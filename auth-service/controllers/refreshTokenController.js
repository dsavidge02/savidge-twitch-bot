const jwt = require('jsonwebtoken');

const { mongoConnector, ObjectId } = require('../utils/mongo');
const { userSchema } = require('../schemas/userSchema');

const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync(path.join(__dirname, '../certs/private.pem'));

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await mongoConnector.getOne('users', { 'refreshToken': refreshToken });
    if (!foundUser) return res.sendStatus(403);
    
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "_id": foundUser._id,
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                privateKey,
                {
                    "algorithm": 'RS256', 
                    "expiresIn": '30s' 
                }
            );
            res.json({ accessToken });
        }
    );
};

module.exports = {
    handleRefreshToken
};