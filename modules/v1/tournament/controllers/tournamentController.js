import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import moment from "moment";
import TournamentModel from "../models/tournamentModel";
import logger from "../../../../lib/logger";

dotenv.load();

class TournamentController {
  //Creating tournament
  createTournament = async (req, res) => {
    if (req.headers && req.headers.authorization) {
      const authorization = req.headers.authorization;
      let decoded;
      try {
        decoded = jwt.verify(authorization, process.env.SECRET_KEY);
      } catch (e) {
        return res.status(401).send("unauthorized");
      }
      const userId = decoded.id;
      req.body.UserId = userId;

      const isValidDate = moment(req.body.tournamentStartDate).isSameOrBefore(
        req.body.tournamentEndDate
      );

      if (!isValidDate) {
        logger.info("Check the tournament date while creation in controller");
        return res.send({
          success: false,
          message: "Check the tournament dates"
        });
      }
      const touramentCreationResult = await TournamentModel.createTournament(
        req.body
      );
      if (touramentCreationResult) {
        logger.info("Tournament successfully created in controller");
        return res
          .status(200)
          .send({ success: true, message: "Tournament Created" });
      } else {
        logger.error("Error in Tournament creation");
        return res.send({
          success: false,
          message: "Error in tournament creation"
        });
      }
    }
    return res.status(500).send({ success: false, message: "Unauthorized" });
  };
}

export default new TournamentController();
