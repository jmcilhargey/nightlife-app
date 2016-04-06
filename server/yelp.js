"use strict";

var querystring = require("querystring")
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
    
    this.get = function(city, sort) {
        
        var baseUrl = "https://api.yelp.com/v2/search/";
        var options = {
            location: city,
            sort: sort,
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
            .get(baseUrl + "?" + querystring.stringify(options), process.env.YELP_TOKEN, process.env.YELP_TOKEN_SECRET, function(err, _data) {
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
