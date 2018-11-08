import TourPlayerModel from "../models/tourPlayerModel";
import logger from "../../../../lib/logger";

class TourPlayerController {
  create = async (req, res) => {
    // Check the before add in the TourPlayer if not exist then add else throw the error
    let isPlayerExists;
    try {
      isPlayerExists = await TourPlayerModel.getTourPlayerById({
        TournamentId: req.body.tournamentId,
        MemberId: req.body.memberId
      });
    } catch (error) {
      logger.error(
        "Error in getTourPlayerById in tourPlayerController ",
        error
      );
      return res.status(400).send({ success: false, message: error });
    }

    console.log("IsPlayerExists ", isPlayerExists);
    if (isPlayerExists && isPlayerExists.result.length > 0) {
      // logger.info(``);
      return res
        .status(400)
        .send({ success: false, message: "Player already exists in team" });
    }
    req.body.UserId = req.user[0].idUser;
    let tourPlayerCreate;
    try {
      tourPlayerCreate = await TourPlayerModel.create(req.body);
    } catch (error) {
      logger.error("Error in create for tourPlayerController ", error);
      res.status(400).send({ success: false, message: error });
    }

    console.log("---------tourPlayerCreate ", tourPlayerCreate);
    return res.status(200).send({ success: true, message: "Adding........." });
  };
}

export default new TourPlayerController();
