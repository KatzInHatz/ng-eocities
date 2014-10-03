(function(angular){
  'use strict';
  
  angular.module('ngEocities.marquee')
  
  .directive('marquee', ['$timeout', function($timeout) {
    function getTransformString(sign, percentage) {
      if (sign === '') sign = -100;
      percentage = percentage === 0 ? percentage : sign + percentage + '%';
      return 'translate3d(' + percentage + ', 0, 0)';
    }
  
    function link(scope, element, attrs) {
      var text, div, wrapper, marquee, direction;

      angular.element(element).parent().css({
        // 'background-color': 'pink',
        'display': 'block',
        'width': scope.width,
        'white-space': 'nowrap',
        'overflow': 'hidden'
      });

      angular.element(element).css({
        'display': 'inline-block',
        'white-space': 'nowrap',
        'padding-left': '100%',
      });

      direction = scope.reverse === 'true' ? '' : '-';
  
      // 60 frames per second
      var timeframe = 1000 / 60;
      var totalFrames = (scope.duration/1000) * 60;
      var frames;
      var percentage;
  
      function loop() {
        angular.element(element).css('transform', getTransformString(direction, 0));
        frames = 0;
        percentage = 0;
  
        $timeout(function animate() {
          frames++;
          percentage = (frames / totalFrames) * 100;
          angular.element(element).css('transform', getTransformString(direction, percentage));
          if (percentage < 100) {
            $timeout(animate, timeframe);
          } else {
            loop();
          }
        }, timeframe);
      }
      
      loop();
    }
  
    return {
      restrict: 'EA',
      template: '<div><div ng-transclude></div></div>',
      transclude: true,
      scope: {
        width: '@',
        duration: '@',
        reverse: '@'
      },
      link: link
    };
  }]);
}(angular));