import express from "express";
import { uploadGameThumbnails } from "../utils/fileUpload.js";
import {
  createNewTournament,
  joinTournament,
  listAllTournaments,
  getLeaderboard,
  addToLeaderboard,
  getLeaderboardToEdit,
  getJoinedUsers,
  getTournamentToEdit,
  editTournament,
} from "../controllers/tournamentController.js";
import {
  validateAdminToken,
  validateToken,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/list", listAllTournaments);

// router.get("/:id/finish", validateAdminToken, finishTournament);

router.get("/:id/users", getJoinedUsers);

router.get("/leaderboard/:id", getLeaderboard);

router.get("/leaderboard/:id/edit", validateAdminToken, getLeaderboardToEdit);

router.get("/:id/edit", validateAdminToken, getTournamentToEdit);

router.post("/leaderboard/declare", validateAdminToken, addToLeaderboard);

router.post("/join", validateToken, joinTournament);

router.post(
  "/create",
  // validateAdminToken,
  uploadGameThumbnails.array("thumbnails"),
  createNewTournament
);

router.post(
  "/:id/edit",
  validateAdminToken,
  uploadGameThumbnails.array("thumbnails"),
  editTournament
);

export default router;
