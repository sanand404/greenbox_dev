import mySqlConnection from "../../services/mySQLConnection";

class UserModel {
  getUserByEmailId = parameters =>
    new Promise((resolve, reject) => {
      const query = `SELECT idUser, firstName, lastName, emailId, domain FROM User WHERE emailId = ? AND password =? AND domain = ?`;
      console.log("Parameters ", parameters);
      const queryParameters = [
        parameters.emailId,
        parameters.password,
        parameters.domain
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
            return resolve(result);
          } else {
            return resolve(false);
          }
        }
      );
    });

  getUserId = parameter =>
    new Promise((resolve, reject) => {
      const query = `SELECT idUser, firstName, lastName, emailId, domain  FROM User WHERE emailId = ?`;

      const queryParameters = [parameter];
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

  addUser = parameter =>
    new Promise((resolve, reject) => {
      console.log("Add User parameter ", parameter);
      const query = `INSERT INTO User VALUES (?,?,?,?,?,?)`;
      const queryParameters = [
        Math.floor(new Date() / 10),
        parameter.firstName,
        parameter.lastName,
        parameter.emailId,
        parameter.password,
        parameter.domain
      ];
      console.log("Inside add ", JSON.stringify(parameter));

      const temp = mySqlConnection.query(
        query,
        queryParameters,
        (err, result) => {
          console.log("SQL: ", temp.sql);
          if (err) {
            reject({ Error: "Error in creating User", err });
          } else if (result) {
            resolve(result);
          } else {
            resolve(false);
          }
        }
      );
    });
}

export default new UserModel();
