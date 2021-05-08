import User from "../models/userModel.js";
import Session from "../models/sessionModel.js";
import twilio from "twilio";
import { AppError } from "../utils/AppError.js";
import { generateToken } from "../utils/generateToken.js";
import {
  getGoogleAccountFromCode,
  googleConfig,
  defaultScope,
  createConnection,
  getConnectionUrl,
  urlGoogle,
} from "../utils/googleAuth.js";
import axios from "axios";
const client = twilio(process.env.TWLO_SID, process.env.TWLO_TOKEN);

export const generateOtp = async (req, res, next) => {
  try {
    const { id, mobile } = req.user;
    client.verify
      .services(process.env.TWLO_SERVICE_ID)
      .verifications.create({ to: `+91${mobile}`, channel: "sms" })
      .then((verification) => {
        res.status(200).json({
          message: "OTP SENT",
          data: {
            to: verification.to,
            channel: verification.channel,
            status: verification.status,
            lookup: verification.lookup,
            dates: {
              created: verification.date_created,
              update: verification.date_updated,
            },
          },
        });
      })
      .catch((err) => {
        next(new AppError(err.message, 503));
      });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { id, mobile } = req.user;
    const { otp } = req.body;

    if (!otp || otp === "") {
      return next(new AppError("OTP required", 401));
    }

    client.verify
      .services(process.env.TWLO_SERVICE_ID)
      .verificationChecks.create({ to: `+91${mobile}`, code: otp })
      .then(async (verification) => {
        if (verification.status === "approved") {
          await User.findOneAndUpdate(
            { _id: id },
            {
              mobileVerified: true,
            }
          );

          res.status(200).json({
            to: verification.to,
            channel: verification.channel,
            status: verification.status,
            dates: {
              created: verification.date_created,
              update: verification.date_updated,
            },
          });
        } else {
          res.status(200).json({
            to: verification.to,
            channel: verification.channel,
            status: verification.status,
            dates: {
              created: verification.date_created,
              update: verification.date_updated,
            },
          });
        }
      })
      .catch((err) => {
        next(new AppError("INVALID OTP", 503));
      });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const registerUser = async (req, res, next) => {
  let profilePic = "/profile-pictures/default.png";

  if (req.file) {
    profilePic = req.file.filename;
  }

  if (!req.body.email || req.body.email === "")
    return next(new AppError("Email is required", 400));

  if (!req.body.mobile || req.body.mobile === "")
    return next(new AppError("Mobile number is required", 400));

  if (req.body.mobile.length < 10)
    return next(new AppError("Invalid mobile number", 400));

  if (!req.body.password || req.body.password === "")
    return next(new AppError("password is required", 400));

  if (!req.body.name || req.body.name === "")
    return next(new AppError("name is required", 400));

  const user = new User({
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password,
    name: req.body.name,
    profilePic: profilePic,
  });

  try {
    if (req.body.referCode) {
      try {
        await User.findOneAndUpdate(
          { referralId: req.body.referCode },
          {
            $inc: { coins: Number(process.env.referCode) },
          }
        );
      } catch (err) {
        return next(new AppError("Invalid Referral Code", 404));
      }
    }

    const newUser = await user.save();
    const token = generateToken(newUser._id);
    let date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await Session.create({
      user: newUser._id,
      token,
      expireAt: date,
    });

    res
      .status(201)
      .cookie("access_token", token, {
        expires: date,
        httpOnly: true,
      })
      .set({
        "api-key": token,
      })
      .json({
        userInfo: {
          name: newUser.name,
          mobile: newUser.mobile,
          mobileVerified: newUser.newUser,
          role: newUser.role,
          email: newUser.email,
          emailVerified: newUser.emailVerified,
          coins: newUser.coins,
          profilePic: newUser.profilePic,
          referralId: newUser.referralId,
        },
        token,
      });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const loginUser = async (req, res, next) => {
  try {
    if (!req.body.email || req.body.email === "")
      return next(new AppError("email is required", 400));

    if (!req.body.password || req.body.password === "")
      return next(new AppError("password is required", 400));

    const foundUser = await User.findOne({ email: req.body.email });

    if (!foundUser) return next(new AppError("User does not exist.", 404));

    const result = foundUser.checkPassword(
      req.body.password,
      foundUser.password
    );

    if (result) {
      const token = generateToken(foundUser._id);
      let date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await Session.create({
        user: foundUser._id,
        token,
        expireAt: date,
      });

      return res
        .cookie("access_token", token, {
          expires: date,
          httpOnly: true,
          secure: false,
          sameSite: "None",
          domian: "127.0.0.1",
          path: "/",
        })
        .set({
          "api-key": token,
        })
        .json({
          userInfo: {
            name: foundUser.name,
            mobile: foundUser.mobile,
            mobileVerified: foundUser.mobileVerified,
            email: foundUser.email,
            emailVerified: foundUser.emailVerified,
            role: foundUser.role,
            coins: foundUser.coins,
            profilePic: foundUser.profilePic,
            referralId: foundUser.referralId,
          },
          token,
        });
    } else {
      return next(new AppError("Incorrect password.", 401));
    }
  } catch (err) {
    next(new AppError(error.message, 503));
  }
};

//google login/signup

export const generateGoogleURL = async (req, res, next) => {
  try {
    const url = urlGoogle();

    res.status(200).json({
      url: url,
    });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const data = await getGoogleAccountFromCode(req.query.code);
    const googleProfile = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${data.data.tokens.access_token}`
    );
    const { email, name, picture } = googleProfile.data;

    const existingUser = await User.findOne({ email: email }).select(
      "-password"
    );

    if (existingUser) {
      const token = generateToken(existingUser._id);
      let date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await Session.create({
        user: existingUser._id,
        token,
        expireAt: date,
      });

      res
        .status(201)
        .cookie("access_token", token, {
          expires: date,
          httpOnly: true,
        })
        .set({
          "api-key": token,
        })
        .json({
          user: existingUser,
        });
    }

    if (!existingUser) {
      const user = await User.create({
        name: name,
        email: email,
        emailVerified: true,
        password: "",
        profilePic: picture,
      });

      const token = generateToken(user._id);
      let date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await Session.create({
        user: user._id,
        token,
        expireAt: date,
      });

      res
        .status(200)
        .cookie("access_token", token, {
          expires: date,
          httpOnly: true,
        })
        .set({
          "api-key": token,
        })
        .redirect("/");
    }
  } catch (error) {
    next(new AppError(error.message, 503));
  }
};

//log out
export const logoutUser = async (req, res, next) => {
  try {
    await Session.findOneAndDelete({ token: req.token });

    res.status(200).clearCookie("access_token").json({
      status: "log out",
    });
  } catch (error) {
    next(new AppError(error.message, 503));
  }
};
