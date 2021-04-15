import User from "../models/userModel.js";
import Tournament from "../models/tournamentModel.js";
import Match from "../models/matchModel.js";
import { AppError } from "../utils/AppError.js";

export const getProfileDetails = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) return next(new AppError("Profile not found.", 404));

    const profile = await User.find({ _id: id });

    if (!profile) return next(new AppError("Profile not found", 404));

    delete profile.coins;
    delete profile.password;

    res.status(200).json({
      profile,
    });
  } catch (error) {
    next(new AppError("Something went wrong.", 503));
  }
};

export const getMyProfileDetails = async (req, res, next) => {
  try {
    res.status(200).json({
      profile: req.user,
    });
  } catch (error) {
    next(new AppError("Something went wrong.", 503));
  }
};

export const getMyTournaments = async (req, res, next) => {
  const { id } = req.user;
  const { page, limit } = req.query;
  try {
    if (!id) return next(new AppError("Profile not found.", 404));

    const profile = await Match.paginate(
      { player: id },
      {
        page: page ? page : 1,
        limit: limit ? limit : 10,
      }
    )
      .populate("tournament")
      .exec();

    if (!profile) return next(new AppError("Profile not found", 404));

    res.status(200).json({
      profile: profile,
    });
  } catch (error) {
    next(new AppError("Something went wrong.", 503));
  }
};
