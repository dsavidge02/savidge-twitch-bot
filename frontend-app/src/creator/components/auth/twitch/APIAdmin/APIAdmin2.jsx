import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { getServiceStatus, initToken, generateToken, getToken } from "../../../../api/twitchApi";

import CustomButton from "../../../structures/CustomButton/CustomButton";
import CustomAsyncValueDisplay from "../../../structures/CustomValueDisplay/CustomAsyncValueDisplay";
import "./APIAdmin2.css";

const APIAdmin2 = () => {
    const axiosPrivate = useAxiosPrivate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [serviceStatus, setServiceStatus] = useState(null);
    const [isExchanging, setIsExchanging] = useState(false);
    const [token, setToken] = useState({
        accessToken: "",
        refreshToken: "",
        expiresAt: 0,
    });

    // Check service status on mount and after token exchange
    useEffect(() => {

        const fetchToken = async () => {
            const token = await getToken(axiosPrivate);
            setToken(token);
        }

        const checkServiceStatus = async () => {
            try {
                const status = await getServiceStatus(axiosPrivate);
                setServiceStatus(status);

                if (status) {
                    fetchToken();
                }
            } 
            catch (err) {
                console.error("Error getting service status:", err);
            }
        }

        checkServiceStatus();
    }, [isExchanging]);

    // Handle OAuth redirect and automatically generate token
    useEffect(() => {
        const handleOAuthRedirect = async () => {
            const code = searchParams.get("code");
            const scope = searchParams.get("scope");
            const state = searchParams.get("state");

            if (code && scope && state) {
                setIsExchanging(true);
                try {
                    // Convert scope string to array
                    const scopes = scope.split(' ');
                    
                    const body = {
                        code,
                        state,
                        scopes,
                        type: "admin"
                    };
                    
                    const tokenData = await generateToken(axiosPrivate, body);
                    console.log("Token generated:", tokenData);
                    
                    // Clear URL parameters after successful token generation
                    setSearchParams({});
                } catch (err) {
                    console.error("Error generating token:", err);
                } finally {
                    setIsExchanging(false);
                }
            }
        };

        handleOAuthRedirect();
    }, [searchParams]);
    
    const handleInitToken = async (e) => {
        e.preventDefault();

        try {
            const oauthData = await initToken(axiosPrivate, 'admin');
            const params = new URLSearchParams({
                response_type: oauthData.response_type,
                client_id: oauthData.client_id,
                force_verify: oauthData.force_verify,
                redirect_uri: oauthData.redirect_uri,
                scope: oauthData.scope.join(' '),
                state: oauthData.state
            });
            
            const link = `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;
            window.location.href = link;
        }
        catch (err) {
            console.error("Error initializing token:", err);
        }
    };

    return (
        <div className="api-admin-container">
            <h2>API Admin</h2>
            <p>Service Status: {serviceStatus ? "Running" : "Down"}</p>
            <CustomButton
                action={(e) => handleInitToken(e)}
                disabled={isExchanging}
                active={isExchanging}
                text={isExchanging ? "Waiting for token..." : "Get Token"}
            />
            {
                serviceStatus && (
                    <div className="api-admin-token-container">
                        <CustomAsyncValueDisplay
                            label={"Access Token"}
                            value={token.accessToken}
                            confidential={true}
                            maxLength={30}
                        />
                        <CustomAsyncValueDisplay
                            label={"Refresh Token"}
                            value={token.refreshToken}
                            confidential={true}
                            maxLength={50}
                        />
                        <CustomAsyncValueDisplay
                            label={"Expires At"}
                            value={token.expiresAt}
                            confidential={false}
                            maxLength={30}
                            type={"date"}
                        />
                    </div>
                )
            }
            
        </div>
    )
};

export default APIAdmin2;