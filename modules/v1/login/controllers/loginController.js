import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import UserModel from "../../user/models/userModel";
import MailUtility from "../../../../lib/SendMail/sendMail";
import logger from "../../../../lib/logger";

dotenv.load();

class LoginController {
  //#region sendAddUserMail
  sendAddUserMail = user =>
    new Promise((resolve, reject) => {
      const mailObj = new MailUtility();
      const mailSubject = "Getting started with Playsoftech";
      const mailTo = user.emailId;
      const mailTemplate = `<p> Welcome ${user.firstName}, </p>
                                        <p>Congratulations! You've successfully signed up for <b>Playsoftech</b>.</p>
                                        <p>Your account will activated once it will get verified by <b>Playsoftech</b>.</p>
                                        <p>Thanks,</p>
                                        <p>The Playsoftech team</p>`;

      const mailOptions = mailObj.setMailOptions(
        process.env.SMTP_USER,
        mailTo,
        mailSubject,
        mailTemplate
      );

      mailObj.sendMail(mailOptions, (err, data) => {
        if (err) {
          logger.info("Mail send fail for AddUser ", user);
          return resolve(false);
          //res.status(400).send({ status: "error", result: err });
        } else {
          logger.info("Mail send successfully for AddUser ", user);
          return resolve(true);
          //res.status(200).send({ status: "success", result: data.data });
        }
      });
    });

  //#endregion

  //#region createUser
  createUser = async (req, res) => {
    const newUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      password: req.body.password,
      provider: "playsoftech"
    };

    try {
      UserModel.getUserByDomain({
        emailId: newUser.emailId,
        provider: newUser.provider
      }).then(async isUserExists => {
        if (isUserExists.result && isUserExists.result.length > 0) {
          logger.info("EmailId already exists ", newUser);
          return res.send({
            success: false,
            message: "EmailId already exists"
          });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newUser.password, salt);

        newUser.password = passwordHash;
        UserModel.addUser(newUser)
          .then(user => {
            if (user) {
              this.sendAddUserMail(newUser);
              res.send({ success: true, result: newUser });
            }
          })
          .catch(err => {
            res.send({ success: false, error: err });
          });
      });
    } catch (err) {
      logger.info("Error in createUser ", err);
      res.send({ success: false, error: err });
    }
  };

  //#endregion

  //#region  generateJWTToken
  generateJWTToken = payload =>
    new Promise((resolve, reject) => {
      console.log("generateJWTToken payload : ", payload);
      logger.info("generateJWTToken payload : ", payload);
      jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {
          //iat: new Date().getTime(),
          expiresIn: new Date().setDate(new Date().getDate() + 1)
        },
        (err, token) => {
          if (err) {
            console.log("Error generateJWTToken", err);
            logger.info("Error generateJWTToken", err);
            return resolve(false);
          }
          console.log("Token generateJWTToken : ", token);
          logger.info("Token generateJWTToken : ", token);
          return resolve(token);
        }
      );
    });

  //#endregion

  //#region  login

  login = async (req, res) => {
    //Check Email And provider
    let emailId = "";
    let password = "";
    let provider = "";

    if (req.body && req.body.emailId) {
      console.log("In body ", req.body);
      logger.info("In body ", req.body);
      emailId = req.body.emailId;
      password = req.body.password;
      provider = req.body.provider;
    } else if (req.user && req.user.user.length > 0) {
      console.log("In User body", req.user);
      logger.info("In User body ", req.user);
      emailId = req.user.user[0].emailId;
      password = "";
      provider = req.user.user[0].provider;
    } else if (req.user && req.user.user.emailId) {
      console.log("If User register for first time by google OAuth");
      logger.info("If User register for first time by google OAuth");
      emailId = req.user.user.emailId;
      password = "";
      provider = req.user.user.provider;
    }

    const user = await UserModel.getUserByDomain({
      emailId: emailId,
      password: password,
      provider: provider
    });

    console.log("$$$$$$$$$$", user);
    logger.info("$$$$$$$$$$", user);

    if (!user || (user && user.result[0].isActive == 0)) {
      logger.info("login EmailId not found");
      return res.send({ success: false, message: "EmailId not found" });
    }

    console.log("-----------", password);

    if (provider !== "playsoftech" && password) {
      logger.info("login Invalid user");
      return res.send({ success: false, message: "Invalid user" });
    }
    const userPassword = user.result[0].password;

    console.log("---------UserPassword ", userPassword);
    logger.info("---------UserPassword ", userPassword);
    const isMatch = await bcrypt.compare(password, userPassword);

    console.log("Password Match ", isMatch);
    logger.info("Password Match ", isMatch);
    if (!isMatch && provider === "playsoftech") {
      return res.send({ success: false, message: "Password is incorrect" });
    }

    UserModel.getUserByEmailId({
      emailId: emailId,
      password: userPassword,
      provider: provider
    })
      .then(async user => {
        if (user) {
          const payload = {
            id: user.result[0].idUser,
            emailId: user.result[0].emailId,
            provider: user.result[0].provider
          };

          const jwtToken = await this.generateJWTToken(payload);

          console.log("JWTTOken ", jwtToken);
          if (jwtToken) {
            return res.send({ token: jwtToken });
          } else {
            return res.send({ token: false });
          }
        } else {
          return res.send({
            success: false,
            token: "Error in generating token"
          });
        }
      })
      .catch(err => {
        console.log("Error in login ", err);
      });
  };

  //#endregion

  //#region forgotPassword

  forgotPassword = async (req, res) => {
    const user = await UserModel.getUserId({
      emailId: req.body.emailId,
      provider: "playsoftech"
    });

    console.log("-------Forgot-Password User ", !user);
    console.log("-----Seconds Cond ", user && user[0].isActive == 0);
    console.log("-------IsActive forgotPAssword ", user[0].isActive);

    if (!user || (user && user[0].isActive == 0)) {
      logger.info("forgot password Please check the email-id");
      return res.send({ success: false, message: "Please check the email-id" });
    }

    console.log("After validation ");

    const payload = {
      id: user[0].idUser,
      emailId: user[0].emailId,
      provider: user[0].provider
    };

    const jwtToken = await this.generateJWTToken(payload);

    if (!jwtToken) {
      res.send({ result: false, message: "Error in sending email" });
    }

    const mailObj = new MailUtility();
    const mailSubject = "Reset your password";
    const mailTo = user[0].emailId;
    const mailTemplate = `<p> Hi ${user[0].firstName}, </p>
                                        <p>We've received a request to reset your password.If you didn't make the request, just ignore this email.</p>
                                        <p>Otherwise, you can reset your password using this link:</p>
                                        <p><a href=reset_password?token=${jwtToken}>Click here to reset your password</a></p>
                                        <p>Thanks,</p>
                                        <p>The Playsoftech team</p>`;
    const mailOptions = mailObj.setMailOptions(
      process.env.SMTP_USER,
      mailTo,
      mailSubject,
      mailTemplate
    );

    mailObj.sendMail(mailOptions, (err, data) => {
      if (err) {
        logger.info("Forgotpassword error in mail", err);
        res.status(400).send({ status: "error", result: err });
      } else {
        logger.info("Forgotpassword success in mail", data);
        res.status(200).send({ status: "success", result: data.data });
      }
    });
  };

  //#endregion
}

export default new LoginController();
