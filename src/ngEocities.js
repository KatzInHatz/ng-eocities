(function(angular){
  "use strict";

  angular.module('ngEocities', [
    'ngEocities.flasher',
    'ngEocities.pixelated-img-directive',
    'ngEocities.figlet',
    'ngEocities.marquee-directive',
    'ngEocities.counter',
    'firebase'
  ])

  .provider('counter', function() {
    var firebaseURL, syncObject;

    this.setFirebaseURL = function(url) { 
      if (url) { 
        firebaseURL = url;
      }
    };

    this.$get = function($firebase) {
      var visitorRef, sync;
      visitorRef = new Firebase(firebaseURL);
      
      // create an AngularFire reference to the data
      sync = $firebase(visitorRef);
      
      // download the count into a local object
      syncObject = sync.$asObject();

      // on load, increment the count and save the result
      syncObject.$loaded().then(function(){
        syncObject.count++;
        syncObject.$save();
      });

      return syncObject; 
    };
  });
}(angular));

