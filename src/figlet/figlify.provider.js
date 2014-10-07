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