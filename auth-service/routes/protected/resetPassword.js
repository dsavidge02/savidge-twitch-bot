const express = require('express');
const router = express.Router();
const { handleResetPassword } = require('../../controllers/resetPasswordController');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/')
    .get(verifyJWT, handleResetPassword);

module.exports = router;