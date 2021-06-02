import Blog from "../models/blogModel.js";
import { AppError } from "../utils/AppError.js";

export const createNewBlog = async (req, res, next) => {
  try {
    const {
      title,
      blogContent,
      category,
      videoLink,
      keywords,
      metaDescription,
    } = req.body;

    if (req.file) {
      req.body.featuredImage =
        process.env.DOMAIN_NAME + "/blog-images/" + req.file.filename;
    }

    await Blog.create({
      title,
      blogContent,
      category,
      videoLink,
      keywords,
      metaDescription,
      featuredImage: req.body.featuredImage,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};
