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
} from "../controllers/tournamentController.js";
import {
  validateAdminToken,
  validateToken,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/list", listAllTournaments);
router.get("/:id/users", getJoinedUsers);
router.get("/leaderboard/:id", getLeaderboard);
router.get("/leaderboard/:id/edit", validateAdminToken, getLeaderboardToEdit);

router.post("/leaderboard/:match/edit", validateAdminToken, addToLeaderboard);

router.post("/join", validateToken, joinTournament);

router.post(
  "/create",
  uploadGameThumbnails.array("thumbnails"),
  createNewTournament
);

export default router;
