module('viewmodel tests');

test('initialisation', function() {

	ok(mvvm, 'mvvm created');
	
	ok(mvvm.viewmodel() instanceof mvvm.Viewmodel, 'viewmodel method returns a Viewmodel instance');
	ok(mvvm.viewmodel().views, 'viewmodel has a views collection');
	ok(mvvm.viewmodel().model, 'viewmodel has a models value');

	ok(mvvm.viewmodel('home').id === 'home', 'Viewmodel has id');
	ok(mvvm.model.home, 'Model created for home viewmodel');
	ok(mvvm.viewmodels.home, 'Viewmodels collection contains viewmodel.')
}); 

test('implicit actions', function() {
	
	expect(5);

	$('#qunit-fixture').append('<fieldset id="test1"><legend>test</legend><label for="input1"></label><input id="input1" name="input1"></fieldset>');
	$('#qunit-fixture').append('<table id="test2"><tbody><tr><td>1</td></tr><tr><td>2</td></tr></table>');
	
	var result = mvvm.viewmodel('test1', function(app) {

		ok(app instanceof mvvm.Viewmodel, 'viewmodel function passes Viewmodel instance');

		app.input1Click = function() {
			ok(true, 'Click event triggered');
		};
	});

	ok(result.views['#input1'], 'Implicit view found');
	ok(result.actions.click, 'Click event type found');
	ok(result.actions.click['#input1'], 'input1 action found');

	$('#input1').trigger('click');
});