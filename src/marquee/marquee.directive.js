(function(angular){
  'use strict';
  
  angular.module('ngEocities.marquee')
  
  .directive('marquee', ['$timeout', function($timeout) {
    function getTransformString(sign, percentage) {
      if (sign === '') sign = -100;
      percentage = percentage === 0 ? percentage : sign + percentage + '%';
      return 'translate3d(' + percentage + ', 0, 0)';
    }

    // function getTransformString(sign, percentage) {
    //   if (sign === '') sign = -100;
    //   percentage = percentage === 0 ? percentage : sign + percentage + '%';
    //   return 'translate3d(0, ' + percentage + ', 0)';
    // }
  
    function link(scope, element, attrs) {
      var timeframe, totalFrames;

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
        var frames = 0;
        var percentage = 0;
  
        $timeout(function animate() {
          angular.element(element).css('transform', getTransformString(directions[scope.direction], (frames / totalFrames) * 100));
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