import User from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
  });

  try {
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
    res.status(503).json({
      status: "Error",
      message: err.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.body.email });

    if (!foundUser)
      return res.json({ status: "Error", message: "User does not exist." });

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
      return res.json({ status: "Error", message: "Incorrect password." });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: "Error",
      message: err.message,
    });
  }
};
