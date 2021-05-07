import express from "express";
import {
  buyCoins,
  verifyPayment,
  withdrawRequestByUser,
  getPendingWithdrawalRequests,
  respondToWithdrawalRequests,
  getAllWithdrawalRequests,
} from "../controllers/coinsController.js";
import { validateToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/buy", validateToken, buyCoins);
router.get("/withdraw/pending", getPendingWithdrawalRequests);
router.get("/withdraw", getAllWithdrawalRequests);

router.post("/verify", verifyPayment);
router.post("/withdraw/request", withdrawRequestByUser);
router.post("/withdraw/respond/:id", respondToWithdrawalRequests);

export default router;
