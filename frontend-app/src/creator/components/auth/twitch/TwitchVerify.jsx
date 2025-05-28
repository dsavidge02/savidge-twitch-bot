const TwitchVerify = () => {
    const params = new URLSearchParams({
        response_type: "code",
        client_id: "oq27qs5xtr75kpnrwyp3xixylz1crt",
        force_verify: true,
        redirect_uri: "http://localhost:5173/savidge_af/register",
        scope: "user:read:subscriptions user:read:email"
    })
    const link = `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;

    return (
        <div className="twitch-verify-container">
            <a href={link}>Click Here</a>
        </div>
    );
};

export default TwitchVerify;