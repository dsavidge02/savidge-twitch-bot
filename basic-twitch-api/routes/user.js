const express = require('express');
const axios = require('axios');
const { getAccessToken, clientId } = require('../utils/twitchAuthService');
const router = express.Router();

router.get('/', async (req, res) => {
    const login = req.query.login;

    if (!login) {
        return res.status(400).json({ error: 'expected request /user?login=<username>'});
    }

    try {
        const token = getAccessToken();

        const response = await axios.get(`https://api.twitch.tv/helix/users`, {
            params: {login},
            headers: {
                'Authorization': `Bearer ${token}`,
                'Client-ID': clientId
            }
        });

        res.json(response.data);
    }
    catch (err) {
        console.error('Error fetching user from Twitch:', err.message);
        res.status(500).json({ error: 'Failed to fetch user from Twitch API' });
    }
});

module.exports = router;