import express from "express";
import passport from "passport";
import TourMatchController from "../controllers/tourMatchController";

const router = express.Router();

router.post(
  "/generate",
  passport.authenticate("jwt", { session: false }),
  TourMatchController.create
);

router.post(
  "/generateTourMatch",
  passport.authenticate("jwt", { session: false }),
  TourMatchController.createTourMatch
);

export default router;
