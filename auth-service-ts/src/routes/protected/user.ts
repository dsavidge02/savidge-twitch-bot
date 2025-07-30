import express from 'express';
import { verifyJWT } from '../../middleware/verifyJWT';
import { verifyRoles } from '../../middleware/verifyRoles';
import { ROLES_LIST } from '../../config/roles_list';
import { handleResetPassword, handleDeleteUser, handleUpdateRoles } from '../../controllers/userController';

const router = express.Router();
router.route('/password')
    .post(verifyJWT, handleResetPassword);
router.route('/delete')
    .post(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), handleDeleteUser);
router.route('/roles')
    .post(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), handleUpdateRoles);


export default router;