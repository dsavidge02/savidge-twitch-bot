import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const TwitchCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [hasExchanged, setHasExchanged] = useState(false);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const code = searchParams.get('code');
        if (!code || hasExchanged) {
            return;
        }

        const exchangeCode = async () => {
            try {
                setHasExchanged(true);
                const res = await axiosPrivate.post("http://localhost:3001/auth/admin/token", { code });
                console.log("Twitch verified:", res.data);
                navigate("/savidge_af/admin");
            }
            catch (err) {
                console.error("Error exchanging code:", err);
                setError("Failed to verify Twitch login.");
                navigate("/savidge_af/unauthorized");
            }
        }

        exchangeCode();
    }, []);

    return (
        <div className="twitch-callback-container">
            { "Verifying Twitch Login..." }
        </div>
    );
};

export default TwitchCallback;