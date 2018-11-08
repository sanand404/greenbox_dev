import mySqlConnection from "../../services/mySQLConnection";
import logger from "../../../../lib/logger";

class MemberModel {
  register = parameters => {
    const idMember = Math.floor(new Date() / 10);
    const dateTime = new Date();
    const dateTimeString = dateTime
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const query = `Call create_member(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const queryParameters = [
      idMember,
      parameters.firstName,
      parameters.middleName,
      parameters.lastName,
      parameters.dob,
      parameters.emailId,
      parameters.phoneNo,
      parameters.gender,
      parameters.address1,
      parameters.address2,
      parameters.address3,
      parameters.city,
      parameters.state,
      parameters.pincode,
      dateTimeString,
      dateTimeString,
      parameters.userId
    ];

    return new Promise((resolve, reject) => {
      const temp = mySqlConnection.query(
        query,
        queryParameters,
        (err, result) => {
          console.log("SQL: ", temp.sql);
          if (err) {
            logger.error("Error in register of memberModel ", err);
            return reject({ success: false, message: err });
          }
          return resolve({ success: true, message: result });
        }
      );
    });
  };

  getMemberByEmail = parameters => {
    const query = ` SELECT firstName, lastName, emailId FROM Member WHERE emailId = ?`;
    return new Promise((resolve, reject) => {
      const temp = mySqlConnection.query(query, parameters, (err, result) => {
        console.log("SQL: getMemberByEmail in memberModel ", temp.sql);
        if (err) {
          logger.err("Error in getMemberByEmail in memberModel  ", err);
          return reject({ success: false, message: err });
        } else if (result && result.length > 0) {
          logger.info("Success getMemberByEmail in memberModel ", result);
          return resolve(result);
        }
        return resolve(false);
      });
    });
  };
}

export default new MemberModel();
