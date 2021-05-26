import {useState, useRef} from 'react';
import './App.css';

import {Player, PlayerRef} from '@remotion/player';
import {Basic} from './components/video/Basic';

function App() {
  const [name, setName] = useState('Steve');
  const [color, setColor] = useState('Green');
  const [animal, setAnimal] = useState('Oppossum');
  const [place, setPlace] = useState('Museum');
  
  const playerRef = useRef<PlayerRef>(null);

  return (
    <div className="App">
      <Player
        ref={playerRef}
        component={Basic}
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
      <div className="Selection">
        <input id='name' placeholder='Name' type='text' onChange={e => setName(e.target.value)}></input>
        <input id='color' placeholder='Color' type='text' onChange={e => setColor(e.target.value)}></input>
        <input id='animal' placeholder='Animal' type='text' onChange={e => setAnimal(e.target.value)}></input>
        <input id='place' placeholder='Place' type='text' onChange={e => setPlace(e.target.value)}></input>
        <button onClick={() => playerRef.current?.play()}>Go!</button>                
      </div>
    </div>
  );
}

export default App;
