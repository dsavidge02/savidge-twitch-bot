import { Link } from 'react-router-dom';

import './CreatorHeader.css';
import { useAuthContext } from '../../../contexts/AuthContext';

const CreatorHeader = () => {
    const { isAuth, doLogout } = useAuthContext();

    const handleSubmit = async(e) => {
        e.preventDefault();

        doLogout();
    }

    return (
        <div className="creator-header-container">
            <div className="creator-header-brand-container">
                <Link to="/savidge_af" className="creator-header-brand-link">Home</Link>
            </div>
            <div className="creator-header-links-container">
                {
                    !isAuth && (
                        <div className="creator-header-unprotected-links-container">
                            <Link to="/savidge_af/login" className="creator-header-link">Login</Link>
                            <Link to="/savidge_af/register" className="creator-header-link">Register</Link>
                        </div>
                    )
                }
                {   
                    isAuth && (
                        <div className="creator-header-protected-links-container">
                            <Link to="/savidge_af/users" className="creator-header-link">Profile</Link>
                            <button className="creator-header-link" onClick={handleSubmit}>Logout</button>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default CreatorHeader;