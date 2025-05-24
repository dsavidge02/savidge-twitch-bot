const express = require('express');
const axios = require('axios');
const { getAccessToken, getStreamerId, clientId } = require('../utils/twitchAuthService');
const router = express.Router();

router.get('/followers', async (req, res) => {
    try {
        const token = getAccessToken();
        const streamer = getStreamerId();

        const response = await axios.get('https://api.twitch.tv/helix/channels/followers', {
            params: {
                'broadcaster_id': streamer
            },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Client-ID': clientId,
                'scope': ["moderator:read:followers"]
            }
        });
        console.log(response.data);
        res.json({
            count: response.data.total
        });
    }
    catch (err) {
        console.error('Error fetching followers from Twitch:', err.message);
        res.status(500).json({ error: 'Failed to fetch followers from Twitch API' });
    }
});

module.exports = router;