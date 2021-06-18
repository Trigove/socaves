import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';
// import formData from 'express-form-data';
import rateLimit from 'express-rate-limit';
import { connect } from './db';
import { isDev, corsOptions } from './config';
import './middlewares/passport';
import routers from './router';

const app: express.Application = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
});

// connect to mongodb
connect();

// setup middleware
if (!isDev) {
  app.use(helmet());
  app.use(compression());
  app.use(limiter);
}
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
// app.use(formData.parse());  // very useful when need debug FormData,
// app.use(formData.union());  // turn both on can log req.body, req.file or req.files on terminal
app.use(passport.initialize());

app.use(routers);

app.get('/hello', (_req, res) => {
  return res.status(200).send('Hello World!');
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err.stack);
  return res.status(500).send('Something broke!');
});

export default {
  path: 'api',
  handler: app,
};
