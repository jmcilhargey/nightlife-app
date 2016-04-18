"use strict";

var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var session = require("express-session");
var passport = require("passport");
var Yelp = require("./yelp.js");
var yelpApi = new Yelp();
var Users = require("./user.js");
var Businesses = require("./business.js");

require("./passport.js")(passport);
var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + "/../client"));
app.use(session({
    secret: "nightlifeApp",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return false;
  }
}

app.get("/auth/google", passport.authenticate("google", { scope:["profile", "email"] }));

app.get("/auth/google/callback", passport
  .authenticate("google", { 
    successRedirect: "/",
    failureRedirect: "/"
  })
);

app.get("/auth/login", function(req, res) {
  if (req.user) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.get("/auth/logout", function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get("/api/search", function(req, res) {
  
  yelpApi.search(req.query.searchCity, req.query.sortBy).then(function(data) {

  res.json(data);
  });
});

app.get("/api/going", function(req, res) {
    
  Businesses.find({ "name": { $in: req.query.businessList } }, function(err, docs) {
    if (err) { throw err; }
    
    res.json(docs);
  });
});

app.get("/api/user", isLoggedIn, function(req, res) {
  res.json(req.user.google);
});

app.put("/api/join", isLoggedIn, function(req, res) {
  var found;
  
  Users.findOne({ "google.id" : req.user.google.id }, function(err, doc) {
    if (err) { throw err; }

    if (doc.events.indexOf(req.body.businessId) == -1) {
      found = false;
      Users.findOneAndUpdate({ "google.id": req.user.google.id }, { $push : { "events": req.body.businessId } }).exec("update");
    } else {
      found = true;
      Users.findOneAndUpdate({ "google.id": req.user.google.id }, { $pull : { "events": req.body.businessId } }).exec("update");
    }
  });
  
  Businesses.findOne({ "name": req.body.businessId }, function(err, doc) {
    if (err) { throw err; }
    
    if (doc) {
      if (found) {
        Businesses.findOneAndUpdate({ "name": req.body.businessId }, { $inc: { "count": -1 }, $pull: { "people": req.user.google.name } }).exec("update");
      } else {
        Businesses.findOneAndUpdate({ "name": req.body.businessId }, { $inc: { "count": 1 }, $push: { "people": req.user.google.name } }).exec("update");
      }
    } else {
      var newBusiness = new Businesses();
      newBusiness.name = req.body.businessId;
      newBusiness.count = 1;
      newBusiness.people = new Array(req.user.google.name);
      
      newBusiness.save(function(err) {
        if (err) { throw err; }
      });
    }
  });
  res.sendStatus(200);
});

app.listen(process.env.PORT, function() {
  console.log("Listening on port " + process.env.PORT);
});