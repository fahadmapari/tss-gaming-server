import express from "express";
import {
  getMyProfileDetails,
  getProfileDetails,
  getMyTournaments,
  updateUserProfile,
  getMyTransactions,
  getMyWithdrawals,
} from "../controllers/profileController.js";
import { checkGuest, validateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", validateToken, getMyProfileDetails);
router.get("/transactions", validateToken, getMyTransactions);
router.get("/withdrawals", validateToken, getMyWithdrawals);
router.get("/tournaments", validateToken, getMyTournaments);

router.get("/:id", getProfileDetails);
router.post("/update", validateToken, updateUserProfile);

export default router;
