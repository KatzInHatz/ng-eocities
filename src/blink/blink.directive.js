(function(angular){
  angular.module('ngEocities.blink')
  .directive('blink', blink);

  /*@inject*/
  function blink($timeout){
    return {
      restrict: 'EA',
      template: '<div ng-transclude></div>',
      transclude: true,
      scope: {
        active: '@',
        flashtext: '@',
        option: '@',
        interval: '@'
      },
      link: function(scope, ele, attrs){
        scope.options = {
          rainbow: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
          blackwhite: ['black', 'white'], 
          simple: [0, 1]
        };

        scope.current = 0;
        scope.option    = scope.option === undefined ? 'simple' : scope.option;
        scope.option = 'simple';
        scope.flashtext = scope.flashtext || false;
        scope.active    = scope.active    || false;
        scope.interval  = scope.interval !== undefined ? scope.interval: 500;
        scope.flash     = flash;

        scope.$watch('active', function(newValue, oldValue) {
          scope.active    = newValue;
          scope.option    = scope.option === undefined ? 'simple' : scope.option;
          if (scope.active) scope.flash();
        });

        function flash(){
          var length, fontColor, property;
          property = scope.option === 'simple' ? 'opacity': 'background-color';
          if (scope.active){
            ele.css(property, scope.options[scope.option][scope.current]);
            length = scope.options[scope.option].length;
            if ( scope.flashtext ){
              fontColor = scope.options[scope.option][(scope.current+length/2)%length];
              setChildFontColor(ele, fontColor);
            }
            scope.current =  scope.current < length-1 ? scope.current+1 : 0;
            $timeout(function(){
              flash();
            }, scope.interval);
          }
        }

        function setChildFontColor(ele, color){
          ele.css('color', color);
          var children = ele.children();
          for (var i = 0; i < children.length; i++){
            setChildFontColor(angular.element(children[i]), color);
          }
        }
      }
    };
  }

})(angular);

