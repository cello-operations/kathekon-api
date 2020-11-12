import { Router } from 'express';
import BlogController from '../controllers/BlogController';
import Permissions from '../middlewares/Permissions';

const blogsRouter = Router();

blogsRouter.post(
  '/',
  Permissions.authenticateJWTFromRequest,
  Permissions.allowOnly(['ADMIN', 'SUPER_ADMIN']),
  BlogController.createBlogPost,
);

blogsRouter.get(
  '/',
  BlogController.getBlogPosts
);

blogsRouter.get(
  '/:slug',
  BlogController.getPostBySlug,
);

export default blogsRouter;
