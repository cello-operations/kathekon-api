import { Schema, model } from 'mongoose';

const blogPostTagSchema = new Schema({
  tagName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  updatedOn: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

blogPostTagSchema.index({ tagName: 'text' });
const BlogPostTag = model('blogPostTags', blogPostTagSchema);

export default BlogPostTag;
