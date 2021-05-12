import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const blocklistScehma = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

blocklistScehma.plugin(mongoosePaginate);

const Blocklist = mongoose.model("Blocklist", blocklistScehma);
export default Blocklist;
