const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUsers, refreshUser } = require('../utils/mongo');
require('dotenv').config();

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;

    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    try {
        const users = await getUsers();
        const foundUser = users.find(person => person.username === user);
        if (!foundUser) return res.sendStatus(401);

        const match = await bcrypt.compare(pwd, foundUser.password);
        if (!match) return res.sendStatus(401);

        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username,
                    roles: roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s'}
        );

        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        
        const currentUser = { ...foundUser, refreshToken: refreshToken };
        await refreshUser(currentUser);

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });
    }
    catch (err) {
        console.error('Login error: ', err);
        res.sendStatus(500);
    }
};

module.exports = { handleLogin };