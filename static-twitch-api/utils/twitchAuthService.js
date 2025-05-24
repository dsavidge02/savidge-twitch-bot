const axios = require('axios');
const qs = require('qs');

// READING IN ENV VARIABLES
require('dotenv').config();
const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const userLogin = process.env.TWITCH_STREAMER_USERNAME;

if (!clientId || !clientSecret || !userLogin) {
    throw new Error('Missing TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET or TWITCH_STREAMER_USERNAME');
}

let accessToken = null;
let tokenExpiresAt = 0;
let streamerId = null;

const MAX_TIMEOUT = 2 ** 31 - 1;

// TOKEN LOGIC
const fetchAccessToken = async() => {
    try {
        const body = qs.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials'
        });

        const res = await axios.post('https://id.twitch.tv/oauth2/token', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        accessToken = res.data.access_token;
        const expiryTime = res.data.expires_in * 1000;
        tokenExpiresAt = Date.now() + expiryTime;

        const refreshTime = Math.min(expiryTime - 60_000, MAX_TIMEOUT);
        console.log(`Twitch token acquired. Refreshing in ${Math.floor(refreshTime / 1000)}s`);

        await fetchStreamerId();

        setTimeout(fetchAccessToken, refreshTime);
    }
    catch (err) {
        console.error('Failed to fetch Twitch access token:', err?.response?.data?.message || err.message);

        setTimeout(fetchAccessToken, 60 * 1000);
    }
};

const getAccessToken = () => {
    if (!accessToken || Date.now() >= tokenExpiresAt) {
        throw new Error('Access token unavailable.');
    }
    return accessToken;
};

const resetAuth = () => {
    accessToken = null;
    tokenExpiresAt = 0;
    streamerId = null;
};

// STREAMER ID LOGIC
const fetchStreamerId = async() => {
    try {
        const token = getAccessToken();
        const username = process.env.TWITCH_STREAMER_USERNAME;

        const res = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${token}`,
            },
        });

        const user = res.data.data[0];
        if (!user) {
            throw new Error(`Streamer not found for username: ${username}`);
        }

        streamerId = user.id;
        console.log(`Streamer ID cached: ${streamerId}`);
    }
    catch (err){
        console.error('Failed to fetch streamer ID:', err?.response?.data?.message || err.message)
    }
};

const getStreamerId = () => {
    if (!streamerId) throw new Error('Streamer ID not available.');
    return streamerId;
}

module.exports = { fetchAccessToken, getAccessToken, getStreamerId, clientId, resetAuth };