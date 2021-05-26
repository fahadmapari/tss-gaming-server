import { Agenda } from "agenda/es.js";
import Match from "../models/matchModel.js";
import Tournament from "../models/tournamentModel.js";
import { sendPushNotification } from "../utils/firebase-notification.js";

export const agenda = new Agenda({
  db: {
    address: process.env.MONGO_URI,
    options: {
      useUnifiedTopology: true,
    },
  },
  processEvery: "30 minutes",
});

agenda.define(
  "update tournament",
  { priority: "high", concurrency: 10 },
  async (job) => {
    try {
      const { tournamentID } = job.attrs.data;

      await Tournament.findOneAndUpdate(
        { _id: tournamentID },
        {
          status: "ongoing",
        }
      );

      await Match.updateMany(
        { tournament: tournamentID },
        {
          tournamentStatus: "ongoing",
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
);

agenda.define(
  "send notification",
  { priority: "high", concurrency: 10 },
  async (job) => {
    try {
      const { title } = job.attrs.data;

      sendPushNotification({
        title: `${title} starting in 1 hour.`,
        body: "Get ready to play or watch the live stream!",
      });
    } catch (err) {
      console.log(err);
    }
  }
);

export const updateTournamentStatus = async (tournamentID, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      await agenda.start();
      const job = await agenda.schedule(date, "update tournament", {
        tournamentID,
      });
      resolve(job);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

export const schedulePushNotification = async (title, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      await agenda.start();
      const updatedDate = new Date(date.getTime - 3600000);

      const job = await agenda.schedule(updatedDate, "send notification", {
        title,
      });
      resolve(job);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
