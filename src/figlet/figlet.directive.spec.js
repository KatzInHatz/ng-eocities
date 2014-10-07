describe('Unit: Figlet', function(){
  //variables we'll need
  var figlify, element, scope;

  //load module we're testing
  beforeEach(module('ngEocities.figlet'));

  //mockup figlify provider
  beforeEach(function(){
    var func = function(text, font, cb){cb('hello world');};
    figlify = {figlify: func};

    module(function($provide){
      $provide.value('figlify', figlify);
    });
  });

  //let's setup our directive
  beforeEach(inject(function($rootScope, $compile){
    scope = $rootScope.$new();
    element = '<div figlet font="alligator" text="Hello"></div>';

    //compile element and initiate digest loop
    element = $compile(element)(scope);
    scope.$digest();
  }));

  it('should call figlify.figlify with cb, and use result in pre tag', function(){
    expect(element.find('pre').text()).to.equal('hello world');
  });
});