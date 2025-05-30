import { useState, useEffect} from "react";
import { useSearchParams } from "react-router-dom";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useLocalStorage from "../../../../hooks/useLocalStorage";

import { getToken, generateToken, getFollowers, getSubscribers } from "../../../../api/staticTwitchApi";

import CustomButton from "../../../structures/CustomButton/CustomButton";
import CustomSpinner from "../../../structures/CustomSpinner/CustomSpinner";
import CustomAsyncValueDisplay from "../../../structures/CustomValueDisplay/CustomAsyncValueDisplay";

import "./APIAdmin.css";

const APIAdmin =  () => {
    const [isExchanging, setIsExchanging] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const [searchParams, setSearchParams] = useSearchParams();
    const axiosPrivate = useAxiosPrivate();

    const [adminOauthState, setAdminOauthState] = useLocalStorage("twitch_admin_oauth_state", "");

    const [apiToken, setApiToken] = useState({
        access_token: "",
        refresh_token: "",
        expires_at: -1
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await getToken(axiosPrivate);
                setApiToken({
                    access_token: res.access_token,
                    refresh_token: res.refresh_token,
                    expires_at: res.expires_at
                });
            }
            catch (err) {
                console.error("Error loading data:", err);
            }
            finally {
                setIsLoading(false);
            }
        };


        const exchangeCode = async (code) => {
            setIsExchanging(true);
            try {
                const success = await generateToken(axiosPrivate, code);
                console.log("Token exchange successful:", success);
                setSearchParams({});
            }
            catch (err) {
                console.error("Token exchange failed:", err);
            }
            finally {
                setIsExchanging(false);
            }
        };

        const code = searchParams.get("code");
        const returnedState = searchParams.get("state");

        const init = async () => {
            if (code && returnedState && returnedState === adminOauthState) {
                setAdminOauthState("");
                await exchangeCode(code);
            }
            else if (code && returnedState && returnedState !== adminOauthState) {
                setAdminOauthState("");
            }
            await loadData();
        };

        init();
    }, []);

    const handleExchange = async (e) => {
        e.preventDefault();

        const admin_oauth_state = crypto.randomUUID();
        setAdminOauthState(admin_oauth_state);

        const params = new URLSearchParams({
            response_type: "code",
            client_id: "oq27qs5xtr75kpnrwyp3xixylz1crt",
            force_verify: true,
            redirect_uri: "http://localhost:5173/admin",
            scope: "moderator:read:followers channel:read:subscriptions",
            state: admin_oauth_state
        });

        const link = `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;
        window.location.href = link;
    }

    return (
        <div className="api-admin-container">
            <CustomButton 
                action={handleExchange}
                disabled={false}
                active={isExchanging}
                text={"Generate New Token"}
                size={"medium"}
            />
            <div className="api-admin-values-container">
                <CustomAsyncValueDisplay
                    label={"Access Token"}
                    value={apiToken.access_token}
                    confidential={true}
                    maxLength={30}
                />
                <CustomAsyncValueDisplay
                    label={"Refresh Token"}
                    value={apiToken.refresh_token}
                    confidential={true}
                    maxLength={50}
                />
                <CustomAsyncValueDisplay
                    label={"Expires At"}
                    value={apiToken.expires_at}
                    confidential={false}
                    maxLength={30}
                    type={"date"}
                />
            </div>
        </div>
    );
};

export default APIAdmin;