/*jslint nomen: true*/
/*globals require,_,$,console,jQuery,navigator,window,configPath*/

/**
 * main
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

/**
 * Main.js is first executable file and will be a single js which needs to be included in <head> tag of index.html.
 * This js file start the intilization by calling start method
 * This class is also responsbile to load playerconfig and activityConfig data files and pass these data to player
 * in between initlization process of MPlayer.
 *
 * Also manage to add name space in requireJS set the dependencies.
 *
 * Read the queryString and set the application mode before to start player based on the provided data through querystring
 * or player config file.
 * @class Main
 * @access private
 */
//LIMITED GLOBAL VARIABLES
var Data_Loader, mPlayer, Popup_Manager, CONSOLE, pPath, PlayerApplication, dataLoader;

// setup required libraries
var objRequireConfigData = {
	baseUrl : reqBaseUrl,
	paths : {
		player : basePath + 'framework/player',
		simPictor : basePath + 'framework/pictor',
		jquery : basePath + 'framework/libs/jquery/jquery-2.0.3.min',
		jqueryUI : basePath + 'framework/libs/jquery/plugins/jquery-ui-1.10.3.custom.min',
		jqueryUIAccordion : basePath + 'framework/libs/jquery/plugins/jquery-ui-accordion.min',
		jqueryTouchPunch : basePath + 'framework/libs/jquery/plugins/jquery.ui.touch-punch.min',
		jqueryURL : basePath + "framework/libs/jquery/plugins/jquery.url",
		json2xml : basePath + 'framework/libs/jquery/plugins/jquery.json2xml',
		xml2json : basePath + 'framework/libs/jquery/plugins/jquery.xml2json',
		underscore : basePath + 'framework/libs/underscore/underscore-min',
		backbone : basePath + 'framework/libs/backbone/backbone-min',
		marionette : basePath + 'framework/libs/backbone/backbone.marionette',
		text : basePath + 'framework/libs/require/text',
		css : basePath + 'framework/libs/require/css',
		image : basePath + 'framework/libs/require/image',
		templates : basePath + 'framework/player/templates',
		components : basePath + 'framework/player/components',
		activity : 'activity',
		eventsConst : basePath + 'framework/player/events/eventsconst',
		frameworkRoot : basePath + 'framework',
		utiljs : basePath + "framework/libs/utils",
		appInit : "app-initializer"
	},
	shim : {
		jqueryUI : {
			deps : ['jquery']
		},

		jqueryURL : {
			deps : ['jquery']
		},
		jqueryTouchPunch : {
			deps : ['jqueryUI']
		},
		xml2json : {
			deps : ['jquery']
		},
		json2xml : {
			deps : ['jquery']
		},
		underscore : {
			exports : '_'
		},
		backbone : {
			deps : ['underscore', 'jquery'],
			exports : 'Backbone'
		},
		marionette : {
			deps : ['jquery', 'underscore', 'backbone'],
			exports : 'Backbone.Marionette'
		}
	},
	deps : ['jquery', 'underscore']
};

// set config of require js
require.config(objRequireConfigData);

// start configuration and initialization process for application
require(['player/player-app', 'player/mplayer', 'player/controllers/router-helper', 'player/utils/data-loader', 'player/manager/popup-manager', 'player/router', 'jqueryURL'], function(app, player, navController, DataLoader, PopupManager, Router) {
	'use strict';
	// template settings of underscore
	/*jslint regexp: true*/
	_.templateSettings = {
		evaluate : /\{\{#(.+?)\}\}/g,
		interpolate : /\{\{([^#].*?)\}\}/g,
		escape : /\{\{-(.+?)\}\}/g
	};
	PlayerApplication = app;
	//PlayerApplication.start();
	mPlayer = player;
	dataLoader = new DataLoader();

	/**
	 *Product config sucessfully loaded, and now product config data
	 * will be pass to PlayerApplication
	 * @param {Object} data Product config
	 * @return none
	 * @access private
	 * @memberof main#
	 */
	function playerConfigLoadSuccess(data) {
		PlayerApplication.startPlayerInitalizer(data.activityConfig);
	}

	function playerConfigLoadFail(errorObj) {
		console.log("Error while loading product config!!! ", errorObj);
	}

	/**
	 * This function process the parameter inputs and invokes the data loading
	 * @param {Object} strURL Path of data file to be loaded
	 * @param {Object} strDataType Data type of the file
	 * @param {Object} strContentType Content type of the file
	 * @param {Object} strReturnType Return type of the loaded data
	 * @param {Object} successHandler Success handler callback function
	 * @param {Object} errorHandler Error handler callback function
	 * @return None
	 * @memberof Main#
	 * @acccess private
	 */
	function loadProductConfigData(strURL) {
		var objClassRef = this;
		if (dataLoader !== null) {
			dataLoader = new DataLoader();
		}
		dataLoader.on(dataLoader.DATA_LOAD_SUCCESS, playerConfigLoadSuccess);
		dataLoader.on(dataLoader.DATA_LOAD_FAILED, playerConfigLoadFail);
		dataLoader.load({
			url : strURL,
			dataType : "xml",
			contentType : "application/xml",
			returnType : "json",
			scope : objClassRef
		});
	}

	/**
	 * getting product config path, default path of config file is
	 * 'data/product-config.xml' but user can override this
	 * value by passing query string
	 */
	function getProductConfigPath() {
		var productPath = configPath;
		if (configPath === undefined || configPath === "") {
			productPath = "data/product-config.xml";
		}
		//overriding product config file if new product path associated with query object.
		if (jQuery.url.param("product") !== undefined) {
			productPath = jQuery.url.param("product") + ".xml";
		}
		return productPath;
	}

	/**
	 * First method to execute to start the initializing of player(s).
	 * First we need to load product config xml file to get to know
	 * that how many player(s) needs to be created.
	 */
	function start() {
		loadProductConfigData(getProductConfigPath());
	}

	/**
	 * This function destroys mPlayer
	 * @param None
	 * @return None
	 * @memberof Main#
	 * @acccess private
	 */
	function destroy() {
		return mPlayer.destroy();
	}

	function testinMain(obj) {
		console.log("hello i m in main.js", obj, this);
	}

	//start the main
	start();

});
