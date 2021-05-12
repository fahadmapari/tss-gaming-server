import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();
const client = twilio(process.env.TWLO_SID, process.env.TWLO_TOKEN);
let twilioSID;

//generate twillio service
(async () => {
  const service = await client.verify.services.create({
    friendlyName: "tss-gaming",
  });

  twilioSID = service.sid;
  console.log(twilioSID);
})();
