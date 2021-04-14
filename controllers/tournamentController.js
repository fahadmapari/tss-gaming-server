import Tournament from "../models/tournamentModel.js";
import { AppError } from "../utils/AppError.js";

export const createNewTournament = async (req, res, next) => {
  const {
    title,
    description,
    status,
    entryFee,
    date,
    tournamentType,
    kills,
    streak,
    damage,
  } = req.body;

  try {
    const tournament = new Tournament({
      title,
      description,
      status,
      entryFee,
      date,
      tournamentType,
      prizeDistribution: {
        kills,
        streak,
        damage,
      },
    });

    if (req.files.length) {
      req.files.forEach((file) => {
        tournament.thumbnails.push("thumbnails/" + file);
      });
    }

    tournament.save();
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};
