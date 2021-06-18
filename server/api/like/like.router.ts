import { Router } from 'express';
import passport from 'passport';
import likeController from './like.controller';

const router = Router();

router.put(
  '/likes',
  passport.authenticate('jwt', { session: false }),
  likeController.update
);

export default router;
