
/*
* Extendify JavaScript mvvm Framework
* https://github.com/jameswestgate/extendify-mvvm
* 
* Copyright (c) James Westgate 2014
*
* Licensed under the MIT license:
*   http://www.opensource.org/licenses/mit-license.php
*/

window.mvvm = window.mvvm || {};

//Helper functionality
(function() {

	mvvm.Viewmodel = function() {

	}

	mvvm.viewmodel = function() {

		var app = new mvvm.Viewmodel();

		return app;
	}


})();