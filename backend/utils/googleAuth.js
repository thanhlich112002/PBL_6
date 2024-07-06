const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
const appError = require("./appError");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      prompt: "select_account",
    },
    async function(request, accesstoken, refreshtoken, profile, done) {
      await User.findOne({ email: profile.emails[0].value }, function(
        err,
        user
      ) {
        if (err) return done(err);
        if (user) {
          request.user = user;
          return done(null, user);
        } else {
          return done(new appError("Your account does not exist"));
        }
      });
    }
  )
);

passport.serializeUser(function(profile, done) {
  done(null, profile);
});

passport.deserializeUser(function(id, done) {
  done(null, id);
});
