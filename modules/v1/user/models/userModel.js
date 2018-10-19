import mySqlConnection from "../../services/mySQLConnection";

class UserModel {
  getUserByDomain = parameters => {
    return new Promise((resolve, reject) => {
      const query = `SELECT firstName, lastName, emailId, password, domain FROM User WHERE emailId = ? AND domain = ?`;
      const queryParameters = [parameters.emailId, parameters.domain];

      const temp = mySqlConnection.query(
        query,
        queryParameters,
        (err, result) => {
          console.log("sql getUserByDomain :", temp.sql);
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

  getUserByEmailId = parameters => {
    return new Promise((resolve, reject) => {
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
      const query = `SELECT idUser, firstName, lastName, emailId, domain  FROM User WHERE emailId = ? AND domain = ?`;

      const queryParameters = [parameters.emailId, parameters.domain];
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
      const query = `INSERT INTO User VALUES (?,?,?,?,?,?)`;
      const queryParameters = [
        idUser,
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
            resolve({
              result: result,
              data: { idUser: idUser, emailId: parameter.emailId }
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
