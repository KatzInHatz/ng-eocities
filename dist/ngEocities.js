(function(angular){
  'use strict';
  
  angular.module('ngEocities.counter', [
    'ngEocities.counter-provider',
    'ngEocities.counter-directive'
  ]);
}(angular));
(function(angular){
  angular.module('ngEocities.blink', []);
})(angular);
(function(angular){
  angular.module('ngEocities.figlet', []);
})(angular);
(function(angular){
  angular.module('ngEocities.marquee', []);
})(angular);
(function(angular){
  angular.module('ngEocities.pixelated-img', []);
})(angular);
(function(angular){
  angular.module('ngEocities.sparkler', [
    'ngEocities.sparkler-factory'
  ]);
})(angular);
(function(angular){
  "use strict";

  angular.module('ngEocities', [
    'ngEocities.blink',
    'ngEocities.pixelated-img',
    'ngEocities.figlet',
    'ngEocities.marquee',
    'ngEocities.counter',
    'ngEocities.sparkler',
    'firebase'
  ]);
}(angular));


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
        active: '@',
        flashtext: '@',
        option: '@',
        interval: '@'
      },
      link: function(scope, ele, attrs){
        scope.options = {
          rainbow: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
          blackwhite: ['black', 'white'], 
          simple: [0, 1]
        };

        console.log('scope.option: ', scope.option);

        scope.current = 0;
        scope.option    = scope.options[scope.option] ? scope.option : 'simple';
        scope.flashtext = scope.flashtext || false;
        scope.active    = scope.active    || false;
        scope.interval  = scope.interval !== undefined ? scope.interval: 500;
        scope.flash     = flash;

        scope.$watch('active', function(newValue, oldValue) {
          scope.active = newValue;
          if (scope.active) scope.flash();
        });

        function flash(){
          var length, fontColor, property;
          property = scope.option === 'simple' ? 'opacity': 'background-color';
          if (scope.active){
            console.log('property is: ', property);
            ele.css(property, scope.options[scope.option][scope.current]);
            length = scope.options[scope.option].length;
            if ( scope.flashtext ){
              fontColor = scope.options[scope.option][(scope.current+length/2)%length];
              setChildFontColor(ele, fontColor);
            }
            scope.current =  scope.current < length-1 ? scope.current+1 : 0;
            $timeout(function(){
              flash();
            }, scope.interval);
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


(function(angular){
  'use strict';
  
  angular.module('ngEocities.counter-directive', [])
  
  .directive('counter', function($firebase, counter) {
    function link(scope, element, attrs) {
      counter.getFirebaseObject().$bindTo(scope, 'visitor');
    }
  
    return {
      restrict: 'EA',
      template: '<div>You are visitor {{visitor.count}}</div>',
      scope: {
      },
      link: link
    };
  });
}(angular));
(function(angular){
  'use strict';
  
  angular.module('ngEocities.counter-provider', [])
  
  .provider('counter', function() {
    var firebaseURL, syncObject;

    this.setFirebaseURL = function(url) {
      if (url) { 
        firebaseURL = url;
      }
    };

    this.$get = function($firebase) {
      var getFirebaseObject = function() {
        var visitorRef, sync;

        visitorRef = new Firebase(firebaseURL);
      
        // create an AngularFire reference to the data
        sync = $firebase(visitorRef);
        
        // download the count into a local object
        return sync.$asObject();
      };

      syncObject = getFirebaseObject();

      // on load, increment the count and save the result
      syncObject.$loaded().then(function(){
        syncObject.count++;
        syncObject.$save();
      });

      return {
        'getFirebaseObject': getFirebaseObject
      };
    };
  });
}(angular));
(function(angular){
  angular.module('ngEocities.figlet')
  .directive('figlet', figlet);

  /*@inject*/
  function figlet($http, figlify){
    return {
      restrict: 'EA',
      template: '<pre>{{fig}}</pre>',
      // transclude: true,
      scope: {
        text: '@',
        font: '@'
      },
      link: function(scope, ele, attrs, transcludefn){
        scope.font = scope.font || "standard";
        scope.text = scope.text || '';
        scope.fig  = '';
        ele = angular.element(ele.children()[0]);

        scope.$watch('text', function(newValue, oldValue){
          if (newValue === ''){
            scope.fig = '';
          } else {
            figlify.figlify(scope.text, scope.font, function(str){
              scope.fig = str;
            });
          } 
        });
      }
    };
  }
})(angular);

(function(angular){
  'use strict'; 

  angular.module('ngEocities.figlet')
    .provider('figlify', figlifyProvider);

    function figlifyProvider(){
      var fontsURL, fonts = {};

      this.setFontsRoute = function(url){
        fontsURL = url;
      };

      /*@inject*/
      this.$get = function($http){
        return {
          figlify: figlify
        };

        function figlify(text, font, callback){
          write(text, font, callback);
        }

        function loadFont(name, fn){
          $http({
            method:'GET', 
            url:fontsURL + name + '.flf'})
            .success(fn)
            .error(function(data, status, headers, config){
              console.log('error fetching font');
            });
        }

        function parseFont(name, fn) {
          if (name in fonts) {
            fn();
            return;
          }
          loadFont(name, function(defn) {
            _parseFont(name, defn, fn);
          });
        }
        
        function _parseFont(name, defn, fn) {
          var lines = defn.split("\n"),
            header = lines[0].split(" "),
            hardblank = header[0].charAt(header[0].length - 1),
            height = +header[1],
            comments = +header[5];
          
          fonts[name] = {
            defn: lines.slice(comments + 1),
            hardblank: hardblank,
            height: height,
            char: {}
          };
          fn();
        }
        
        function parseChar(char, font) {
          var fontDefn = fonts[font];
          if (char in fontDefn.char) {
            return fontDefn.char[char];
          }
          
          var height = fontDefn.height,
            start = (char - 32) * height,
            charDefn = [],
            i;
          for (i = 0; i < height; i++) {
            charDefn[i] = fontDefn.defn[start + i]
              .replace(/@/g, "")
              .replace(RegExp("\\" + fontDefn.hardblank, "g"), " ");
          }
          return fontDefn.char[char] = charDefn;
        }

        function write(str, font, fn) {
          parseFont(font, function() {
            var chars = [],
              result = "", 
              height;

            for (var i = 0, len = str.length; i < len; i++) {
              chars[i] = parseChar(str.charCodeAt(i), font);
            }
            for (i = 0, height = chars[0].length; i < height; i++) {
              for (var j = 0; j < len; j++) {
                result += chars[j][i];
              }
              result += "\n";
            }
            fn(result);
          });
        }
      };
    }
})(angular);
(function(angular){
  'use strict';
  
  angular.module('ngEocities.marquee')
  
  .directive('marquee', ['$timeout', function($timeout) {
  
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
(function(angular){
'use strict';

angular.module('ngEocities.pixelated-img')

.directive('pixelatedImg', ['$document', function($document) {
  return {
    restrict: 'E',
    scope: {
      src: '@',
      height: '@',
      width: '@',
      pixelation: '='
    },
    link: function(scope, element, attrs) {
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      var image = document.createElement('img');

      image.onload = pixelate;
      image.src = scope.src;
      
      function pixelate() {
        // set dimensions
        image.width = scope.width || image.width;
        image.height = scope.height || image.height;
        canvas.width = image.width;
        canvas.height = image.height;

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

      element.append(canvas); 
    }
  };
}]);
}(angular));
(function(angular){
  'use strict';
  
  angular.module('ngEocities.sparkler-factory', [])
  
  .factory('sparkler', function() {
    // http://sunshinestory96.blogspot.com/2011/07/tutorial-rainbow-sparkle-cursor.html
    var ox, oy, sdown;
    var hex = new Array("00","14","28","3C","50","64","78","8C","A0","B4","C8","DC","F0");
    var r = 1;
    var g = 1;
    var b = 1;
    var seq = 1;
    var sparkles  =  35;
    var x = ox = 400;
    var y = oy = 300;
    var swide = 800;
    var shigh = 600;
    var sleft = sdown = 0;
    var tiny = new Array();
    var star = new Array();
    var starv = new Array();
    var starx = new Array();
    var stary = new Array();
    var tinyx = new Array();
    var tinyy = new Array();
    var tinyv = new Array();


    function sparkle() {
      var c;

      if (x !== ox || y !== oy) {
        ox = x;
        oy = y;
        for (c = 0; c<sparkles; c++) if (!starv[c]) {
          star[c].style.left = (starx[c] = x)+"px";
          star[c].style.top = (stary[c] = y)+"px";
          star[c].style.clip = "rect(0px, 5px, 5px, 0px)";
          star[c].style.visibility = "visible";
          starv[c] = 50;
          break;
        }
      }

      for (c = 0; c < sparkles; c++) {
        if (starv[c]) update_star(c);
        if (tinyv[c]) update_tiny(c);
      }

      setTimeout(sparkle, 40);
    }

    function update_star(i) {
      if (--starv[i]==25) star[i].style.clip = 'rect(1px, 4px, 4px, 1px)';
      if (starv[i]) {
        stary[i] += 1 + Math.random() * 3;

        if (stary[i] < shigh + sdown) {
          star[i].style.top = stary[i] + 'px';
          starx[i] += (i % 5 - 2) / 5;
          star[i].style.left = starx[i] + 'px';
        } else {
          star[i].style.visibility = 'hidden';
          starv[i] = 0;
          return;
        }
      } else {
        tinyv[i] = 50;
        tiny[i].style.top = (tinyy[i] = stary[i]) + 'px';
        tiny[i].style.left = (tinyx[i] = starx[i]) + 'px';
        tiny[i].style.width = '2px';
        tiny[i].style.height = '2px';
        star[i].style.visibility = 'hidden';
        tiny[i].style.visibility = 'visible';
      }
    }

    function update_tiny(i) {
      if (--tinyv[i]==25) {
        tiny[i].style.width="1px";
        tiny[i].style.height="1px";
      }

      if (tinyv[i]) {
        tinyy[i]+=1+Math.random()*3;
        if (tinyy[i]<shigh+sdown) {
          tiny[i].style.top=tinyy[i]+"px";
          tinyx[i]+=(i%5-2)/5;
          tiny[i].style.left=tinyx[i]+"px";
        } else {
          tiny[i].style.visibility="hidden";
          tinyv[i]=0;
          return;
        }
      } else tiny[i].style.visibility="hidden";
    }

    document.onmousemove = function(e) {
      set_scroll();
      y = e.pageY;
      x = e.pageX;
    };

    function set_scroll() {
      if (typeof(self.pageYOffset) === 'number') {
        sdown = self.pageYOffset;
        sleft = self.pageXOffset;
      } else if (document.body.scrollTop || document.body.scrollLeft) {
        sdown = document.body.scrollTop;
        sleft = document.body.scrollLeft;
      } else if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
        sleft = document.documentElement.scrollLeft;
        sdown = document.documentElement.scrollTop;
      } else {
        sdown = 0;
        sleft = 0;
      }
    }

    function createDiv(height, width) {
      var rainbow, div;
      div = document.createElement('div');
      rainbow = '#' + hex[r] + hex[g] + hex[b];

      if (seq === 6) {
        b--;
        if (b === 0) seq = 1;
      }

      if (seq === 5) {
        r++;
        if (r === 12) seq = 6;
      }

      if (seq === 4) {
        g--;
        if (g === 0) seq = 5;
      }

      if (seq === 3) {
        b++;
        if (b==12) seq=4;
      }

      if (seq===2) {
        r--;
        if (r===0) seq = 3;
      }

      if (seq===1) {
        g++;
        if (g===12) seq=2;
      }

      div.style.position = 'absolute';
      div.style.height = height + 'px';
      div.style.width = width + 'px';
      div.style.overflow = 'hidden';
      div.style.zIndex = '10';
      div.style.backgroundColor = rainbow;

      return (div);
    }

    function initCursor() {
      var i, rats, rlef, rdow;

      if (document.getElementById) {
        
        for (i = 0; i < sparkles; i++) {
          rats = createDiv(3, 3);
          rats.style.visibility="hidden";
          document.body.appendChild(tiny[i]=rats);
          starv[i]=0;
          tinyv[i]=0;
          rats=createDiv(5, 5);
          rats.style.backgroundColor="transparent";
          rats.style.visibility="hidden";
          rlef=createDiv(1, 5);
          rdow=createDiv(5, 1);
          rats.appendChild(rlef);
          rats.appendChild(rdow);
          rlef.style.top="2px";
          rlef.style.left="0px";
          rdow.style.top="0px";
          rdow.style.left="2px";
          document.body.appendChild(star[i]=rats);
        }
        sparkle();
      }
    }

    return initCursor;
  });
}(angular));