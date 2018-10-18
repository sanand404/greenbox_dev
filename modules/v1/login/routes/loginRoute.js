import passport from "passport";
import express from "express";
import LoginController from "../controllers/loginController";

const router = express.Router();

router.post("/register", LoginController.createUser);
router.post("/login", (req, res) => { });
router.post("/auth/google", passport.authenticate("googleToken", {
  scope: ["profile", "email"]
}), (req, res) => {
  res.send("In google token");
});
router.get("/auth/google/callback", passport.authenticate("googleToken"));

router.get("/current_user", (req, res) => {
  res.send(req.user);
});

export default router;