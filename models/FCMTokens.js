import mongoose from "mongoose";

const FCMTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, "FCM token is required."],
  },
});

const FCMToken = mongoose.model("FCMToken", FCMTokenSchema);

export default FCMToken;
