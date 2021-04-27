import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import Session from "../models/sessionModel.js";

export const checkGuest = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    next();
  } else {
    return res.status(403).json({
      status: "Error",
      message: "Already logged in.",
    });
  }
};

export const validateToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      let user = await User.findOne({ _id: decoded.userId });

      if (!user) {
        return res.status(403).json({
          status: "Error",
          error: err.message,
          message: "Something went wrong while validating token. Invalid token",
        });
      }

      user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        coins: user.coins,
      };

      const session = await Session.findOne({ token: token });

      if (!session) {
        return res.status(403).json({
          status: "Error",
          error: err.message,
          message: "Something went wrong while validating token. Invalid token",
        });
      }

      req.user = user;
      req.token = token;

      return next();
    } catch (err) {
      return res.status(403).json({
        status: "Error",
        error: err.message,
        message: "Something went wrong while validating token. Invalid token",
      });
    }
  } else {
    return res.status(403).json({
      status: "Error",
      message: "User not logged in.",
    });
  }
};

export const validateAdminToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      let user = await User.findOne({ _id: decoded.userId });

      user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        coins: user.coins,
      };

      req.user = user;
      req.token = token;

      let session = await Session.findOne({ token: token });

      if (!session) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "User not authorized to perform this task.",
        });
      }

      if (user.role !== "admin") {
        return res.status(401).json({
          status: "Unauthorized",
          message: "User not authorized to perform this task.",
        });
      }

      return next();
    } catch (err) {
      return res.status(403).json({
        status: "Error",
        error: err.message,
        message: "Something went wrong while validating token. Invalid token",
      });
    }
  } else {
    return res.status(403).json({
      status: "Error",
      message: "User not logged in.",
    });
  }
};
