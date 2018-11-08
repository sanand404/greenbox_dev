import express from "express";
import passport from "passport";
import MemberController from "../controllers/memberController";
import MemberValidation from "../validations/memberValidation";
const router = express.Router();

router.post(
  "/register",
  passport.authenticate("jwt", { session: false }),
  MemberValidation.memberValidation,
  MemberController.create
);

export default router;
