import * as queryString from "query-string";
import axios from "axios";

const stringifiedParams = queryString.stringify({
  client_id: process.env.FACEBOOK_ID,
  redirect_uri: "https://tss-gaming.herokuapp.com/api/auth/facebook/",
  scope: ["email", "public_profile"].join(","), // comma seperated string
  response_type: "code",
  auth_type: "rerequest",
  display: "popup",
});

export const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;
