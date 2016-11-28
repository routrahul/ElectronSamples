angular.module('Player', [
  'ngRoute',
  'Player.first'
])
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .otherwise({redirectTo: '/first'})
}])
