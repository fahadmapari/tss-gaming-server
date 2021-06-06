import express from "express";
import {
  getMyProfileDetails,
  getProfileDetails,
  getMyTournaments,
  updateUserProfile,
  getMyTransactions,
  getMyWithdrawals,
  getMyReferrals,
  updateProfilePic,
} from "../controllers/profileController.js";
import { checkGuest, validateToken } from "../middlewares/authMiddleware.js";
import { uploadProfilePicture } from "../utils/fileUpload.js";

const router = express.Router();

router.get("/", validateToken, getMyProfileDetails);

router.get("/transactions", validateToken, getMyTransactions);

router.get("/withdrawals", validateToken, getMyWithdrawals);

router.get("/referrals", validateToken, getMyReferrals);

router.get("/tournaments", validateToken, getMyTournaments);

router.get("/:id/view", getProfileDetails);

router.post(
  "/update",
  validateToken,
  uploadProfilePicture.single("profilePic"),
  updateUserProfile
);

router.post(
  "/profile-pic",
  validateToken,
  uploadProfilePicture.single("profilePic"),
  updateProfilePic
);

export default router;
