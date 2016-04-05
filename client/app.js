(function() {
    
"use strict";

angular.module("nightlifeApp", ["ngRoute"])
    
    .factory("Search", ["$http", function($http) {
        return {
            find: function(entered) {
                return $http({
                    method: "GET",
                    url: "/search",
                    params: { city: entered }
                });
            }
        };
    }])
    
    .controller("HomeController", ["$scope", "Search", function($scope, Search) {
        
        $scope.newSearch = function() {
            Search.find($scope.city).success(function(data) {
               $scope.results = data; 
            });
            
        };
    }])
    
    .config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "home.html",
                controller: "HomeController"
            })
            .when("/search", {
                templateUrl: "search.html",
                controller: "SearchController"
            })
            .otherwise({
                redirectTo: "/"
            })
    }]);
})();
