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
