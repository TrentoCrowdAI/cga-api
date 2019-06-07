/**
 * Server.js
 * @author Sara Callaioli <sara.callaioli@studenti.unitn.it> 
 * @author Giovanni Guadagnini <giovanni.guadagnini@studenti.unitn.it>
 */

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
// Import Google OAuth apps config
const {google} = require('./config');
const dbUser = require('./db/userQueries');

// Transform Google profile into user object 
const transformGoogleProfile = (profile) => {
    //console.log(profile);
    return ({
        name: profile.given_name,
        surname: profile.family_name,
        //avatar: profile.picture ? profile.picture : 'http://2.citynews-today.stgy.ovh/~media/original-hi/24353835697500/cane-12-10.jpg',
        id: profile.sub ? profile.sub : null,
    });
}
/*
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
*/
// Inzialize http server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/*
// Inzialize passport 
app.use(passport.initialize());
app.use(passport.session());

// Set up Google auth routes
app.get('/auth/google', passport.authenticate('google', {scope: ['profile'] }));

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/auth/google'}),(req, res) => {
  console.log(req.user);
  req.session.user = req.user;
  dbUser.createUser(req, res);
  //res.redirect("OAuthLogin://login?user=${JSON.stringify(req.user)}");
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
*/

app.get('/', function(req, res){
  res.json("Hello world");
});

// Initialising the APIs
var users = require("./controllers/apis/users.js");
var projects = require("./controllers/apis/projects.js");
var roles = require("./controllers/apis/roles.js");
var dataCollections = require("./controllers/apis/dataCollection.js");
var surveys = require("./controllers/apis/surveys.js");  
users.init(app);
projects.init(app);
roles.init(app);
dataCollections.init(app);
surveys.init(app);

module.exports = app;