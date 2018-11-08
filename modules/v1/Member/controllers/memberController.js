import logger from "../../../../lib/logger";
import MemberModel from "../models/memberModel";
import MailUtility from "../../../../lib/SendMail/sendMail";

class MemberController {
  create = async (req, res) => {
    req.body.userId = req.user[0].idUser;
    try {
      let memberExist;
      try {
        memberExist = await MemberModel.getMemberByEmail(req.body.emailId);
        console.log("-----------Meme", memberExist);
        if (memberExist && memberExist.length > 0) {
          return res.status(200).send({
            success: true,
            message: `${req.body.emailId} already exists`
          });
        }
      } catch (error) {
        logger.error("Error in getMemberByEmail in memberController");
        return res.status(400).send({ success: false, message: error });
      }

      await MemberModel.register(req.body);
      const user = {
        firstName: req.body.firstName,
        emailId: req.body.emailId
      };

      try {
        await this.sendRegisterMemberMail(user);
      } catch (error) {
        logger.error("Error in sending mail for ", user.firstName);
      }
    } catch (error) {
      logger.error("Error in create memeberController ", error);
      res.status(400).send({ success: false, message: error });
    }
    res
      .status(200)
      .send({ success: true, message: "Member created successfully" });
  };

  // #region sendAddUserMail
  sendRegisterMemberMail = user =>
    new Promise((resolve, reject) => {
      const mailObj = new MailUtility();
      const mailSubject = "Getting started with Greenbox";
      const mailTo = user.emailId;
      const mailTemplate = `<p> Welcome ${user.firstName}, </p>
                                        <p>Congratulations! You've successfully registered up for <b>Greenbox</b>.</p>
                                        
                                        <p>Thanks,</p>
                                        <p>The Greenbox team</p>`;

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
          // res.status(400).send({ status: "error", result: err });
        } else {
          logger.info("Mail send successfully for AddUser ", user);
          return resolve(true);
          // res.status(200).send({ status: "success", result: data.data });
        }
      });
    });

  // #endregion
}

export default new MemberController();
