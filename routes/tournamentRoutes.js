import express from "express";
import { uploadGameThumbnails } from "../utils/fileUpload.js";
import {
  createNewTournament,
  joinTournament,
  listAllTournaments,
} from "../controllers/tournamentController.js";

const router = express.Router();

router.get("/list", listAllTournaments);

router.post("/join", joinTournament);

router.post(
  "/create",
  uploadGameThumbnails.array("thumbnails"),
  createNewTournament
);

export default router;
