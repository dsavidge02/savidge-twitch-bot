const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { mongoConnector, ObjectId } = require('../utils/mongo');
const { userSchema } = require('../schemas/userSchema');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });
    
    const foundUser = await mongoConnector.getOne('users', { 'username': username });
    if (!foundUser) return res.sendStatus(401);
    
    const pMatch = await bcrypt.compare(password, foundUser.password);
    if (pMatch) {
        const roles = Object.values(foundUser.roles).filter(Boolean);

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "_id": foundUser._id,
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { "expiresIn": '30s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { "expiresIn": '1d'}
        );
        
        foundUser.refreshToken = refreshToken;

        const result = await mongoConnector.updateOne('users', foundUser);

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'Lax',
            // secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });
    }
    else {
        res.sendStatus(401);
    }
};

module.exports = {
    handleLogin
};