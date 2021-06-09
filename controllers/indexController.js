import User from "../models/userModel.js";
import Blocklist from "../models/blocklistModel.js";
import { AppError } from "../utils/AppError.js";
import Referral from "../models/referralModel.js";
import Game from "../models/gameModel.js";
import FCMToken from "../models/FCMTokens.js";
import { validateEmail } from "../utils/validations.js";
import {
  sendPushNotification,
  subscribeForNotification,
} from "../utils/firebase-notification.js";
import sgMail from "@sendgrid/mail";
import mongoose from "mongoose";

sgMail.setApiKey(process.env.SEND_GRID_KEY);

export const contactUs = async (req, res, next) => {
  try {
    const { name, email, phone, message, subject, category } = req.body;

    if (!name || name === "")
      return next(new AppError("name is required.", 400));
    if (!email || email === "")
      return next(new AppError("email is required.", 400));
    if (!phone || phone === "")
      return next(new AppError("phone is required.", 400));
    if (!message || message === "")
      return next(new AppError("name is required.", 400));
    if (!subject || subject === "")
      return next(new AppError("name is required.", 400));
    if (!category || category === "")
      return next(new AppError("name is required.", 400));

    const msg = {
      to: process.env.SEND_GRID_EMAIL,
      from: process.env.SEND_GRID_EMAIL, // Use the email address or domain you verified above
      subject: subject + " - TSS_GAMING",
      replyTo: email,
      html: `<h3>Name: ${name}</h3> <h3>Email: ${email}</h3> <h3>Phone: ${phone}</h3> <h3>Subject: ${subject}</h3> <h3>Category: ${category}</h3> <h3>Message:</h3> <p>${message}</p>`,
    };

    await sgMail.send(msg);

    res.json({
      message: "Mail sent",
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const saveFcmTokens = async (req, res, next) => {
  try {
    const { fcmToken } = req.body;
    const { gameId, tournamentId } = req.query;

    if (!FCMToken) return next(new AppError("FCM token is required.", 400));

    if (gameId && gameId !== "") {
      if (!mongoose.isValidObjectId(gameId))
        return next(new AppError("Invalid game id", 401));
      await subscribeForNotification(fcmToken, gameId);
    }

    if (tournamentId && tournamentId !== "") {
      if (!mongoose.isValidObjectId(gameId))
        return next(new AppError("Invalid tournament id", 401));
      await subscribeForNotification(fcmToken, tournamentId);
    }

    if (!gameId && !tournamentId) await subscribeForNotification(fcmToken);

    res.json({
      message: "succesfully registered for notifications.",
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const sendCustomPushNotification = async (req, res, next) => {
  try {
    const { title, body, id } = req.body;

    if (id && id !== "") {
      if (!mongoose.isValidObjectId(id))
        return next(new AppError("Invalid id"));
      await sendPushNotification({ title, body }, id);
    }
    if (!id) await sendPushNotification({ title, body });

    res.json({
      message: "Notification sent",
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const sendWhatsappMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
  } catch (er) {
    next(new AppError(err.message, 503));
  }
};

export const rewardUserForReferral = async (req, res, next) => {
  try {
    const { id, mobileVerified, emailVerified } = req.user;
    const { referCode } = req.body;

    const user = await User.findOne({ _id: id });
    const regiseredDate = new Date(user.createdAt).getTime() + 86400000; // converting date to milli seconds and adding 1 day to it.

    if (new Date() > new Date(regiseredDate))
      return next(new AppError("only new users can perform this action.", 400));

    if (user.password !== "") {
      return next(new AppError("allowed only for social login users.", 400));
    }

    if (!referCode || referCode === "")
      return next(new AppError("referral code can not be empty.", 400));

    const foundUser = await User.findOne({ referCode: referCode });

    if (!foundUser) return next(new AppError("invalid referral code.", 400));

    const referredBy = await User.findOneAndUpdate(
      { _id: foundUser._id },
      {
        $inc: { coins: Number(process.env.referCode) },
      }
    );

    await Referral.create({
      referredBy: referredBy._id,
      referredUser: id,
    });

    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const getAllRegisteredUsers = async (req, res, next) => {
  try {
    const { page, limit, role } = req.query;

    const query = {};

    if (role) query.role = role;

    const users = await User.paginate(query, {
      page: page ? page : 1,
      limit: limit ? limit : 10,
      select: "-password",
    });

    res.json({
      users,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const searchUsers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const { searchTerm } = req.body;

    if (!searchTerm || searchTerm === "") {
      return next(new AppError("Search term required.", 400));
    }

    const searchedUsers = await User.paginate(
      {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
        ],
      },
      {
        page: page ? page : 1,
        limit: limit ? limit : 10,
        select: "-password",
      }
    );

    res.json({
      searchedUsers,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const blockUser = async (req, res, next) => {
  try {
    const { role: adminRole } = req.user;
    const { id } = req.params;

    const user = await User.findOne({ _id: id });

    if (!user) return next("invalid user id.", 400);

    const alreadyBlocked = await Blocklist.findOne({ user: user._id });

    if (alreadyBlocked) return next("user already blocked.", 400);

    if (adminRole === "sub-admin" && user.role === "admin")
      return next("Action not allowed.", 403);

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
    const { page, limit, role } = req.query;

    const query = {};

    if (role) query.role = role;

    const blocklist = await Blocklist.paginate(query, {
      populate: "user",
      select: "-password",
      page: page ? page : 1,
      limit: limit ? limit : 10,
    });

    res.json({
      blocklist,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const unBlockUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });

    if (!user) return next(new AppError("invalid user id.", 400));

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

export const getAllGames = async (req, res, next) => {
  try {
    const games = await Game.find({});

    res.json({
      games,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const addNewGame = async (req, res, next) => {
  try {
    const { title } = req.body;
    let gameCover = process.env.DOMAIN_NAME + "/game-covers/" + "default.png";

    if (req.file) {
      gameCover = process.env.DOMAIN_NAME + "/game-covers/" + req.file.filename;
    }

    const game = await Game.create({
      title: title,
      cover: gameCover,
    });

    res.json({
      message: "New game created",
      game,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const createNewSubAdmin = async (req, res, next) => {
  let profilePic = "/profile-pictures/default.png";
  if (req.file) {
    profilePic =
      process.env.DOMAIN_NAME + "/profile-pictures/" + req.file.filename;
  }

  if (!req.body.email || req.body.email === "")
    return next(new AppError("Email is required", 400));

  if (!req.body.mobile || req.body.mobile === "")
    return next(new AppError("Mobile number is required", 400));

  if (!validateEmail(req.body.email))
    return next(new AppError("Invalid email", 400));

  if (req.body.mobile.length < 10)
    return next(new AppError("Invalid mobile number", 400));

  if (!req.body.password || req.body.password === "")
    return next(new AppError("password is required", 400));

  if (!req.body.name || req.body.name === "")
    return next(new AppError("name is required", 400));

  const user = new User({
    email: req.body.email.toLowerCase(),
    mobile: req.body.mobile,
    password: req.body.password,
    name: req.body.name,
    profilePic: profilePic,
    role: "sub-admin",
  });

  try {
    const newUser = await user.save();

    res.status(201).json({
      userInfo: {
        name: newUser.name,
        mobile: newUser.mobile,
        mobileVerified: newUser.newUser,
        role: newUser.role,
        email: newUser.email,
        emailVerified: newUser.emailVerified,
        mobileVerified: newUser.mobileVerified,
        profilePic: newUser.profilePic,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const editUserProfile = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return next(new AppError("Only admin can perform this action."));

    const { name, mobile, email, role } = req.body;
    const { id } = req.params;

    let updateDetails = {};

    if (name && name !== "") updateDetails.name = name;
    if (mobile && mobile !== "") updateDetails.mobile = mobile;
    if (email && email !== "") updateDetails.email = email;
    if (role && role !== "") updateDetails.role = role;

    if (req.file)
      updateDetails.profilePic =
        process.env.DOMAIN_NAME + "/profile-pictures/" + req.file.filename;

    const foundUser = await User.findOne({ _id: id });

    if (!foundUser) return next(new AppError("User not found.", 401));

    await User.findOneAndUpdate(
      { _id: foundUser._id },
      {
        ...updateDetails,
        mobileVerified: mobile ? false : foundUser.mobileVerified,
        emailVerified: email ? false : foundUser.emailVerified,
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

      if (mobile || email) {
        const msg = {
          to: foundUser.email,
          from: process.env.SEND_GRID_EMAIL, // Use the email address or domain you verified above
          subject: "TSS-GAMING Account update",
          text: `${mobile && `Your mobile numer: ${mobile} was changed`}
                  ${email && `Your email: ${email} was changed, `}
                  `,
        };

        await sgMail.send(msg);
      }
    } catch (err) {
      console.log(err);
    }

    res.json({
      message: "User profile updated",
    });
  } catch (err) {
    next(err.message, 503);
  }
};
