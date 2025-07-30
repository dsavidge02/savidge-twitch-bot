import { Request, Response } from "express";
import { mongoConnector } from "@dsavidge02/mongo-connector-ts";
import { AuthUserRequest, User } from "../types/userSchema";
import { ROLES_LIST } from "../config/roles_list";
import bcrypt from 'bcrypt';
import { ObjectId } from "mongodb";

interface ResetPasswordRequest extends Request {
    body: {
        password: string;
        newPassword: string;
    }
}

export const handleResetPassword = async (req: ResetPasswordRequest, res: Response) => {
    try {
        const { password, newPassword } = req.body;

        if (!password || !newPassword) return res.status(400).json({ 'message': 'The current and new password are required.' });
        if (password === newPassword) return res.status(400).json({ 'message': 'The new password must not match the current password.' });
        
        const authReq = req as AuthUserRequest;
        const { _id } = authReq;

        const foundUser = await mongoConnector.getOne<User>('users', { _id: new ObjectId(_id) });
        if (!foundUser) return res.sendStatus(401);

        const pMatch = await bcrypt.compare(password, foundUser.password);
        if (pMatch) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            foundUser.password = hashedPassword;
            const result = await mongoConnector.updateOne<User>('users', foundUser);
            res.json({ message: 'Password updated successfully.' });
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (err) {
        console.error('Error resetting password:', err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

interface DeleteUserRequest extends Request {
    body: {
        username: string;
    };
};

export const handleDeleteUser = async (req: DeleteUserRequest, res: Response) => {
    try {
        const { username } = req.body;

        if (!username) return res.status(400).json({ message: 'Username is required.' });

        const foundUser = await mongoConnector.getOne<User>('users', { username });
        if (!foundUser) return res.sendStatus(404);

        const result = await mongoConnector.deleteOne<User>('users', foundUser);
        if (!result) return res.status(500).json({ message: 'Failed to delete user.' });

        res.json({ message: 'User successfully deleted.' });
    }
    catch (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

interface UpdateUserRequest extends Request {
    body: {
        username: string;
        roles?: number[];
    };
};

export const handleUpdateRoles = async (req: UpdateUserRequest, res: Response) => {
    try {
        const { username, roles } = req.body;

        if (!username) return res.status(400).json({ message: 'Username is required.' });
        
        const foundUser = await mongoConnector.getOne<User>('users', { username });
        if (!foundUser) return res.sendStatus(404);
        
        const newRoles: number[] = roles ?? [];
        const validRoles = newRoles.filter(role => Object.values(ROLES_LIST).includes(role));
        
        if (!validRoles.includes(ROLES_LIST.USER)) validRoles.push(ROLES_LIST.USER);

        foundUser.roles = validRoles;

        const result = await mongoConnector.updateOne<User>('users', foundUser);

        res.json({ message: `Roles successfully given to user: ${username}` });
    }
    catch (err) {
        console.error('Error updating roles for user:', err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};