import { useState, useEffect } from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const Basic: React.FC<{
	currentSentence: string;
	readyToAnimate: boolean;  	
}> = ({currentSentence, readyToAnimate}) => {
  const [text, setText] = useState<string[]>([]);
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();  

  // update the animated text only after user submits their inputs
  useEffect(() => {	  		
	  if (readyToAnimate) {		  	  	
		const splitText = currentSentence.split(' ').map((t) => ` ${t} `);
	  	setText(splitText);		
	  }
  }, [currentSentence, readyToAnimate])  

  return (
    <div style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      
      <h1
			style={{
				fontFamily: 'SF Pro Text, Helvetica, Arial',
				fontWeight: 'bold',
				fontSize: 30,
				textAlign: 'center',
				position: 'absolute',
				bottom: 160,
				width: '100%',
			}}
		>
			{text.map((t, i) => {
				return (
					<span
						key={i}
						style={{							
							marginLeft: 10,
							marginRight: 10,
							transform: `scale(${spring({
								fps: videoConfig.fps,
								from: 0,
								to: 1,
								frame: frame - i * 5,
								config: {
									damping: 100,
									stiffness: 200,
									mass: 0.5,
								},
							})})`,								
							display: 'inline-block',
						}}
					>
						{t}
					</span>
				);
			})}
		</h1>
    </div>
  );
};