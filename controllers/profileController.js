import User from "../models/userModel.js";
import Tournament from "../models/tournamentModel.js";
import Match from "../models/matchModel.js";
import { AppError } from "../utils/AppError.js";
import { hashPassword } from "../utils/hashPassword.js";

export const getProfileDetails = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) return next(new AppError("Profile not found.", 404));

    const profile = await User.find({ _id: id })
      .select("-password -coins")
      .exec();

    if (!profile) return next(new AppError("Profile not found", 404));

    res.status(200).json({
      profile: profile[0],
    });
  } catch (error) {
    next(new AppError(error.message, 503));
  }
};

export const getMyProfileDetails = async (req, res, next) => {
  try {
    res.status(200).json({
      profile: req.user,
    });
  } catch (error) {
    next(new AppError(error.message, 503));
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
    next(new AppError(error.message, 503));
  }
};

export const updateUserProfile = async (req, res, next) => {
  const { name, mobile, email, currentPassword, newPassword } = req.body;

  try {
    let updateDetails = {};

    if (currentPassword === "")
      return next(new AppError("Password is required to update profile", 403));
    if (name && name !== "") updateDetails.name = name;
    if (mobile && mobile !== "") updateDetails.mobile = mobile;
    if (email && email !== "") updateDetails.email = email;
    if (newPassword && newPassword !== "") {
      const updatedPassword = await hashPassword(newPassword);
      updateDetails.password = updatedPassword;
    }

    const foundUser = await User.findOne({ _id: req.user.id });

    let authCheck = foundUser.checkPassword(
      currentPassword,
      foundUser.password
    );

    if (authCheck) {
      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          ...updateDetails,
        }
      );

      res.json({
        message: "User profile updated",
      });
    } else {
      next(new AppError("Invalid Password", 403));
    }
  } catch (error) {
    next(new AppError(error.message, 503));
  }
};
