import express from "express";
import passport from "passport";
import TourPlayerController from "../controllers/tourPlayerController";

const router = express.Router();

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  TourPlayerController.create
);

export default router;
