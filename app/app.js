'use strict';
angular.module('myApp', [
  'ngRoute','reader'

]).run(function(){

}).config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
