import { useNavigate } from 'react-router-dom';

const TwitchVerify = () => {
    const navigate = useNavigate();

    const params = new URLSearchParams({
        response_type: "code",
        client_id: "oq27qs5xtr75kpnrwyp3xixylz1crt",
        redirect_uri: "http://localhost:5173/savidge_af/register",
        scope: "moderator:read:followers"
    })
    const link = `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;

    return (
        <div className="twitch-verify-container">
            <a href={link}>Click Here</a>
        </div>
    );
};

export default TwitchVerify;