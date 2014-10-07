(function(angular){
  'use strict';
  
  angular.module('ngEocities.jukebox')
  
  .directive('jukebox', ['$window', '$interval', function($window, $interval) {

    function link(scope, element, attrs) {
      /* Configurations */
      var interval = attrs.fps ? Math.floor(1000 / attrs.fps) : 32;
      var bins = attrs.bins = attrs.bins || 16;
      // Visual dimensions
      var bin = 4, gap = 1;
      var height = (2 + gap) * 13 + gap;
      var width = (bin + gap) * bins + gap;
      var bufferSize = 2048;


      /* DOM Manipulations */
      // Create HTML5 audio tag
      var audio = angular.element(
        ['<audio  loop src=', attrs.src, '>'].join('"'));
      audio[0].volume = scope.volume;
      
      // Create jukebox
      var jukebox = angular.element(
        ['<canvas height=', height, ' width=', width, '>'].join('"'));
      jukebox.css({
        width: 'inherit',
        height: 'inherit'
      });
      // ...and initialize its canvas
      var painting = jukebox[0].getContext('2d');
      painting.fillStyle = "rgb(0,0,0)";
      painting.fillRect(0, 0, width, height);

      element.append(audio);
      element.append(jukebox);


      /* Audio Operations */
      // Create the stream
      var context = new ($window.AudioContext || $window.webkitAudioContext)();
      var source = context.createMediaElementSource(audio[0]);
      var juker = context.createAnalyser();
      juker.fftSize = bufferSize;

      // Hook up the audio context
      if (scope.processor instanceof ScriptProcessorNode) {
        source.connect(scope.processor);
        scope.processor.connect(juker);
      } else source.connect(juker);
      juker.connect(context.destination);

      // Start the audio (as autoplay would be stop with context configuration)
      audio[0].play();

      // Update volume with bound value
      scope.$watch("volume", function() {
        audio[0].volume = scope.volume;
      });


      /* Visualizer Operations */
      var binSize = bufferSize / (bins + 4);
      var teardown = $interval(paint, interval, false);
      // Cleanup the $interval
      element.on('$destroy', $interval.bind(null, teardown));

      var data = new Uint8Array(bufferSize);
      function paint() {
        // Analyse the audio stream
        var transform = [];
        juker.getByteFrequencyData(data);
        for (var i = 0; i < bufferSize; i++) {
          transform[Math.floor(i / binSize)] = transform[Math.floor(i / binSize)] || 0;
          transform[Math.floor(i / binSize)] += data[i];
        }
        // Lots of noise in the edges, so discard them
        transform.shift(); transform.pop(); transform.pop(); transform.pop();

        var color, lit;
        var min = Math.min.apply(null, transform);
        var max = Math.max.apply(null, transform) - min;

        transform
          .map(function(bin) {
            // Normalize the analysed stream's transform
            return 13 - 13 * (bin - min) / max;
          })
        // Map the distribution to the canvas
          .forEach(function(intensity, x) {
            for (var y = 0; y < 13; y++) {
              lit = intensity < y ? '255' : '85';
              if (y < 2) { // red
                color = [lit, 0, 0];
              } else if (y < 5) { // yellow
                color = [lit, lit, 0];
              } else if (y < 9) { // green
                color = [0, lit, 0];
              } else { // blue
                color = [0, 0, lit];
              }
              painting.fillStyle = 'rgb(' + color.join() + ')';
              painting.fillRect(gap + (gap + bin) * x, gap + (gap + 2) * y, bin, 2);
            }
          });
      }
    }
  
    return {
      restrict: 'EA',
      scope: {
        src: '@',
        fps: '&?',
        volume: '=?',
        bins: '&?',
        // A script processor node, in case you want to get fancy
        processor: '=?'
      },
      link: link
    };
  }]);
}(angular));