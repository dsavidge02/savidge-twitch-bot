import { useState, useEffect } from 'react';

import { useViewContext } from "../../../../contexts/ViewContext";
import LeetcodeDisplay from "../Leetcode/Leetcode";
import GoalsDisplay from '../Goals/Goals';
import './Main.css';

const MainDisplay = () => {
    const { viewMode } = useViewContext();
    const displayOptions = ['leetcode', 'followers', 'subs'];
    const [ displayState, setDisplayState ] = useState('leetcode');

    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayState(prevState => {
                const currentIndex = displayOptions.indexOf(prevState);
                const nextIndex = (currentIndex + 1) % displayOptions.length;
                return displayOptions[nextIndex];
            });
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="main-display-content-container">
            {displayState === 'leetcode' && (
                <LeetcodeDisplay />
            )}
            {displayState === 'followers' && (
                <GoalsDisplay props={{'goalKey': `${displayState}`}} />
            )}
             {displayState === 'subs' && (
                <GoalsDisplay props={{'goalKey': `${displayState}`}} />
            )}
        </div>
    );
};

export default MainDisplay;