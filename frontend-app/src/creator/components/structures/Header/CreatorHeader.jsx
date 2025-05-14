import { useLocation, Navigate } from 'react-router-dom';

import './CreatorHeader.css';

const CreatorHeader = () => {
    return (
        <div className="creator-header-container">
            <div className="creator-header-brand-container">
                <p>SAVIDGE APPS</p>
            </div>
            <div className="creator-header-links-container">
                <p>HOME</p>
            </div>
        </div>
    );
};

export default CreatorHeader;