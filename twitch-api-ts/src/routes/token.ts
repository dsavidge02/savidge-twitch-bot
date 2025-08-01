import { Router } from 'express';
import { handleInitToken, handleGenerateToken, handleGetTokens } from '../controllers/tokenController';
import { conditionalAuth } from '../middleware/conditionalAuth';

const router = Router();

// GET /token/init?type=user|admin
// Conditional auth: requires JWT + admin role for admin requests, no auth for user requests
router.route('/init')
    .get(conditionalAuth, handleInitToken);

router.route('/generate')
    .post(handleGenerateToken);

router.route('/')
    .get(handleGetTokens);

export default router; 