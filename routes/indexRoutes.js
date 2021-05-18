import express from "express";
import {
  addNewGame,
  blockUser,
  getAllBlockedUsers,
  getAllRegisteredUsers,
  rewardUserForReferral,
  searchUsers,
  unBlockUser,
} from "../controllers/indexController.js";
import {
  validateAdminToken,
  validateNewUserToken,
  validateToken,
} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "API Running" });
});

router.post("/refer", validateToken, rewardUserForReferral);

router.get("/users", validateAdminToken, getAllRegisteredUsers);

router.post("/users/search", validateAdminToken, searchUsers);

router.get("/users/:id/block", validateAdminToken, blockUser);

router.get("/users/blocked", validateAdminToken, getAllBlockedUsers);

router.get("/users/:id/unblock", validateAdminToken, unBlockUser);

router.post("/newgame", validateAdminToken, addNewGame);

export default router;
