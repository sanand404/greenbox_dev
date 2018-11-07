import TourPoolModel from "../models/tourPoolModel";
import _ from "lodash";
import logger from "../../../../lib/logger";

class TourPoolController {
  /** Create the TourPool */

  create = async (req, res) => {
    const userId = req.user[0].idUser;

    const tourPoolReponse = { success: [], faliure: [] };

    for (const tourPoolObj of req.body) {
      tourPoolObj.UserId = userId;
      let isTourPoolTeamExists;
      try {
        isTourPoolTeamExists = await TourPoolModel.checkTourPoolTeamExists(
          tourPoolObj
        );
      } catch (error) {
        console.log(
          "Error in checkTourPoolTeamExists in tourPoolCOntroller ",
          error
        );
        res.status(400).send({ success: false, message: error });
      }

      if (isTourPoolTeamExists.success) {
        tourPoolReponse.faliure.push({
          success: false,
          message: `${isTourPoolTeamExists.data[0].teamName.toUpperCase()} exists in POOL ${
            isTourPoolTeamExists.data[0].poolName
          }`
        });
      } else {
        let tourPoolResult;
        try {
          tourPoolResult = await TourPoolModel.createTourPool(tourPoolObj);
        } catch (error) {
          console.log("Error in createTourPool in tourPoolController ", error);
          res.status(400).send({ success: false, message: error });
        }

        if (!tourPoolResult) {
          if (tourPoolResult.result) {
            tourPoolReponse.faliure.push({
              success: false,
              message: `${tourPoolResult.result[1][0].teamName.toUpperCase()} already exists in POOL ${
                tourPoolObj.poolName
              }`
            });
          } else {
            tourPoolReponse.faliure.push({
              success: false,
              message: `Register team in Tournament before add in POOL ${
                tourPoolObj.poolName
              }`
            });
          }
        } else {
          tourPoolReponse.success.push({
            success: true,
            message: `${tourPoolResult.result[1][0].teamName.toUpperCase()} added successfully in POOL ${
              tourPoolObj.poolName
            }`
          });
        }
      }
    }
    return res.status(200).send({ success: true, response: tourPoolReponse });
  };

  /** List the pool Team on Tournament and Gender */
  listTourPoolTeam = async (req, res) => {
    const TournamentId = req.params.tournamentId;
    const poolGender = req.params.gender;
    let tourPoolResult;
    try {
      tourPoolResult = await TourPoolModel.getTourPoolTeams({
        TournamentId: TournamentId,
        poolGender: poolGender
      });
    } catch (error) {
      console.log("Error in listTourPoolTeam in tourPoolController ", error);
      return res.status(400).send({ success: false, message: error });
    }
    if (!tourPoolResult) {
      logger.error("Error listTourPoolTeam :", tourPoolResult);
      res.send({ success: false, data: tourPoolResult });
    } else {
      logger.info("listTourPoolTeam Result ", tourPoolResult);

      const tourPoolTeamResponse = {};
      if (tourPoolResult.result && tourPoolResult.result[0]) {
        const groupPool = _.groupBy(tourPoolResult.result[0], "poolName");

        _.map(groupPool, (values, keys) => {
          tourPoolTeamResponse[keys] = tourPoolTeamResponse[keys] || [];
          values.forEach(team => {
            tourPoolTeamResponse[keys].push(team);
          });
        });
      }
      res.send({ success: true, data: tourPoolTeamResponse });
    }
  };
}

export default new TourPoolController();
