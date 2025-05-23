import './CreatorHome.css';
import { useAuthContext } from '../../contexts/AuthContext';

const CreatorHome = () => {
    const { isAuth } = useAuthContext();

    return (
        <div className="creator-home-content">
            <h2>Welcome to the unofficial page for savidge_af!</h2>
            {
                !isAuth && (
                    <div className="creator-home-content-not-auth">
                        <p>YOU ARE NOT LOGGED IN</p>
                    </div>
                )
            }
            {
                isAuth && (
                    <div className="creator-home-content-auth">
                        <p>YOU ARE LOGGED IN</p>
                    </div>
                )
            }

        </div>
    )
};

export default CreatorHome;