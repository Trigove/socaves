import { Router } from 'express';
import passport from 'passport';
import userController from './user.controller';

const router = Router();

// req will go through local section of passport middleware then pass back to controller login handler
router.put('/login', userController.checkUser, userController.login);
router.post('/signup', userController.create);
router.get(
  '/logout',
  passport.authenticate('jwt', { session: false }),
  userController.sync,
  userController.logout
);

router.get(
  '/user',
  passport.authenticate('jwt', { session: false }),
  userController.verify
);

// req will go through jwt section of passport middleware then pass back to controller user handler
router.get(
  '/user/profile',
  passport.authenticate('jwt', { session: false }),
  userController.profile,
  userController.getPosts
);

router.get(
  '/users/:username',
  passport.authenticate(['jwt', 'anonymous'], { session: false }),
  userController.read,
  userController.getPosts
);

router.get('/users/:id/posts', userController.getPosts);
router.get(
  '/users/:id/followers',
  passport.authenticate(['jwt', 'anonymous'], { session: false }),
  userController.getFollowers
);
router.get(
  '/users/:id/followings',
  passport.authenticate(['jwt', 'anonymous'], { session: false }),
  userController.getFollowing
);
router.get(
  '/users/:id/follows',
  passport.authenticate(['jwt', 'anonymous'], { session: false }),
  userController.getFollowers,
  userController.getFollowing
);

router.get(
  '/utils/users/friends',
  passport.authenticate('jwt', { session: false }),
  userController.getFriends
);

router.get(
  '/utils/users/closeFriends',
  passport.authenticate('jwt', { session: false }),
  userController.getCloseFriends
);

router.put(
  '/utils/users/closeFriends',
  passport.authenticate('jwt', { session: false }),
  userController.updateCloseFriends
);

// router.put('/utils/users/sync', userController.sync);
router.get('/utils/users/search', userController.search);
router.put(
  '/utils/users/info',
  passport.authenticate('jwt', { session: false }),
  userController.updateInfo
);
router.put(
  '/utils/user/online',
  passport.authenticate('jwt', { session: false }),
  userController.updateOnline
);
router.get(
  '/utils/users/random',
  passport.authenticate('jwt', { session: false }),
  userController.random
);
router.delete(
  '/users',
  passport.authenticate('jwt', { session: false }),
  userController.deleteUser
);

export default router;
