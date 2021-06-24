import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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
    pd: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

orderScehma.plugin(mongoosePaginate);

const Order = mongoose.model("Order", orderScehma);
export default Order;
