const axios = require('axios');

const validateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];

    try {
        const response = await axios.get('http://localhost:3002/validate', {
            headers: { Authorization: `Bearer ${token}`}
        });
        const { valid, UserInfo } = response.data;
        if (!valid) return res.sendStatus(401);
        req.user = UserInfo.user;
        req.roles = UserInfo.roles;
        next();
    }
    catch (err) {
        console.error('Token validation failed:', err.message);
        return res.sendStatus(403);
    }
};

module.exports = validateToken;