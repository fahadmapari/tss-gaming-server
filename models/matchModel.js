import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import autoFill from "mongoose-autopopulate";

const matchScehma = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
      autopopulate: true,
    },
    tournamentStatus: {
      type: String,
      required: true,
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    team: {
      type: [String],
    },
    leaderboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leaderboard",
      required: true,
    },
    prize: {
      type: Number,
      default: 0,
    },
    kills: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    damage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

matchScehma.plugin(mongoosePaginate);
matchScehma.plugin(autoFill);

const match = mongoose.model("Match", matchScehma);
export default match;
