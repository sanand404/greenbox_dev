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
}

export default new TeamController();
