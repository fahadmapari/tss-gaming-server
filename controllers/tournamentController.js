import Tournament from "../models/tournamentModel.js";
import Match from "../models/matchModel.js";
import User from "../models/userModel.js";
import Leaderboard from "../models/LeaderboardModel.js";
import {
  agenda,
  schedulePushNotification,
  updateTournamentStatus,
} from "../cron-jobs/updateTournaments.js";
import { AppError } from "../utils/AppError.js";
import { tournamentUpdateFields } from "../utils/tournamentUpdateFields.js";
import { endOfDay, startOfDay } from "date-fns";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SEND_GRID_KEY);

export const listAllTournaments = async (req, res, next) => {
  const { page, limit, status, dateFrom, dateTo } = req.query;

  try {
    const opts = {
      page: page ? page : 1,
      limit: limit ? limit : 10,
      sort: { createdAt: -1 },
      select: "-credentials",
      populate: "game",
    };

    const query = {};

    if (status && status !== "") {
      query.status = status;
    }

    if (dateFrom && dateFrom !== "") {
      if (!dateTo || dateTo === "") {
        query.createdAt = {
          $gte: startOfDay(new Date(dateFrom)),
          $lte: endOfDay(new Date(dateFrom)),
        };
      } else {
        query.createdAt = {
          $gte: startOfDay(new Date(dateFrom)),
          $lte: endOfDay(new Date(dateTo)),
        };
      }
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
  console.log("request received");
  const {
    title,
    description,
    entryFee,
    date,
    game,
    tournamentType,
    kills,
    streak,
    damage,
    prize,
    roomId,
    roomPassword,
    stream,
    slots,
  } = req.body;

  try {
    const tournament = new Tournament({
      title,
      description,
      entryFee,
      date: new Date(date),
      game,
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
      slots,
      slotsAvailable: slots,
    });

    if (!req.files)
      return next(new AppError("Please upload atleast one thumbnail", 400));

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
    await schedulePushNotification(savedTournament.title, savedTournament.date);

    res.status(201).json({
      message: "New Tournament created",
      data: savedTournament,
    });
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, 503));
  }
};

