import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from './verifyJWT';
import { verifyRoles } from './verifyRoles';
import { ROLES_LIST } from '../config/roles_list';
import { isServiceEnabled } from '../utils/serviceStateManager';

export const conditionalAuth = (req: Request, res: Response, next: NextFunction) => {
    const type = req.query.type as string;
    
    // If requesting admin token, require JWT verification and admin role
    if (type === 'admin') {
        // First verify JWT
        verifyJWT(req, res, (err) => {
            if (err) return next(err);
            
            // Then verify admin role
            verifyRoles(ROLES_LIST.ADMIN)(req, res, next);
        });
    } 
    else if (type === 'user') {
        if (!isServiceEnabled()) {
            return res.status(503).json({
                error: 'Service temporarily unavailable',
                message: 'Admin token not configured. Please contact administrator.',
                code: 'SERVICE_DISABLED'
            });
        }

        next();
    } 
    else {
        // Invalid type parameter
        return res.status(400).json({
            error: 'Invalid type parameter',
            message: 'Type must be either "user" or "admin"',
            code: 'INVALID_TYPE'
        });
    }
}; 