import { google } from "googleapis";

/*******************/
/** CONFIGURATION **/
/*******************/

export const googleConfig = {
  clientId: process.env.GOOGLE_ID, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: process.env.GOOGLE_SECRET, // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: "https://tssgaming.in/user/google.html", // this must match your google api settings
};

export const defaultScope = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

/*************/
/** HELPERS **/
/*************/

export const createConnection = () => {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
};

export const getConnectionUrl = (auth) => {
  return auth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: defaultScope,
  });
};

/**********/
/** MAIN **/
/**********/

/**
 * Part 1: Create a Google URL and send to the client to log in the user.
 */
export const urlGoogle = () => {
  const auth = createConnection();
  const url = getConnectionUrl(auth);
  return url;
};

/**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */
export const getGoogleAccountFromCode = async (code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const auth = createConnection();
      const data = await auth.getToken(code);
      const tokens = data.tokens;
      auth.setCredentials(tokens);

      resolve({
        data,
      });
    } catch (err) {
      console.log("something went wront");
      console.log(err.message);
    }
  });
};
