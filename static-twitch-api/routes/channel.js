const express = require('express');
const router = express.Router();
const { handleGetFollowers, handleGetSubscribers } = require('../controllers/channelController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/roles_list');

router.route('/followers')
    .get(handleGetFollowers);
router.route('/subscribers')
    .get(handleGetSubscribers);

module.exports = router;