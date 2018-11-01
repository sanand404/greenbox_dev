import mySqlConnection from "../../services/mySQLConnection";
import logger from "../../../../lib/logger";

class TourMatchModel {
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
}

export default new TourMatchModel();
