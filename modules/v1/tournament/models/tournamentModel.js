import mySqlConnection from "../../services/mySQLConnection";
import logger from "../../../../lib/logger";

class TournamentModel {
  createTournament = parameters => {
    return new Promise((resolve, reject) => {
      // const query = `INSERT INTO Tournament VALUES(?,?,?,?,?,?,?,?)`;
      const query = `Call create_tournament(?,?,?,?,?,?,?)`;
      // const idTournament = Math.floor(new Date() / 10);
      const queryParameters = [
        //idTournament,
        parameters.tournamentName,
        parameters.tournamentOrgBy,
        parameters.tournamentStartDate,
        parameters.tournamentEndDate,
        parameters.tournamentLogo,
        parameters.tournamentVenue,
        parameters.UserId
      ];

      console.log("Tournament creation parameter ", queryParameters);
      const temp = mySqlConnection.query(
        query,
        queryParameters,
        (err, result) => {
          console.log("SQL: ", temp.sql);
          if (err) {
            logger.info("Error in crearing tournament ", err);
            reject({ Error: "Error in creating tournament", err });
          } else if (result) {
            resolve({
              success: true,
              result: result
            });
          } else {
            resolve(false);
          }
        }
      );
    });
  };
}
export default new TournamentModel();
