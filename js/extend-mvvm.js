
/*
* Extendify JavaScript mvvm Framework
* https://github.com/jameswestgate/extendify-mvvm
* 
* Copyright (c) James Westgate 2014
*
* Licensed under the MIT license:
*   http://www.opensource.org/licenses/mit-license.php
*/

//Helper functionality
(function() {

	window.mvvm = {};

	//IE9 and >
	mvvm.matches = function(el, selector) {
  		return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
	};
})();

//Core
(function() {

	var ACTIONS = ['Click', 'Focus', 'Blur'];

	//-- Model

	mvvm.model = {};
	mvvm.viewmodels = {};

	//-- Viewmodel
	mvvm.Viewmodel = function(id) {
		this.views = {};
		this.model = {};
		this.actions = {};

		this.id = id;
		this.root = null;
	}

	//Setup root element, initial implicit bindings and handlers
	mvvm.Viewmodel.prototype.initialize = function() {
		this.root = document.getElementById(this.id);
		
		if (this.root) {
			
			//Loop through and get all elements with an id and place them in a view
			//TODO: narrow scope only to action elements such as button, input
			var elements = this.root.querySelectorAll('[id]');

			for (var i=0, len=elements.length; i<len; i++) {
				this.views['#' + elements[i].id] = elements[i].id;
			}
		}
	}

	//Add elements to the view
	mvvm.Viewmodel.prototype.view = function(values) {
		for (var key in values) {
			this.views[key] = values[key];
		}
	}

	//Resolve elements in the view
	//eg actions: {click: {'table thead tr': rowClick}}
	//eg view {'table thead tr': 'row'}
	mvvm.Viewmodel.prototype.resolve = function() {

		//Create event handlers from each type of action
		for (var i=0, len=ACTIONS.length; i<len; i++) {

			var action = ACTIONS[i].toLowerCase();
	
			//Loop through the views which are marked us unbound
			//TODO: unbind
			for (var key in this.views) {
				
				var fn = this[this.views[key] + ACTIONS[i]];

				//Match up any existing functions
				if (fn && typeof fn === 'function') {	

					//Create the event handler for this action if it doesnt exist
					if (!this.actions[action]) {

						//Capture the value of action
						(function(current, actions){

							//Bind an event handler for each action to the root
							this.root.addEventListener(current, function(e) {

								//Loop through each selector and handler by this action
								for (var key in actions[current]) {

									//If the target matches the selector, then call the handler
									if (mvvm.matches(e.target, key)) {// this.model.apply(function() {
										actions[current][key].call(e.target, e);
									}; //);
								}

							});

						}).call(this, action, this.actions);

						//Add this event type
						this.actions[action] = {};
					}
					
					//Function has now been bound in actions
					this.actions[action][key] = fn;
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

		mvvm.viewmodels[id] = app;
		mvvm.model[id] = app.model;

		return app;
	}

})();