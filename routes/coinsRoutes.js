import express from "express";
import {
  buyCoins,
  verifyPayment,
  withdrawRequestByUser,
  getPendingWithdrawalRequests,
  respondToWithdrawalRequests,
  getAllWithdrawalRequests,
} from "../controllers/coinsController.js";
import {
  validateAdminToken,
  validateToken,
} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/buy", validateToken, buyCoins);
router.get(
  "/withdraw/pending",
  validateAdminToken,
  getPendingWithdrawalRequests
);
router.get("/withdraw", validateAdminToken, getAllWithdrawalRequests);

router.get("/verifypay", verifyPayment);

router.post("/withdraw/request", validateToken, withdrawRequestByUser);
router.post(
  "/withdraw/respond/:id",
  validateAdminToken,
  respondToWithdrawalRequests
);

export default router;
