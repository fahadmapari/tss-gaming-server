import express from "express";
import { uploadGameThumbnails } from "../utils/fileUpload.js";
import {
  createNewTournament,
  joinTournament,
  listAllTournaments,
  getLeaderboard,
} from "../controllers/tournamentController.js";

const router = express.Router();

router.get("/list", listAllTournaments);
router.get("/leaderboard/:id", getLeaderboard);

router.post("/join", joinTournament);
router.post(
  "/create",
  uploadGameThumbnails.array("thumbnails"),
  createNewTournament
);

export default router;
