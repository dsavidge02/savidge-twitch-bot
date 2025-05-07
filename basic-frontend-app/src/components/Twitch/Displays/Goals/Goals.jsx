import { useState } from 'react';
import './Goals.css';

import { useViewContext } from '../../../../contexts/ViewContext';
import PercentageBar from '../../Elements/PercentageBar/PercentageBar';

const GoalsDisplay = ({ props }) => {
    const { viewMode } = useViewContext();
    const { goalKey } = props;

    const getGoalProps = () => {
        if (goalKey === 'followers') {
            return {
                title: `Follower Count`,
                current: 63,
                target: 75
            }
        }
        else if (goalKey === 'subs') {
            return {
                title: `Subscriber Count`,
                current: 10,
                target: 25
            }
        }
    };
    
    const goalProps = getGoalProps();

    return (
        <div className="goal-content-container">
            {viewMode === 'default' && (
                <div className="nontwitch-content">
                    
                </div>
            )}
            <div className={`all-content ${viewMode === 'bot' ? 'full-screen' : ''}`}>
                <div className="goal-bar-container">
                    <PercentageBar props={goalProps}/>
                </div>
            </div>
        </div>
    );
};

export default GoalsDisplay;