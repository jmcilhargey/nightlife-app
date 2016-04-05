"use strict";

var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var session = require("express-session");
var passport = require("passport");
var Yelp = require("./yelp.js");
var yelpApi = new Yelp();

require("dotenv").load();
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
    res.redirect("/");
  }
}

app.get("/", function(req, res) {
  res.sendFile("index.html");
});

app.get("/search", function(req, res) {
  yelpApi.search(req.query.city, 0).then(function(data) {
    res.json(data);
  });
});

app.get("/auth/google", passport.authenticate("google", { scope:["profile", "email"] }));

app.get("/auth/google/callback", passport
  .authenticate("google", { 
    successRedirect: "/",
    failureRedirect: "/"
  }));

app.listen(process.env.PORT, function() {
  console.log("Listening on port " + process.env.PORT);
});