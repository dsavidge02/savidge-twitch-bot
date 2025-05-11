const bcrypt = require('bcrypt');

const { mongoConnector, ObjectId } = require('../utils/mongo');;
const { userSchema } = require('../schemas/userSchema');

const handleResetPassword = async (req, res) => {
    const { password, newPassword } = req.body;

    if (!password || !newPassword) return res.status(400).json({ 'message': 'The current and new password are required.' });
    if (password === newPassword) return res.status(400).json({ 'message': 'The new password must not match the current password.' });

    const id = req._id;
    const foundUser = await mongoConnector.getOne('users', { '_id': new ObjectId(id) });
    if (!foundUser) return res.sendStatus(401);

    const pMatch = await bcrypt.compare(password, foundUser.password);
    if (pMatch) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        foundUser.password = hashedPassword;
        const result = await mongoConnector.updateOne('users', foundUser);
        res.json({ 'message': 'Password updated successfully.' });
    }
    else {
        res.sendStatus(401);
    }
};

module.exports = {
    handleResetPassword
};