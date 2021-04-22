import express from "express";
import { uploadGameThumbnails } from "../utils/fileUpload.js";
import {
  createNewTournament,
  joinTournament,
  listAllTournaments,
  getLeaderboard,
  addToLeaderboard,
  getLeaderboardToEdit,
} from "../controllers/tournamentController.js";

const router = express.Router();

router.get("/list", listAllTournaments);
router.get("/leaderboard/:id", getLeaderboard);
router.get("/leaderboard/:id/edit", getLeaderboardToEdit);

router.post("/leaderboard/:match/edit", addToLeaderboard);
router.post("/join", joinTournament);
router.post(
  "/create",
  uploadGameThumbnails.array("thumbnails"),
  createNewTournament
);

export default router;
