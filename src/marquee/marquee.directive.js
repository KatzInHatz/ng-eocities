(function(angular){
  'use strict';
  
  angular.module('ngEocities.marquee')
  
  .directive('marquee', ['$timeout', function($timeout) {
    function getTransformString(sign, percentage) {
      if (sign === '') sign = -100;
      percentage = percentage === 0 ? percentage : sign + percentage + '%';
      return 'translate' + translate + '(' + percentage + ')';
    }
  
    function link(scope, element, attrs) {
      var distance, padding, origin, axis, fps, totalFrames;

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

      // initialize default values
      distance = '100%';
      padding = 'padding-left';
      axis = 'X';
      origin = '-';

      if (scope.direction === 'up' || scope.direction === 'down') {
        distance = attrs.height;
        padding = 'padding-top';
        axis = 'Y';
      }

      if (scope.direction === 'right' || scope.direction === 'down') origin = -100;

      angular.element(element).css(padding, distance);
  
      fps = 1000 / 60; // 60 frames per second
      totalFrames = scope.duration / fps;
  
      function loop(fps, origin, axis) {
        var frames, percentage;
        frames = 0;
  
        $timeout(function animate() {
          percentage = (frames / totalFrames) * 100;
          angular.element(element).css({
            'transform': 'translate' + axis + '(' + (origin + percentage) + '%)'
          });
          ++frames <= totalFrames ? $timeout(animate, fps) : loop(fps, origin, axis);
        }, fps);
      }
      
      loop(fps, origin, axis);
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