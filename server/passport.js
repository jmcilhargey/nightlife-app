"use strict";

var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var User = require("user.js");

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deSerializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_KEY,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackUrl: process.env.APP_URL + "auth/google/callback"
    },
    function(token, refreshToken, profile, done) {
        process.nextTick(function() {
           User.findOne({ "google.id": profile.id }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(err, user);
                } else {
                    var newUser = new User();
                    
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.github.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value;
                    
                    newUser.save(function(err) {
                        if (err) { throw err; }
                        
                        return done(null, newUser);
                    })
                }
           });
        });
    }));
};
