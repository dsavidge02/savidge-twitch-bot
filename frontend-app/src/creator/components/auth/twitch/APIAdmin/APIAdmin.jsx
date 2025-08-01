import { useState, useEffect} from "react";
import { useSearchParams } from "react-router-dom";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useLocalStorage from "../../../../hooks/useLocalStorage";

import { 
    getServiceStatus, 
    initToken, 
    setupAdminToken 
} from "../../../../api/staticTwitchApi";

import CustomButton from "../../../structures/CustomButton/CustomButton";
import CustomSpinner from "../../../structures/CustomSpinner/CustomSpinner";
import CustomAsyncValueDisplay from "../../../structures/CustomValueDisplay/CustomAsyncValueDisplay";

import "./APIAdmin.css";

const APIAdmin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isExchanging, setIsExchanging] = useState(false);
    const [serviceStatus, setServiceStatus] = useState(null);
    const [isServiceReady, setIsServiceReady] = useState(false);
    
    const [searchParams, setSearchParams] = useSearchParams();
    const axiosPrivate = useAxiosPrivate();

    const [adminOauthState, setAdminOauthState] = useLocalStorage("twitch_admin_oauth_state", "");

    // Check service status on component mount
    useEffect(() => {
        const checkServiceStatus = async () => {
            try {
                const status = await getServiceStatus(axiosPrivate);
                setServiceStatus(status);
                setIsServiceReady(status.details.ready);
            } catch (err) {
                console.error("Error checking service status:", err);
                setServiceStatus({
                    service: 'Twitch API Service',
                    status: 'ERROR',
                    details: { enabled: false, hasAdminTokens: false, ready: false },
                    message: 'Service unavailable'
                });
                setIsServiceReady(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkServiceStatus();
    }, [axiosPrivate]);

    // Handle OAuth redirect
    useEffect(() => {
        const handleOAuthRedirect = async () => {
            const code = searchParams.get("code");
            const returnedState = searchParams.get("state");

            if (code && returnedState && returnedState === adminOauthState) {
                setIsExchanging(true);
                try {
                    // Get the scopes from the stored state (you might need to store this)
                    const scopes = ['channel:read:subscriptions', 'moderator:read:followers'];
                    
                    const result = await setupAdminToken(axiosPrivate, {
                        code,
                        state: returnedState,
                        scopes
                    });

                    if (result.success) {
                        // Clear the OAuth state
                        setAdminOauthState("");
                        setSearchParams({});
                        
                        // Refresh service status
                        const newStatus = await getServiceStatus(axiosPrivate);
                        setServiceStatus(newStatus);
                        setIsServiceReady(newStatus.details.ready);
                    } else {
                        console.error("Admin token setup failed:", result.message);
                    }
                } catch (err) {
                    console.error("Token exchange failed:", err);
                } finally {
                    setIsExchanging(false);
                }
            } else if (code && returnedState && returnedState !== adminOauthState) {
                // Invalid state - clear it
                setAdminOauthState("");
                setSearchParams({});
            }
        };

        handleOAuthRedirect();
    }, [searchParams, adminOauthState, axiosPrivate, setSearchParams]);

    const handleInitAdminToken = async (e) => {
        e.preventDefault();

        try {
            // Get OAuth parameters from server
            const oauthData = await initToken(axiosPrivate, 'admin');
            
            // Generate and store state
            const admin_oauth_state = crypto.randomUUID();
            setAdminOauthState(admin_oauth_state);

            // Build OAuth URL with server-provided parameters
            const params = new URLSearchParams({
                response_type: "code",
                client_id: oauthData.client_id,
                force_verify: true,
                redirect_uri: oauthData.redirect_uri,
                scope: oauthData.scope.join(' '),
                state: admin_oauth_state
            });

            const link = `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;
            window.location.href = link;
        } catch (err) {
            console.error("Error initializing admin token:", err);
        }
    };

    if (isLoading) {
        return (
            <div className="api-admin-container">
                <CustomSpinner 
                    size={{ radius: "40px", thickness: "4px" }}
                    loading={true}
                />
                <p>Checking service status...</p>
            </div>
        );
    }

    return (
        <div className="api-admin-container">
            {/* Service Status Display */}
            <div className="service-status-section">
                <h3>Service Status</h3>
                <div className="status-indicators">
                    <div className={`status-item ${serviceStatus?.details.enabled ? 'enabled' : 'disabled'}`}>
                        Service Enabled: {serviceStatus?.details.enabled ? '✅' : '❌'}
                    </div>
                    <div className={`status-item ${serviceStatus?.details.hasAdminTokens ? 'enabled' : 'disabled'}`}>
                        Admin Tokens: {serviceStatus?.details.hasAdminTokens ? '✅' : '❌'}
                    </div>
                    <div className={`status-item ${isServiceReady ? 'enabled' : 'disabled'}`}>
                        Ready for Users: {isServiceReady ? '✅' : '❌'}
                    </div>
                </div>
                <p className="status-message">{serviceStatus?.message}</p>
            </div>

            {/* Admin Token Setup */}
            {!isServiceReady && (
                <div className="admin-setup-section">
                    <h3>Admin Token Setup</h3>
                    <p>Service requires admin token configuration before user verification can begin.</p>
                    <CustomButton 
                        action={handleInitAdminToken}
                        disabled={isExchanging}
                        active={isExchanging}
                        text={isExchanging ? "Setting up..." : "Setup Admin Token"}
                        size={"medium"}
                    />
                </div>
            )}

            {/* Service Ready Message */}
            {isServiceReady && (
                <div className="service-ready-section">
                    <h3>✅ Service Ready</h3>
                    <p>The Twitch API service is now ready to accept user verification requests.</p>
                    <div className="ready-details">
                        <p>• Admin tokens are configured and valid</p>
                        <p>• User verification endpoints are active</p>
                        <p>• Service can check followers and subscribers</p>
                    </div>
                </div>
            )}

            {/* Legacy Token Display (for reference) */}
            <div className="api-admin-values-container">
                <CustomAsyncValueDisplay
                    label={"Service Status"}
                    value={serviceStatus?.status || "Unknown"}
                    confidential={false}
                    maxLength={30}
                />
                <CustomAsyncValueDisplay
                    label={"Admin Tokens Configured"}
                    value={serviceStatus?.details.hasAdminTokens ? "Yes" : "No"}
                    confidential={false}
                    maxLength={10}
                />
                <CustomAsyncValueDisplay
                    label={"Service Ready"}
                    value={isServiceReady ? "Yes" : "No"}
                    confidential={false}
                    maxLength={10}
                />
            </div>
        </div>
    );
};

export default APIAdmin;