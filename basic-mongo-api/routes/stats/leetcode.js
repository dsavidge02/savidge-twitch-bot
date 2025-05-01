const express = require('express');
const router = express.Router();

const { fetchCollection, fetchRecord, addRecord, updateRecord } = require('../../utils/mongo');
const { validateRecord, validateUpdate } = require('../../utils/schema');
const validateToken = require('../../middleware/validateToken');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.get('/leetcode', async (req, res) => {
    try {
        const collection = await fetchCollection('stats','leetcode');
        
        if (!collection) {
            return res.status(404).json({ message: 'No leetcode data found' });
        }

        return res.json(collection);
    }
    catch (err) {
        console.error('Error fetching stats from leetcode:', err.message);
        res.status(500).json({ error: 'Failed to fetch goals from Mongo API' });
    }
});

router.get('/leetcode/problem', async (req, res) => {
    try {
        const id = req.query.id;

        if (!id) {
            return res.status(400).json({ error: 'expected request /problem?id=<id>'});
        }

        problem = await fetchRecord('stats', 'leetcode', id);
        return res.json(problem);
    }
    catch (err) {
        console.error('Error fetching problem from Leetcode:', err.message);
        res.status(500).json({ error: 'Failed to fetch user from Leetcode API' });
    }
});

router.post('/leetcode/addProblem', validateToken, verifyRoles(ROLES_LIST.Bot), async (req, res) => {
    try {
        const validatedParams =  validateRecord('problem', req.body);
        const result = await addRecord('stats', 'leetcode', validatedParams);

        if (result.insertedId) {
            console.log(`Added a new problem with id ${result.insertedId}`);
        }

        return res.status(201).json({
            message: 'Problem added successfully',
            insertedId: result.insertedId
        });
    }
    catch (err) {
        console.error('Error in adding problem to leetcode', err);
        return res.status(500).json({ error: 'Failed to create new problem record from Leetcode API' });
    }
});

router.post('/leetcode/updateProblem', validateToken, verifyRoles(ROLES_LIST.Bot), async (req, res) => {
    try {
        const id = req.query.id;

        if (!id) {
            return res.status(400).json({ error: 'expected request /updateProblem?id=<id>'});
        }

        const validatedParams =  validateUpdate('problem', req.body);
        const result = await updateRecord('stats', 'leetcode', id, validatedParams);

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: `No problem found with id ${id}` });
        }

        console.log(`Updated problem with id ${id}`);

        return res.status(200).json({
            message: 'Problem updated successfully',
            updatedId: id
        });
    }
    catch (err) {
        console.error('Error in updating problem in leetcode', err);
        return res.status(500).json({ error: 'Failed to update problem record from Leetcode API' });
    }
});

module.exports = router;