(function(angular){
  angular.module("ngEocities.flasher", [])
  .directive("flasher", function($timeout){
    return {
      restrict: 'EA',
      template: '<div><div ng-transclude></div></div>',
      transclude: true,
      scope: {
        on: '@'
      },
      link: function(scope, ele, attrs){
        console.log('loaded directive');
        //lets make a flashing rainbow background
        var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
        var color = 0;
        // ele = ele.children();
        console.log(attrs);
        scope.$watch('on', function(newValue, oldValue) {
          console.log('watching the change');
          scope.on = newValue;
        });
        var rainbow = function(){
          $timeout(function(){
            angular.element(ele).css('background-color', colors[color]);
            color = color < colors.length-1 ? color+1 : 0;
            !scope.on || rainbow();
            console.log('scope.on is: '+scope.on);
          }, attrs.interval);
        };

        rainbow();

      }
    };
  });
})(angular);

