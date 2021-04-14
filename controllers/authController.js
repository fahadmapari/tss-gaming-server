import User from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
  });

  if (req.file.profilepicture) {
    user.profilePic = req.file.profilepicture;
  }

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

    res
      .status(201)
      .cookie("access_token", generateToken(newUser._id), {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
      })
      .send({
        userInfo: {
          name: newUser.name,
          role: newUser.role,
          email: newUser.email,
          coins: newUser.coins,
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
      return res
        .cookie("access_token", generateToken(foundUser._id), {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          httpOnly: true,
          secure: true,
        })
        .json({
          userInfo: {
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
            coins: foundUser.coins,
          },
        });
    } else {
      return next(new AppError("Incorrect password.", 401));
    }
  } catch (err) {
    next(new AppError(err.message, 503));
  }
};
