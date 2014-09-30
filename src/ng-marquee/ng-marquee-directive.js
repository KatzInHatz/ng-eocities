'use strict';

angular.module('myApp.ng-eocities.marquee-directive', [])

.directive('ngMarquee', ['$timeout', function($timeout) {
  function getTransformString(sign, percentage) {
    if (sign === '') sign = -100;
    percentage = percentage === 0 ? percentage : sign + percentage + '%';
    return 'translate3d(' + percentage + ', 0, 0)';
  }

  function link(scope, element, attrs) {
    var text, div, wrapper, marquee, direction;

    // div = document.createElement('div');
    wrapper = document.createElement('div');
    marquee = document.createElement('span');

    // div.style.width = scope.width;

    wrapper.style.backgroundColor = 'pink';
    wrapper.style.display = 'block';
    wrapper.style.width = scope.width;
    wrapper.style.whiteSpace = 'nowrap';
    wrapper.style.overflow = 'hidden';

    marquee.style.display = 'inline-block';
    marquee.style.whiteSpace = 'nowrap';
    marquee.style.paddingLeft = '100%';
    marquee.style.fontSize = '200px';

    marquee.innerHTML = element.text();
    element.text('');
    angular.element(element).css('display', 'block');

    wrapper.appendChild(marquee);
    element.append(wrapper);

    direction = scope.reverse === 'true' ? '' : '-';

    // 60 frames per second
    var timeframe = 1000 / 60;
    var totalFrames = (scope.duration/1000) * 60;
    var frames;
    var percentage;

    function loop() {
      marquee.style.transform = getTransformString(direction, 0);
      frames = 0;
      percentage = 0;

      $timeout(function animate() {
        frames++;
        percentage = (frames / totalFrames) * 100;
        marquee.style.transform = getTransformString(direction, percentage);
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
    scope: {
      width: '@',
      duration: '@',
      reverse: '@'
    },
    link: link
  };
}]);