import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const Basic: React.FC<{
	name: string;
  	color: string;
	animal: string;
  	place: string;
}> = ({name, color, animal, place}) => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();

  const text = `Bad news, ${name}. Your ${color} ${animal} just escaped to the ${place}!`;
  const splitText = text.split(' ').map((t) => ` ${t} `);

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
			{splitText.map((t, i) => {
				return (
					<span
						key={t}
						style={{
							color: color,
							marginLeft: 10,
							marginRight: 10,
							transform: frame < videoConfig.durationInFrames - 1 
								? `scale(${spring({
									fps: videoConfig.fps,
									frame: frame - i * 7,
									config: {
										damping: 100,
										stiffness: 200,
										mass: 0.5,
									},
								})})` 
								: 'scale(0)',
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