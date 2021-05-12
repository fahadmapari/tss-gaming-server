import User from "../models/userModel.js";
import Blocklist from "../models/blocklistModel.js";
import { AppError } from "../utils/AppError.js";

export const rewardUserForReferral = async (req, res, next) => {
  try {
    const { id, mobileVerified, emailVerified } = req.user;
    const { referCode } = req.body;

    const user = await User.findOne({ _id: id });

    if (mobileVerified || emailVerified)
      return next(new AppError("only new users can perform this action.", 400));

    if (user.password !== "") {
      return next(new AppError("allowed only for social login users.", 400));
    }

    if (!referCode || referCode === "")
      return next(new AppError("referral code can not be empty.", 400));

    const foundUser = await User.findOne({ referCode: referCode });

    if (!foundUser) return next(new AppError("invalid referral code.", 400));

    await User.findOneAndUpdate(
      { _id: foundUser._id },
      {
        $inc: { coins: Number(process.env.referCode) },
      }
    );

    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const getAllRegisteredUsers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const users = await User.paginate(
      {},
      {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        select: "-password",
      }
    );

    res.json({
      users,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const blockUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });

    if (!user) return next("invalid user id.", 400);

    await Blocklist.create({
      user: user._id,
    });

    res.json({
      message: `${user.name} has been blocked.`,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const getAllBlockedUsers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    await Blocklist.paginate(
      {},
      {
        populate: "user",
        select: "-password",
        page: page ? page : 1,
        limit: limit ? limit : 10,
      }
    );
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const unBlockUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });

    if (!user) return next("invalid user id.", 400);

    await Blocklist.findOneAndRemove({
      user: user._id,
    });

    res.json({
      message: `${user.name} has been unblocked.`,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};
