import mongoose from "mongoose";
import { hashPassword } from "../utils/hashPassword.js";
import shortid from "shortid";
import bcrypt from "bcrypt";

const userScehma = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  mobile: {
    type: Number,
    unique: true,
  },
  mobileVerified: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  coins: {
    type: Number,
    default: 0,
  },
  referralId: {
    type: String,
    default: shortid.generate,
  },
});

userScehma.pre("save", async function (next) {
  if (this.password === "" || !this.password) return next();
  this.password = await hashPassword(this.password);
  return next();
});

userScehma.methods.checkPassword = function (enteredPassword, password) {
  return bcrypt.compareSync(enteredPassword, password);
};

const User = mongoose.model("User", userScehma);
export default User;
