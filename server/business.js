"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Business = new Schema({
    name: String,
    count: Number,
    people: [String]
}, { versionKey: false });

module.exports = mongoose.model("Business", Business);