import User from "../models/userModel.js";
import Session from "../models/sessionModel.js";
import { AppError } from "../utils/AppError.js";
import { generateToken } from "../utils/generateToken.js";
import { getGoogleAccountFromCode } from "../utils/googleAuth.js";
import axios from "axios";

export const registerUser = async (req, res, next) => {
  let profilePic = "/profile-pictures/default.png";

  if (req.file) {
    profilePic = req.file.profilepicture.filename;
  }

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
        secure: true,
      })
      .set({
        "api-key": token,
      })
      .json({
        userInfo: {
          name: newUser.name,
          mobile: newUser.mobile,
          role: newUser.role,
          email: newUser.email,
          coins: newUser.coins,
          profilePic: newUser.profilePic,
          referralId: newUser.referralId,
        },
      });
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};

export const loginUser = async (req, res, next) => {
  try {
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
          secure: true,
        })
        .set({
          "api-key": token,
        })
        .json({
          userInfo: {
            name: foundUser.name,
            mobile: foundUser.mobile,
            email: foundUser.email,
            role: foundUser.role,
            coins: foundUser.coins,
            profilePic: foundUser.profilePic,
            referralId: foundUser.referralId,
          },
        });
    } else {
      return next(new AppError("Incorrect password.", 401));
    }
  } catch (err) {
    next(new AppError(error.message, 503));
  }
};

//google login/signup

export const googleLogin = async (req, res, next) => {
  try {
    const data = await getGoogleAccountFromCode(req.query.code);
    const googleProfile = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${data.data.tokens.access_token}`
    );
    const { email, name, picture } = googleProfile.data;

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      const token = generateToken(newUser._id);
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
          secure: true,
        })
        .redirect("/");
    }

    if (!existingUser) {
      await User.create({
        name: name,
        email: email,
        emailVerified: true,
        password: "",
        profilePic: picture,
      });
    }

    console.log("got request from google");
    console.log(google);
    res.send("ok");
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
