import Joi from "joi";

class LoginValidation {
  loginValidation = (req, res, next) => {
    const loginValidationSchema = Joi.object().keys({
      emailId: Joi.string().email({ minDomainAtoms: 2 }),
      password: Joi.string()
        .min(4)
        .required(),
      provider: Joi.string()
        .valid("playsoftech", "google")
        .required()
    });

    Joi.validate(req.body, loginValidationSchema, (err, value) => {
      if (err) {
        console.log("Inside error", err);
        return res.status(400).send({
          success: false,
          error: err.details[0].message
        });
      }
      console.log("After err");
      next();
    });
  };

  registrationValidation = (req, res, next) => {
    const registrationValidationSchema = Joi.object().keys({
      firstName: Joi.string().regex(/^[A-Za-z]+$/),
      lastName: Joi.string().regex(/^[a-zA-Z]*$/),
      emailId: Joi.string().email({ minDomainAtoms: 2 }),
      password: Joi.string()
        .alphanum()
        .min(6)
        .required()
    });

    Joi.validate(req.body, registrationValidationSchema, (err, value) => {
      if (err) {
        return res.status(400).send({
          success: false,
          error: err.details[0].message
        });
      }
      next();
    });
  };

  forgotPasswordValidation = (req, res, next) => {
    const forgotPasswordValidationSchema = Joi.object().keys({
      emailId: Joi.string().email({ minDomainAtoms: 2 })
    });

    Joi.validate(req.body, forgotPasswordValidationSchema, (err, result) => {
      if (err) {
        return res.status(400).send({
          success: false,
          error: err.details[0].message
        });
      }
      next();
    });
  };
}

export default new LoginValidation();
