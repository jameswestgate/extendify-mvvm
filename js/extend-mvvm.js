
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

	//IE9 and above
	//TODO: move this to mvvm.element / mvvm.elements class
	mvvm.matches = function(el, selector) {
  		return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
	};

})();

//Core
(function() {

	var ACTIONS = ['Click', 'Focus', 'Blur'];

	//-- Model

	mvvm.model = {};

	//-- Viewmodel
	mvvm.Viewmodel = function(id) {
		this.views = {};
		this.model = {};
		this.actions = {}; //view actions
		this.bindings = {}; //model bindings

		this.id = id;
		this.root = null;
		this.template = '';
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

			//TODO: investigate IE9 and 10 support for change
			//TODO: investigate any elements that dont use change? (perhaps blur?)
			//Remove existing bound handler (if any)
			(function(vm) {
				vm.root.addEventListener('change', function(e) {
					
					var flag = false;

					for (var key in vm.bindings) {
						if (mvvm.matches(e.target, key)) {

							//TODO: investigate when name attribute is allowed to be used
							var name = e.target.getAttribute('name');
							if (name) {
								vm.bindings[name] = e.target.value;
								console.log('Updating model: ' + name + ' with ' + e.target.value);
								flag = true;
							}
						}
					}

					//if (flag) vm.render(); // we dont want to overide other changes!
				})
			})(this);

			this.bind('select, input, textarea', this.model);

			//Set up template
			this.template = this.root.innerHTML;
  			Mustache.parse(this.template);   // optional, speeds up future uses
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

	mvvm.Viewmodel.prototype.bind = function(selector, model) {
		
		if (!this.root) return;

		//Get initial values
		var elements = this.root.querySelectorAll(selector);
		for (var i=0, len=elements.length; i<len; i++) {
			
			var element = elements[i],
				name = element.getAttribute('name');

			if (name) model[name] = element.value;
		}

		//Add to list of bindings
		this.bindings[selector] = model;
	}

	mvvm.Viewmodel.prototype.render = function() {
		if (!this.root) return;
		console.log('Rendering template');
  		var rendered = Mustache.render(this.template, this.model);
  		this.root.innerHTML = rendered;
	}


	//-- mvvm
	//Helper to create an initialised viewmodel
	mvvm.viewmodel = function(id, fn) {

		var app = new mvvm.Viewmodel(id);
	
		//TODO: This is probably wrong
		mvvm.model[id] = app.model;

		//Get implicit actions, bind root element
		app.initialize();

		//Execute the function
		if (fn) fn.call(this, app);

		//Now resolve any of the bindings, including implicit bindings and render the template
		app.resolve();
		app.render();

		return app;
	}

})();