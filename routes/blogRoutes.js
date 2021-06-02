import express from "express";
import { createNewBlog } from "../controllers/blogController.js";
import { validateAdminToken } from "../middlewares/authMiddleware.js";
import { uploadBlogImage } from "../utils/fileUpload.js";

const router = express.Router();

router.get("/");

router.post(
  "/create",
  validateAdminToken,
  uploadBlogImage.single("featuredImage"),
  createNewBlog
);

export default router;
