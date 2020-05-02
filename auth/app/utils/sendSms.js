import africastalking from "africastalking";

const AT = africastalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

//Initialize the SMS service
const smsService = AT.SMS;

export default smsService;
