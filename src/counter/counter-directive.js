(function(angular){
  'use strict';
  
  angular.module('ngEocities.counter-directive', [])
  
  .directive('counter', function($firebase, counter) {
    function link(scope, element, attrs) {
      counter.$bindTo(scope, 'visitor');
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