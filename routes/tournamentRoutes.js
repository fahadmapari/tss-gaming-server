import express from "express";
// import { buyCoins, verifyPayment } from "../controllers/coinsController.js";
const router = express.Router();

router.get("/list", buyCoins);
router.post("/join", buyCoins);
router.post("/create", buyCoins);

export default router;
