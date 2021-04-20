import mongoose from "mongoose";

const sessionScehma = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

sessionScehma.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model("Session", sessionScehma);
export default Session;
