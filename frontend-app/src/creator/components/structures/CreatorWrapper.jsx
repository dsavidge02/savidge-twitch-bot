import { Outlet } from 'react-router-dom';
import { useViewContext } from '../../contexts/ViewContext';

import './CreatorWrapper.css';

import CreatorHeader from './Header/CreatorHeader';

const CreatorWrapper = () => {
    const { viewParams } = useViewContext();

    return (
        <div className="creator-wrapper">
            {
                viewParams.mode === 'default' && (
                    <div className="creator-wrapper-header">
                        <CreatorHeader />
                    </div>
                )
            }
            <div className="creator-wrapper-scrollable-container">
                <div className={ `creator-wrapper-content-border ${viewParams.mode === 'default' ? '' : `includes--border ${viewParams.design}`}` }>
                    <div className="creator-wrapper-content">
                        <Outlet/>
                    </div>
                </div>
                {
                    viewParams.mode === 'default' && (
                        <div className="creator-wrapper-footer">
                            <p>FOOTER</p>
                        </div>
                    ) 
                }
            </div>
        </div>
    );
};

export default CreatorWrapper;