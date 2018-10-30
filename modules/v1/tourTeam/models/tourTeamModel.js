import mySqlConnection from "../../services/mySQLConnection";
import logger from "../../../../lib/logger";

class TourTeamModel {
  /**To create tournament team */

  create = parameters => {
    const query =
      "Call create_tour_team(?,?,?,?,?,@teamName); SELECT @teamName AS teamName;";
    const dateTimeString = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const queryParameter = [
      parameters.TeamId,
      parameters.TournamentId,
      parameters.UserId,
      dateTimeString,
      parameters.teamGender
    ];

    return new Promise((resolve, reject) => {
      const temp = mySqlConnection.query(
        query,
        queryParameter,
        (err, result) => {
          console.log("SQL: ", temp.sql);
          if (err) {
            logger.info("Error in creating tourTeam ", err);
            return reject({ Error: "Error in creating tourTeam", err });
          } else if (result) {
            return resolve({
              success: true,
              result: result
            });
          } else {
            return resolve(false);
          }
        }
      );
    });
  };

  /**Check for tournament team before add */
  checkTourTeamExists = parameters => {
    const query = `SELECT idTourTeam, teamName FROM TourTeam tt 
    JOIN Team t 
      ON t.idTeam = tt.TeamId AND tt.TeamId = ? AND tt.TournamentId = ? AND tt.teamGender = ?`;

    const queryParameter = [
      parameters.TeamId,
      parameters.TournamentId,
      parameters.teamGender
    ];

    return new Promise((resolve, reject) => {
      const temp = mySqlConnection.query(
        query,
        queryParameter,
        (err, result) => {
          console.log("SQL checkTourTeamExists: ", temp.sql);
          console.log("Result ", result);

          if (err) {
            logger.error("Error in checkTourTeamExists ", err);
            return resolve({ success: false, message: err });
          } else if (result && result.length > 0) {
            console.log("Result ", result);
            return resolve({ success: false, message: result });
          }
          return resolve({ success: true, message: result });
        }
      );
    });
  };
}

export default new TourTeamModel();
