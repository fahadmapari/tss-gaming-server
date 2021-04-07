import Razorpay from "razorpay";
import crypto from "crypto";
import shortid from "shortid";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

const instance = new Razorpay({
  key_id: process.env.razor_id,
  key_secret: process.env.razor_secret,
});

export const buyCoins = async (req, res) => {
  const { coins } = req.body;

  const orderResponse = await instance.orders.create({
    amount: Number(coins) * 100,
    currency: "INR",
    receipt: shortid.generate(),
    payment_capture: true,
  });

  await Order.create({
    user: req.user._id,
    order_id: orderResponse.order_id,
    orderDetails: orderResponse,
  });

  res.json({
    orderResponse,
  });
};

export const verifyPayment = async (req, res) => {
  const shasum = crypto.createHmac("sha256", process.env.razor_secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    if (
      req.body.payload.payment.entity.status === "captured" ||
      req.body.payload.payment.entity.status === "failed" ||
      req.body.payload.payment.entity.status === "authorized"
    ) {
      const updatedOrder = await Order.findOneAndUpdate(
        { order_id: req.body.payload.payment.entity.order_id },
        { orderDetails: req.body }
      );

      await User.findOneAndUpdate(
        { _id: updatedOrder.user },
        {
          $inc: { coins: Number(updatedOrderpayload.payment.amount) / 100 },
        }
      );
    }
  } else {
    await Order.findOneAndUpdate(
      { order_id: req.body.payload.payment.entity.order_id },
      { orderDetails: req.body }
    );
  }

  res.status(200).json({ status: "OK" });
};
