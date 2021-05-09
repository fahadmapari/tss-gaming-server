import express from "express";
import {} from "../controllers/profileController.js";
import { checkGuest, validateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", validateToken, getMyProfileDetails);
router.get("/tournaments", validateToken, getMyTournaments);

router.get("/:id", getProfileDetails);

router.post("/update", validateToken, updateUserProfile);

export default router;
