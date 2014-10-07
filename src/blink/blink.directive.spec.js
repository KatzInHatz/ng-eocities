describe('Unit: blink', function(){
  var scope, element;

  beforeEach(module('ngEocities.blink'));

  beforeEach(inject(function($rootScope, $compile){
    scope = $rootScope.$new();
    element = '<div blink option"rainbow" flashtext="true" interval=500>Hello World</div>';
    element = $compile(element)(scope);
    scope.$digest();
  }));

});