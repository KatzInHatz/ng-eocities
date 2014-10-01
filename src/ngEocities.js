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

    this.getSyncObject = function() {
      return syncObject;
    };

    this.$get = function($firebase) {
      return function() {
        var visitorRef = new Firebase(firebaseURL);
      
        // create an AngularFire reference to the data
        var sync = $firebase(visitorRef);
      
        // // download the count into a local object
        syncObject = sync.$asObject();
        syncObject.$loaded().then(function(){
          syncObject.count++;
          syncObject.$save();
          console.log(syncObject.count);
        });
        // 
      };    
    };
  })

  .run(function(counter) {
    counter();
  });
}(angular));

