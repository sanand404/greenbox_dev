import passport from "passport";
import express from "express";
import LoginController from "../controllers/loginController";

const router = express.Router();

router.post("/register", LoginController.createUser);
router.post("/login", LoginController.login);
router.get(
  "/auth/google",
  passport.authenticate("googleToken", {
    scope: ["profile", "email"]
  }),
  (req, res) => {
    res.send("In google token");
  }
);
router.get(
  "/auth/google/callback",
  passport.authenticate("googleToken"),
  (req, res) => {
    res.send("Hey welocome");
  }
);

router.get(
  "/current_user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log("HEY ALMOST THERE");
    res.send(req.user);
  }
);

export default router;
