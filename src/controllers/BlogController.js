import BlogPost from '../models/BlogPost';
import ServerUtility from '../helpers/ServerResponse';
import BlogPostHelper from '../helpers/BlogPostHelper';
import { errorTypeMap } from '../helpers/reorganizeErrors';

/**
 *
 * @description class to model helper methods for blog posts
 * @export
 * @class BlogController
 */
class BlogController {
  /**
   * @method createBlogPost
   * @description create a new blog post
   * @static
   * @async
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function
   * @returns {object|function} - returns a response object
   * @memberof BlogController
   */
  static async createBlogPost(req, res, next) {
    const start = new Date();
    try {
      const {
        body, title, description, tags, status,
        coverImage,
      } = req.body;

      const slug = BlogPostHelper.generateSlug(title);
      const readTime = BlogPostHelper.getReadTime(body);

      const newPost = new BlogPost({
        body,
        title,
        author: req.user._id,
        description,
        tags: tags ? [...tags] : [],
        coverImage,
        status: status || 'PUBLISHED',
        slug,
        readTime,
      });
      const post = await newPost.save();

      return ServerUtility.successResponse(
        res,
        201,
        {
          ...post,
        },
        'Successfully created blog article',
        { responseTime: `${new Date() - start}ms` }
      );
    } catch (error) {
      return next(error);
    }
  }

  static async getBlogPosts(req, res, next) {
    const start = new Date();
    try {
      const {
        status, createdOnRangeStart, createdOnRangeEnd,
        pageSize, page,
      } = req.query;

      const itemsPerPage = pageSize || 10;
      const numberOfPages = Math.max(0, page) || 0;
      const queryOpts = {
        ...(status ? { status } : { status: 'PUBLISHED' }),
        ...(createdOnRangeStart && createdOnRangeEnd ? {
          createdOn: { $gte: createdOnRangeStart, $lte: createdOnRangeEnd },
        } : {}),
      };

      const posts = await BlogPost.find({
        ...queryOpts,
      }).populate('author', ['_id', 'firstName', 'lastName'])
        .limit(parseInt(itemsPerPage, 10))
        .skip(parseInt(itemsPerPage, 10) * parseInt(numberOfPages, 10))
        .sort({
          createdOn: -1,
        });

      const totalCount = await BlogPost.count({
        ...queryOpts,
      });
      return ServerUtility.successResponse(
        res,
        200,
        { posts },
        'Stories fetched successfully',
        {
          responseTime: `${new Date() - start}ms`,
          totalCount,
          currentCount: posts.length,
          page,
          pageSize,
        }
      );
    } catch (error) {
      return next(error);
    }
  }

  static async getPostBySlug(req, res, next) {
    const start = new Date();
    try {
      const { slug } = req.params;

      const post = await BlogPost.findOne({ slug })
        .populate('author', ['_id', 'firstName', 'lastName', 'avatar']);

      if (!post) {
        return ServerUtility.errorResponse(
          res,
          404,
          { message: 'This post has either been removed or does not exist' },
          'Post not found',
          {},
          { responseTime: `${new Date() - start}ms`, errorType: '001', errorDescription: errorTypeMap['001'] }
        );
      }

      // update read count
      const updatedPostFields = {
        readCount: post.readCount + 1,
      };

      const updatedPost = await BlogPost.findOneAndUpdate(
        { _id: post._id },
        { $set: updatedPostFields },
        { new: true },
      ).populate('author', ['_id', 'firstName', 'lastName', 'avatar']);

      // fetch related posts
      const itemsPerPage = 4;
      const numberOfPages = 0;
      const recentPosts = await BlogPost.find({
        status: 'PUBLISHED',
        slug: { $not: { $regex: `^${slug}` } }
      }).populate('author', ['_id', 'firstName', 'lastName'])
        .limit(parseInt(itemsPerPage, 10))
        .skip(parseInt(itemsPerPage, 10) * parseInt(numberOfPages, 10))
        .sort({
          createdOn: -1,
        });

      return ServerUtility.successResponse(
        res,
        200,
        { post: updatedPost, recentPosts },
        'Stories fetched successfully',
        {
          responseTime: `${new Date() - start}ms`,
        }
      );
    } catch (error) {
      return next(error);
    }
  }
}

export default BlogController;
