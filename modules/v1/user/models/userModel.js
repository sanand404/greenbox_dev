import mySqlConnection from "../../services/mySQLConnection";

class UserModel {
  getUserId = parameter =>
    new Promise((resolve, reject) => {
      const query = `SELECT * FROM User WHERE idUser = ?`;

      const queryParameters = [parameter];
      const temp = mySqlConnection.query(
        query,
        queryParameters,
        (err, result) => {
          //console.log("SQL: ",temp.sql);
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
      const query = `INSERT INTO User VALUES (?,?,?,?)`;
      const queryParameters = [
        parameter.idUser,
        parameter.firstName,
        parameter.lastName,
        parameter.emailId
      ];
      console.log("Inside add ", JSON.stringify(parameter));

      const temp = mySqlConnection.query(
        query,
        queryParameters,
        (err, result) => {
          console.log("SQL: ", temp.sql);
          if (err) {
            reject({ Error: "Error in creating User" });
          } else if (result) {
            resolve(result);
          } else {
            resolve(false);
          }
        }
      );
    });
}
module.exports = new UserModel();
//export default UserModel;
