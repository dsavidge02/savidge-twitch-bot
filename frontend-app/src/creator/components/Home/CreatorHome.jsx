import './CreatorHome.css';
import { useAuthContext } from '../../contexts/AuthContext';

import savidgeAppsLogo from "../../../assets/images/savidge-apps-logo-1.0.1.png";

const CreatorHome = () => {
    const { getUsername } = useAuthContext();
    
    const username = getUsername();

    return (
        <div className="creator-home-content">
            <div className="creator-home-header">
                <h1 className="creator-home-header-content">Welcome to Savidge Apps!</h1>
                <h3 className="creator-home-header-content sub-header">The Official Home Page of <a className="creator-home-header-link" href="https://twitch.tv/savidge_af">savidge_af</a>!</h3>
                <img className="creator-home-header-logo" src={savidgeAppsLogo} alt={"Savidge Apps"} />
            </div>
            <div className="creator-home-main-content">
                <p className="greeting">
                    Hello {username === "" ? "There" : `${username}`}!
                </p>
                <p className="comments">
                    This website began as a simple way to engage more deeply with my viewers - originally intended as a place to host the graphics for my livestreams. But as I started building a dashboard, I realized it had the potential to be much more. I've always dreamed of being a teacher, and this site is an extension of that. While it's still early in development, my goal for this platform is to offer everyone a glimpse into the world of programming. Whether it's apps, games, or scripts, we can build whatever we imagine - together.
                </p>
            </div>
        </div>
    )
};

export default CreatorHome;