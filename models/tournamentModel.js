import mongoose from "mongoose";

const tournamentScehma = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed"],
    default: "upcoming",
  },
  entryFee: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  tournamentType: {
    type: String,
    enum: ["solo", "duo", "team"],
    required: true,
  },
  thumbnails: {
    type: [String],
    required: true,
  },
  prizeDistribution: {
    type: {
      kills: {
        type: Number,
      },
      streak: {
        type: Number,
      },
      damage: {
        type: Number,
      },
    },
  },
});

const Tournament = mongoose.model("Tournament", tournamentScehma);
export default Tournament;
