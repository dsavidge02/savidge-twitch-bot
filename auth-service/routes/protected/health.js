const express = require('express');
const router = express.Router();
const { handleHealth } = require('../../controllers/healthController');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/')
    .get(verifyJWT, handleHealth);

module.exports = router;