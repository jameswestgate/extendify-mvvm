module("viewmodel tests");

test("initialisation", function() {

	ok(mvvm, 'mvvm created');
	
	ok(mvvm.viewmodel() instanceof mvvm.Viewmodel, 'viewmodel method returns a Viewmodel instance');
	ok(mvvm.viewmodel().views, 'viewmodel has a views collection');
	ok(mvvm.viewmodel().model, 'viewmodel has a models value');

	ok(mvvm.viewmodel('home').id === 'home', 'Viemodel has id');
}); 