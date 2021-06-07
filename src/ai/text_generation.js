import { getSentences } from './text_analysis';
const deepai = require('deepai');
deepai.setApiKey('937ae033-e29f-4485-b5da-63f3cede0127');

// use deepai api to generate a new sentence from seed sentence
// from the generated output use the next sentence after the seed sentence
async function generate(seed) {   
    const resp = await deepai.callStandardApi("text-generator", {
            text: seed,
    });    
    const output = resp.output;    

    // split output into sentences with Google NLP
    const sentences = await getSentences(output);

    // if there is no next sentence, rerun the generator
    if (!sentences[1] || !sentences[1].text)
        return await generate(seed);

    // the next sentence is one right after the original seed sentence
    let newSentence = sentences[1].text.content;
    newSentence = fixQuotations(newSentence);

    // if the next sentence is a fragment then rerun the generator
    if (!isComplete(newSentence))
        return await generate(seed);

    return newSentence;
}

// add ending quotation if missing from split sentence
// remove quotation mark if it's at the end of sentence
// check if there's even or odd amount of quotation marks
function fixQuotations(sentence) {
    if ((sentence.split(`"`).length - 1) % 2 !== 0) {    
        const len = sentence.length;        
        return sentence[len - 1] === `"` ? sentence.substring(0, len - 1) : sentence + `"`;
    }
    else
        return sentence;
}

// make sure sentence is not a fragment
function isComplete(sentence) {
    const punctuation = /[.?!"]$/;
    return punctuation.test(sentence);    
}

export default generate;