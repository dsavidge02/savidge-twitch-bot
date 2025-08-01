import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { mongoConnector } from '@dsavidge02/mongo-connector-ts';
import { User } from '../types/userSchema';

interface LoginRequestBody {
    username: string;
    password: string;
}

const privateKey = fs.readFileSync(path.join(__dirname, '../../certs/private.pem'));
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
if (!refreshTokenSecret) throw new Error("Missing REFRESH_TOKEN_SECRET env variable.");

export const handleLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body as LoginRequestBody;

    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await mongoConnector.getOne<User>('users', { username });
    if (!foundUser) return res.sendStatus(401);

    const pMatch = await bcrypt.compare(password, foundUser.password);
    if (pMatch) {
        const twitch_user_id = foundUser.twitch_user_id || "";
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    _id: foundUser._id,
                    username: foundUser.username,
                    roles: foundUser.roles,
                    twitch_user_id
                }
            },
            privateKey,
            {
                algorithm: 'RS256',
                expiresIn: '30s'
            }
        );
        const refreshToken = jwt.sign(
            {
                username: foundUser.username
            },
            refreshTokenSecret,
            {
                expiresIn: '1d'
            }
        );

        foundUser.refreshToken = refreshToken;

        const result = await mongoConnector.updateOne<User>('users', foundUser);

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            // secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });
    }
    else {
        res.sendStatus(401);
    }
};