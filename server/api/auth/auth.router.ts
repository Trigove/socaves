import { Router } from 'express';
import authController from './auth.controller';

const router = Router();

router.put('/account/send_password_email', authController.send);
router.put('/account/send', authController.send);
router.get('/verify', authController.verify);
router.get('/verify_reset', authController.verifyReset);
router.put('/account/reset_password', authController.reset);

export default router;
