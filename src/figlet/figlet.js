(function(angular){
  angular.module('ngEocities.figlet', [])
  .directive('figlet', figlet);

  /*@inject*/
  function figlet($http){
    return {
      restrict: 'EA',
      scope: {},
      link: function(scope, ele, attrs){
        scope.parseFont = parseFont;
        scope._parseFont = _parseFont;
        scope.parseChar = parseChar;
        scope.write = write;
        scope.loadFont = loadFont;
        scope.fonts = {};
        scope.font = attrs.font || "standard";
        scope.fontPath = attrs.href;

        scope.write(ele.text(), scope.font, function(str){
          ele.text(str);
        });

        function loadFont(name, fn){
          $http({
            method:'GET', 
            url:scope.fontPath + name + '.flf'})
            .success(fn)
            .error(function(data, status, headers, config){
              console.log('error fetching font');
            });
        }

        function parseFont(name, fn) {
          if (name in scope.fonts) {
            fn();
            return;
          }
          
          scope.loadFont(name, function(defn) {
            scope._parseFont(name, defn, fn);
          });
        }
        
        function _parseFont(name, defn, fn) {
          var lines = defn.split("\n"),
            header = lines[0].split(" "),
            hardblank = header[0].charAt(header[0].length - 1),
            height = +header[1],
            comments = +header[5];
          
          scope.fonts[name] = {
            defn: lines.slice(comments + 1),
            hardblank: hardblank,
            height: height,
            char: {}
          };
          fn();
        }
        
        function parseChar(char, font) {
          var fontDefn = scope.fonts[font];
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
          scope.parseFont(font, function() {
            var chars = [],
              result = "";
            for (var i = 0, len = str.length; i < len; i++) {
              chars[i] = scope.parseChar(str.charCodeAt(i), font);
            }
            for (i = 0, height = chars[0].length; i < height; i++) {
              for (var j = 0; j < len; j++) {
                result += chars[j][i];
              }
              result += "\n";
            }
            console.log(result);
            fn(result);
          });
        }
      }

    };
  }
})(angular);
