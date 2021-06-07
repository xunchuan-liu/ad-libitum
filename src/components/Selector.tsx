import { useEffect, useState, useRef } from 'react';
import { TextField, Button } from '@material-ui/core';
import styles from '../styles/Selector.module.css';

type Choice = {
    original: string,
    type: string,
    offset: number,
    plural: boolean
}

type Choices = {    
    [key: number]: Choice
}

type Responses = {
    [key: number]: string
  }

type Response = {
    [key: number]: string
}

type SelectorProps = {    
    playVideo: () => void,
    playerChoices: Choices,       
    setPlayerResponses: (responses:Responses) => void,
    customizeSentence: () => void,
    prepareNextRound: () => void,
    startNextRound: () => void,
    isPlayerDone: boolean,
    readyToPlay: boolean,
    playerCanChoose: boolean
}

function Selector({
    playVideo,
    playerChoices, 
    setPlayerResponses, 
    customizeSentence,
    prepareNextRound,
    startNextRound, 
    isPlayerDone, 
    readyToPlay, 
    playerCanChoose 
} : SelectorProps) {

    const [choice1, setChoice1] = useState<Response>({});
    const [choice2, setChoice2] = useState<Response>({});
    const [choice3, setChoice3] = useState<Response>({});
    const [choice4, setChoice4] = useState<Response>({});
    const [choice5, setChoice5] = useState<Response>({});    
    const [headingText, setHeadingText] = useState('Now, you choose!');

    const formRef = useRef<HTMLFormElement>(null); // form ref    
    
    const setters = [setChoice1, setChoice2, setChoice3, setChoice4, setChoice5];
    const choices = Object.values(playerChoices);            
    
    // clear input fields after submitting
    function clearSelections() {
        formRef.current?.reset();
        setChoice1({});
        setChoice2({});
        setChoice3({});
        setChoice4({});
        setChoice5({});
    }

    // check if field label needs to ask for a plural input
    function checkPlural(offset:number, type:string) {                        
        if (playerChoices[offset].plural)
            return `${type} (plural)`;
        else
            return type;
    }

    // update heading text if player has no choices
    useEffect(() => {
        const heading = playerCanChoose ? 'Now, you choose!' : 'Looks like the story takes a turn of its own!';
        setHeadingText(heading);
    }, [playerCanChoose])

    // initialize player responses as original values generated from ai
    useEffect(() => {                
        if (playerCanChoose) {
            choices.forEach((choice, i) => {
                const { offset } = choice;                       
                setters[i]({[offset]: playerChoices[offset].original});
            })
        }
    }, [playerChoices, playerCanChoose])
    
    // update responses
    useEffect(() => {     
        const responses = {
            ...choice1,
            ...choice2,
            ...choice3,
            ...choice4,
            ...choice5,
        }                

        setPlayerResponses(responses);        
    }, [choice1, choice2, choice3, choice4, choice5])


    return (
        <div className={styles.container}>

            {isPlayerDone ? 
                <div className={styles.container}>                    
                    {readyToPlay ? <h2 className={styles.heading}>{headingText}</h2> : []}

                    {readyToPlay ?
                        <form className={styles.selector} ref={formRef}>
                                        
                            {playerCanChoose ? choices.map((choice, i) => {
                                const { type, offset } = choice;
                                return (
                                    <TextField
                                        key={offset} 
                                        className={styles.field}                                                             
                                        placeholder={checkPlural(offset, type)}                                                    
                                        type='text'                         
                                        onChange={e => {
                                            (e.target.value)
                                            ? setters[i]({[offset]: e.target.value})
                                            : setters[i]({[offset]: playerChoices[offset].original})
                                        }}
                                    />
                                )
                            }) : []}                        
                            
                            <Button 
                                className={styles.goButton} 
                                disabled={!readyToPlay} 
                                variant='contained' 
                                color='primary' 
                                onClick={() => { 
                                    customizeSentence();                  
                                    playVideo();
                                    clearSelections();
                                    prepareNextRound();
                                }}
                            >Go!</Button>
                        </form>
                    : 
                        <div className={styles.buttonContainer}>
                            <Button 
                                className={styles.groupButton}                             
                                variant='contained' 
                                color='secondary' 
                                onClick={() => {
                                    startNextRound();                                    
                                }}
                            >Next</Button>
                            <Button 
                                className={styles.groupButton}                                                                                             
                                variant='contained' 
                                color='secondary' 
                                onClick={() => {
                                    playVideo();                                    
                                }}
                            >Replay</Button>
                        </div>                        
                    }
                </div>
                : [] }                           
        </div>
    );

}

export default Selector;

