const { mongoConnector, ObjectId } = require('../utils/mongo');
const { userSchema } = require('../schemas/userSchema');

const handleGetUsers = async (req, res) => {
    const usersArray = await mongoConnector.getCollectionArray('users');
    if (!usersArray) return res.sendStatus(404);

    res.json({ 'users': usersArray });
};

module.exports = {
    handleGetUsers
};