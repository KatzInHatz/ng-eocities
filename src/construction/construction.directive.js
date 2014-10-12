(function(angular){
  'use strict';
  
  angular.module('ngEocities.construction')
  
  .directive('construction', function($firebase, counter) {
    function link(scope, element, attrs) {

    }
  
    return {
      restrict: 'EA',
      transclude: true,
      template: 
        '<div class="ngEocities-construction">' +
          '<div ng-transclude></div>' +
        '</div>',
      scope: {},
      link: link
    };
  });
}(angular));