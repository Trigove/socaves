import { Router } from 'express';
import passport from 'passport';
import reportController from './report.controller';

const router = Router();

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  reportController.create
);

export default router;
