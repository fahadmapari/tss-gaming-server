import Tournament from "../models/tournamentModel.js";
import { AppError } from "../utils/AppError.js";

export const createNewTournament = async (req, res, next) => {
  const {
    title,
    description,
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

    await tournament.save();

    res.status(201).json({
      message: "New Tournament created",
      data: tournament,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const joinTournament = async (req, res, next) => {};
