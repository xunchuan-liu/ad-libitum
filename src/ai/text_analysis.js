import _ from 'underscore';

import entityMapping from '../utils/entities';


// using Google NLP model

// split text into sentences
async function getSentences(text) {
    const url = 'https://language.googleapis.com/v1/documents:analyzeSyntax?key=AIzaSyDJSghKel7lnrmUbKNA1iBMOMwRPm9-_OU';
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            document: {
                type: "PLAIN_TEXT",
                content: text 
            },
            encodingType: "UTF8"
        })
    }

    const res = await fetch(url, requestOptions)
    const parsed = await res.json();    
    return parsed.sentences;
}

// extract entities and parts of speech from given sentence 
// returns set of choices for the player with this sentence
async function analyzeSentence(sentence) {
    const url = 'https://language.googleapis.com/v1/documents:annotateText?key=AIzaSyDJSghKel7lnrmUbKNA1iBMOMwRPm9-_OU';
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            document: {
                type: "PLAIN_TEXT",
                content: sentence
            },
            features: {
                extractSyntax: true,
                extractEntities: true
            },
            encodingType: "UTF8"
        })
    }
    
    const res = await fetch(url, requestOptions)
    const parsed = await res.json();
    
    let entities = getEntities(parsed.entities);    
    entities = checkPlurals(entities, parsed.tokens);
    const adjectives = getAdjectives(parsed.tokens);    

    let choices = getChoices(entities, adjectives);    
    choices = standardize(choices);
    console.log(choices);   
    choices = randomSubset(choices);

    if (!choices)
        return choices;
        
    // convert to object indexed by the type
    const final = choices.reduce((acc, current) => {
        acc[current.offset] = current;
        return acc;
    }, {});
    
    return final;  
}

// extract entities from the entity tokens
function getEntities(entities) {            
    entities = entities.map(entity => {
        const type = getEntityType(entity);
        const offset = entity.mentions[0].text.beginOffset;        
        return { original: entity.name, type, offset };
    })

    entities = removeDuplicates(entities);    
    return entities;
}

// differentiate types for the proper vs common nouns for a single type
// i.e. either a city or a country for a proper LOCATION
function getEntityType(entity) {
    // helper function to randomly choose an integer in a given range
    const randomize = (mapping, range) => {
        const randomInt = Math.floor(Math.random() * range);
        return mapping[randomInt];
    }

    if (entity.type === 'PERSON') {
        if (entity.mentions.length) {
            const mapping = {
                0: 'OCCUPATION',
                1: 'ANIMAL'
            }            

            return (entity.mentions[0].type === 'PROPER') ? 'NAME' : randomize(mapping, 2);
        }

        else
            return entity.type;
    }
    
    else if (entity.type === 'LOCATION') {
        if (entity.mentions.length) {
            const properMapping = {
                0: 'CITY',
                1: 'COUNTRY'
            }
            
            const commonMapping = {
                0: 'ROOM',
                1: 'RESTAURANT',
                2: 'STORE',
                3: 'LOCATION'
            }

            return (entity.mentions[0].type === 'PROPER') ? randomize(properMapping, 2) : randomize(commonMapping, 4);
        }

        else
            return entity.type;
    }

    else if (entity.type === 'WORK_OF_ART') {
        if (entity.mentions.length) {
            const mapping = {
                0: 'ALBUM',
                1: 'MOVIE',
                2: 'NOVEL',
                3: 'POEM',
                4: 'PAINTING'                
            }            

            return (entity.mentions[0].type === 'PROPER') ? randomize(mapping, 5) : 'WORK_OF_ART';
        }

        else
            return entity.type;
    }

    else if (entity.type === 'ORGANIZATION') {
        if (entity.mentions.length) {
            const mapping = {
                0: 'BAND',
                1: 'COMPANY',
                2: 'POLITICAL_PARTY',
                3: 'UNIVERSITY',
                4: 'SPORTS_TEAM'                
            }            

            return (entity.mentions[0].type === 'PROPER') ? randomize(mapping, 5) : 'ORGANIZATION';
        }

        else
            return entity.type;
    }

    else if (entity.type === 'CONSUMER_GOOD') {        
        const mapping = {
            0: 'CONSUMER_GOOD',
            1: 'VEHICLE',
            2: 'FOOD',
            3: 'INSTRUMENT',
            4: 'TOOL',
            5: 'TOY',
            6: 'WEAPON',
            7: 'CLOTHING'                
        }            

        return randomize(mapping, 8);       
    }

    else
        return entity.type;
}

// sometimes multiple entities captured for same words like NUMBER and PRICE
// convert to object to remove duplicate offsets
function removeDuplicates(entities) {
    const unique = entities.reduce((acc, current) => {
        if (acc[current.offset] && current.type === 'NUMBER' && acc[current.offset].type === 'PRICE')
            return acc;
        // catch any $12.00 (PRICE) with 12.00 (NUMBER) collisions
        if (acc[current.offset - 1] && current.type === 'NUMBER' && acc[current.offset - 1].type === 'PRICE')
            return acc;
                    
        acc[current.offset] = current;
        return acc;
    }, {});
    return(Object.values(unique));
}

// extract adjectives from the syntax tokens
function getAdjectives(tokens) {
    tokens = tokens.filter(token => token.partOfSpeech.tag === 'ADJ');
    const adjectives = tokens.map(token => {        
        const offset = token.text.beginOffset;
        return { original: token.text.content, type: token.partOfSpeech.tag, offset, plural: false };
    })

    return adjectives;     
}

// add plural tags to entities
function checkPlurals(entities, tokens) {

    // filter out the matching tokens for the entities    
    const entityText = entities.map(entity => entity.original);            
    tokens = tokens.filter(token => entityText.includes(token.text.content));
    
    // reduce to an object indexed by entity
    tokens = tokens.reduce((acc, current) => {
        acc[current.text.content] = current.partOfSpeech.number;
        return acc;
    }, {})    

    entities = entities.map(entity => {
        if (tokens[entity.original] === 'PLURAL')
            return {...entity, plural: true };
        else
            return {...entity, plural: false };
    })    

    return entities;
}

// get all the choices from entities and adjectives
// in cases of duplicates between entities and adjectives
// give priority to the adjective
function getChoices(entities, adjectives) {
    const adjectiveText = adjectives.map(adjective => adjective.original);
    entities = entities.filter(entity => !adjectiveText.includes(entity.original));
    return [...entities, ...adjectives];
}

// standardize all types from the entity mapping
function standardize(choices) {
    choices = choices.map(choice => {
        if (entityMapping[choice.type])
            return { ...choice, type: entityMapping[choice.type] };
        else
            return null;
    }).filter(choice => choice !== null)

    return choices;
}

// randomly choose a subset of all available choices
function randomSubset(choices) {
    const len = choices.length;
    if (len === 0) return null;

    // decide how many choices in the subset
    let total;  
    
    switch (len) {
        case 1:
        case 2:            
            total = len;         
            break;
        case 3:
        case 4:
            total = len - Math.round(Math.random());
            break;
        case 5:
        case 6:
            total = len - Math.round(Math.random() + 1);
            break;
        default:            
            total = 5;
    }    

    // based on the total, randomly sample from the given choices
    const subset = _.sample(choices, total);
    return subset;
}


export { getSentences, analyzeSentence };