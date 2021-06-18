import mongoose from 'mongoose';
import { ERelationship } from '../../types/relationship';

export interface IRelationship extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  parentID: mongoose.Types.ObjectId;
  follower: mongoose.Types.ObjectId;
  type: string;
}

const RelationshipSchema = new mongoose.Schema(
  {
    // can be user, tag
    parentID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      refPath: 'type',
    },
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ERelationship,
    },
  },
  { timestamps: true, optimisticConcurrency: true }
);

const Relationship: mongoose.Model<IRelationship> =
  mongoose.models.relationships ||
  mongoose.model<IRelationship>('relationships', RelationshipSchema);
export default Relationship;
