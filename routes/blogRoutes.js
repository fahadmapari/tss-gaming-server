import express from "express";
import {
  createNewBlog,
  deleteBlogById,
  editBlog,
  getAllBlogs,
  getAllCategories,
  getBlogById,
  getBlogsByCategory,
} from "../controllers/blogController.js";
import { validateAdminToken } from "../middlewares/authMiddleware.js";
import { uploadBlogImage } from "../utils/fileUpload.js";

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/categories", getAllCategories);
router.get("/:id/view", getBlogById);
router.get("/category/:category", getBlogsByCategory);

router.get("/:id/delete", validateAdminToken, deleteBlogById);

router.post(
  "/create",
  validateAdminToken,
  uploadBlogImage.single("featuredImage"),
  createNewBlog
);

router.post(
  "/:id/edit",
  validateAdminToken,
  uploadBlogImage.single("featuredImage"),
  editBlog
);

export default router;
