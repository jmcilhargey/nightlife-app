"use strict";

var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var Yelp = require("./yelp.js");
var yelpApi = new Yelp();

require("dotenv").load();
var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + "/../client"));

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return ;
  }
}

mongoose.connect(process.env.MONGO_URI);

app.get("/search", function(req, res) {
  yelpApi.search("San Francisco", 0).then(function(err, data) {
    if (err) { console.log(err); }
    res.json(JSON.stringify(data));
  });
});

app.listen(process.env.PORT, function() {
  console.log("Listening on port " + process.env.PORT);
});