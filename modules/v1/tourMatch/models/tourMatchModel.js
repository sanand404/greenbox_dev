import mySqlConnection from "../../services/mySQLConnection";
import logger from "../../../../lib/logger";

class TourMatchModel {
  createTempMatch = (parameters, teamPair) => {
    const query = "Call create_temp_match(?,?,?,?,?,?,?,?,?,?)";

    const dateTimeString = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const queryParameters = [
      teamPair.teamA,
      teamPair.teamB,
      parameters.poolGender,
      parameters.matchType,
      teamPair.poolName,
      dateTimeString,
      dateTimeString,
      dateTimeString,
      parameters.TournamentId,
      parameters.UserId
    ];

    return new Promise((resolve, reject) => {
      const temp = mySqlConnection.query(
        query,
        queryParameters,
        (err, result) => {
          console.log("SQL createTempMatch:: ", temp.sql);
          if (err) {
            logger.error("SQL createTempMatch Error", err);
            return resolve(false);
          } else if (result) {
            logger.info("SQL createTempMatch", result);
            return resolve(result);
          } else {
            return resolve(false);
          }
        }
      );
    });
  };

  createTourMatch = parameters => {
    const query = "Call create_tour_match(?,?,?,?,?,?,?,?,?,?)";

    const dateTimeString = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const queryParameters = [
      parameters.teamA,
      parameters.teamB,
      parameters.poolGender,
      parameters.matchType,
      parameters.poolName,
      dateTimeString,
      dateTimeString,
      dateTimeString,
      parameters.TournamentId,
      parameters.UserId
    ];

    return new Promise((resolve, reject) => {
      const temp = mySqlConnection.query(
        query,
        queryParameters,
        (err, result) => {
          console.log("SQL createTourMatch:: ", temp.sql);
          if (err) {
            logger.error("SQL createTourMatch Error", err);
            return reject({ success: false, message: err });
          } else if (result) {
            logger.info("SQL createTourMatch", result);
            return resolve(result);
          }
          return resolve(false);
        }
      );
    });
  };

  getTempMatch = parameters => {
    const query = `SELECT teamA, teamB, gender, matchType, abbrMatchType, poolName, TournamentId FROM TempMatch tm WHERE tm.TournamentId = ? AND gender = ? AND (matchType = ? || abbrMatchType = ?)`;

    const queryParameters = [
      parameters.TournamentId,
      parameters.gender,
      parameters.matchType,
      parameters.matchType
    ];

    return new Promise((resolve, reject) => {
      const temp = mySqlConnection.query(
        query,
        queryParameters,
        (err, result) => {
          console.log("Sql: getTempMatch ", temp.sql);
          if (err) {
            logger.error("Error in getTempMatch in tourMatchModel ", err);
            return reject({ success: false, message: err });
          } else if (result && result.length > 0) {
            logger.info("Success in getTempMatch in tourMatchModel ", result);
            return resolve({ success: true, result });
          }
          return resolve(false);
        }
      );
    });
  };
}

export default new TourMatchModel();
