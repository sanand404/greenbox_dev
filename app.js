import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import passport from "passport";
import morgan from "morgan";

import loginRoute from "./modules/v1/login/routes/loginRoute";
import tournamentRoute from "./modules/v1/tournament/routes/tournamentRoute";
import teamRoute from "./modules/v1/team/routes/teamRoute";
import tourTeamRoute from "./modules/v1/tourTeam/routes/tourTeamRoute";
import tourPoolRoute from "./modules/v1/tourPool/routes/tourPoolRoute";
import tourMatchRoute from "./modules/v1/tourMatch/routes/tourMatchRoute";

require("./modules/v1/services/passport");

dotenv.load();
const app = express();

app.use(morgan("dev"));
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.SECRET_KEY]
  })
);

//Middlewares
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

//Routes
app.use("/", loginRoute);
app.use("/tournament", tournamentRoute);
app.use("/team", teamRoute);
app.use("/tourteam", tourTeamRoute);
app.use("/tourpool", tourPoolRoute);
app.use("/tourmatch", tourMatchRoute);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port ", process.env.PORT);
});
