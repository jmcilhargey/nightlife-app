"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var User = new Schema({
    github: {
        id: String,
        displayName: String,
        userName: String
    },
    events: [String]
});

module.exports = mongoose.model("User", User);