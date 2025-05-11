const { mongoConnector, ObjectId } = require('../utils/mongo');
const { userSchema } = require('../schemas/userSchema');

const handleDeleteUser = async (req, res) => {
    const { username } = req.body;
    
    if (!username) return res.status(400).json({ 'message': 'Username is required.' });

    const foundUser = await mongoConnector.getOne('users', { 'username': username });
    if (!foundUser) return res.sendStatus(404);

    const result = await mongoConnector.deleteOne('users', foundUser);

    res.json({ 'message': 'User successfully deleted.' });
};

module.exports = {
    handleDeleteUser
};