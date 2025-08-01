import { Router } from 'express';
import { handleGetStatus } from '../controllers/statusController';
    
const router = Router();

router.route('/')
    .get(handleGetStatus);

export default router;