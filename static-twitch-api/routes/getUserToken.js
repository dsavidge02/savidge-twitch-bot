const express = require('express');
const axios = require('axios');
const qs = require('qs');
const router = express.Router();

// READING IN ENV VARIABLES
require('dotenv').config();
const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

router.post('/', async (req, res) => {
    const code = req.body.code;

    if (!code) return res.status(400).json({ error: 'Authorization code is required.' });

    try {
        const body = qs.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            grant_type: "authorization_code",
            redirect_uri: "http://localhost:5173/savidge_af/callback"
        });

        const response = await axios.post('https://id.twitch.tv/oauth2/token', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token, refresh_token, expires_in } = response.data;

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
});

module.exports = router;