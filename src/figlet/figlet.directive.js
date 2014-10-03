(function(angular){
  angular.module('ngEocities.figlet')
  .directive('figlet', figlet);

  /*@inject*/
  function figlet($http, figlify){
    return {
      restrict: 'EA',
      scope: {},
      link: function(scope, ele, attrs){
        scope.font = attrs.font || "standard";

        figlify.figlify(ele.text(), scope.font, function(str){
          ele.text(str);
        });
      }
    };
  }
})(angular);
