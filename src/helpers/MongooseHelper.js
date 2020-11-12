import mongoose from 'mongoose';

export default class MongooseHelper {
  static validateObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }
}
