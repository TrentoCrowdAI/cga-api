/**
 * Server.js
 * @author Sara Callaioli <sara.callaioli@studenti.unitn.it> 
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
// Import Google OAuth apps config
const {google} = require('./config');

// Transform Google profile into user object 
const transformGoogleProfile = (profile) => {
    // console.log(profile);
    return ({
        name: profile.name,
        avatar: profile.picture ? profile.picture : 'http://2.citynews-today.stgy.ovh/~media/original-hi/24353835697500/cane-12-10.jpg',
        id: profile.sub ? profile.sub : null,
    });
}

// Make sure that the request is sent by an authorized user
const isLoggedIn = (req, res, next) => {
  console.log(req.session);
  if (req.session && req.session.user !== undefined) {
    next();
  } else {
    res.status(400).json('User not authenticated');
  }
} 

// Register Google Passport strategy 
passport.use(new GoogleStrategy(google, 
    // Gets called when user authorizes access to their profile
    async(accessToken, refreshToken, profile, done)
        // Return done callback and pass transformed user object
        => done(null, transformGoogleProfile(profile._json))
));

// Serialize user into the sessions
passport.serializeUser((user, done) => done(null, user));

// Desrialize user from the sessions
passport.deserializeUser((user, done) => done(null,user));

// Inzialize http server
const app = express();

// Inzialize passport 
app.use(passport.initialize());
app.use(passport.session());

// Set up Google auth routes
app.get('/auth/google', passport.authenticate('google', {scope: ['profile'] }));

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/auth/google'}),(req, res) => {
  console.log(req.user);
  req.session.user = req.user;
  res.redirect(`OAuthLogin://login?user=${JSON.stringify(req.user)}`)
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// Initialising the APIs
var users = require("./users");
var projects = require("./projects");
users.init(app);
projects.init(app);

//Launch the server on port 3000
const server = app.listen(3000, () => {
  const { address, port } = server.address();
  console.log('Listening at http://localhost:' + port);
});