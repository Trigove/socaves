import { Router } from 'express';
import passport from 'passport';
import auth from './api/auth/auth.router';
import user from './api/user/user.router';
import post from './api/post/post.router';
import like from './api/like/like.router';
import report from './api/report/report.router';
import follow from './api/relationship/relationship.router';
import message from './api/message/message.router';

const routers = Router();

// setup route
routers.use(auth);
routers.use(user);
routers.use('/reports', report);
routers.use('/posts', like);
routers.use('/posts', post);
routers.use(passport.authenticate('jwt', { session: false }));
routers.use('/follows', follow);
routers.use('/chatList', message);

export default routers;
