import Tournament from "../models/tournamentModel.js";
import Match from "../models/matchModel.js";
import User from "../models/userModel.js";
import Leaderboard from "../models/LeaderboardModel.js";
import { updateTournamentStatus } from "../cron-jobs/updateTournaments.js";
import { AppError } from "../utils/AppError.js";

export const listAllTournaments = async (req, res, next) => {
  const { page, limit, status } = req.query;

  try {
    const opts = {
      page: page ? page : 1,
      limit: limit ? limit : 10,
      sort: { createdAt: -1 },
      select: "-credentials",
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
    prize,
    roomId,
    roomPassword,
    stream,
  } = req.body;

  try {
    const tournament = new Tournament({
      title,
      description,
      entryFee,
      date: new Date(date),
      tournamentType,
      prize,
      prizeDistribution: {
        kills,
        streak,
        damage,
      },
      credentials: {
        roomId,
        roomPassword,
      },
      stream,
    });

    if (!req.files)
      return next(new AppError("Please upload atleast one thumbnail"));

    if (req.files.length) {
      req.files.forEach((file) => {
        tournament.thumbnails.push(
          process.env.DOMAIN_NAME + "/thumbnails/" + file.filename
        );
      });
    }

    const savedTournament = await tournament.save();
    const leaderboard = await Leaderboard.create({
      tournament: tournament._id,
    });

    await updateTournamentStatus(savedTournament._id, savedTournament.date);

    res.status(201).json({
      message: "New Tournament created",
      data: savedTournament,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const joinTournament = async (req, res, next) => {
  const { id: userId, coins: userCoins } = req.user;
  const { tournamentId } = req.body;
  let { teamMembers } = req.body;

  try {
    const tournament = await Tournament.findOne({ _id: tournamentId });

    if (!tournament) return next(new AppError("Invalid Tournament ID", 404));

    if (tournament.status !== "upcoming")
      return next(new AppError("Tournament already started.", 404));

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

    if (
      tournament.tournamentType === "solo" ||
      !teamMembers ||
      teamMembers === ""
    ) {
      teamMembers = [];
    }

    if (teamMembers) {
      if (!Array.isArray(teamMembers)) {
        return next(new AppError("Team members should be an array.", 401));
      }
    }

    const match = await Match.create({
      tournament: tournamentId,
      tournamentStatus: tournament.status,
      leaderboard: leaderboard._id,
      teamMembers,
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
    next(new AppError(err.message, 503));
  }
};

export const getJoinedUsers = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || id === "")
      return next(new AppError("Invalid tournament id", 401));

    const users = await Match.find({ tournament: id })
      .select("player")
      .populate("player", "-password")
      .exec();

    console.log(users);

    res.json({
      users,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const getLeaderboard = async (req, res, next) => {
  const { id: tournamentId } = req.params;

  try {
    const leaderboard = await Leaderboard.findOne({ tournament: tournamentId })
      .populate({ path: "list", options: { sort: { prize: -1 } } })
      .populate("tournament", "-credentials")
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
  const { prizeWon, kills, streak, damage } = req.body.userStats;

  try {
    const match = await Match.findOneAndUpdate(
      {
        _id: matchId,
      },
      {
        prize: prizeWon,
        kills: kills,
        streak: streak,
        damage: damage,
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

    await Tournament.findOneAndUpdate({ _id: match.tournament });

    res.status(200).json({
      data: match,
    });
  } catch (error) {
    next(new AppError(error.message, 503));
  }
};

export const finishTournament = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tournament = await Tournament.findOneAndUpdate(
      { _id: id },
      {
        status: "completed",
      }
    );

    await Match.updateMany(
      { tournament: id },
      {
        tournamentStatus: "completed",
      }
    );

    res.json({
      message: "Tournament finished",
      tournament,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};
