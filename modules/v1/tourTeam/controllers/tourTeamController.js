import TourTeamModel from "../models/tourTeamModel";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.load();

class TourTeamController {
  create = async (req, res) => {
    if (req.headers && req.headers.authorization) {
      const authorization = req.headers.authorization;
      let decoded;
      try {
        decoded = jwt.verify(authorization, process.env.SECRET_KEY);
      } catch (err) {
        return res
          .status(401)
          .send({ success: false, msessage: "Unauthorized User" });
      }
      const userId = decoded.id;

      const tourTeamReponse = { success: [], faliure: [] };

      for (const tourTeamObj of req.body) {
        tourTeamObj.UserId = userId;
        console.log("Req ", tourTeamObj);
        const isTourTeamExists = await TourTeamModel.checkTourTeamExists(
          tourTeamObj
        );
        console.log("CheckTourTeam ", isTourTeamExists);

        if (!isTourTeamExists.success) {
          tourTeamReponse.faliure.push({
            success: false,
            message:
              isTourTeamExists.message[0].teamName.toUpperCase() +
              " already exists."
          });
        } else {
          const tourTeamResult = await TourTeamModel.create(tourTeamObj);
          console.log("TourTeamResult ", JSON.stringify(tourTeamResult));

          if (!tourTeamResult) {
            tourTeamReponse.faliure.push({
              success: false,
              message:
                tourTeamResult.result[1][0].teamName.toUpperCase() +
                " team already exists."
            });
          } else {
            tourTeamReponse.success.push({
              success: true,
              message:
                tourTeamResult.result[1][0].teamName.toUpperCase() +
                " team added successfully."
            });
          }
        }
      }

      return res.send({ response: tourTeamReponse });
    }
  };
}

export default new TourTeamController();
