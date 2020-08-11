const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "200370789243-00sdlm6rkn2cuihfvc4lgs1t4e81lfpa.apps.googleusercontent.com",
    clientSecret: "n4PmudX3CLP_eD3j8Ixj8yFR",
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));