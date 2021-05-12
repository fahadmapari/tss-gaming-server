import express from "express";
import {
  blockUser,
  getAllBlockedUsers,
  getAllRegisteredUsers,
  rewardUserForReferral,
  unBlockUser,
} from "../controllers/indexController.js";
import {
  validateAdminToken,
  validateNewUserToken,
} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "API Running" });
});

router.post("/refer", validateNewUserToken, rewardUserForReferral);

router.get("/users", validateAdminToken, getAllRegisteredUsers);

router.get("/users/:id/block", validateAdminToken, blockUser);

router.get("/users/blocked", validateAdminToken, getAllBlockedUsers);

router.get("/users/:id/unblock", validateAdminToken, unBlockUser);

export default router;
