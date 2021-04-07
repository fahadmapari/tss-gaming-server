import express from "express";
import { buyCoins, verifyPayment } from "../controllers/coinsController.js";
const router = express.Router();

router.get("/buy", buyCoins);

router.post("/verify", verifyPayment);

export default router;
