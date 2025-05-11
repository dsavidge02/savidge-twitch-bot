const express = require('express');
const router = express.Router();
const { handleGiveRoles, handleRemoveRoles } = require('../../controllers/updateRolesController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

router.route('/give')
    .post(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), handleGiveRoles);

router.route('/remove')
    .post(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), handleRemoveRoles);

module.exports = router;