const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { userSchema } = require('../schemas/userSchema');

const handleLogin = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) return res.status(400).json({ 'message': 'Username, email, and password are required.' });
    else if (false) return res.status(409).json({ 'message': 'Username is already taken.' });
    else if (false) return res.status(409).json({ 'message': 'Email is already being used.' });

    res.json({ 'message': 'oi mate' });
};

module.exports = {
    handleLogin
};