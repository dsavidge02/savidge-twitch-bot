const express = require('express');
const axios = require('axios');
const qs = require('qs');
const router = express.Router();

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const redirectUri = 'http://localhost:3000/twitch/callback'; // must match the one used earlier

router.post('/exchange', async (req, res) => {
    const { code } = req.body;
    try {
        const body = qs.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri
        });

        const tokenRes = await axios.post('https://id.twitch.tv/oauth2/token', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = tokenRes.data.access_token;

        // Optionally fetch Twitch user info
        const userRes = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const user = userRes.data.data[0];

        res.json({
            accessToken,
            twitchUser: user
        });

    } catch (err) {
        console.error('Token exchange failed:', err?.response?.data || err.message);
        res.status(500).json({ error: 'Failed to exchange Twitch code' });
    }
});

module.exports = router;