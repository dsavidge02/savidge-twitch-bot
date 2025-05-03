import { useState, useEffect, useRef } from 'react';
import './Grid.css';
import GridContainer from './GridContainer';

import { useViewContext } from '../../../../contexts/ViewContext';

const Grid = ({ props }) => {
    const { viewMode } = useViewContext();
    const { title, data, rows, cols, start = 0 } = props;
    const [fontSize, setFontSize] = useState('10px');
    const titleRef = useRef(null);

    const updateFontSize = () => {
        if (titleRef.current) {
            const titleWidth = titleRef.current.clientWidth;
            const titleHeight = titleRef.current.clientWidth;

            const scaleFromHeight = titleWidth * 0.09;
            const scaleFromWidth = titleHeight * 0.07;

            const newFontSize = `${Math.max(30, Math.min(scaleFromHeight, scaleFromWidth))}px`;
            setFontSize(newFontSize);
        }
    }

    useEffect(() => {
        updateFontSize();
        window.addEventListener('resize', updateFontSize);
        return () => window.removeEventListener('resize', updateFontSize);
    }, []);

    const style = {
        'fontSize': fontSize
    }

    return (
        <div className="grid--container">
            <span className={`grid-title ${viewMode === 'bot' ? 'bot' : ''}`} style={style} ref={titleRef}>{title}</span>
            <div className={`grid-inner-container ${viewMode === 'bot' ? 'bot' : ''}`}>
                <GridContainer props={{ data: data, rows: rows, cols: cols, start: start }}/>
            </div>
        </div>
    );
}

export default Grid;