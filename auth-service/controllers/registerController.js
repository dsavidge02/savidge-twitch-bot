const { getUsers, addUser } = require('../utils/mongo');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usenames in the db
    const users = await getUsers();
    const duplicate = users.find(person => person.username === user);
    if (duplicate) return res.sendStatus(409);

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //store the new user
        const newUser = { 
            "username": user,
            "roles": { "User": 2002 },
            "password": hashedPwd
        };
        addUser(newUser);
        res.status(201).json({ 'success': `New user ${user} created` });
    }
    catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};

module.exports = { handleNewUser }