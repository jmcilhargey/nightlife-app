"use strict";
require("dotenv").config();
var stringToUrl = require("./serialize.js");
var oauth = require("oauth");
var OAuth = oauth.OAuth;

var auth = new OAuth(
    null,
    null,
    process.env.YELP_KEY,
    process.env.YELP_SECRET,
    "1.0",
    null,
    "HMAC-SHA1"
    );
    
module.exports = function() {
    
    this.get = function(searchCity, sortBy) {
        
        var baseUrl = "https://api.yelp.com/v2/search/json";
        var options = {
            location: searchCity,
            sort: sortBy,
            limit: 20,
            category_filter: "nightlife"
        };
        
        var promise = new Promise(function(resolve, reject) {
            new OAuth(
                null,
                null,
                process.env.YELP_KEY,
                process.env.YELP_SECRET,
                "1.0",
                null,
                "HMAC-SHA1"
                )
            .get(baseUrl + "?" + stringToUrl(options), process.env.YELP_TOKEN, process.env.YELP_TOKEN_SECRET, function(err, _data) {
               if (err) { console.log(err); }
               var data = JSON.parse(_data);
               resolve(data);
            });
        });
        
        return promise;
    };
    
    this.search = function(city, sort) {
       return this.get(city, sort);
    };
};
