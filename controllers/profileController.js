import User from "../models/userModel.js";
import Tournament from "../models/tournamentModel.js";
import Order from "../models/orderModel.js";
import Match from "../models/matchModel.js";
import { AppError } from "../utils/AppError.js";
import { hashPassword } from "../utils/hashPassword.js";
import Withdrawal from "../models/withdrawModel.js";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import Referral from "../models/referralModel.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
  const { page, limit, status } = req.query;
  try {
    if (!id) return next(new AppError("Profile not found.", 404));

    const query = {
      player: id,
    };

    if (status && status !== "") query.tournamentStatus = status;

    let profile = await Match.paginate(query, {
      page: page ? page : 1,
      limit: limit ? limit : 10,
      populate: "tournament game",
      sort: { createdAt: -1 },
    });

    if (!profile) return next(new AppError("Profile not found", 404));

    res.status(200).json({
      tournaments: profile,
    });
  } catch (error) {
    next(new AppError(error.message, 503));
  }
};

export const getMyTransactions = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { page, limit } = req.query;

    const transactions = await Order.paginate(
      { user: id },
      {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        sort: { createdAt: -1 },
      }
    );

    res.status(200).json({
      transactions,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const getMyWithdrawals = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { page, limit } = req.query;

    const withdrawals = await Withdrawal.paginate(
      { user: id },
      {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        sort: { createdAt: -1 },
      }
    );

    res.status(200).json({
      withdrawals,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const getMyReferrals = async (req, res, next) => {
  const { id } = req.user;
  const { page, limit } = req.query;

  const referrals = await Referral.paginate(
    { referredBy: id },
    {
      page: page ? page : 1,
      limit: limit ? limit : 10,
      sort: { createdAt: -1 },
      populate: { path: "referredUser", select: "-password -coins" },
    }
  );

  res.json({
    referrals,
  });
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
    if (req.file)
      updateDetails.profilePic =
        process.env.DOMAIN_NAME + "/profile-pictures/" + req.file.filename;

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
          mobileVerified: mobile ? false : req.user.mobileVerified,
          emailVerified: email ? false : req.user.emailVerified,
        },
        { runValidators: true, context: "query" }
      );

      try {
        const oldProfilePicLocation = foundUser.profilePic.split("/");
        fs.unlinkSync(
          path.resolve(
            __dirname,
            `../public/profile-pictures/${
              oldProfilePicLocation[oldProfilePicLocation.length - 1]
            }`
          )
        );
      } catch (err) {
        console.log(err);
      }

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
