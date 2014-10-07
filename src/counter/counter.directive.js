(function(angular){
  'use strict';
  
  angular.module('ngEocities.counter-directive', [])
  
  .directive('counter', function($firebase, counter) {
    function link(scope, element, attrs) {
      counter.getFirebaseObject().$loaded().then(function(object) {
        scope.position = object.count;
        object.$bindTo(scope, 'visitor');
      });
    }
  
    return {
      restrict: 'EA',
      template: '<div>you are visitor {{position}} out of {{visitor.count}}.</div>',
      scope: {
        'option': '@'
      },
      link: link
    };
  });
}(angular));