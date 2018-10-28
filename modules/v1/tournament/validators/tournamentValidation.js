import Joi from "joi";
import logger from "../../../../lib/logger";

class TournamentValidation {
  tournamentValidation = (req, res, next) => {
    const tournamentCreateSchema = Joi.object().keys({
      tournamentName: Joi.string().required(),
      tournamentOrgBy: Joi.string().required(),
      tournamentStartDate: Joi.date().required(),
      tournamentEndDate: Joi.date().required(),
      tournamentLogo: Joi.string(),
      tournamentVenue: Joi.string()
    });

    Joi.validate(req.body, tournamentCreateSchema, (err, result) => {
      if (err) {
        logger.info("tournamentValidation failed ", err);
        return res.send({ success: false, message: err });
      }
      next();
    });
  };
}

export default new TournamentValidation();
