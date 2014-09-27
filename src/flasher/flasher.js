(function(angular){
  angular.module("ngEocities.flasher", [])
  /* @inject */
  .directive("flasher", flasher);

function flasher($timeout){
  return {
    restrict: 'EA',
    template: '<div><div ng-transclude></div></div>',
    transclude: true,
    scope: {
      active: '='
    },
    link: function(scope, ele, attrs){
      var current, selection, options;
      
      scope.options = {
        rainbow: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
        blackwhite: ['black', 'white']};
      scope.selection = scope.options[attrs.colors];
      scope.current = 0;
      scope.flash = flash;

      scope.$watch('active', function(newValue, oldValue) {
        scope.active = newValue;
        if (scope.active) scope.flash();
      });

      function flash(){
        $timeout(function(){
          angular.element(ele).css('background-color', scope.selection[scope.current]);
          if (scope.active){
            scope.current =  scope.current < scope.selection.length-1 ? scope.current+1 : 0;
            flash();
          }
        }, attrs.interval);
      }
    }
  };
}

})(angular);

