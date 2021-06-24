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

router.post("/google", checkGuest, googleLogin);
router.post("/google/mobile", checkGuest, googleLoginMobile);
router.get("/google/url", generateGoogleURL);

router.post("/facebook", checkGuest, facebookLogin);
router.get("/facebook/url", generateFacebookUrl);

router.post("/discord", checkGuest, discordLogin);
router.get("/discord/mobile", (req, res, next) =>
  res.send(`<div class="container">
<style scoped>
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .container{
    min-height: 100vh;
    background: white;
    position: relative;
  }
    
  .loader{
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .load-bar{
    height: 35px;
    width: 10px;
    background: #ff4336;
    margin: 0.3rem;
    transform-origin: bottom;
    animation: loadAnim 1s ease-out infinite alternate;
  }
  .load-bar.two{
    animation: loadAnim 1s ease-out infinite alternate 1s;
  }
  
  @keyframes loadAnim{
    from{
      transform: ScaleY(0.3);  
    }
    to{
      transform: ScaleY(1); 
    }
  }
</style>

<div class="loader">
  <div class="load-bar"></div>
  <div class="load-bar two"></div>
  <div class="load-bar"></div>
</div>

</div>`)
);
router.post("/discord/mobile", checkGuest, discordLoginMobile);

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

router.get("/reset-password/:email", resetPasswordOTP);
router.post("/reset-password", resetPassword);

router.post("/otp/:method", validateNewUserToken, verifyOtp);

export default router;
