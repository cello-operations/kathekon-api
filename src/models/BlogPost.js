import { Schema, model } from 'mongoose';

const blogPostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  readTime: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  updatedOn: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    default: 'PUBLISHED',
  },
  body: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'tags',
  }],
  readCount: {
    type: Number,
    default: 0,
  },
  deleted: {
    type: Boolean,
    default: false,
  }
});

blogPostSchema.index({ title: 'text', description: 'text', body: 'text' });
const BlogPost = model('blogPosts', blogPostSchema);

export default BlogPost;
