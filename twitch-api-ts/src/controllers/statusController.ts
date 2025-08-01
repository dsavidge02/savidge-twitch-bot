import { Request, Response } from 'express';
import { isServiceEnabled } from '../utils/serviceStateManager';

export const handleGetStatus = (req: Request, res: Response) => {
    if (!isServiceEnabled()) {
        return res.status(503).json({
            error: 'Service temporarily unavailable',
            message: 'Admin token not configured. Please contact administrator.',
            code: 'SERVICE_DISABLED'
        });
    }
    return res.status(200).json({
        message: 'Service is enabled'
    });
};