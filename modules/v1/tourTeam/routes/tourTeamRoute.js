import express from "express";
import passport from "passport";
import TourTeamController from "../controllers/tourTeamController";

const router = express.Router();

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  TourTeamController.create
);

export default router;
