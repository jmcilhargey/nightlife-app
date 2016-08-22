"use strict";

var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var session = require("express-session");
var passport = require("passport");
var routes = require("./routes.js")

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

app.use("/", routes);

app.listen(process.env.PORT, function() {
  console.log("Listening on port " + process.env.PORT);
});