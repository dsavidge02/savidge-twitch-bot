import { Request, Response, NextFunction } from 'express';
import { isServiceEnabled } from '../utils/serviceStateManager';

export const verifyService = (req: Request, res: Response, next: NextFunction) => {
    if (!isServiceEnabled()) {
        return res.status(503).json({
            error: 'Service temporarily unavailable',
            message: 'Admin token not configured. Please contact administrator.',
            code: 'SERVICE_DISABLED'
        });
    }
    next();
};