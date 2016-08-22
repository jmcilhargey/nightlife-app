"use strict";

function initMap() {

  	var styles = [
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
	        "featureType": "transit",
	        "elementType": "all",
	        "stylers": [
	            {
	                "color": "#CCFF90"
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

    var mapBounds = new google.maps.LatLngBounds(
        {
            "lat": 37.7745851,
            "lng": -121.9960835
        },        
        {
            "lat": 37.77975470000001,
            "lng": -121.977842
        }
    );

    var googleMap = new google.maps.Map(document.getElementById("map"), {
		"clickableIcons": true,
		"mapTypeId": "roadmap",
		"styles": styles,
		"zoom": 10
    });

    googleMap.fitBounds(mapBounds);

    googleMap.setCenter(mapBounds.getCenter());

    var wayPoints = [
        {
            "geocoder_status": "OK",
            "place_id": "ChIJN1iRXjKNj4AR51jBgfatf-E",
            "types": [
                "street_address"
            ]
        },
        {
            "geocoder_status": "OK",
            "partial_match": true,
            "place_id": "ChIJ01Z4TsTyj4AREhM6rUZwmFk",
            "types": [
                "premise"
            ]
        },
        {
            "geocoder_status": "OK",
            "place_id": "ChIJN1iRXjKNj4AR51jBgfatf-E",
            "types": [
                "street_address"
            ]
        }
    ];

	var pointCoords = [
		{
            "lat": 37.77958539999999,
            "lng": -121.977842
        },
		{
        "lat": 37.775585,
        "lng": -121.9960835
       	},
       	{
            "lat": 37.7750805,
            "lng": -121.9942434
        }
	];

    var pathPolyline = new google.maps.Polyline({
		path: getPathCoordinates(),
		geodesic: true,
		strokeColor: "#7C4DFF",
		strokeOpacity: 1.0,
		strokeWeight: 2
    });

    pathPolyline.setMap(googleMap);

    dropMarkers(wayPoints, pointCoords);

    function getPathCoordinates() {
	return google.maps.geometry.encoding.decodePath("k`qeFnjrgVt@iCVy@VsAAwA`Ba@AKq@cFKqAAkBM_C@eBNeCFgBTeBNgAD}AsAEcAKeAUcA[q@[e@WmAw@{@q@{@}@i@s@U[oAaCg@gAu@kBo@{A}@}Bg@sBUqCUeCIiBAeCAiM@gA\\Q]PAfA@hM@dCHhBTdCTpCf@rB|@|Bn@zAt@jBf@fAnA`CTZh@r@z@|@z@p@lAv@d@Vp@ZbAZdATbAJrADE|AOfAUdBGfBOdCAdBL~B@jBJpAp@bF@JaB`@@vAWrAWx@u@hC")
	}

	var marker;

	function dropMarkers(wayPoints, pointCoords) {
		for (var i = 0; i < wayPoints.length; i++) {
			setTimeout(function() {
				addMarker(wayPoints[i], pointCoords[i]);
			}, i * 250);
		}
	}

	function addMarker(wayPoint, pointCoord) {

		marker = new google.maps.Marker({
			map: googleMap,
			draggable: true,
			animation: google.maps.Animation.DROP,
			place: {
				location: pointCoord,
				placeId: wayPoint.place_id
			}
		});
	}
}


