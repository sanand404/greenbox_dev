import Joi from "joi";
import logger from "../../../../lib/logger";
import postalCodes from "postal-codes-js";
import _ from "lodash";

class MemberValidation {
  memberValidation = (req, res, next) => {
    const memberValidationSchema = Joi.object().keys({
      firstName: Joi.string()
        .min(1)
        .required(),
      middleName: Joi.string().allow(""),
      lastName: Joi.string().allow(null),
      dob: Joi.date().required(),
      emailId: Joi.string()
        .email({ minDomainAtoms: 2 })
        .required(),
      phoneNo: Joi.number().required(),
      gender: Joi.string().required(),
      address1: Joi.string().required(),
      address2: Joi.string(),
      address3: Joi.string(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      pincode: Joi.number()
        .min(6)
        .required()
    });

    const postalCodeValid = postalCodes.validate("IN", req.body.pincode);
    if (_.includes(postalCodeValid, "not valid")) {
      logger.error("Error in memberValidation for pincode");
      return res
        .status(400)
        .send({ success: false, message: "Error in pin code" });
    }

    Joi.validate(req.body, memberValidationSchema, (err, result) => {
      if (err) {
        logger.error("Error in memberValidation", err);
        return res.status(400).send({ success: false, message: err });
      }
      next();
    });
  };
}

export default new MemberValidation();
