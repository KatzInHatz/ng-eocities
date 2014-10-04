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
      var distance, padding, sign, translate, timeframe, totalFrames;

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
      translate = 'X';
      sign = '-';

      if (scope.direction === 'up' || scope.direction === 'down') {
        distance = attrs.height;
        padding = 'padding-top';
        translate = 'Y';
      }

      if (scope.direction === 'right' || scope.direction === 'down') sign = '';

      angular.element(element).css(padding, distance);
  
      timeframe = 1000 / 60; // 60 frames per second
      totalFrames = scope.duration / timeframe;
  
      function loop() {
        var frames = 0;
  
        $timeout(function animate() {
          angular.element(element).css('transform', getTransformString(sign, (frames / totalFrames) * 100, translate));
          ++frames <= totalFrames ? $timeout(animate, timeframe) : loop();
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