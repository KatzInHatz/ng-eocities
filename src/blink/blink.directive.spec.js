describe('Unit: blink', function(){
  var scope, element, $timeout, isolateScope;

  beforeEach(module('ngEocities.blink'));

  beforeEach(inject(function($rootScope, $compile, _$timeout_){
    scope = $rootScope.$new();
    $timeout = _$timeout_;
    element = '<div blink option="rainbow" flashtext="true" active="true" interval=500>Hello World</div>';
    element = $compile(element)(scope);
    scope.$digest();
    isolateScope = element.isolateScope();
  }));

  it('should correctly tie attribute values to scope', function(){
    expect(isolateScope.option).to.equal('rainbow');
    expect(isolateScope.flashtext).to.equal('true');
    expect(isolateScope.interval).to.equal('500');
    expect(isolateScope.active).to.equal('true');
  });

  it('should correctly invoke $timeout', function(){
    $timeout.flush();
  });
});