import { TextField, Button } from '@material-ui/core';
import styles from '../styles/Selector.module.css';

type InitialSelectorProps = {
    setCurrentSentence: (sentence:string) => void,
    playVideo: () => void,
    prepareNextRound: () => void,
    setIsInitial: (state:boolean) => void
}


function InitialSelector({setCurrentSentence, prepareNextRound, playVideo, setIsInitial} : InitialSelectorProps) {

    // add period to sentence if missing ending punctuation
    function appendPeriod(sentence:string) {
        const regex = /[.?!]$/;
        if (!regex.test(sentence.trim()))
            return sentence + '.';
        else 
            return sentence;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Kick it off with a sentence from your wildest imagination!</h2>
            <TextField 
                className={styles.initialField}
                id='sentence' 
                multiline
                variant='outlined' 
                rows={3}                 
                type='text' 
                placeholder='A lawyer, a businessman, and a beekeeper walk into a Chinese restaurant.'                 
                onChange={e => (e.target.value) ? setCurrentSentence(appendPeriod(e.target.value)) : setCurrentSentence('A lawyer, a businessman, and a beekeeper walk into a Chinese restaurant.')}/>            
            <Button 
                className={styles.goButton} 
                variant='contained' 
                color='primary' 
                onClick={() => {
                    setIsInitial(false);
                    playVideo();
                    prepareNextRound();                    
                }}
            >Go!</Button>                
        </div>
    );

}

export default InitialSelector;

