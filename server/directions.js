"use strict";
require("dotenv").config();

var https = require("https");
var stringToUrl = require("./serialize.js");

module.exports = function() {

	this.get = function(start, mode, waypoints) {

		var baseUrl = "https://maps.googleapis.com/maps/api/directions/json";

		var key = process.env.GOOGLE_MAPS_KEY;

		var options = {
			origin: start,
			destination: start,
			mode: mode,
			waypoints: waypoints,
			language: "english",
			units: "imperial",
			optimize: true,
			timeout: 1000
		};

		var promise = new Promise(function(resolve, reject) {

			https.get(baseUrl + "?" + stringToUrl(options), function(response) {

				response.on("error", function(error) {
					reject(error);
				});

				if (response.headers["content-type"] == "application/json; charset=UTF-8") {

					var data = "";

					response.on("data", function(chunk) {

						data += chunk;
					});

					response.on("end", function() {

						resolve({
							status: response.statusCode,
							headers: response.headers,
							json: JSON.parse(data)
						});
					});
				}
			});
		});
		return promise;
	}
}

