import passport from "passport";
import express from "express";
import LoginController from "../controllers/loginController";

const router = express.Router();

router.post("/register", LoginController.createUser);
router.post("/login", LoginController.login);
router.get(
  "/auth/google",
  passport.authenticate("googleToken", {
    session: false,
    scope: ["profile", "email"]
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("googleToken"),
  (req, res) => {
    console.log("Request body user", req.user);
    console.log("Request google access token ", req.user.accessToken);
    LoginController.login(req, res);
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

router.post("/forgot_password", LoginController.forgotPassword);

export default router;
