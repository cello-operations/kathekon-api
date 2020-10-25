import { Schema, model } from 'mongoose';

const resetTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  blacklisted: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  expiresIn: {
    type: Date,
  }
});

const ResetToken = model('resetTokens', resetTokenSchema);

export default ResetToken;
