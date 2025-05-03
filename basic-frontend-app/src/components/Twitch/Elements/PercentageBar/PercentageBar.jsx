import { useState, useEffect, useRef } from 'react';

import './PercentageBar.css';

const PercentageBar = ({ props }) => {
    const { title, current, target, style } = props;
    const percentage = Math.min((current / target) * 100, 100);
    const [fontSize, setFontSize] = useState('1rem');
    const outerBarRef = useRef(null);

    useEffect(() => {
        const updateFontSize = () => {
            if (outerBarRef.current) {
                const outerBarHeight = outerBarRef.current.offsetHeight;
                const outerBarWidth = outerBarRef.current.offsetWidth;
                
                const scaleFromHeight = outerBarHeight * 0.4;
                const scaleFromWidth = outerBarWidth * 0.1;

                const newFontSize = `${Math.max(10, Math.min(scaleFromHeight, scaleFromWidth))}px`;
                setFontSize(newFontSize);
            }
        };

        updateFontSize();
        window.addEventListener('resize', updateFontSize);

        return () => {
            window.removeEventListener('resize', updateFontSize);
        }
    }, []);

    const getGradientColor = (percentage) => {
        const red = Math.min(255, Math.floor(255 - (percentage * 2.55)));
        const green = Math.min(255, Math.floor(percentage * 2.55));
        return `rgb(${red}, ${green}, 0)`;
    }

    const gradientColor = getGradientColor(percentage);

    return (
        <div className="percentage-bar-container">
            <span className="percentage-bar-title" style={{ fontSize }}>{title}</span>
            <div className="percentage-bar-outer-bar" ref = {outerBarRef}>
                <div className={`percentage-bar-current-bar ${current >= target ? 'complete' : ''}`}
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: gradientColor,
                    }}
                >
                    { percentage > 10 && (
                        <span className="percentage-bar-current-text" style={{ fontSize }}>{current}</span>
                    )}
                </div>
            </div>
        </div>
    )
};

export default PercentageBar;