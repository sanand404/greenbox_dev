import passport from "passport";
const JWTStrategy = require("passport-jwt").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
//import { ExtractJWT } from "passport-jwt";

import dotenv from "dotenv";
import UserModel from "../user/models/userModel";
import userModel from "../user/models/userModel";

dotenv.load();

passport.serializeUser((user, done) => {
  console.log("In serialize ", JSON.stringify(user));
  console.log("-------Type of ", user.length);
  //console.log(" ID ", user.idUser);
  if (user.length === undefined) {
    console.log("In undefined ");
    done(null, user.idUser);
  } else {
    done(null, user[0].idUser);
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
      console.log("profile: ", profile._json);

      const User = await UserModel.getUserId(profile.emails[0].value);
      if (!User) {
        console.log("-----------Creating new user");
        const newUser = await UserModel.addUser({
          idUser: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          emailId: profile.emails[0].value,
          password: "",
          domain: profile._json.domain
        });
        console.log("------------New User created ", newUser);
        if (newUser) {
          console.log("--------------Sending response", newUser.data);
          done(null, newUser.data);
        } else {
          done(null, false);
        }
      } else {
        console.log("------------User already exists ", User);
        done(null, User);
      }

      // UserModel.getUserId(profile.emails[0].value)
      //   .then(existingUser => {
      //     console.log("Successfull ", existingUser);

      //     if (!existingUser) {
      //       UserModel.addUser({
      //         idUser: profile.id,
      //         firstName: profile.name.givenName,
      //         lastName: profile.name.familyName,
      //         emailId: profile.emails[0].value,
      //         password: "",
      //         domain: profile._json.domain
      //       }).then(user => {
      //         done(null, user);
      //       });
      //     } else {
      //       done(null, existingUser);
      //     }
      //   })
      //   .catch(err => {
      //     console.log("Inside catch ", err);
      //   });
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
      UserModel.getUserId(payload.emailId).then(user => {
        console.log("Passport User ", user);
        if (user) {
          done(null, user);
        } else {
          return done(null, false);
        }
      });
    }
  )
);
