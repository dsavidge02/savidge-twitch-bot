import { Request, Response } from 'express';
import { mongoConnector } from '@dsavidge02/mongo-connector-ts';
import { User } from '../types/userSchema';

interface LogoutRequestBody extends Request {
    cookies: {
        jwt?: string;
    }
}

export const handleLogout = async (req: LogoutRequestBody, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    const foundUser = await mongoConnector.getOne<User>('users', { refreshToken });
    if (!foundUser) {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.sendStatus(204);
    }

    foundUser.refreshToken = '';

    const result = await mongoConnector.updateOne<User>('users', foundUser);

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    });
    res.sendStatus(204);
};