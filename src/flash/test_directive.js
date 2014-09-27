(function(angular){
  angular.module("ngEocities.flasher", [])
  .directive("flasher", function($timeout){
    return {
      restrict: 'EA',
      template: '<div><div ng-transclude></div></div>',
      transclude: true,
      scope: {
        active: '='
      },
      link: function(scope, ele, attrs){
        var current, selection, options;
        
        options = {
          rainbow: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
          blackwhite: ['black', 'white']};
        selection = options[attrs.colors];
        current = 0;

        scope.$watch('active', function(newValue, oldValue) {
          scope.active = newValue;
        });

        (function flash(){
          $timeout(function(){
            angular.element(ele).css('background-color', selection[current]);
            if (scope.active){
              current =  current < selection.length-1 ? current+1 : 0;
            }
            flash();
          }, attrs.interval);
        })();
      }
    };
  });
})(angular);

