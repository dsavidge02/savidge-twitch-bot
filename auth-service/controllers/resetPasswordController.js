const { mongoConnector, ObjectId } = require('../utils/mongo');
const { userSchema } = require('../schemas/userSchema');

const handleResetPassword = async (req, res) => {
    // DELETE ACCESS TOKEN ON CLIENT

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    const foundUser = await mongoConnector.getOne('users', { 'refreshToken': refreshToken });
    if (!foundUser) {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.sendStatus(204);
    }

    foundUser.refreshToken = '';
    
    const result = await mongoConnector.updateOne('users', foundUser);
    
    res.clearCookie('jwt', { 
        httpOnly: true,
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000
    });
    res.sendStatus(204);
};

module.exports = {
    handleResetPassword
};