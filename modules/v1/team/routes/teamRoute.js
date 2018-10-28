import express from "express";
import passport from "passport";
import TeamController from "../controllers/teamController";
import TeamValidator from "../validators/teamValidator";

const router = express.Router();

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  TeamValidator.teamCreateValidation,
  TeamController.createTeam
);

export default router;
