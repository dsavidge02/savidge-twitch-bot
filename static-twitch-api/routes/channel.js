const express = require('express');
const router = express.Router();
const { handleGetFollowers, handleGetSubscribers, handleGetFollower, handleGetSubscriptions } = require('../controllers/channelController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/roles_list');

router.route('/followers')
    .get(handleGetFollowers);
router.route('/subscribers')
    .get(handleGetSubscribers);
router.route('/getFollower')
    .get(verifyJWT, handleGetFollower);
router.route('/getSubscriptions')
    .get(verifyJWT, handleGetSubscriptions);

module.exports = router;