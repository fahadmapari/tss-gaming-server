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

    const blog = await Blog.create({
      title,
      blogContent,
      category,
      videoLink: videoLink,
      keywords: keywords,
      metaDescription: metaDescription,
      featuredImage: req.body.featuredImage,
    });

    res.json({
      message: "New blog created.",
      blog,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const editBlog = async (req, res, next) => {
  try {
    const dataToUpdate = {
      ...req.body,
    };

    const { id } = req.params;

    if (req.file) {
      dataToUpdate.featuredImage =
        process.env.DOMAIN_NAME + "/blog-images/" + req.file.filename;
    }

    const blog = await Blog.findOneAndUpdate(
      {
        _id: id,
      },
      dataToUpdate
    );

    res.json({
      message: "Blog edited.",
      blog,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const deleteBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Blog.findOneAndDelete({ _id: id });

    res.json({
      message: "blog deleted.",
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const getAllBlogs = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const blogs = await Blog.paginate(
      {},
      {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        sort: { createdAt: -1 },
      }
    );

    res.json({
      blogs,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const getBlogsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page, limit } = req.query;

    const blogs = await Blog.paginate(
      {
        category,
      },
      {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        sort: { createdAt: -1 },
      }
    );

    res.json({
      blogs,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findOne({
      _id: id,
    });

    if (!blog) return next(new AppError("Blog not found.", 404));

    res.json({
      blog,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Blog.distinct("category");

    if (!categories) return next(new AppError("no categories found.", 404));

    res.json({
      categories,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};
