import mySqlConnection from "../../services/mySQLConnection";
import logger from "../../../../lib/logger";

class TeamModel {
  createTeam = parameters => {
    const query = `Call create_team(?,?,?,?)`;
    const dateTime = new Date();
    const dateTimeString = dateTime
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const queryParameter = [
      parameters.temaFlag,
      parameters.teamName,
      dateTimeString,
      1
    ];

    return new Promise((resolve, reject) => {
      mySqlConnection.query(query, queryParameter, (err, result) => {
        if (err) {
          logger.error("Error in creating team ", err);
          return reject(false);
        } else if (result) {
          logger.info("Team created ", result);
          return resolve(true);
        } else {
          return resolve(false);
        }
      });
    });
  };
}

export default new TeamModel();
