import admin from "firebase-admin";
import fs from "fs";
import path, { dirname, resolve } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const serviceAccount = JSON.parse(
  fs.readFileSync(
    path.resolve(
      __dirname,
      "../test-app-41c64-firebase-adminsdk-1z3d6-e2300eeeb4.json"
    )
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://test-app-41c64.firebaseio.com",
});

export const subscribeForNotification = async (
  token,
  topic = "tournament_reminder"
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await admin.messaging().subscribeToTopic(token, topic);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export const sendPushNotification = async (
  message,
  topic = "tournament_reminder"
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payload = {
        notification: {
          title: message.title,
          body: message.body,
          icon: process.env.DOMAIN_NAME + "/logo.png",
        },
      };

      const options = {
        priority: "high",
      };

      await admin.messaging().sendToTopic(topic, payload, options);

      resolve();
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
