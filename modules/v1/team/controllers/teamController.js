import TeamModel from "../models/teamModel";
import logger from "../../../../lib/logger";

class TeamController {
  createTeam = async (req, res) => {
    const teamCreationResult = await TeamModel.createTeam(req.body);
    if (teamCreationResult) {
      logger.info("Team successfully created");
      return res.status(200).send({ success: true });
    } else {
      logger.error("Error in creating team");
      return res.send({ success: false, message: "Error in creating team" });
    }
  };

  listTeams = async (req, res) => {
    const teamList = await TeamModel.listTeam();
    if (teamList) {
      logger.info("Team list fetched successfully");
      return res.status(200).send({
        success: true,
        message: "List fetched successfully",
        data: teamList.result[0]
      });
    } else {
      logger.error("Error in listing the team");
      return res.send({ success: false, message: "Error in listing the team" });
    }
  };
}

export default new TeamController();
