module('viewmodel tests');

test('initialisation', function() {

	ok(mvvm, 'mvvm created');
	
	ok(mvvm.viewmodel() instanceof mvvm.Viewmodel, 'viewmodel method returns a Viewmodel instance');
	ok(mvvm.viewmodel().views, 'viewmodel has a views collection');
	ok(mvvm.viewmodel().model, 'viewmodel has a models value');

	ok(mvvm.viewmodel('home').id === 'home', 'Viewmodel has id');
	ok(mvvm.model.home, 'Model created for home viewmodel');
}); 

test('implicit actions', function() {
	
	expect(5);

	$('#qunit-fixture').append('<fieldset id="test1"><legend>test</legend><label for="input1"></label><input id="input1" name="input1"></fieldset>');
	
	var result = mvvm.viewmodel('test1', function(app) {

		ok(app instanceof mvvm.Viewmodel, 'viewmodel function passes Viewmodel instance');

		app.input1Click = function(e) {
			ok(true, 'Click event triggered');
			//todo: test e for correct type here
		};
	});

	ok(result.views['#input1'], 'Implicit view found');
	ok(result.actions.click, 'Click event type found');
	ok(result.actions.click['#input1'], 'input1 action found');

	$('#input1').trigger('click');
});

test('explicit actions', function(){

	expect(2);

	$('#qunit-fixture').append('<table id="test2"><tbody><tr><td>1</td></tr><tr><td>2</td></tr></table>');

	var result = mvvm.viewmodel('test2', function(app) {

		app.view({
			'tbody tr': 'row'
		});

		app.rowClick = function(e) {
			ok(true, 'row click event triggered');
		};
	});

	ok(result.views['tbody tr'], 'Explicit view found');

	$('#test2 tr').eq(0).trigger('click');
});


test('implicit model binding', function() {
	
	expect(2);

	$('#qunit-fixture').append('<fieldset id="test3"><legend>test</legend><label for="input3"></label><input id="input3" name="input3" value="default"></fieldset>');
	
	var result = mvvm.viewmodel('test3', function(app) {

	});

	ok(result.model.input3 === 'default', 'default binding with default value');
	
	$('#input3').val('hello world');
	ok(result.model.input3 === 'hello world', 'default binding updated (' + result.model.input3 + ')');	
});