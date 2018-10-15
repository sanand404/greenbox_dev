import passport from "passport";
const GoogleStrategy = require("passport-google-oauth20").Strategy;
import dotenv from "dotenv";
import UserModel from "../user/models/userModel";

dotenv.load();

passport.serializeUser((user, done) => {
  console.log("In serialize ", JSON.stringify(user), " ID ", user[0].idUser);
  done(null, user[0].idUser);
});

passport.deserializeUser((idUser, done) => {
  console.log("In deserial ", idUser);
  UserModel.getUserId(idUser).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
      // proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("accesstoken: ", accessToken);
      console.log("refreshtoken: ", refreshToken);
      console.log("profile: ", profile._json);

      UserModel.getUserId(profile.id)
        .then(existingUser => {
          console.log("Successfull ", existingUser);

          if (!existingUser) {
            console.log("In Add", profile.emails[0]);
            UserModel.addUser({
              id: profile.id,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              emailId: profile.emails[0].value
            }).then(user => {
              done(null, user);
            });
          } else {
            done(null, existingUser);
          }
        })
        .catch(err => {
          console.log("Inside catch ", err);
        });
    }
  )
);
