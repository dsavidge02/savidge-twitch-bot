import { Request } from 'express';
import { ObjectId } from 'mongodb'; 

export interface User {
    _id: ObjectId;
    username: string;
    email: string;
    password: string;
    roles: number[];
    twitch_user_id?: string;
    refreshToken?: string;
};

export interface NewUser {
    username: string;
    email: string;
    password: string;
    roles: number[];
    twitch_user_id?: string;
}

export interface AuthUserRequest extends Request{
    _id: ObjectId,
    username: string;
    roles: number[];
    twitch_user_id?: string;
}