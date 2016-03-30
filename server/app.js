"use strict";

var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

require("dotenv").load();
var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + "/../client"));

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login")
  }
}

mongoose.connect(process.env.MONGO_URI);

app.get("/api/:search", function(req, res) {
    var url = "http://api.yelp.com/v2/"
})

app.listen(process.env.PORT, function() {
  console.log("Listening on port " + process.env.PORT);
});