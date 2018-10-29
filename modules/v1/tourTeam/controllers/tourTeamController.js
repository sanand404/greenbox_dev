import TourTeamModel from "../models/tourTeamModel";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.load();

class TourTeamController {
  create = (req, res) => {
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
      req.body.UserId = userId;
      TourTeamModel.create(req.body);
    }
  };
}

export default new TourTeamController();
