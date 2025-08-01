import { Request, Response } from 'express';
import { getFollowers, getSubcribers } from '../utils/twitchHelper';

export const handleGetFollowers = async (req: Request, res: Response) => {
    const followers = await getFollowers();
    res.json(followers);
};

export const handleGetSubscribers = async (req: Request, res: Response) => {
    const subscribers = await getSubcribers();
    res.json(subscribers);
};
