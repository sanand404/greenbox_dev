import dotenv from "dotenv";
import nodemailer from "nodemailer";

class MailUtility {
  constructor() {
    dotenv.load();

    this.transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        //Do not fail on invalid certs
        rejectUnauthorized: false
      }
    });
  }

  setMailOptions = (senderMail, recevierMail, mailSubject, templateBody) => {
    const mailOptions = {
      from: senderMail,
      to: recevierMail,
      subject: mailSubject,
      html: templateBody
    };
    return mailOptions;
  };

  sendMail(mailOptions, cb) {
    this.transport.sendMail(mailOptions, cb);
  }
}

export default MailUtility;
