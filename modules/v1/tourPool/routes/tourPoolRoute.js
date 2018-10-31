import express from "express";
import passport from "passport";
import TourPoolController from "../controllers/tourPoolController";

const router = express.Router();

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  TourPoolController.create
);

export default router;
