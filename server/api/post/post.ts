import mongoose from 'mongoose';
import { EPrivacy, EPost, EPermission } from '../../types/post';
import { ILike } from '../like/like';

export interface IMedia {
  fileName: string;
  type: string;
  src?: string;
  annotationSrc?: string;
  annotation?: {
    coordinates: {
      width: number;
      height: number;
      left: number;
      top: number;
    };
    image: {
      width: number;
      height: number;
      transforms?: {
        rotate: number;
        flip: {
          horizontal: boolean;
          vertical: boolean;
        };
        translateX: number;
        translateY: number;
        scaleX: number;
        scaleY: number;
      };
    };
  };
}

export interface IViewer {
  user: mongoose.Types.ObjectId;
  permission: string[];
}

export interface IPost extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  content: string;
  media: IMedia[];
  tags: string[];
  numViews: number;
  numLikes: number;
  numComments: number | undefined;
  numReports: number;
  likedUsers: ILike[];
  privacy: EPrivacy;
  validViewer?: IViewer[];
  deleteAt?: Date;
  isReported?: boolean;
  comments: IPost[];
  replies: IPost[];
  parentID?: IPost | mongoose.Types.ObjectId;
  type: EPost;
  isLiked?: boolean;
  updatedAt: Date;
  authorUpdatedAt: Date;
  createdAt: Date;
}

const PostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    content: { type: String },
    media: [
      {
        _id: false,
        fileName: { type: String },
        type: { type: String },
        src: { type: String },
        annotationSrc: { type: String },
        annotation: {
          coordinates: {
            width: { type: Number },
            height: { type: Number },
            left: { type: Number },
            top: { type: Number },
          },
          image: {
            width: { type: Number },
            height: { type: Number },
            transforms: {
              rotate: { type: Number },
              flip: {
                horizontal: { type: Boolean },
                vertical: { type: Boolean },
              },
              translateX: { type: Number },
              translateY: { type: Number },
              scaleX: { type: Number },
              scaleY: { type: Number },
            },
          },
        },
      },
    ],
    tags: [String],
    numViews: { type: Number, default: 0 },
    numLikes: { type: Number, default: 0 },
    numComments: { type: Number, default: 0 },
    numShares: { type: Number, default: 0 },
    numReports: { type: Number, default: 0 },
    privacy: {
      type: String,
      enum: EPrivacy,
      default: EPrivacy.PUBLIC,
    },
    permission: [
      {
        type: String,
        enum: EPermission,
      },
    ],
    deleteAt: Date,
    isReported: { type: Boolean, default: false },
    parentID: { type: mongoose.Schema.Types.ObjectId, ref: 'posts' }, // postID (comment, reply) or userID (sharing)
    type: {
      type: String,
      enum: EPost,
      default: EPost.POST,
    },
    authorUpdatedAt: { type: Date, default: new Date() },
  },
  { timestamps: true, optimisticConcurrency: true } // auto add updatedAt, createdAt and better concurrency
);

const Post: mongoose.Model<IPost> =
  mongoose.models.posts || mongoose.model<IPost>('posts', PostSchema);
export default Post;
