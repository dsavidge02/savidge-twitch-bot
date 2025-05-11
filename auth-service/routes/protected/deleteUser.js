const express = require('express');
const router = express.Router();
const { handleDeleteUser } = require('../../controllers/deleteUserController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

router.route('/')
    .post(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), handleDeleteUser);

module.exports = router;