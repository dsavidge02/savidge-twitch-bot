import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from 'axios';

const TwitchCallback = () => {
    const [userData, setUserData] = useState({});
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const code = searchParams.get('code');
        if (!code) return;

        axios.post("/api/twitch/exchange", { code })
            .then(res => {
                console.log('Twitch verified: ', res.data);
                navigate('/savidge_af/register');
            })
            .catch(err => {
                console.error('Error exchanging code:', err);
                navigate("/savidge_af/unauthorized");
            });
    }, []);

    return (
        <div className="twitch-callback-container">
            Verifying Twitch Login...
        </div>
    )
}