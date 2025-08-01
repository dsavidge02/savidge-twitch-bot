import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { AuthUserRequest, User } from '../types/userSchema';

interface AccessTokenPayload {
    UserInfo: User;
    iat: number;
    exp: number;
}

const publicKey = fs.readFileSync(path.join(__dirname, '../../certs/public.pem'));

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.toString().startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.toString().split(' ')[1];
    jwt.verify(
        token,
        publicKey,
        { algorithms: ['RS256'] },
        (err, decoded) => {
            if (err) return res.sendStatus(403);

            const payload = decoded as AccessTokenPayload;
            const user = payload.UserInfo;

            const authReq = req as AuthUserRequest;
            authReq._id = user._id;
            authReq.username = user.username;
            authReq.roles = user.roles;
            authReq.twitch_user_id = user.twitch_user_id;
            next();
        }
    );
}; 