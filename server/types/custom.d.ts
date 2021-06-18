import { Types } from 'mongoose';

declare module 'express' {
  export interface Request {
    user?: {
      _id?: Types.ObjectId;
      username?: string;
      email?: string;
      expiration?: number;
    };
  }
}
