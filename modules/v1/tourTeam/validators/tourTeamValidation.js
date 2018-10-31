import Joi from "joi";
import logger from "../../../../lib/logger";

class TourTeamValidation {
  tourTeamValidation = (req, res, next) => {
    const tourTeamSchema = Joi.object().keys({
      TeamId: Joi.number()
        .integer()
        .required(),
      TournamentId: Joi.number()
        .integer()
        .required(),
      teamGender: Joi.string()
        .valid("MALE", "FEMALE", "TRANSGENDER")
        .required()
    });

    tourTeamSchema.validate(req.body, { abortEarly: false }, (err, result) => {
      if (err) {
        logger.info("tourTeamValidation failed ", err);
        return res.send({ success: false, message: "Validation error " + err });
      }
      next();
    });
  };
}

export default new TourTeamValidation();
