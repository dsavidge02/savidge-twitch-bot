const express = require('express');
const router = express.Router();
const { handleGetToken, handleGenerateToken, handleVerifyUser } = require('../controllers/authController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/roles_list');

router.route('/admin/token')
    .get(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), handleGetToken)
    .post(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), handleGenerateToken);

router.route('/user/verify')
    .post(handleVerifyUser);

module.exports = router;