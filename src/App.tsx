import {useState, useEffect, useRef} from 'react';
import './App.css';
import {Player, PlayerRef} from '@remotion/player';


import {Basic} from './components/video/Basic';
import Selector from './components/Selector';
import Header from './components/Header';

const toHex = require('colornames');

function App() {
  const [name, setName] = useState('Steve');
  const [color, setColor] = useState('Green');
  const [animal, setAnimal] = useState('Oppossum');
  const [place, setPlace] = useState('Museum');

  const [playerBackground, setPlayerBackground] = useState('#fff');
  
  const playerRef = useRef<PlayerRef>(null);

  const playVideo = () => playerRef.current?.play();

  useEffect(() => {
    const hex = toHex(color);
    if (!hex) return setPlayerBackground('#fff');

    const getComplementaryColor = (color = '') => {
      const colorPart = color.slice(1);
      const ind = parseInt(colorPart, 16);
      let iter = ((1 << 4 * colorPart.length) - 1 - ind).toString(16);
      while (iter.length < colorPart.length) {
         iter = '0' + iter;
      };
      return '#' + iter;
   };
   const background = getComplementaryColor(hex);
   setPlayerBackground(background);

  }, [color])

  return (
    <div className="App">
      <Header/>      
      <main>
        <Selector setName={setName} setColor={setColor} setAnimal={setAnimal} setPlace={setPlace} playVideo={playVideo}/>
        <Player
          ref={playerRef}
          component={Basic}
          style={{height: '100%', backgroundColor: playerBackground}}
          durationInFrames={150}
          fps={30}
          compositionWidth={800}
          compositionHeight={450}        
          inputProps={{
            name,
            color,
            animal,
            place
          }}        
        />        
      </main>            
    </div>
  );
}

export default App;
