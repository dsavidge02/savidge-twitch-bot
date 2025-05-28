const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

let accessToken = null;
let refreshToken = null;

const requiredScopes = ['channel:read:subscriptions', 'moderator:read:followers'];

const setToken = (data) => {
    const { access_token, refresh_token, expires_in, scope, token_type } = data;

    const scopeArray = Array.isArray(scope) ? scope : typeof scope === 'string' ? scope.split(' ') : [];

    const isBearer = token_type?.toLowerCase() === 'bearer';
    const hasRequiredScopes = requiredScopes.every(s => scopeArray.includes(s));

    if (!isBearer || !hasRequiredScopes) {
        console.error("Token validation failed: missing required scopes or incorrect token type.");
        return;
    }

    accessToken = access_token;
    refreshToken = refresh_token;

    console.log(`Access Token: ${accessToken}`);
    console.log(`Refresh Token: ${refreshToken}`);
}

const getAccessToken = () => {
    return accessToken;
}

const refreshAccessToken = async () => {
    try {
        const body = qs.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'refresh_token',
            refresh_token: encodeURIComponent(refreshToken)
        });

        const response = await axios.post('https://id.twitch.tv/oauth2/token', body, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        const result = response.data;
        return result;
    }
    catch (err) {
        throw err;
    }
};

const twitchRequest = async(config) => {
    try {
        const response = await axios({
            ...config,
            headers: {
                ...config.headers,
                'Authorization': `Bearer ${accessToken}`,
                'Client-ID': clientId
            }
        });

        return response;
    }
    catch (err) {
        if (err.response?.status === 401) {
            console.warn('Access token expired. Refreshing...');
        }

        try {
            const newToken = await refreshAccessToken();
            setToken(newToken);

            const retryResponse = await axios({
                ...config,
                headers: {
                    ...config.headers,
                    'Authorization': `Bearer ${token}`,
                    'Client-ID': clientId
                }
            });

            return retryResponse;
        }
        catch (refreshErr) {
            console.error('Failed to refresh token or retry request:', refreshErr.message);
            throw refreshErr;
        }
    }
}

module.exports = {
    setToken,
    getAccessToken,
    twitchRequest
};