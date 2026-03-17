import React from 'react';
import Grainient from '../ui/Grainient';

const Background: React.FC = () => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        >
            <Grainient
                color1="#300c0c"
                color2="#991919"
                color3="#45061f"
                timeSpeed={0.25}
                colorBalance={0}
                warpStrength={1}
                warpFrequency={5}
                warpSpeed={2}
                warpAmplitude={50}
                blendAngle={0}
                blendSoftness={0.19}
                rotationAmount={500}
                noiseScale={2}
                grainAmount={0.1}
                grainScale={2}
                grainAnimated={false}
                contrast={1.5}
                gamma={1}
                saturation={0.4}
                centerX={0}
                centerY={0}
                zoom={0.8}
            />
        </div>
    );
};

export default Background;