(function() {
    
"use strict";

angular.module("nightlifeApp", ["ui.router"])
    
    .factory("Search", ["$http", function($http) {
        return {
            search: function(city, sort) {
                return $http({
                    method: "GET",
                    url: "api/search",
                    params: { searchCity: city, sortBy: sort }
                });
            },
            join: function(id, address1, address2) {
                return $http({
                    method: "PUT",
                    url: "api/join",
                    data: { businessId: id, businessAddress: (address1 + " " + address2) }
                });
            },
            going: function(businesses) {
                return $http({
                    method: "GET",
                    url: "api/going",
                    params: { businessList: businesses }
                });
            }
        };
    }])
    
    .factory("UserInfo", ["$http", function($http) {
        return $http({
            method: "GET",
            url: "api/user"
        });
    }])
    
    .factory("CheckLogin", ["$http", function($http) {
        return $http({
            method: "GET",
            url: "auth/login"
        });
    }])
    
    .controller("HomeController", ["$scope", "$state", "Search", "UserInfo", "CheckLogin", function($scope, $state, Search, UserInfo, CheckLogin) {
        
        $scope.newSearch = function(searchCity, sortBy) {
            Search.search(searchCity, sortBy).success(function(data) {
                
                $scope.results = data;
                
                $scope.businessList = [];
                data.businesses.forEach(function(element) {
                    $scope.businessList.push(element.id);
                });
                
                Search.going($scope.businessList).success(function(data) {
                    $scope.going = data;
                    $state.go("home.search");
                });
            });
        };
        
        $scope.checkGoing = function(id) {
            $scope.count = 0;
        
            $scope.going.forEach(function(element) {
                if (element.name === id) {
                    $scope.count = element.count;
                }
            });
            return $scope.count;
        };
        
        $scope.addGoing = function(businessId, address1, address2) {
            Search.join(businessId, address1, address2).success(function() {
                Search.going($scope.businessList).success(function(data) {
                    $scope.going = data;
                    $scope.listGoing(businessId);
                });
            });
        };
        
        $scope.listGoing = function(id) {
            $scope.people = "";
            
            $scope.going.forEach(function(element) {
               if (element.name === id) {
                   $scope.people = element.people.join("\n");
               }
            });
            return $scope.people;
        };
        
        $scope.getUser = function() {
            UserInfo.success(function(data) {
                $scope.user = data;
            });
        };
        $scope.getUser();
        
        $scope.loggedIn = function() {
            CheckLogin.success(function(data) {
                data ? $scope.authenticated = true : $scope.authenticated = false;
            });
        };
        $scope.loggedIn();
    }])
    
    .directive("tooltip", function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                $(element).hover(function() {
                    $(element).tooltip("show");
                },
                function() {
                $(element).tooltip("hide");
            });
            }
        };
    })

    .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("home", {
               url: "/home",
               controller: "HomeController",
               templateUrl: "/views/home.html"
            })
        
            .state("home.welcome", {
                url: "/welcome",
                templateUrl: "/views/welcome.html"
            })
            
            .state("home.search", {
                url: "/search",
                templateUrl: "/views/search.html"
            })
            .state("home.directions", {
                url: "/directions",
                templateUrl: "/views/directions.html"
            });
        $urlRouterProvider.otherwise("/home/welcome");
    }]);
})();