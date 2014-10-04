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
      var timeframe, totalFrames, frames, percentage;

      angular.element(element).parent().css({
        'display': 'block',
        'width': attrs.width,
        'height': attrs.height,
        'white-space': 'nowrap',
        'overflow': 'hidden'
      });

      angular.element(element).css({
        'display': 'inline-block',
        'white-space': 'nowrap',
      });

      angular.element(element).css(padding[scope.direction], '100%');
  
      timeframe = 1000 / 60; // 60 frames per second
      totalFrames = scope.duration / timeframe;
  
      function loop() {
        angular.element(element).css('transform', getTransformString(directions[scope.direction], 0));
        frames = 0;
        percentage = 0;
  
        $timeout(function animate() {
          frames++;
          percentage = (frames / totalFrames) * 100;
          angular.element(element).css('transform', getTransformString(directions[scope.direction], percentage));
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
        duration: '@',
        direction: '@'
      },
      link: link
    };
  }]);
}(angular));