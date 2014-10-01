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