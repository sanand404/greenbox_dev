import Joi from "joi";
import logger from "../../../../lib/logger";

class TeamValidator {
  teamCreateValidation = (req, res, next) => {
    const teamCreateSchema = Joi.object().keys({
      teamFlag: Joi.string()
        .min(1)
        .required(),
      teamName: Joi.string()
        .min(1)
        .required(),
      teamCreatedAt: Joi.string()
    });

    Joi.validate(req.body, teamCreateSchema, (err, result) => {
      if (err) {
        logger.error("Error in teamCreate Validation ", err);
        return res.send({ success: false, error: "Error in valiation", err });
      }
      next();
    });
  };
}

export default new TeamValidator();
