import express from "express";
import passport from "passport";
import TournamentController from "../controllers/tournamentController";
import TournamentValidator from "../validators/tournamentValidation";

const router = express.Router();

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  TournamentValidator.tournamentValidation,
  TournamentController.createTournament
);

export default router;
