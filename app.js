const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const dotenv = require("dotenv");

dotenv.load();

const app = express();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    console.log('accesstoken: ',accessToken);
    console.log('refreshtoken: ',refreshToken);
    console.log('profile: ',profile);
}));

app.get('/auth/google', passport.authenticate('google', {
    scope : ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google'));

app.listen(process.env.PORT || 3000);