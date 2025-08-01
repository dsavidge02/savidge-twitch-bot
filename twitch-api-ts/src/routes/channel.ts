import { Router } from 'express';
import { verifyService } from '../middleware/verifyService';
import { handleGetFollowers, handleGetSubscribers } from '../controllers/channelController';

const router = Router();

router.route('/followers')
    .get(verifyService, handleGetFollowers);
router.route('/subscribers')
    .get(verifyService, handleGetSubscribers);

export default router;

