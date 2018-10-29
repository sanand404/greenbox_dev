import mySqlConnection from "../../services/mySQLConnection";
import logger from "../../../../lib/logger";

class TeamModel {
  createTeam = parameters => {
    const query = `Call create_team(?,?,?,?,?)`;
    const dateTime = new Date();
    const dateTimeString = dateTime
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const queryParameter = [
      parameters.temaFlag,
      parameters.teamName,
      dateTimeString,
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

  getTeamByName = parameters => {
    const query = `SELECT teamName FROM Team WHERE teamName = ?`;
    const queryParameter = [parameters.teamName];

    return new Promise((resolve, reject) => {
      const temp = mySqlConnection.query(
        query,
        queryParameter,
        (err, result) => {
          console.log("SQL: getTeamByName ", temp.sql, result);
          if (err) {
            logger.error("Error in getTeamByName ", err);
            return reject(false);
          } else if (result && result.length > 0) {
            logger.info("getTeamByName ", result);
            return resolve(true);
          } else {
            return resolve(false);
          }
        }
      );
    });
  };

  listTeam = () => {
    const query = `Call list_teams()`;

    return new Promise((resolve, reject) => {
      const temp = mySqlConnection.query(query, (err, result) => {
        console.log("SQL: ", temp.sql);
        if (err) {
          logger.error("Error in listing the team");
          return reject(false);
        } else if (result) {
          logger.info("Team listed successfully");
          return resolve({ success: true, result: result });
        } else {
          return resolve(false);
        }
      });
    });
  };
}

export default new TeamModel();
