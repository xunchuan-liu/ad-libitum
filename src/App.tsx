import {useState, useEffect, useRef} from 'react';
import {Player, PlayerRef} from '@remotion/player';
import './App.css';

import {Basic} from './components/video/Basic';
import Selector from './components/Selector';
import InitialSelector from './components/InitialSelector';
import Header from './components/Header';

import generate from './ai/text_generation';
import { analyzeSentence } from './ai/text_analysis';

import { fixArticles, customReplace } from './utils/grammar';

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

const DEFAULT_SENTENCE = 'A lawyer, a businessman, and a beekeeper walk into a Chinese restaurant.';

function App() {
  const [currentSentence, setCurrentSentence] = useState(DEFAULT_SENTENCE);
  const [playerChoices, setPlayerChoices] = useState<Choices>({});    
  const [playerResponses, setPlayerResponses] = useState<Responses>({});  
  const [wordCount, setWordCount] = useState(12);
  const [playerCanChoose, setPlayerCanChoose] = useState(true);
  const [isInitial, setIsInitial] = useState(true);  
  const [isPlayerDone, setIsPlayerDone] = useState(true);
  const [readyToAnimate, setReadyToAnimate] = useState(true);
  const [readyToPlay, setReadyToPlay] = useState(false);      
  
  // current reference to Remotion Player
  const playerRef = useRef<PlayerRef>(null); 

  // plays the text animation  
  const playVideo = async () => {       
    setIsPlayerDone(false);
    setReadyToPlay(false);    
    playerRef.current?.play();         
  }

  // inject user input values into the current sentence
  const customizeSentence = () => {
    // set flag to let player know it should animate this sentence
    setReadyToAnimate(true);

    if (playerCanChoose) {
      const choices = Object.values(playerChoices);

      // replace original word for input word for each choice
      let customSentence = choices.reduce((acc, current) => {
        const { offset } = current;      
        const original = playerChoices[offset].original;
        const custom = playerResponses[offset];                            
        
        return customReplace(acc, original, custom, offset);            
      }, currentSentence)
      
      customSentence = fixArticles(customSentence);                            
      setCurrentSentence(customSentence);      
    }    
  }

  // generates sentence and updates choices for next round
  const prepareNextRound = async () => {

    // update player choices every time there is a new sentence    
    async function updateChoices(sentence:string) {                  
      const newChoices = await analyzeSentence(sentence);                  

      if (!newChoices) {      
        setPlayerCanChoose(false); // no choices available for the player
        setPlayerChoices({});                
      }
      else {        
        setPlayerCanChoose(true);        
        setPlayerChoices(newChoices);                
      }      
    }    
         
    const newSentence = await generate(currentSentence);
    // prevent video from changing existing sentence when preparing for next round
    setReadyToAnimate(false);
    await setCurrentSentence(newSentence);      
    await updateChoices(newSentence);               
  }

  // begin next round
  const startNextRound = () => setReadyToPlay(true);
  

  // set flag for when video is finished playing
  useEffect(() => {       
    playerRef.current?.addEventListener('ended', () => {                  
      setIsPlayerDone(true);          
    });    
  }, [])
  
  // resets the video after it finishes playing
  useEffect(() => {
    if (isPlayerDone && readyToPlay)    
      playerRef.current?.seekTo(0);
  }, [isPlayerDone, readyToPlay])

  // update word count for new sentence after video finishes playing
  useEffect(() => {
    if (isPlayerDone && readyToPlay) {
      const newWordCount = currentSentence.split(' ').length;
      setWordCount(newWordCount);
    }
  }, [isPlayerDone, readyToPlay, currentSentence])


  return (
    <div className="App">
      <Header/>      
      <main>
        {isInitial 
          ? <InitialSelector 
              setCurrentSentence={setCurrentSentence}
              prepareNextRound={prepareNextRound} 
              setIsInitial={setIsInitial} 
              playVideo={playVideo}
            />
          : <Selector 
              playerChoices={playerChoices}                          
              setPlayerResponses={setPlayerResponses}
              customizeSentence={customizeSentence}
              prepareNextRound={prepareNextRound}
              startNextRound={startNextRound} 
              playVideo={playVideo}
              isPlayerDone={isPlayerDone} 
              readyToPlay={readyToPlay} 
              playerCanChoose={playerCanChoose}
            />
        }        
        <Player
          ref={playerRef}
          component={Basic}
          style={{height: '100%'}}
          durationInFrames={wordCount * 5 + 60}
          fps={30}
          loop={false}
          autoPlay={false}
          controls={false}          
          clickToPlay={false}
          compositionWidth={800}
          compositionHeight={450}        
          inputProps={{
            currentSentence,
            readyToAnimate
          }}        
        />        
      </main>            
    </div>
  );
}

export default App;
