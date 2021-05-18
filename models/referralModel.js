import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const referralScehma = new mongoose.Schema(
  {
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    referredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

referralScehma.plugin(mongoosePaginate);

const Referral = mongoose.model("Referral", referralScehma);
export default Referral;
