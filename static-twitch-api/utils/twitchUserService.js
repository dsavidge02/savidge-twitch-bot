const axios = require('axios');
const qs = require('qs');

require('dotenv').config();

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

const requiredScopes = ['user:read:subscriptions', 'user:read:email'];

const { getAccessToken, twitchRequest } = require('../utils/twitchAdminService');
const { getStreamerId } = require('../utils/twitchAuthService');

const userRequest = async (config) => {
    try {
        const response = await axios({
            ...config,
            headers: {
                ...config.headers,
            }
        });
        return response;
    }
    catch (err) {
        console.error(err);
    }
}

const checkFollowing = async (userId) => {
    try {
        const streamer = getStreamerId();

        const response = await twitchRequest({
            method: 'get',
            url: 'https://api.twitch.tv/helix/channels/followers',
            params: { 'broadcaster_id': streamer, 'user_id': userId }
        });

        console.log(response.data);

        const following = response?.data?.data?.length === 1;
        return following;
    }
    catch (err) {
        console.error('Error fetching followers from Twitch:', err.message);
        res.status(500).json({ error: 'Failed to fetch followers from Twitch API' });
    }
}

const checkSubscription = async (userId) => {
    try {
        const streamer = getStreamerId();

        const response = await twitchRequest({
            method: 'get',
            url: 'https://api.twitch.tv/helix/subscriptions',
            params: {
                broadcaster_id: streamer,
                user_id: userId
            }
        });

        const subscription = response?.data?.data?.length > 0;
        return subscription;
    }
    catch (err) {
        console.error('Error fetching subscriptions from Twitch:', err.message);
        res.status(500).json({ error: 'Failed to fetch subscriptions from Twitch API' });
    }
};

const verifyUser = async (data) => {
    const token = getAccessToken();
    if (!token) return false;

    const { access_token, refresh_token, expires_in, scope, token_type } = data;

    const scopeArray = Array.isArray(scope) ? scope : typeof scope === 'string' ? scope.split(' ') : [];

    const isBearer = token_type?.toLowerCase() === 'bearer';
    const hasRequiredScopes = requiredScopes.every(s => scopeArray.includes(s));

    if (!isBearer || !hasRequiredScopes) {
        console.error("Token validation failed: missing required scopes or incorrect token type.");
        return;
    }

    console.log(`Access Token: ${access_token}`);

    const response = await userRequest({
        method: 'get',
        url: 'https://api.twitch.tv/helix/users',
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Client-ID': clientId
        }
    });

    if (!response?.data?.data?.[0]) return;

    const { id, login, email } = response.data.data[0];

    console.log(response.data.data)

    console.log(id);

    const following = await checkFollowing(id);
    const subscription = await checkSubscription(id);
    const allowed = (following || subscription);
    console.log(following);
    const user = {
        allowed,
        login,
        email,
        id
    }
    return user;
};



module.exports = {
    verifyUser
};