import express from "express";
import { uploadProfilePicture } from "../utils/fileUpload.js";
import {
  loginUser,
  registerUser,
  googleLogin,
  generateOtp,
  verifyOtp,
  generateGoogleURL,
  logoutUser,
  generateFacebookUrl,
  facebookLogin,
  discordLogin,
  generateDiscordUrl,
  googleLoginMobile,
  generateDiscordMobileUrl,
  discordLoginMobile,
  resetPasswordOTP,
  resetPassword,
} from "../controllers/authController.js";
import {
  checkGuest,
  validateNewUserToken,
  validateToken,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/google", googleLogin);
router.post("/google/mobile", googleLoginMobile);
router.get("/google/url", generateGoogleURL);

router.get("/facebook", facebookLogin);
router.get("/facebook/url", generateFacebookUrl);

router.get("/discord", discordLogin);
router.get("/discord/mobile", (req, res, next) => res.send("OK"));
router.post("/discord/mobile-auth", discordLoginMobile);

router.get("/discord/url", generateDiscordUrl);
router.get("/discord/url/mobile", generateDiscordMobileUrl);

router.get("/otp/:method", validateNewUserToken, generateOtp);
router.get("/logout", validateToken, logoutUser);

router.post(
  "/register",
  checkGuest,
  uploadProfilePicture.single("profilePic"),
  registerUser
);
router.post("/login", checkGuest, loginUser);

router.get("/reset-password", resetPasswordOTP);
router.post("/reset-password", resetPassword);

router.post("/otp/:method", validateNewUserToken, verifyOtp);

export default router;
