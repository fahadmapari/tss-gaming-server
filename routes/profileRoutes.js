import express from "express";
import {
  getMyProfileDetails,
  getProfileDetails,
  getMyTournaments,
} from "../controllers/profileController.js";
import { checkGuest } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getMyProfileDetails);
router.get("/tournaments", getMyTournaments);

router.get("/:id", getProfileDetails);

router.post("/update");

export default router;
