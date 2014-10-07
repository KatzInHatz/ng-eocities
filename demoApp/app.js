var app = angular.module('myApp', ['ngEocities', 'firebase']);

app.config(function(counterProvider, figlifyProvider) {
  counterProvider.setFirebaseURL('https://ng-eocities.firebaseio.com/');
  figlifyProvider.setFontsRoute('/figlet/fonts/');
});

app.controller('myController', function($scope, $timeout) {
  var toggle = false;
  $scope.fig = 'type something';
  $scope.aaron = 'https://media.licdn.com/media/p/5/005/06a/07c/0ee6549.jpg';
  $scope.john = 'https://media.licdn.com/media/p/3/000/08f/332/20b3765.jpg';
  $scope.kat = 'http://petitecurie.com/wp-content/uploads/2014/03/cat8.jpg';
  $scope.link = 'http://occupyfun.com/media/videos/2/Cats-Transforming-into-Croissants.jpg';
  $scope.pixelation = 4;
  $scope.action = function() {
    console.log(toggle);
    $scope.link = toggle ? 'http://www.schoolforthedogs.com/wp-content/uploads/2012/10/Screen-Shot-2014-02-06-at-7.15.27-PM-300x200.png' : 'http://occupyfun.com/media/videos/2/Cats-Transforming-into-Croissants.jpg';
    toggle = !toggle;
  };
});

app.run(function(sparkler) {
  sparkler();
});