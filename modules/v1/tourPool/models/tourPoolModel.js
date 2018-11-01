import mySqlConnection from "../../services/mySQLConnection";
import logger from "../../../../lib/logger";

class TourPoolModel {
  createTourPool = parameters => {
    const query =
      "Call create_tour_pool(?,?,?,?,?,?,?,@teamName); SELECT @teamName AS teamName;";
    const dateTimeString = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const queryParameter = [
      parameters.poolName,
      parameters.poolGender,
      parameters.UserId,
      parameters.TournamentId,
      parameters.TourTeamId,
      dateTimeString,
      dateTimeString
    ];

    return new Promise((resolve, reject) => {
      const temp = mySqlConnection.query(
        query,
        queryParameter,
        (err, result) => {
          console.log("SQL createTourPool ", temp.sql);
          if (err) {
            logger.error("SQL createTourPool ", err);
            return resolve(false);
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

  /**Check for the team in TourPool table */

  checkTourPoolTeamExists = parameters => {
    const query = `SELECT tp.poolName,t.teamName,t.idTeam  FROM TourPool tp 
            JOIN TourTeam tt 
                ON tt.idTourTeam = tp.TourTeamId
            JOIN Team t
                ON 1=1 AND t.idTeam = tt.TeamId AND tp.TournamentId = ? AND tp.TourTeamId = ? AND tp.poolGender = ?`;
    const queryParameter = [
      parameters.TournamentId,
      parameters.TourTeamId,
      parameters.poolGender
    ];

    return new Promise((resolve, reject) => {
      const temp = mySqlConnection.query(
        query,
        queryParameter,
        (err, result) => {
          console.log("SQL checkTourPoolTeamExists: ", temp.sql);
          if (err) {
            logger.error("SQL checkTourPoolTeamExists Error: ", err);
            return resolve({ success: false, message: err });
          } else if (result && result.length > 0) {
            logger.info("SQL checkTourPoolTeamExists: ", result);
            return resolve({ success: true, data: result });
          } else {
            return resolve({ success: false, data: result });
          }
        }
      );
    });
  };

  /** */

  /**Display the tour pool team by pool name */
  getTourPoolTeamByName = parameters => {
    const query = `Call list_pool_team_by_poolName(?, ?, ?)`;
    const queryParameter = [
      parameters.poolName,
      parameters.TournamentId,
      parameters.Gender
    ];

    return new Promise((resolve, reject) => {
      const temp = mySqlConnection.query(
        query,
        queryParameter,
        (err, result) => {
          console.log("SQL getTourPoolTeamByName ", temp.sql);
          if (err) {
            logger.error("Error in getTourPoolTeamByName ", err);
            resolve(false);
          } else if (result && result.length > 0) {
            logger.info("Result getTourPoolTeamByName ", result);
            resolve({ success: true, result: result });
          } else {
            resolve(false);
          }
        }
      );
    });
  };

  /** */

  /**List Pool Teams in Tournament */
  getTourPoolTeams = parameters => {
    const query = `Call list_pool_team(?, ?)`;
    const queryParameter = [parameters.TournamentId, parameters.poolGender];

    return new Promise((resolve, reject) => {
      const temp = mySqlConnection.query(
        query,
        queryParameter,
        (err, result) => {
          console.log("SQL getTourPoolTeams ", temp.sql);
          if (err) {
            logger.error("Error in getTourPoolTeams ", err);
            resolve(false);
          } else if (result && result.length > 0) {
            logger.info("Result getTourPoolTeams ", result);
            resolve({ success: true, result: result });
          } else {
            resolve(false);
          }
        }
      );
    });
  };
}

export default new TourPoolModel();
