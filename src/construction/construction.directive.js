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
          '<div style="background-color: #ff0; padding: 5px 0px 5px 0px" ng-transclude></div>' +
        '</div>',
      scope: {},
      link: link
    };
  });
}(angular));