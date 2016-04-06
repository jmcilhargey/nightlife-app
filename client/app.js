(function() {
    
"use strict";

angular.module("nightlifeApp", ["ngRoute", "ui.router"])
    
    .factory("Search", ["$http", function($http) {
        return {
            find: function(city, sort) {
                return $http({
                    method: "GET",
                    url: "/api/search",
                    params: { searchCity: city, sortBy: sort }
                });
            }
        };
    }])
    
    .controller("MainController", ["$scope", "$state", "Search", function($scope, $state, Search) {
        
        $scope.newSearch = function() {
            Search.find($scope.city, $scope.sort).success(function(data) {
                $scope.results = data;
            });
            $state.go("home.search");
        };
    }])
    
    .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("home", {
               url: "/home",
               controller: "MainController",
               templateUrl: "home.html"
            })
        
            .state("home.welcome", {
                url: "/welcome",
                templateUrl: "welcome.html"
            })
            
            .state("home.search", {
                url: "/search",
                templateUrl: "search.html"
            });
        $urlRouterProvider.otherwise("/home/welcome");
    }]);
    
    /*
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
    }]);*/
})();
