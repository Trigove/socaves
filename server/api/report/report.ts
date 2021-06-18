import mongoose from 'mongoose';

export interface IReport extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  parentID: mongoose.Types.ObjectId;
  userID: mongoose.Types.ObjectId;
  content: string;
  type: string;
}

const ReportSchema = new mongoose.Schema(
  {
    // can be post, comment, reply, user, tag
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
    content: String,
    type: {
      type: String,
      enum: ['POST', 'COMMENT', 'REPLY', 'USER', 'TAG'],
      default: 'POST',
    },
  },
  { timestamps: true, optimisticConcurrency: true }
);

const Report =
  mongoose.models.reports || mongoose.model<IReport>('reports', ReportSchema);
export default Report;
