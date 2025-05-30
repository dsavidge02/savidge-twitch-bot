const axios = require('axios');
const qs = require('qs');

require('dotenv').config();
const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
// const redirectUri = "http://localhost:5173/savidge_af/callback";

const { setToken, getAccessToken } = require('../utils/twitchAdminService');
const { verifyUser } = require('../utils/twitchUserService');

const handleGetToken = async (req, res) => {
    const token = getAccessToken();
    return res.json({
        access_token: token.accessToken,
        refresh_token: token.refreshToken,
        expires_at: token.expiresAt,
    });
}

const fetchUserAccessToken = async (code, redirectUri) => {
    try {
        const body = qs.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            grant_type: "authorization_code",
            redirect_uri: redirectUri
        });

        const response = await axios.post("https://id.twitch.tv/oauth2/token", body, {
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

const handleGenerateToken = async (req, res) => {
    const code = req.body.code;

    if (!code) return res.status(400).json({ error: 'Authorization code is required.' });

    try {
        const redirectUri = "http://localhost:5173/savidge_af/admin";
        const newToken = await fetchUserAccessToken(code, redirectUri);
        setToken(newToken);
        const { access_token, refresh_token, expires_in } = newToken;
        return res.json({
            access_token,
            refresh_token,
            expires_in
        });
    }
    catch (err) {
        console.error('Error exchanging code for token: ', err.response?.data || err.message);
        return res.status(500).json({ error: 'Failed to exchange code for token' });
    }
};

const handleVerifyUser = async (req, res) => {
    const code = req.body.code;

    if (!code) return res.status(400).json({ error: 'Authorization code is required.' });

    try {
        const redirectUri = "http://localhost:5173/savidge_af/register";
        const newToken = await fetchUserAccessToken(code, redirectUri);
        const user = await verifyUser(newToken);

        if (user.allowed) {
            return res.status(200).json({ 
                email: user.email,
                login: user.login,
                twitch_user_id: user.id
            });
        }
        else {
            return res.sendStatus(401);
        }
    }
    catch (err) {
        console.error('Error exchanging code for token: ', err.response?.data || err.message);
        return res.status(500).json({ error: 'Failed to exchange code for token' });
    }
}

module.exports = {
    handleGetToken,
    handleGenerateToken,
    handleVerifyUser
};