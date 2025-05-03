import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import './TwitchWrapper.css';

import { useViewContext } from '../../contexts/ViewContext';

const TwitchWrapper = () => {
    const { viewMode } = useViewContext();

    return (
        <div className="twitch-content">
            {viewMode === 'default' && (
                <h1>HI TWITCH</h1>
            )}

            
            <div className={`twitch-main-content ${viewMode === 'bot' ? 'full-screen' : ''}`}>
                <div className="inner-twitch-content">
                    <Outlet />
                </div>
            </div>
            
            {viewMode === 'default' && (
                <h1>HI TWITCH</h1>
            )}
        </div>
    );
};

export default TwitchWrapper;