const { getAccessToken, twitchRequest } = require('../utils/twitchAdminService');
const { getStreamerId } = require('../utils/twitchAuthService')

const handleGetFollowers = async (req, res) => {
    try {
        const streamer = getStreamerId();

        let followers = [];
        let cursor = null;
        const limit = 100;

        do {
            const response = await twitchRequest({
                method: 'get',
                url: 'https://api.twitch.tv/helix/channels/followers',
                params: {
                    'broadcaster_id': streamer,
                    'first': limit,
                    ...(cursor ? { 'after': cursor } : {})
                }
            });

            if (response.data?.data?.length) {
                followers.push(...response.data.data);
            }

            cursor = response.data.pagination?.cursor;
        } while (cursor);

        res.json({
            count: followers.length,
            followers
        });
    }
    catch (err) {
        console.error('Error fetching followers from Twitch:', err.message);
        res.status(500).json({ error: 'Failed to fetch followers from Twitch API' });
    }
};

const handleGetSubscribers = async (req, res) => {
    try {
        const streamer = getStreamerId();

        let subscribers = [];
        let cursor = null;
        const limit = 100;

        do {
            const response = await twitchRequest({
                method: 'get',
                url: 'https://api.twitch.tv/helix/subscriptions',
                params: {
                    broadcaster_id: streamer,
                    first: limit,
                    ...(cursor ? { 'after': cursor } : {})
                }
            });

            if (response.data?.data?.length) {
                subscribers.push(...response.data.data);
            }

            cursor = response.data.pagination?.cursor;
        } while (cursor);

        res.json({
            count: subscribers.length,
            subscribers
        });
    }
    catch (err) {
        console.error('Error fetching subscribers from Twitch:', err.message);
        res.status(500).json({ error: 'Failed to fetch subscribers from Twitch API' });
    }
};

const handleGetFollower = async (req, res) => {
    try {
        const streamer = getStreamerId();

        if (!req?.twitch_user_id) return res.sendStatus(400);

        const response = await twitchRequest({
            method: 'get',
            url: 'https://api.twitch.tv/helix/channels/followers',
            params: {
                broadcaster_id: streamer,
                user_id: req.twitch_user_id
            }
        });

        const follower = response.data.data[0];

        console.log(`follower: ${JSON.stringify(follower)}`);

        res.json({
            follower
        });
    }
    catch (err) {
        console.error('Error fetching follower from Twitch:', err.message);
        res.status(500).json({ error: 'Failed to fetch follower from Twitch API' });
    }
};

const handleGetSubscriptions = async (req, res) => {
    try {
        const streamer = getStreamerId();

        if (!req?.twitch_user_id) return res.sendStatus(400);

        const response = await twitchRequest({
            method: 'get',
            url: 'https://api.twitch.tv/helix/subscriptions',
            params: {
                broadcaster_id: streamer,
                user_id: req.twitch_user_id
            }
        });

        const subscriptions = response.data.data;

        console.log(`subscriptions: ${JSON.stringify(subscriptions)}`);

        res.json({
            subscriptions
        });
    }
    catch (err) {
        console.error('Error fetching subscriber from Twitch:', err.message);
        res.status(500).json({ error: 'Failed to fetch subscriber from Twitch API' });
    }
};

module.exports = {
    handleGetFollowers,
    handleGetSubscribers,
    handleGetFollower,
    handleGetSubscriptions
}