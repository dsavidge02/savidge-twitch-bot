import './CreatorHome.css';
import { useAuthContext } from '../../contexts/AuthContext';

const CreatorHome = () => {
    const { getUsername } = useAuthContext();
    
    const username = getUsername();

    return (
        <div className="creator-home-content">
            <h2>Welcome to the unofficial page for savidge_af!</h2>
            {
                username === "" ? (
                    <div className="creator-home-content-not-auth">
                        <p>Hello There!</p>
                    </div>
                )
                :
                (
                    <div className="creator-home-content-auth">
                        <p>Hello {`${username}`}!</p>
                    </div>
                )
            }
        </div>
    )
};

export default CreatorHome;