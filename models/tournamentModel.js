import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const tournamentScehma = new mongoose.Schema(
  {
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
    prize: {
      type: Number,
      required: [true, "Prize is required."],
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
    credentials: {
      type: {
        roomId: String,
        roomPassword: String,
      },
    },
    stream: {
      type: String,
    },
  },
  { timestamps: true }
);

tournamentScehma.plugin(mongoosePaginate);

const Tournament = mongoose.model("Tournament", tournamentScehma);
export default Tournament;
