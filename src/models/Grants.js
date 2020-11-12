import { Schema, model } from 'mongoose';

const grantsSchema = new Schema({
  grantId: {
    type: String,
    required: true,
  },
  grantName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['ACTIVE', 'CLOSED', 'EVALUATING', 'EXPIRED', 'ARCHIVED'],
    default: 'ACTIVE'
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  updatedOn: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  applicationStartDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  grantType: {
    type: String,
    required: true,
    enum: ['grant', 'scholarship'],
    default: 'grant'
  },
  upload: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  }
});

grantsSchema.index({
  grantName: 'text',
  description: 'text',
  status: 'text',
  grantType: 'text',
});
const Grants = model('grants', grantsSchema);

export default Grants;
