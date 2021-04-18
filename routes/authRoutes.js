import express from "express";
import { uploadProfilePicture } from "../utils/fileUpload.js";
import { loginUser, registerUser } from "../controllers/authController.js";
import { checkGuest } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  checkGuest,
  uploadProfilePicture.single("profilePic"),
  registerUser
);

router.post("/login", checkGuest, loginUser);

export default router;
