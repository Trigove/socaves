import mongoose from 'mongoose';
import { IUser } from '../user/user';

export interface ILike extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  parentID: mongoose.Types.ObjectId;
  userID: mongoose.Types.ObjectId | IUser;
  type: string;
}

const LikeSchema = new mongoose.Schema(
  {
    // can be post, comment, reply, tag
    parentID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    type: {
      type: String,
      enum: ['POST', 'COMMENT', 'REPLY', 'TAG'],
      default: 'POST',
    },
  },
  { timestamps: true, optimisticConcurrency: true }
);

const Like: mongoose.Model<ILike> =
  mongoose.models.likes || mongoose.model<ILike>('likes', LikeSchema);
export default Like;
