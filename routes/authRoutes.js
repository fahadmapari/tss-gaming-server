import express from "express";
import { uploadProfilePicture } from "../utils/fileUpload.js";
import { loginUser, registerUser } from "../controllers/authController.js";

const router = express.Router();

router.post(
  "/register",
  uploadProfilePicture.single("profilepicture"),
  registerUser
);
router.post("/login", loginUser);

export default router;
