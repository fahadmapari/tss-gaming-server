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
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: [true, "game is required."],
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
      enum: ["solo", "duo", "squad"],
      required: [true, "tournament type is required."],
    },
    thumbnails: {
      type: [String],
      required: [true, "thumbnails are required"],
    },
    slots: {
      type: Number,
      required: [true, "number of slots is required."],
    },
    slotsAvailable: {
      type: Number,
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
