import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import expressSanitizer from "express-sanitizer";
import cookieSession from "cookie-session";
import passport from "passport";

require("./modules/v1/services/passport");
import mySqlConnection from "./modules/v1/services/mySQLConnection";

dotenv.load();
const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.SECRET_KEY]
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// app.use(expressSanitizer());

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   next();
// });

require("./modules/v1/login/routes/loginRoute")(app);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started ");
});
