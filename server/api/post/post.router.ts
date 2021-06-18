import { Router } from 'express';
import passport from 'passport';
import awsS3 from '../../middlewares/upload';
import postController from './post.controller';

const router = Router();

router.get(
  '/',
  passport.authenticate(['jwt', 'anonymous'], { session: false }),
  postController.list
);
router.get(
  '/:id/comments',
  passport.authenticate(['jwt', 'anonymous'], { session: false }),
  postController.getComments
);
router.get('/search', postController.search);
router.get(
  '/:id',
  passport.authenticate(['jwt', 'anonymous'], { session: false }),
  postController.read
);

router.use(passport.authenticate('jwt', { session: false }));
router.put('/t/:id', postController.update);

// !!!!!!!!! multer and express-form-data can't work together !!!!!!!!!
// req will go through uploadS3 middleware then pass back to controller handler
router.put('/:id', awsS3.uploadTen, postController.update);
router.put('/', awsS3.uploadTen, postController.create);

router.delete('/:id', postController.deletePost);

export default router;
