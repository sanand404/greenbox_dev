import mySqlConnection from "../../services/mySQLConnection";
import logger from "../../../../lib/logger";

class UserModel {
  getUserByDomain = parameters => {
    return new Promise((resolve, reject) => {
      const query = `CALL get_user_by_domain(?, ?)`;
      const queryParameters = [parameters.emailId, parameters.provider];

      const temp = mySqlConnection.query(
        query,
        queryParameters,
        (err, result) => {
          console.log("sql getUserByDomain :", temp.sql);
          console.log("Result ", result);

          if (err) {
            return reject({ Error: "Error in fetching User Records " + err });
          } else if (result[0] && result[0].length) {
            return resolve({ result: result[0] });
          } else {
            return resolve(false);
          }
        }
      );
    });
  };

  getUserByEmailId = parameters => {
    return new Promise((resolve, reject) => {
      const query = `SELECT idUser, firstName, lastName, emailId, provider FROM User WHERE emailId = ? AND password =? AND provider = ?`;
      console.log("Parameters ", parameters);
      const queryParameters = [
        parameters.emailId,
        parameters.password,
        parameters.provider
      ];

      const temp = mySqlConnection.query(
        query,
        queryParameters,
        (err, result) => {
          console.log("sql getUserByEmailId :", temp.sql);
          console.log("Result ", result);

          if (err) {
            return reject({ Error: "Error in fetching User Records " + err });
          } else if (result && result.length) {
            return resolve({ result });
          } else {
            return resolve(false);
          }
        }
      );
    });
  };

  getUserId = parameters => {
    return new Promise((resolve, reject) => {
      const query = `SELECT idUser, firstName, lastName, emailId, provider, isActive  FROM User WHERE emailId = ? AND provider = ?`;

      const queryParameters = [parameters.emailId, parameters.provider];
      const temp = mySqlConnection.query(
        query,
        queryParameters,
        (err, result) => {
          console.log("SQL getUserId: ", temp.sql);
          if (err) {
            reject({ Error: "Error in fetching User Records " + err });
          } else if (result.length) {
            resolve(result);
          } else {
            resolve(false);
          }
        }
      );
    });
  };

  addUser = parameter => {
    return new Promise((resolve, reject) => {
      console.log("Add User parameter ", parameter);
      const idUser = Math.floor(new Date() / 10);
      const dateTime = new Date();
      const dateTimeString = dateTime
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const query = `Call create_user(?,?,?,?,?,?,?,?,?)`;
      const queryParameters = [
        idUser,
        parameter.firstName,
        parameter.lastName,
        parameter.emailId,
        parameter.password,
        parameter.provider,
        dateTimeString,
        dateTimeString,
        0
      ];
      console.log("Inside add ", JSON.stringify(parameter));

      const temp = mySqlConnection.query(
        query,
        queryParameters,
        (err, result) => {
          console.log("SQL: ", temp.sql);
          if (err) {
            logger.info("Error in creating User ", err);
            reject({ Error: "Error in creating User", err });
          } else if (result) {
            resolve({
              result: result,
              data: {
                idUser: idUser,
                emailId: parameter.emailId,
                provider: parameter.provider
              }
            });
          } else {
            resolve(false);
          }
        }
      );
    });
  };
}

export default new UserModel();