export const getTournamentToEdit = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tournament = await Tournament.findOne({ _id: id })
      .populate("game")
      .exec();

    if (!tournament) return next(new AppError("Invalid tournament id.", 400));

    res.json({
      tournament,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const editTournament = async (req, res, next) => {
  const { id } = req.params;

  try {
    const tournament = await Tournament.findOne({ _id: id });

    if (!tournament) return next(new AppError("Invalid tournament id.", 400));

    const dataToUpdate = tournamentUpdateFields(req.body, tournament);

    if (req.files) {
      if (req.files.length) {
        req.files.forEach((file) => {
          dataToUpdate.thumbnails.push(
            process.env.DOMAIN_NAME + "/thumbnails/" + file.filename
          );
        });
      }
    }

    const updatedTournament = await Tournament.findOneAndUpdate(
      { _id: tournament._id },
      dataToUpdate
    );

    await agenda.cancel({ "data.tournamentID": tournament._id });

    await updateTournamentStatus(updatedTournament._id, updatedTournament.date);

    res.status(201).json({
      message: "Tournament edited",
      data: updatedTournament,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const joinTournament = async (req, res, next) => {
  const { id: userId, coins: userCoins } = req.user;
  const { tournamentId } = req.body;
  let { teamMembers, teamName } = req.body;

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

    if (teamMembers) {
      if (!Array.isArray(teamMembers)) {
        return next(new AppError("Team members should be an array.", 400));
      }
    }

    if (tournament.tournamentType === "solo") {
      teamMembers = [];
    }

    if (tournament.tournamentType === "duo") {
      if (teamMembers.length < 1 || teamMembers.length > 1) {
        return next(new AppError("Need 1 team member to play duo.", 400));
      }

      const joinTeamMembers = await User.find({
        name: {
          $in: [...teamMembers],
        },
      });

      if (joinTeamMembers.length < 1)
        return next(new AppError(`${teamMembers} is not registered.`, 400));
    }

    if (tournament.tournamentType === "squad") {
      if (teamMembers.length < 3 || teamMembers.length > 3) {
        return next(new AppError("Need 3 team members to play squad.", 400));
      }

      let joinTeamMembers = await User.find({
        name: {
          $in: [...teamMembers],
        },
      });

      joinTeamMembers = joinTeamMembers.map((user) => {
        return user.name;
      });

      if (joinTeamMembers.length < 3) {
        const unregisteredUsers = teamMembers.filter((name) => {
          if (!joinTeamMembers.includes(name)) {
            return name;
          }
        });

        return next(
          new AppError(`${unregisteredUsers} is/are not registered.`, 400)
        );
      }
    }

    const match = await Match.create({
      tournament: tournamentId,
      tournamentStatus: tournament.status,
      leaderboard: leaderboard._id,
      team: teamMembers,
      player: userId,
      teamName: teamName,
    });

    await User.findOneAndUpdate(
      { _id: userId },
      {
        $inc: {
          coins: -Math.abs(tournament.entryFee),
        },
      }
    );

    await Tournament.findOneAndUpdate(
      { _id: tournament._id },
      {
        slotsAvailable: tournament.slotsAvailable - 1,
      }
    );

    const msg = {
      to: email,
      from: process.env.SEND_GRID_EMAIL, // Use the email address or domain you verified above
      subject: "Tournament credentials - TSS_GAMING",
      html: `<h3>You just joined ${tournament.title} tournament.<h3> <h4>credentials<h4> <p>Room ID: ${tournament.credentials.roomId}</p> <p>Room Password: ${tournament.credentials.roomPassword}</p>`,
    };

    await sgMail.send(msg);

    res.status(200).send({
      message: "Joined Tournament",
      data: match,
    });
  } catch (err) {
    console.log(err);
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
  // const { match: matchId } = req.params;
  // const { prizeWon, kills, streak, damage, matchId } = req.body.userStats;

  const userStats = req.body.userStats;

  try {
    for (let i = 0; i < userStats.length - 1; i++) {
      for (let j = 1; j < userStats.length; j++) {
        if (userStats[i].prizeWon < userStats[j].prizeWon) {
          let temp = userStats[i];
          userStats[i] = userStats[j];
          userStats[j] = temp;
        }
      }
    }

    const assignedPositions = userStats.map((user, index) => {
      return {
        ...user,
        prizeWon:
          user.teamMembers.length > 0
            ? user.prizeWon / (user.teamMembers.length + 1)
            : user.prizeWon,
        position: index + 1,
      };
    });

    assignedPositions.forEach(async (assignedPosition) => {
      await Match.findOneAndUpdate(
        {
          _id: assignedPosition.matchId,
        },
        {
          prize: assignedPosition.prizeWon,
          kills: assignedPosition.kills,
          streak: assignedPosition.streak,
          damage: assignedPosition.damage,
        }
      );
    });

    await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        $inc: {
          coins: Number(assignedPosition.prizeWon),
        },
      }
    );

    const foundMatch = await Match.findOne({ _id: matchId });

    foundMatch.teamMembers.forEach(async (member) => {
      await User.findOneAndUpdate(
        { name: member },
        {
          $inc: {
            coins: Number(assignedPosition.prizeWon),
          },
        }
      );
    });

    await Leaderboard.findOneAndUpdate(
      { tournament: foundMatch.tournament },
      {
        $push: {
          list: foundMatch._id,
        },
      }
    );

    await Tournament.findOneAndUpdate(
      { _id: foundMatch.tournament },
      {
        status: "completed",
      }
    );

    res.status(200).json({
      message: "Winners declared.",
    });
  } catch (error) {
    next(new AppError(error.message, 503));
  }
};

// depracated
// export const finishTournament = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const tournament = await Tournament.findOneAndUpdate(
//       { _id: id },
//       {
//         status: "completed",
//       }
//     );

//     await Match.updateMany(
//       { tournament: id },
//       {
//         tournamentStatus: "completed",
//       }
//     );

//     res.json({
//       message: "Tournament finished",
//       tournament,
//     });
//   } catch (err) {
//     next(new AppError(err.message, 503));
//   }
// };
