const express = require('express');
const router = express.Router();

const { fetchCollection } = require('../utils/mongo');

router.get('/goals', async (req, res) => {
    try {
        const params = req.query.params ? req.query.params.split(',') : [];

        if (params.length === 0) {
            return res.status(400).json({ message: 'No parameters provided' });
        }

        const collection = await fetchCollection('twitch','goals');
        const goalInfo = collection[0];
        if (!goalInfo) {
            return res.status(404).json({ message: 'No goal data found' });
        }

        let result = {};

        params.forEach(param => {
            if (goalInfo.hasOwnProperty(param)) {
                result[param] = goalInfo[param];
            }
        });

        return res.json(result);
    }
    catch (err) {
        console.error('Error fetching goals from mongo:', err.message);
        res.status(500).json({ error: 'Failed to fetch goals from Mongo API' });
    }
});

module.exports = router;