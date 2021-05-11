import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const withdrawalScehma = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "withdraw amount is required."],
    },
    upiID: {
      type: String,
      required: [true, "upi id is required to withdraw."],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

withdrawalScehma.plugin(mongoosePaginate);

const Withdrawal = mongoose.model("Withdrawal", withdrawalScehma);
export default Withdrawal;
