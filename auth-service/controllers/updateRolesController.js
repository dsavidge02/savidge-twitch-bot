const bcrypt = require('bcrypt');

const { mongoConnector, ObjectId } = require('../utils/mongo');;
const { userSchema } = require('../schemas/userSchema');
const ROLES_LIST = require('../config/roles_list');

const handleUpdateRoles = async (req, res) => {
    const { username, roles } = req.body;

    if (!username || !roles ) return res.status(400).json({ 'message': 'Username and roles are required.' });
    if ( username === req.username) return res.status(403).json({ 'message': 'Are you trying to update your own id?' });
    
    const foundUser = await mongoConnector.getOne('users', { 'username': username });
    if (!foundUser) return res.sendStatus(404);

    const newRoles = Array.isArray(roles) ? roles : [roles];
    const validRoles = newRoles
        .filter(role => Object.values(ROLES_LIST).includes(role));
    if (validRoles.length === 0) {
        return res.status(400).json({ 'message': 'No valid roles provided.' });
    }

    const existingRoles = Array.isArray(foundUser.roles) ? foundUser.roles : [];
    const updatedRoles = [...new Set([...existingRoles, ...validRoles])];
    foundUser.roles = updatedRoles;

    const result = await mongoConnector.updateOne('users', foundUser);
    
    res.json({ 'message': `Roles updated successfully for user: ${username}` });
};

module.exports = {
    handleUpdateRoles
};