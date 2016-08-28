(function() {

	"use strict";

	getUserData();

	function getUserData() {

		var request = new XMLHttpRequest();

		request.open("GET", "/api/user", true);

		request.onload = function() {

			if (request.status >= 200 && request.status < 400) {

				var data = JSON.parse(request.responseText);
				
				var form = document.getElementById("form");

				data.events.forEach(function(location, index) {

					var input = document.createElement("input");
					input.type = "checkbox";
					input.id = "box-" + index;
					input.name = location.business;
					input.value = location.address;
					form.appendChild(input);

					var label = document.createElement("label");
					label.setAttribute("for", "box-" + index);
					label.innerHTML = location.business;
					form.appendChild(label);

				});

				var submit = document.createElement("input");
				submit.type = "submit";
				submit.value = "Get Route";
				form.appendChild(submit);

				addSubmitListener(form);
			}
		}
		request.onerror = function() {
			console.log("Error: " + request.statusText);
		};
		request.send();
	}
	
	function addSubmitListener(form) {

		form.addEventListener("submit", function(event) {
			
			event.preventDefault();

			var inputs = document.getElementsByTagName("input");
			var formData = {};

			formData["eventLegs"] = {};

			Array.prototype.forEach.call(inputs, function(input) {

				if (input.id === "startAddress") {
					formData[input.id] = input.value;
				}

				if (input.name === "travelMethod" && input.checked) {
					formData[input.name] = input.value;
				}

				if (input.type === "checkbox" && input.checked) {
					formData["eventLegs"][input.value] = input.name;
				}
			});
			getDirectionData(formData);
		});
	}

	function getDirectionData(formData) {

		var request = new XMLHttpRequest();

		request.open("POST", "/api/directions", true);

		request.setRequestHeader("Content-Type", "application/json");

		request.onload = function() {

			if (request.status >= 200 && request.status < 400) {
				
				var directionsData = JSON.parse(request.responseText);

				initializeMap(directionsData, formData);
			} else {
				console.log("Error: " + request.status);
			}
		}
		request.send(JSON.stringify(formData));
	}

	function initializeMap(directionsData, formData) {

	    function getPathCoordinates() {
			return google.maps.geometry.encoding.decodePath(route.overview_polyline.points);
		}

		function getPointCoords() {
			return route.legs.map(function(leg) {
				return leg.end_location;
			});
		}

		function addMarker(address, location, i) {

			var marker = new google.maps.Marker({
				"map": googleMap,
				"draggable": true,
				"animation": google.maps.Animation.DROP,
				"place": {
					"location": location,
					"placeId": directionsData.geocoded_waypoints[i].place_id
				},
				"icon": {
					"url": "../images/purple-icon.png",
					"scaledSize": new google.maps.Size(48, 48),
					"labelOrigin": new google.maps.Point(23, 15)
				},
				"label": {
					"text": (i + 1).toString(),
					"color": "white",
					"fontSize": "20px",
					"fontWeight": "100"
				},

			});

			var infoWindow = new google.maps.InfoWindow();

			marker.addListener("click", (function(address, marker, i) {
				return function() {
					infoWindow.open(googleMap, marker);
					infoWindow.setContent(matchAddress(address) + "<p>" + address + "</p>");				
				}
			})(address, marker, i));
		}

		function dropMarkers() {

			route.legs.forEach(function(leg, i) {
				(function(i) {
					setTimeout(function() {
						addMarker(leg.end_address, leg.end_location, i);
					}, 250 * (i + 1));
				})(i);
			});
		}

		function matchAddress(address) {

			var street = address.slice(0, address.indexOf(","));

			if (formData.startAddress.indexOf(street) > -1) {
					return "<b>Starting Address</b><br>";
			};

			for (var key in formData.eventLegs) {

				if (key.indexOf(street) > -1) {
					return "<b>" + formData.eventLegs[key] + "</b><br>";
				}
			}
			return "";
		}

		var route = directionsData.routes[0];

	    var googleMap = new google.maps.Map(document.getElementById("map"), {
			"clickableIcons": true,
			"mapTypeId": "roadmap",
			"styles": loadStyles()
	    });

	    var mapBounds = new google.maps.LatLngBounds(route.bounds.southwest, route.bounds.northeast);

	    googleMap.fitBounds(mapBounds);
	    googleMap.setCenter(mapBounds.getCenter());

	    var pathPolyline = new google.maps.Polyline({
			"path": getPathCoordinates(),
			"geodesic": true,
			"strokeColor": "#7C4DFF",
			"strokeOpacity": 1.0,
			"strokeWeight": 3
	    });

	    pathPolyline.setMap(googleMap);

	    dropMarkers();

		function loadStyles() {
			return [
			    {
			        "featureType": "all",
			        "elementType": "labels.text.fill",
			        "stylers": [
			            {
			                "color": "#ffffff"
			            }
			        ]
			    },
			    {
			        "featureType": "all",
			        "elementType": "labels.text.stroke",
			        "stylers": [
			            {
			                "color": "#000000"
			            }
			        ]
			    },
			    {
			        "featureType": "administrative",
			        "elementType": "geometry.fill",
			        "stylers": [
			            {
			                "color": "#000000"
			            }
			        ]
			    },
			    {
			        "featureType": "administrative",
			        "elementType": "geometry.stroke",
			        "stylers": [
			            {
			                "color": "#1B5E20"
			            },
			            {
			                "weight": 1
			            }
			        ]
			    },
			    {
			        "featureType": "landscape",
			        "elementType": "all",
			        "stylers": [
			            {
			                "color": "#212121"
			            }
			        ]
			    },
			    {
			        "featureType": "poi",
			        "elementType": "geometry",
			        "stylers": [
			            {
			                "color": "#424242"
			            }
			        ]
			    },
			    {
			        "featureType": "road.highway",
			        "elementType": "geometry.fill",
			        "stylers": [
			            {
			                "color": "#000000"
			            }
			        ]
			    },
			    {
			        "featureType": "road.highway",
			        "elementType": "geometry.stroke",
			        "stylers": [
			            {
			                "color": "#B2FF59"
			            }
			        ]
			    },
			    {
			        "featureType": "road.arterial",
			        "elementType": "geometry.fill",
			        "stylers": [
			            {
			                "color": "#000000"
			            }
			        ]
			    },
			    {
			        "featureType": "road.arterial",
			        "elementType": "geometry.stroke",
			        "stylers": [
			            {
			                "color": "#33691E"
			            }
			        ]
			    },
			    {
			        "featureType": "road.local",
			        "elementType": "geometry",
			        "stylers": [
			            {
			                "color": "#000000"
			            }
			        ]
			    },
			    {
			        "featureType": "transit.line",
			        "elementType": "all",
			        "stylers": [
			            {
			                "color": "#CCFF90"
			            }
			        ]
			    },
			   	{
			        "featureType": "transit.station",
			        "elementType": "geometry",
			        "stylers": [
			            {
			                "color": "#424242"
			            }
			        ]
			    },
			    {
			        "featureType": "water",
			        "elementType": "all",
			        "stylers": [
			            {
			                "color": "#37474F"
			            }
			        ]
			    }
			];
		}
	}
})();
