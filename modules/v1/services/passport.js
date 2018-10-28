import passport from "passport";
const JWTStrategy = require("passport-jwt").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
//import { ExtractJWT } from "passport-jwt";
import logger from "../../../lib/logger";

import dotenv from "dotenv";
import UserModel from "../user/models/userModel";

dotenv.load();

passport.serializeUser((googleObj, done) => {
  console.log("In serialize ", JSON.stringify(googleObj));

  //console.log(" ID ", user.idUser);
  if (googleObj.user.length === undefined) {
    done(null, googleObj.user.idUser);
  } else {
    done(null, googleObj.user[0].idUser);
  }
});

passport.deserializeUser((idUser, done) => {
  console.log("In deserial ", idUser);
  UserModel.getUserId(idUser).then(user => {
    done(null, user);
  });
});

passport.use(
  "googleToken",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
      // proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("accesstoken: ", accessToken);
      console.log("refreshtoken: ", refreshToken);
      console.log("profile: ", profile);

      const User = await UserModel.getUserId({
        emailId: profile.emails[0].value,
        provider: profile.provider
      });
      if (!User) {
        console.log("-----------Creating new user");
        logger.info("-----------Creating new user");
        const newUser = await UserModel.addUser({
          idUser: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          emailId: profile.emails[0].value,
          password: "",
          provider: profile.provider
        });
        console.log("------------New User created ", newUser);
        logger.info("------------New User created ", newUser);
        if (newUser) {
          console.log("--------------Sending response", newUser.data);
          logger.info("--------------Sending response", newUser.data);
          done(null, { user: newUser.data, accessToken: accessToken });
        } else {
          done(null, false);
        }
      } else {
        console.log("------------User already exists ", User);
        logger.info("------------User already exists ", User);
        done(null, { user: User, accessToken: accessToken });
      }
    }
  )
);

//JWT Strategy
passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromHeader("authorization"),
      secretOrKey: process.env.SECRET_KEY
    },
    (payload, done) => {
      console.log("Payload in passport ", payload);
      logger.info("Payload in passport ", payload);
      UserModel.getUserId({
        emailId: payload.emailId,
        provider: payload.provider
      }).then(user => {
        console.log("Passport User ", user);
        logger.info("Passport User ", user);
        if (user && user[0].isActive == 1) {
          delete user.password;
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }
  )
);
