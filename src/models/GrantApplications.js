import { Schema, model } from 'mongoose';

const grantApplicationsSchema = new Schema({
  grantId: {
    type: Schema.Types.ObjectId,
    ref: 'grants',
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  updatedOn: {
    type: Date,
    default: Date.now,
  },
  requestedBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  status: {
    type: String,
    required: true,
    enum: ['APPROVED', 'PROCESSING', 'IN_REVIEW', 'DECLINED', 'ARCHIVED'],
    default: 'PROCESSING'
  },
  treatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
});

const GrantApplications = model('grantApplications', grantApplicationsSchema);

export default GrantApplications;
