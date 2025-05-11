const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { userSchema } = require('../schemas/userSchema');
const { mongoConnector } = require('../utils/mongo');
const ROLES_LIST = require('../config/roles_list');

const handleRegister = async (req, res) => {
    if(!req.body) return res.status(400).json({ message: 'No request body provided.' });

    const { error, value } = userSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: 'User validation failed',
            details: error.details.map(detail => detail.message)
        });
    }

    const { username, email, password } = value;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        username: username,
        email: email,
        password: hashedPassword,
        roles: [ ROLES_LIST.USER ]
    };
    
    try {
        const result = await mongoConnector.createOne('users', newUser, ['username', 'email']);
        res.status(201).json({ message: 'User registered successfully.', user: { username, email } });
    }
    catch (err) {
        if (err.message.includes('Document with username') || err.message.includes('Document with email')) {
            return res.status(409).json({ message: err.message });
        }

        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    handleRegister
};