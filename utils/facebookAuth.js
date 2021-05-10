import * as queryString from "query-string";
import axios from "axios";

const stringifiedParams = queryString.stringify({
  client_id: process.env.FACEBOOK_ID,
  redirect_uri: "https://tss-gaming.herokuapp.com/api/authenticate/facebook/",
  scope: ["email", "public_profile"].join(","), // comma seperated string
  response_type: "code",
  auth_type: "rerequest",
  display: "popup",
});

export const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;

export const getFacebookAccessTokenFromCode = async (code) => {
  return new Promise(async (resolve, reject) => {
    const { data } = await axios({
      url: "https://graph.facebook.com/v4.0/oauth/access_token",
      method: "get",
      params: {
        client_id: process.env.FACEBOOK_ID,
        client_secret: process.env.FACEBOOK_SECRET,
        redirect_uri: "https://tss-gaming.herokuapp.com/api/auth/facebook/",
        code,
      },
    });
    resolve(data.access_token);
  });
};
