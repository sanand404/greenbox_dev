import mySqlConnection from "../../services/mySQLConnection";
import logger from "../../../../lib/logger";

class TourPlayerModel {
  create = parameters => {
    const dateTimeString = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const query = `Call create_tour_player(?,?,?,?,?,?)`;
    const queryParameters = [
      parameters.memberId,
      parameters.tournamentId,
      parameters.tourTeamId,
      dateTimeString,
      dateTimeString,
      parameters.UserId
    ];

    return new Promise((resolve, reject) => {
      const temp = mySqlConnection.query(
        query,
        queryParameters,
        (err, result) => {
          console.log("SQL create tourPlayer ", temp.sql);
          if (err) {
            logger.error("Error in create in tourPlayerModel ", err);
            return reject({ success: false, message: err });
          }
          return resolve(true);
        }
      );
    });
  };

  getTourPlayerById = parameters => {
    const query = `SELECT MemberId, TourTeamId FROM TourPlayer WHERE TournamentId = ? AND MemberId = ?`;

    const queryParameters = [parameters.TournamentId, parameters.MemberId];

    return new Promise((resolve, reject) => {
      const temp = mySqlConnection.query(
        query,
        queryParameters,
        (err, result) => {
          console.log("SQL: getTourPlayerById ", temp.sql);
          if (err) {
            logger.error("Error in getTourPlayerById ", err);
            return reject({ success: false, message: err });
          } else if (result && result.length > 0) {
            return resolve({ success: true, result });
          }
          return resolve(false);
        }
      );
    });
  };
}

export default new TourPlayerModel();
