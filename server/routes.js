
"use strict";

var fs = require("fs");

var router = require("express").Router();
var passport = require("passport");
var Yelp = require("./yelp.js");
var yelpApi = new Yelp();
var GoogleMaps = require("./gmaps.js");
var googleApi = new GoogleMaps();
var Users = require("./user.js");
var Businesses = require("./business.js");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return false;
  }
}

router.get("/auth/google", passport.authenticate("google", { scope:["profile", "email"] }));

router.get("/auth/google/callback", passport
  .authenticate("google", { 
    successRedirect: "/",
    failureRedirect: "/"
  })
);

router.get("/auth/login", function(req, res) {
  if (req.user) {
    res.send(true);
  } else {
    res.send(false);
  }
});

router.get("/auth/logout", function (req, res) {
  req.logout();
  res.redirect('/');
});

router.get("/api/search", function(req, res) {
  
  yelpApi.search(req.query.searchCity, req.query.sortBy).then(function(data) {

  res.json(data);
  });
});

router.get("/api/going", function(req, res) {

  Businesses.find({ "name": { $in: req.query.businessList } }, function(err, docs) {
    if (err) { throw err; }

    res.json(docs);
  });
});

router.get("/api/user", isLoggedIn, function(req, res) {
  res.json(req.user);
});

router.put("/api/join", isLoggedIn, function(req, res) {
  
  Users.findOne({ "google.id" : req.user.google.id }, function(err, doc) {

    if (err) { throw err; }

    var found = false;

    doc.events.forEach(function(event) {

      if (event.business === req.body.businessName) {
        found = true;
      }
    });

    if (found) {
      Users.findOneAndUpdate({ "google.id": req.user.google.id }, { $pull : { "events": { "business": req.body.businessName, "address": req.body.businessAddress } } }).exec("update");
    } else {
      Users.findOneAndUpdate({ "google.id": req.user.google.id }, { $push : { "events": { "business": req.body.businessName, "address": req.body.businessAddress } } }).exec("update");
    }

    Businesses.findOne({ "name": req.body.businessName }, function(err, doc) {

      if (err) { throw err; }
      
      if (doc) {
        if (found) {
          Businesses.findOneAndUpdate({ "name": req.body.businessName }, { $inc: { "count": -1 }, $pull: { "people": req.user.google.name } }).exec("update");
        } else {
          Businesses.findOneAndUpdate({ "name": req.body.businessName }, { $inc: { "count": 1 }, $push: { "people": req.user.google.name } }).exec("update");
        }
      } else {

        var newBusiness = new Businesses();

        newBusiness.name = req.body.businessName;
        newBusiness.count = 1;
        newBusiness.people = new Array(req.user.google.name);
        newBusiness.save(function(err) {
          if (err) { throw err; }
        });
      }
    });
  });
  res.sendStatus(200);
});

router.post("/api/directions", isLoggedIn, function(req, res) {

  console.log(req.body);

  var wayPoints = Object.keys(req.body).join("|");

  googleApi.get("2640 Steiner Street, San Francisco, CA", "walking", wayPoints)
    .then(function(value) {
      res.json(value.json);

    }, function(reason) {
      res.json(reason); });
});

module.exports = router;





