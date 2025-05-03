import { useState } from 'react';
import './Leetcode.css'

import { useViewContext } from '../../../../contexts/ViewContext';
import Grid from '../../Elements/Grid/Grid';

const LeetcodeDisplay = () => {
    const { viewMode } = useViewContext();
    const [duration, setDuration] = useState('week');

    const gridProps = {
        title: 'Weekly Leetcode',
        data: [0, 1, 1, 0, 1, 1, 1],
        rows: 1,
        cols: 7,
        start: 0
    }

    return (
        <div className="leetcode-content-container">
            {viewMode === 'default' && (
                <div className="nontwitch-content">
                    
                </div>
            )}
            <div className={`all-content ${viewMode === 'bot' ? 'full-screen' : ''}`}>
                <div className="time-grid-container">
                    <Grid props={gridProps}/>
                </div>
            </div>
        </div>  
    );
}

export default LeetcodeDisplay;