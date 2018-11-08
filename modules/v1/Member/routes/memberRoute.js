import express from "express";
import passport from "passport";
const router = express.Router();

router.post("/register", passport.authenticate("jwt", { session: false }));

export default router;
