import express from "express";
import passport from "passport";
import TourTeamController from "../controllers/tourTeamController";
import TourTeamValidation from "../validators/tourTeamValidation";

const router = express.Router();

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  TourTeamValidation.tourTeamValidation,
  TourTeamController.create
);

export default router;
