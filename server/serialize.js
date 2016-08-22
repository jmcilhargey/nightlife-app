"use strict";

module.exports = function(object) {

	var components = [];

	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			components.push(encodeURIComponent(key) + "=" + encodeURIComponent(object[key]));
		}
	}
	return components.join("&");
}