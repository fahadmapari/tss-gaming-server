import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const matchScehma = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

matchScehma.plugin(mongoosePaginate);

const match = mongoose.model("Match", matchScehma);
export default match;
