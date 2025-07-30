import express from 'express';
import { handleGetUsers } from '../../controllers/usersController';
import { verifyJWT } from '../../middleware/verifyJWT';
import { verifyRoles } from '../../middleware/verifyRoles';
import { ROLES_LIST } from '../../config/roles_list';

const router = express.Router();
router.route('/')
    .get(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), handleGetUsers);

export default router;