import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  username: string;
  password?: string;
  personalInfo: object[];
  bio?: string;
  avatar?: string;
  numFollowers: number;
  numFollowing: number;
  numPosts: number;
  numReports: number;
  friends: mongoose.Types.ObjectId[];
  closeFriends: mongoose.Types.ObjectId[];
  isFollowing: boolean;
  isVerified: boolean;
  isReported: boolean;
  lastLogin: Date;
  status: number;
  updatedAt: Date;
  createdAt: Date;
}

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: { unique: true },
      lowercase: true,
      minLength: 1,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      index: { unique: true },
      minLength: 1,
      maxLength: 30,
      trim: true,
    },
    password: { type: String, minLength: 8, required: true },
    personalInfo: {
      name: { type: String, minLength: 1, maxLength: 50, trim: true },
    },
    bio: { type: String, trim: true },
    avatar: { type: String, trim: true },
    friends: { type: [mongoose.Schema.Types.ObjectId], ref: 'users' },
    closeFriends: { type: [mongoose.Schema.Types.ObjectId], ref: 'users' },
    numFollowers: { type: Number, default: 0 },
    numFollowing: { type: Number, default: 0 },
    numReports: { type: Number, default: 0 },
    numPosts: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isReported: { type: Boolean, default: false },
    status: { type: Number, default: 0 },
    lastLogin: Date,
  },
  { timestamps: true, optimisticConcurrency: true }
);

UserSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 24 * 60 * 60 * 3, // 3 days
    partialFilterExpression: { status: 0 },
  }
);

const User: mongoose.Model<IUser> =
  mongoose.models.users || mongoose.model<IUser>('users', UserSchema);
export default User;
