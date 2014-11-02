module("viewmodel tests");

test("viewmodel", function() {

	ok(mvvm, 'mvvm created');
	ok (mvvm.viewmodel() instanceof mvvm.Viewmodel, 'viewmodel method returns a Viewmodel instance' )
}); 