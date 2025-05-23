const express = require('express');
const router = express.Router();
const { handleGetUsers } = require('../../controllers/getUsersController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

router.route('/')
    .get(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), handleGetUsers);

module.exports = router;