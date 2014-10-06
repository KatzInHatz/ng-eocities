var app = angular.module('myApp', ['ngEocities', 'firebase']);

app.config(function(counterProvider, figlifyProvider) {
  counterProvider.setFirebaseURL('https://ng-eocities.firebaseio.com/');
  figlifyProvider.setFontsRoute('/figlet/fonts/');
});

app.controller('myController', function($scope, $timeout) {
  $scope.link = 'http://petitecurie.com/wp-content/uploads/2014/03/cat8.jpg';
  $scope.pixelation = 10;
  $scope.action = function() {
    $scope.link = 'http://www.inlander.com/imager/cat-friday-cats-in-hats/b/original/2199849/4740/hellokittycat.jpg';
    console.log($scope.link);
  };
});

app.run(function(sparkler) {
  sparkler();
});