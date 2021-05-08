import Tournament from "../models/tournamentModel.js";
import Match from "../models/matchModel.js";
import User from "../models/userModel.js";
import Leaderboard from "../models/LeaderboardModel.js";
import { AppError } from "../utils/AppError.js";

export const listAllTournaments = async (req, res, next) => {
  const { page, limit, status } = req.query;

  try {
    const opts = {
      page: page ? page : 1,
      limit: limit ? limit : 10,
    };

    const query = {};

    if (status && status !== "") {
      query.status = status;
    }

    const tournaments = await Tournament.paginate(query, opts);

    res.status(200).send({
      tournaments,
    });
  } catch (error) {
    next(new AppError(error.message, 503));
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
    prize
  } = req.body;

  try {
    const tournament = new Tournament({
      title,
      description,
      entryFee,
      date,
      tournamentType,
      prize,
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
    const leaderboard = await Leaderboard.create({
      tournament: tournament._id,
    });

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

    const existingMatch = await Match.findOne({
      player: userId,
      tournament: tournamentId,
    });

    if (existingMatch) {
      return next(new AppError("Already joined this tournament.", 403));
    }

    const leaderboard = await Leaderboard.findOne({ tournament: tournamentId });

    const match = await Match.create({
      tournament: tournamentId,
      leaderboard: leaderboard._id,
      player: userId,
    });

    await User.findOneAndUpdate(
      { _id: userId },
      {
        $inc: {
          coins: -Math.abs(tournament.entryFee),
        },
      }
    );

    res.status(200).send({
      message: "Joined Tournament",
      data: match,
    });
  } catch (err) {
    next(new AppError(error.message, 503));
  }
};

export const getLeaderboard = async (req, res, next) => {
  const { id: tournamentId } = req.params;

  try {
    const leaderboard = await Leaderboard.findOne({ tournament: tournamentId })
      .populate("list tournament")
      .exec();

    if (!leaderboard) {
      next(new AppError("No leaderboard found for this tournament.", 404));
      return;
    }

    res.status(200).json({
      leaderboard,
    });
  } catch (error) {
    next(new AppError(error.message, 503));
  }
};

export const getLeaderboardToEdit = async (req, res, next) => {
  const { id: tournamentId } = req.params;

  try {
    const matches = await Match.find({ tournament: tournamentId })
      .populate("player", "-password")
      .populate("tournament")
      .exec();

    res.json({
      data: matches,
    });
  } catch (error) {
    next(new AppError(error.message, 503));
  }
};

export const addToLeaderboard = async (req, res, next) => {
  const { match: matchId } = req.params;
  const { prizeWon, kills, streak } = req.body;

  try {
    const match = await Match.findOneAndUpdate(
      {
        _id: matchId,
      },
      {
        prize: prizeWon,
        kills: kills,
        streak: streak
      }
    );

    await Leaderboard.findOneAndUpdate(
      { _id: matchId },
      {
        $push: {
          list: match._id,
        },
      }
    );

    res.status(200).json({
      data: match,
    });
  } catch (error) {
    next(new AppError(error.message, 503));
  }
};
