const express = require('express');
const router = express.Router();
const { handleValidateUser } = require('../../controllers/validateUserController');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/')
    .post(verifyJWT, handleValidateUser);

module.exports = router;