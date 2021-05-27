import { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import styles from '../styles/Selector.module.css';

type SelectorProps = {
    setName: (name:string) => void, 
    setColor: (color:string) => void,
    setAnimal: (animal:string) => void,
    setPlace: (place:string) => void,
    playVideo: () => void
}

function Selector({setName, setColor, setAnimal, setPlace, playVideo} : SelectorProps) {

    return (
        <div className={styles.selector}>
            <h2 className={styles.heading}>Choose a:</h2>
            <TextField className={styles.field} id='name' placeholder='Name' type='text' onChange={e => (e.target.value) ? setName(e.target.value) : setName('Steve')}/>
            <TextField className={styles.field} id='color' placeholder='Color' type='text' onChange={e => (e.target.value) ? setColor(e.target.value) : setColor('Green')}/>
            <TextField className={styles.field} id='animal' placeholder='Animal' type='text' onChange={e => (e.target.value) ? setAnimal(e.target.value) : setAnimal('Oppossum')}/>
            <TextField className={styles.field} id='place' placeholder='Place' type='text' onChange={e => (e.target.value) ? setPlace(e.target.value) : setPlace('Museum')}/>
            <Button className={styles.goButton} variant='contained' color='primary' onClick={playVideo}>Go!</Button>                
        </div>
    );

}

export default Selector;

