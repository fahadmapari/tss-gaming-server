import mongoose from "mongoose";
import { agenda } from "./cron-jobs/updateTournaments.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    await agenda.start();
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong while connecting to database.");
  }
};
