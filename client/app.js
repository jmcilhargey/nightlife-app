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
        
        $scope.newSearch = function(searchCity, sortBy) {
            
            Search.find(searchCity, sortBy).success(function(data) {
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
               templateUrl: "/views/home.html"
            })
        
            .state("home.welcome", {
                url: "/welcome",
                templateUrl: "/views/welcome.html"
            })
            
            .state("home.search", {
                url: "/search",
                templateUrl: "/views/search.html"
            });
        $urlRouterProvider.otherwise("/home/welcome");
    }]);
})();
