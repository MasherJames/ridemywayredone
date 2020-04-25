import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
//Mail transporter object using the default SMTP transport
export default nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
});
