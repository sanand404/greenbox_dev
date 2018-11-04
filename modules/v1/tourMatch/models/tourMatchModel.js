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
}

export default new TourMatchModel();
