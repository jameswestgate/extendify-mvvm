
/*
* Extendify JavaScript mvvm Framework
* https://github.com/jameswestgate/extendify-mvvm
* 
* Copyright (c) James Westgate 2014
*
* Licensed under the MIT license:
*   http://www.opensource.org/licenses/mit-license.php
*/

//Core
(function() {

	var ACTIONS = ['click', 'focus', 'blur'];

	window.mvvm = {};

	//-- Viewmodel
	mvvm.Viewmodel = function(id) {
		this.views = {};
		this.model = {};

		this.id = id;
		this.root = null;

		this._queue = {};
	}

	//Setup root element and initial implicit bindings
	mvvm.Viewmodel.prototype.initialize = function() {
		this.root = document.getElementById(this.id);
		
		if (this.root) {
			
			//Loop through and get all elements with an id and place them in a view
			var elements = this.root.querySelectorAll('[id]');

			for (var i=0, len=elements.length; i<len; i++) {
				this._queue['#' + elements[i].id] = elements[i].id;
			}
		}
	}

	//Add elements to the view
	mvvm.Viewmodel.prototype.view = function(values) {
		for (var key in values) {
			this._queue[key] = values[key];
		}
	}

	//Resolve elements in the view
	mvvm.Viewmodel.prototype.resolve = function(values) {
		var action, name, handler;
		var views = this.views;

		//Loop through all view and bind/unbind them to actions
		for (var i=0, len=ACTIONS.length; i<len; i++) {
			
			action = ACTIONS[i];
			for (var key in values) {

				handler = values[key] + action;
				
				//TODO: unbind if value
				if (this[handler] && typeof this[handler] === 'function') {


					//We need event delegation binding here
					//We also need to place this in a wrapper
					this.root.on(action, key, this[handler]);



					this.views[key] = values[key];
				}
			}
		}
	}	

	//-- mvvm
	//Helper to create an initialised viewmodel
	mvvm.viewmodel = function(id, fn) {

		var app = new mvvm.Viewmodel(id);

		//Get implicit actions, bind root element
		app.initialize();

		//Execute the function
		if (fn) fn.call(this, app);

		//Now resolve any of the bindings, including implicit bindings
		app.resolve();

		return app;
	}

})();