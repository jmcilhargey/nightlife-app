"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var User = new Schema({
    google: {
        id: String,
        token: String,
        name: String,
        email: String
    },
    events: [
	    {
	    	business: String,
	    	address: String
	    }
    ]
}, { versionKey: false });

module.exports = mongoose.model("User", User);