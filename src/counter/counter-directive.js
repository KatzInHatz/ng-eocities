(function(angular){
  'use strict';
  
  angular.module('ngEocities.counter', ['firebase'])
  
  .directive('counter', function($firebase) {
    function link(scope, element, attrs) {

      var visitorRef = new Firebase(attrs.src);

      // // create an AngularFire reference to the data
      var sync = $firebase(visitorRef);

      // // download the count into a local object
      var syncObject = sync.$asObject();

      // // synchronize the object with a three-way data binding
      // // click on `index.html` above to see it used in the DOM!
      syncObject.$bindTo(scope, 'visitor');
      // scope.count = scope.data.count;

      element.on('click', function() {
        scope.visitor.count++;
      });
    }
  
    return {
      restrict: 'EA',
      template: '<div>You are visitor {{visitor.count}}</div>',
      scope: {
      },
      // controller: countCtrl,
      link: link
    };
  });
}(angular));