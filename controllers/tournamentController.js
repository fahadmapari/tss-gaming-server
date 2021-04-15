import Tournament from "../models/tournamentModel.js";
import Match from "../models/matchModel.js";
import { AppError } from "../utils/AppError.js";

export const listAllTournaments = async (req, res, next) => {
  const { page, limit } = req.query;

  try {
    const opts = {
      page: page ? page : 1,
      limit: limit ? limit : 10,
    };

    const tournaments = await Tournament.paginate({}, opts);

    res.status(200).send({
      tournaments,
    });
  } catch (error) {
    new AppError("Something Went wrong", 503);
  }
};

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
        tournament.thumbnails.push("thumbnails/" + file.filename);
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

export const joinTournament = async (req, res, next) => {
  const { id: userId, coins: userCoins } = req.user;
  const { tournamentId } = req.body;

  try {
    const tournament = await Tournament.findOne({ _id: tournamentId });

    if (!tournament) return next(new AppError("Invalid Tournament ID", 404));

    if (Number(userCoins) - Number(tournament.entryFee) < 0) {
      return next(new AppError("Not enough coins to join.", 403));
    }

    const match = Match.create({
      tournament: tournamentId,
      player: userId,
    });

    res.status(200).send({
      message: "Joined Tournament",
      data: match,
    });
  } catch (err) {
    next(new AppError("Something Went Wrong.", 503));
  }
};
