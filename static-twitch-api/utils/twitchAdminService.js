const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

let accessToken = null;
let refreshToken = null;
let expiresAt = null;


let isRefreshing = false;
let requestQueue = [];

const requiredScopes = ['channel:read:subscriptions', 'moderator:read:followers'];

const twitchEventSocket = require("../sockets/twitchEventSocket2");

const fakeAxios401 = {
    response: {
        status: 401,
        data: 'Simulated token expiration'
    },
    message: 'Simulated 401 unauthorized',
    isAxiosError: true
};

const setToken = async (data) => {
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
    expiresAt = Date.now() + expires_in * 1000;

    console.log(`Access Token: ${accessToken}`);
    console.log(`Refresh Token: ${refreshToken}`);

    await twitchEventSocket.updateAccessToken(accessToken);
    await twitchEventSocket.start();
}

const getAccessToken = () => {
    return { accessToken, refreshToken, expiresAt };
}

const refreshAccessToken = async () => {
    if (!refreshToken) return;
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

    return response.data;
};

const twitchRequest = async(config) => {
    const makeRequest = async (token) => axios({
        ...config,
        headers: {
            ...config.headers,
            'Authorization': `Bearer ${token}`,
            'Client-ID': clientId
        }
    });

    try {
        if (!accessToken) throw Error("No access token exists for savidge_af.");
        return await makeRequest(accessToken);
    }
    catch (err) {
        if (err.response?.status !== 401) {
            throw err;
        }
        console.warn('Access token expired. Refreshing...');

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                requestQueue.push(async (newToken) => {
                    try {
                        const res = await makeRequest(newToken);
                        resolve(res);
                    }
                    catch (queueErr) {
                        reject(queueErr);
                    }
                });
            });
        }

        isRefreshing = true;

        try {
            const newTokenData = await refreshAccessToken();
            await setToken(newTokenData);

            const retryRes = await makeRequest(accessToken);

            requestQueue.forEach((callback) => callback(accessToken));
            requestQueue = [];

            return retryRes;
        }
        catch (refreshErr) {
            requestQueue = [];
            throw refreshErr;
        }
        finally {
            isRefreshing = false;
        }
    }
}

module.exports = {
    setToken,
    getAccessToken,
    twitchRequest
};