import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['REQUESTER', 'SUPER_ADMIN', 'ADMIN'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  updatedOn: {
    type: Date,
    default: Date.now,
  },
  defaultPass: {
    type: String,
  },
  firstTimePasswordChanged: {
    type: Boolean,
    default: false,
  },
  mailSubscription: {
    type: Boolean,
    default: true,
  },
});

userSchema.index({ firstName: 'text', lastName: 'text' });
const User = model('users', userSchema);

export default User;
