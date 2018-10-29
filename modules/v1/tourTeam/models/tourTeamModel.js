import mySqlConnection from "../../services/mySQLConnection";
import logger from "../../../../lib/logger";

class TourTeamModel {
  create = parameters => {
    const query = "Call create_tour_team(?,?,?,?,?)";
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
              result: result,
              data: {
                idUser: idUser,
                emailId: parameter.emailId,
                provider: parameter.provider
              }
            });
          } else {
            return resolve(false);
          }
        }
      );
    });
  };
}

export default new TourTeamModel();
