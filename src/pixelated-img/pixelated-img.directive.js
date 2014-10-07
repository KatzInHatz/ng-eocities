(function(angular){
'use strict';

angular.module('ngEocities.pixelated-img')

.directive('pixelatedImg', ['$document', function($document) {
  return {
    restrict: 'EA',
    template: '<canvas></canvas>',
    scope: {
      source: '@',
      height: '@',
      width: '@',
      pixelation: '@'
    },
    link: function(scope, element, attrs) {
      var canvas = element.children()[0];
      var context = canvas.getContext('2d');
      var image = document.createElement('img');

      image.onload = function() {
        image.src = scope.source;
        setDimensions();
        pixelate();
      };

      function setDimensions() {
        // set dimensions
        image.width = scope.width || image.width;
        image.height = scope.height || image.height;
        canvas.width = image.width;
        canvas.height = image.height;
      }
      
      function pixelate() {
        image.src = scope.source;

        // scale by pixelation factor
        scope.pixelation = scope.pixelation || 10;
        var w = (image.width / scope.pixelation)|0;
        var h = (image.height / scope.pixelation)|0;

        /// turn off image smoothing
        context.imageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
      
        /// draw original image to the scaled size
        context.drawImage(image, 0, 0, w, h);
      
        /// draw scaled image to fill canvas
        context.drawImage(canvas, 0, 0, w, h, 0, 0, image.width, image.height);
      }

      scope.$watch('pixelation', pixelate);
      scope.$watch('source', pixelate);
    }
  };
}]);
}(angular));