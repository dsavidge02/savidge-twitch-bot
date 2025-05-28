import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const TwitchAPIAdmin = () => {
    const [accessToken, setAccessToken] = useState('');
    const [followers, setFollowers] = useState(0);
    const [subscribers, setSubscribers] = useState(0);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAccessToken = async () => {
            try {
                const res = await axiosPrivate.get("http://localhost:3001/auth/admin/token");
                if (!res.data.access_token) return;
                console.log(res.data.expires_in);
                setAccessToken(res.data.access_token);
            }
            catch (err) {
                console.error("Unable to verify access token on server: ", err);
            }
        }

        const getFollowers = async () => {
            try {
                const res = await axiosPrivate.get("http://localhost:3001/channel/followers");
                console.log(res);
                if (!res.data.count) return;
                setFollowers(res.data.count);
            }
            catch (err) {
                console.error("Unable to get followers: ", err);
            }
        }

        const getSubscribers = async () => {
            try {
                const res = await axiosPrivate.get("http://localhost:3001/channel/subscribers");
                console.log(res);
                if (!res.data.count) return;
                setSubscribers(res.data.count);
            }
            catch (err) {
                console.error("Unable to get followers: ", err);
            }
        }

        checkAccessToken();
        getFollowers();
        getSubscribers();
    }, []);

    const params = new URLSearchParams({
        response_type: "code",
        client_id: "oq27qs5xtr75kpnrwyp3xixylz1crt",
        force_verify: true,
        redirect_uri: "http://localhost:5173/savidge_af/callback",
        scope: "moderator:read:followers channel:read:subscriptions"
    })
    const link = `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;

    return (
        <div className="twitch-verify-container">
            <a href={link}>Click Here</a>
            <span>AccessToken = {accessToken}</span>
            <span>Followers = {followers}</span>
            <span>Subscribers = {subscribers}</span>
        </div>
    );
};

export default TwitchAPIAdmin;