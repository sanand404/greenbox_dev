import TourPoolModel from "../../tourPool/models/tourPoolModel";
import lodash from "lodash";

class TourMatchController {
  create = async (req, res) => {
    const parameters = {
      TournamentId: req.body.TournamentId,
      poolGender: req.body.poolGender
    };
    const tourPoolResult = await TourPoolModel.getTourPoolTeams(parameters);

    if (
      !tourPoolResult ||
      (tourPoolResult && tourPoolResult.result[0].length == 0)
    ) {
      return res.send({ success: true, message: "No team found " });
    } else {
      console.log("TourResult is ", tourPoolResult);

      return res.status(200).send({ success: true, data: tourPoolResult });
    }
  };
}

export default new TourMatchController();
