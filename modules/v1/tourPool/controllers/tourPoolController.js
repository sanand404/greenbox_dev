import TourPoolModel from "../models/tourPoolModel";

class TourPoolController {
  create = async (req, res) => {
    const userId = req.user[0].idUser;

    const tourPoolReponse = { success: [], faliure: [] };

    for (const tourPoolObj of req.body) {
      tourPoolObj.UserId = userId;

      const isTourPoolTeamExists = await TourPoolModel.checkTourPoolTeamExists(
        tourPoolObj
      );

      if (isTourPoolTeamExists.success) {
        tourPoolReponse.faliure.push({
          success: false,
          message: `${isTourPoolTeamExists.data[0].teamName.toUpperCase()} exists in POOL ${
            isTourPoolTeamExists.data[0].poolName
          }`
        });
      } else {
        const tourPoolResult = await TourPoolModel.createTourPool(tourPoolObj);
        if (!tourPoolResult) {
          tourPoolReponse.faliure.push({
            success: false,
            message: `${tourPoolResult.result[1][0].teamName.toUpperCase()} already exists in POOL ${
              tourPoolObj.poolName
            }`
          });
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
    return res.send({ response: tourPoolReponse });
  };
}

export default new TourPoolController();
