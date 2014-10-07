describe('Unit: Figlify', function(){
  //load module we're testing
  beforeEach(function(){
    //configure provider
    angular.module('ngEocities.figlet')
      .config(function(figlifyProvider){
        figlifyProvider.setFontsRoute('/figlify/fonts/');
      });

    //load module
    module('ngEocities.figlet');
  });

  var figlify, $httpBackend;

  beforeEach(inject(function(_figlify_, _$httpBackend_){
    //inject provider and mockup $http service
    figlify = _figlify_;
    $httpBackend = _$httpBackend_;

    //expect request to get font
    $httpBackend.when('GET', '/figlify/fonts/alligator.flf')
      .respond('hello world');

  }));

  var text; 

  beforeEach(function(){
    text = 'hello';
  });

  afterEach(function(){
    $httpBackend.flush();
  });


  it('should correctly request a font', function(){
    figlify.figlify(text, 'alligator', function(str){
    });
  });
});








