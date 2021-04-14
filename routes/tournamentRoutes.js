import express from "express";
import { uploadGameThumbnails } from "../utils/fileUpload.js";
import { createNewTournament } from "../controllers/tournamentController.js";

const router = express.Router();

// router.get("/list", buyCoins);
// router.post("/join", buyCoins);
router.post(
  "/create",
  uploadGameThumbnails.array("thumbnails"),
  createNewTournament
);

export default router;
