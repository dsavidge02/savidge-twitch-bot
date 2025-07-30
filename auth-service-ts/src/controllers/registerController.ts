import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { mongoConnector } from '@dsavidge02/mongo-connector-ts';
import { NewUser } from '../types/userSchema';
import { ROLES_LIST } from '../config/roles_list';

interface RegisterBody {
    username: string;
    email: string;
    password: string;
    twitch_user_id: string;
}

export const handleRegister = async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    if (!req.body) return res.status(400).json({ message: 'No request body provided.' });

    const { username, email, password, twitch_user_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: NewUser = {
        username,
        email,
        password: hashedPassword,
        roles: [ ROLES_LIST.USER ],
        twitch_user_id
    };

    const uniqueFields: (keyof NewUser)[] = twitch_user_id === '' || twitch_user_id === undefined
        ? ['username', 'email']
        : ['username', 'email', 'twitch_user_id']

    try {
        const result = await mongoConnector.createOne<NewUser>('users', newUser, uniqueFields)
        res.status(201).json({ message: 'User registered successfully.', user: { username, email, twitch_user_id } });
    }
    catch (err: unknown) {
        if (err instanceof Error) {
            if (err.message.includes('Document with username') || err.message.includes('Document with email')) {
                return res.status(409).json({ message: err.message });
            }

            console.error('Error registering user:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
        else {
            console.error('Unexpected error registering user:', err);
            res.status(500).json({ message: 'Unexpected internal server error' });
        }
    }
};