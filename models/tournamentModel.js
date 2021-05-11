import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const tournamentScehma = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required."],
    },
    description: {
      type: String,
      required: [true, "description is required."],
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
    entryFee: {
      type: Number,
      required: [true, "entry fee is required"],
    },
    prize: {
      type: Number,
      required: [true, "Prize is required."],
    },
    date: {
      type: Date,
      required: [true, "date is required."],
    },
    tournamentType: {
      type: String,
      enum: ["solo", "duo", "team"],
      required: [true, "tournament type is required."],
    },
    thumbnails: {
      type: [String],
      required: [true, "thumbnails are required"],
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
        roomId: {
          type: String,
          required: [true, "room id required."],
        },
        roomPassword: {
          type: String,
          required: [true, "room password is required."],
        },
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
