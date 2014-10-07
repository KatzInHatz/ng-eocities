(function(angular){
  'use strict';
  
  angular.module('ngEocities.marquee')
  
  .directive('marquee', ['$timeout', function($timeout) {
  
    function link(scope, element, attrs) {
      var distance, padding, origin, axis, fps, totalFrames;
      
      angular.element(element).css({
        'display': 'block',
        'width': attrs.width,
        'height': attrs.height,
        'white-space': 'nowrap',
        'overflow': 'hidden'
      });

      angular.element(element).find('span').css({
        'display': 'inline-block',
        'white-space': 'nowrap'
      });

      // initialize default values
      scope.duration = scope.duration || 1000;
      distance = attrs.width;
      padding = 'padding-left';
      axis = 'X';
      origin = '-';

      if (scope.direction === 'up' || scope.direction === 'down') {
        distance = attrs.height;
        padding = 'padding-top';
        axis = 'Y';
      }

      if (scope.direction === 'right' || scope.direction === 'down') origin = -100;

      angular.element(element).find('span').css(padding, distance);
  
      fps = 1000 / 60; // 60 frames per second
      totalFrames = scope.duration / fps;
  
      function loop(fps, origin, axis) {
        var frames, percentage;
        frames = 0;
  
        $timeout(function animate() {
          percentage = (frames / totalFrames) * 100;
          angular.element(element).find('span').css({
            'transform': 'translate' + axis + '(' + (origin + percentage) + '%)'
          });
          ++frames <= totalFrames ? $timeout(animate, fps) : loop(fps, origin, axis);
        }, fps);
      }
      
      loop(fps, origin, axis);
    }
  
    return {
      restrict: 'EA',
      template: '<div><span ng-transclude></span></div>',
      transclude: true,
      scope: {
        duration: '@',
        direction: '@'
      },
      link: link
    };
  }]);
}(angular));