const { getUsers, refreshUser } = require("../utils/mongo");

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    const users = await getUsers();
    const foundUser = users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }
    
    // delete refreshToken in db
    const currentUser = { ...foundUser, refreshToken: '' };
    await refreshUser(currentUser);

    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true }); // secure set to true in prod
    res.sendStatus(204);
};

module.exports = { handleLogout };