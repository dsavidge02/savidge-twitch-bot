const { getAccessToken, twitchRequest } = require('../utils/twitchAdminService');
const { getStreamerId } = require('../utils/twitchAuthService')

const handleGetFollowers = async (req, res) => {
    try {
        const token = getAccessToken();
        if (!token) return res.sendStatus(400);
        const streamer = getStreamerId();

        const response = await twitchRequest({
            method: 'get',
            url: 'https://api.twitch.tv/helix/channels/followers',
            params: { 'broadcaster_id': streamer }
        });

        res.json({
            count: response.data.total
        });
    }
    catch (err) {
        console.error('Error fetching followers from Twitch:', err.message);
        res.status(500).json({ error: 'Failed to fetch followers from Twitch API' });
    }
};

const handleGetSubscribers = async (req, res) => {
    try {
        const token = getAccessToken();
        if (!token) return res.sendStatus(400);
        const streamer = getStreamerId();

        const response = await twitchRequest({
            method: 'get',
            url: 'https://api.twitch.tv/helix/subscriptions',
            params: { 'broadcaster_id': streamer }
        });

        res.json({
            count: response.data.total
        });
    }
    catch (err) {
        console.error('Error fetching subscribers from Twitch:', err.message);
        res.status(500).json({ error: 'Failed to fetch subscribers from Twitch API' });
    }
};

module.exports = {
    handleGetFollowers,
    handleGetSubscribers
}