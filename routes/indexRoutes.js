import express from "express";
import {
  addNewGame,
  blockUser,
  contactUs,
  createNewSubAdmin,
  getAllBlockedUsers,
  getAllGames,
  getAllRegisteredUsers,
  rewardUserForReferral,
  saveFcmTokens,
  searchUsers,
  sendCustomPushNotification,
  sendWhatsappMessage,
  unBlockUser,
} from "../controllers/indexController.js";
import {
  validateAdminToken,
  validateNewUserToken,
  validateToken,
} from "../middlewares/authMiddleware.js";
import { uploadGameCover } from "../utils/fileUpload.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "API Running" });
});

router.post("/contact", contactUs);

router.get("/notification-registeration", saveFcmTokens);

router.post("/refer", validateToken, rewardUserForReferral);

router.get("/users", validateAdminToken, getAllRegisteredUsers);

router.post("/users/search", validateAdminToken, searchUsers);

router.get("/users/:id/block", validateAdminToken, blockUser);

router.get("/users/blocked", validateAdminToken, getAllBlockedUsers);

router.get("/users/:id/unblock", validateAdminToken, unBlockUser);

router.get("/games", getAllGames);

router.post(
  "/send-push-notification",
  validateAdminToken,
  sendCustomPushNotification
);

router.post(
  "/new-game",
  validateAdminToken,
  uploadGameCover.single("gameCover"),
  addNewGame
);

router.post(
  "/sub-admin",
  validateAdminToken,
  uploadGameCover.single("profilePic"),
  createNewSubAdmin
);

export default router;
