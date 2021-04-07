import mongoose from "mongoose";

const orderScehma = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order_id: String,
    orderDetails: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderScehma);
export default Order;
