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
        active: '='
      },
      link: function(scope, ele, attrs){
        var current, selection, options;
        
        scope.options = {
          rainbow: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
          blackwhite: ['black', 'white']};
        scope.selection = scope.options[attrs.colors];
        scope.current = 0;
        scope.flashText = attrs.flashtext;
        scope.flash = flash;

        scope.$watch('active', function(newValue, oldValue) {
          scope.active = newValue;
          if (scope.active) scope.flash();
        });

        function flash(){
          if (scope.active){
            ele.css('background-color', scope.selection[scope.current]);
            if ( scope.flashText ){
              var fontColor = attrs.colors === 'rainbow' ? 
                scope.selection[(scope.current+3)%6] :
                scope.selection[(scope.current+1)%2];
              setChildFontColor(ele, fontColor);
            }
            scope.current =  scope.current < scope.selection.length-1 ? scope.current+1 : 0;
            $timeout(function(){
              flash();
            }, attrs.interval);
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

