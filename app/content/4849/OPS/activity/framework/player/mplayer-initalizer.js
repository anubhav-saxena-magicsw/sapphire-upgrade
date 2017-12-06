/*jslint nomen: true */
/*globals Backbone,_,console,$, class,jQuery */

/**
 * PlayerDataInitalizer
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(['marionette', 'player/controllers/router-helper', 'player/utils/data-loader', 'player/manager/popup-manager', 'player/router', 'player/constants/playerconst', 'player/constants/errorconst'],
//'player/manager/EventManager',  -- will be removed.

/**
 * Class is introduced to help to load and initalise the mPlayer default file data
 *
 * @class PlayerDataInitalizer
 * @access private
 * @example
 * var PlayerDataInitalizer = new PlayerDataInitalizer();
 */
function(Marionette, NavController, DataLoader, PopupManager, Router, PlayerConst, errorConst) {
	'use strict';
	var PlayerDataInitalizer;

	PlayerDataInitalizer = Backbone.Marionette.Controller.extend({

		/** ----------- CONSTANTS ----------------*/
		PLAYER_DATA_INIT_COMPLETE : "playerDataInitComplete",
		DEFAULT_PLAYER_WIDTH : 800,
		DEFAULT_PLAYER_HEIGHT : 600,
		PRODUCT_CONFIG_PATH : "data/product-config.xml",
		DATA_TYPE : "xml",
		RETURN_TYPE : "json",
		CONTENT_TYPE : "application/xml",
		/** -----------------------------------------*/

		popupAnimObjects : undefined,
		popupTemplates : undefined,
		dataLoader : undefined,
		playerConfigData : undefined,
		productConfigData : undefined,
		activityConfigData : undefined,
		objRouter : undefined,
		Popup_Manager : undefined,
		totalRegion : undefined,
		tempRegionCount : undefined,
		delayTime : 50,
		playerContainerDiv : undefined,
		playerDiv : undefined,
		objProductConfig : undefined,

		constructor : function(mPlayerRef) {
			this.mPlayer = mPlayerRef;
			this.mPlayer.on(this.mPlayer.PLAYER_INITIALIZE_COMPLETE_EVENT, this.onPlayerInitlizeCompleteEvent, this);
			this.mPlayer.on("playerCommonTaskEvent", this.handlePlayerCommonTask, this);
		}
	});

	PlayerDataInitalizer.prototype.start = function(productConfig, application) {
		this.objApplication = application;
		this.objProductConfig = productConfig;
		this.playerContainerDiv = $(productConfig.containerDiv);
		this.playerDiv = $("#mPlayer", productConfig.containerDiv);
		if (productConfig.activityConfig === undefined) {
			this.loadData(productConfig.configPath, this.DATA_TYPE, this.CONTENT_TYPE, this.RETURN_TYPE, this.handleProductConfigLoadSuccess, this.handleDataLoadFailed);
		} else {
			this.loadData(productConfig.activityConfig, this.DATA_TYPE, this.CONTENT_TYPE, this.RETURN_TYPE, this.onMergedActConfigLoaded, this.handleDataLoadFailed);
		}
	};
	
	/**
	 *This method is introduced to handle the player data when they are merged in same file (activity config.xml)
	 */
	PlayerDataInitalizer.prototype.onMergedActConfigLoaded = function(configData, loader) {
		var objClassRef = loader.dataLoader.SCOPE;
		objClassRef.activityConfigData = configData;
		objClassRef.dataLoader.off(objClassRef.dataLoader.DATA_LOAD_SUCCESS);
		objClassRef.dataLoader.off(objClassRef.dataLoader.DATA_LOAD_FAILED);
		objClassRef.handlePlayerConfigLoadSuccess(configData.playerSettings);
	};

	/**
	 * This function loads player config data
	 * @param None
	 * @return None
	 * @memberof Main#
	 * @acccess private
	 */
	PlayerDataInitalizer.prototype.loadPlayerConfig = function() {
		this.loadData(this.productConfigData.playerConfig.src, this.DATA_TYPE, this.CONTENT_TYPE, this.RETURN_TYPE, this.onPlayerConfigLoaderSucccess, this.handleDataLoadFailed);
	};

	PlayerDataInitalizer.prototype.onPlayerConfigLoaderSucccess = function(configData, loader) {
		var objClassRef = loader.dataLoader.SCOPE;
		objClassRef.handlePlayerConfigLoadSuccess(configData);
	};

	/**
	 * This is handler function for activity config data load
	 * @param {Object} configData Activity config data
	 * @return None
	 * @memberof Main#
	 * @acccess private
	 */
	PlayerDataInitalizer.prototype.handleActivityConfigLoadSuccess = function(configData) {
		this.activityConfigData = configData;
		this.dataLoader.off(this.dataLoader.DATA_LOAD_SUCCESS);
		this.dataLoader.off(this.dataLoader.DATA_LOAD_FAILED);
	};

	/**
	 * This is handler function for player config data load
	 * @param {Object} objConfigData Loaded data of player config xml
	 * @return None
	 * @memberof Main#
	 * @acccess private
	 */
	PlayerDataInitalizer.prototype.handlePlayerConfigLoadSuccess = function(objConfigData) {
		var bRelease;
		this.playerConfigData = objConfigData;
		this.dataLoader.off(this.dataLoader.DATA_LOAD_SUCCESS);
		this.dataLoader.off(this.dataLoader.DATA_LOAD_FAILED);
		bRelease = (this.playerConfigData.release === undefined) ? false : (this.playerConfigData.release === "true") ? true : false;

		if (this.launchInDebugMode() === true) {
			//Hold the player initlization process if debug mode set to true.
			//Now player will initlize when debug mode related js files are loaded and initlized successfully.
			this.playerConfigData.debug.mode = "true";
		} else {
			if (bRelease === true) {
				this.overrideConsole();
			}
		}
		this.loadUtilities();
	};

	PlayerDataInitalizer.prototype.loadUtilities = function() {
		var arrDataToLoad = [], htmlSource, animationSource, objClassref = this;
		if (this.activityConfigData.utilities !== undefined) {
			this.popupTemplates = this.activityConfigData.utilities.popupTemplate;
			htmlSource = this.popupTemplates.html.source;
			animationSource = this.popupTemplates.animation;
			animationSource = (animationSource !== undefined) ? animationSource.source : undefined;

			if (htmlSource !== undefined || htmlSource !== null) {
				arrDataToLoad.push("text!" + htmlSource);
			}

			if (animationSource !== undefined) {
				arrDataToLoad.push("text!" + animationSource);
			}

			require(arrDataToLoad, function(html, animationObejcts) {
				if (animationObejcts) {
					animationObejcts = jQuery.parseJSON(animationObejcts);
				}
				objClassref.onUtilInitComplete(html, animationObejcts);
			});
		} else {
			this.onUtilInitComplete();
		}
	};

	PlayerDataInitalizer.prototype.onUtilInitComplete = function(template, anim) {
		this.popupTemplates = template;
		if (template !== undefined && template.search('text/template') !== -1) {
			template = $("<div>" + this.popupTemplates + "</div>");
			this.popupTemplates = template.find("[type='text/template']");
		}
		if (anim !== undefined) {
			this.popupAnimObjects = anim;
		}
		this.initalizePlyerAndRegions();
	};

	/**
	 * Overriding console to prevent console in release mode.
	 * @param None
	 * @return None
	 * @memberof Main#
	 * @acccess private
	 */
	PlayerDataInitalizer.prototype.overrideConsole = function() {
		var CONSOLE = window.console;
		console.log = function() {
		};
	};

	/**
	 *
	 * This method is requiring Deugger class and then pass the control to
	 * initializeDebugger method to initlize the debugger and player.
	 * @param None
	 * @return None
	 * @memberof Main#
	 * @acccess private
	 */
	PlayerDataInitalizer.prototype.loadDebugger = function() {
		var objClassRef = this;
		require(['player/utils/debugger'], function(debuggerRef) {
			objClassRef.initializeDebugger(debuggerRef);
		});
	};

	/**
	 * Initlized debugger window and then start initlizing
	 * mPlayer and region(s).
	 * @param {Object} DebuggerRef Debugger Class reference. @see Debugger.js for more details
	 * @return None
	 * @memberof Main#
	 * @acccess private
	 */
	PlayerDataInitalizer.prototype.initializeDebugger = function(DebuggerRef) {
		var bLaunchInMinimizeState, bEnableLogger, objDebugger = new DebuggerRef("debuggerHolder");
		bLaunchInMinimizeState = (this.playerConfigData.debug.lunchInMinimizedMode === "true") ? true : false;
		bEnableLogger = (this.playerConfigData.debug.errorLogger === "true") ? true : false;
		objDebugger.enableDebugger(this.launchInDebugMode(), bEnableLogger, bLaunchInMinimizeState);
	};

	/**
	 * Responsible to check application lauch mode
	 * querystirng value will always override the config data value.
	 * if value in querystring set to 'debug=false' then application always lauch in normal
	 * mode even debug mode set to true in playerConfig value.
	 * @return {Boolean) bLaunchMode possible value is true/false
	 * if value is true then app will launch in debug mode.
	 * @param None
	 * @memberof Main#
	 * @acccess private
	 */
	PlayerDataInitalizer.prototype.launchInDebugMode = function() {
		var bLaunchMode = false, launchMode;
		if (jQuery.url !== undefined) {
			launchMode = jQuery.url.param("debug");
		}
		if (launchMode === undefined) {
			bLaunchMode = (this.playerConfigData.debug.mode === "true") ? true : false;
		} else {
			bLaunchMode = (launchMode === "true") ? true : false;
		}
		return bLaunchMode;
	};

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
	PlayerDataInitalizer.prototype.loadData = function(strURL, strDataType, strContentType, strReturnType, successHandler, errorHandler) {
		var objClassRef = this;
		if (this.dataLoader !== null) {
			this.dataLoader = new DataLoader();
		}
		this.dataLoader.on(this.dataLoader.DATA_LOAD_SUCCESS, successHandler);
		this.dataLoader.on(this.dataLoader.DATA_LOAD_FAILED, errorHandler);
		this.dataLoader.load({
			url : strURL,
			dataType : strDataType,
			contentType : strContentType,
			returnType : strReturnType,
			scope : objClassRef
		});
	};

	/**
	 * This is handler function for player config data load
	 * @param {Object} configData Player config data
	 * @return None
	 * @memberof Main#
	 * @acccess private
	 */
	PlayerDataInitalizer.prototype.handleProductConfigLoadSuccess = function(configData, loader) {
		var objClassRef = loader.dataLoader.SCOPE;
		objClassRef.productConfigData = configData;

		//load activity config data.
		if (objClassRef.productConfigData.playerConfig !== undefined) {
			if (objClassRef.productConfigData.regions === undefined) {
				objClassRef.loadData(objClassRef.productConfigData.activityConfig.src, objClassRef.DATA_TYPE, objClassRef.CONTENT_TYPE, objClassRef.RETURN_TYPE, objClassRef.handleActivityConfigLoadSuccess, objClassRef.handleDataLoadFailed);
			} else {
				objClassRef.handleActivityConfigLoadSuccess(configData.regions);
			}
			if (objClassRef.productConfigData.player === undefined) {
				objClassRef.loadPlayerConfig();
			} else {
				objClassRef.handlePlayerConfigLoadSuccess(objClassRef.productConfigData.player);
			}
		} else {
			objClassRef.loadData(objClassRef.productConfigData.activityConfig.src, objClassRef.DATA_TYPE, objClassRef.CONTENT_TYPE, objClassRef.RETURN_TYPE, objClassRef.onMergedActConfigLoaded, objClassRef.handleDataLoadFailed);
		}
	};
	/**
	 * Method 'initalizePlyerAndRegions' will initlized all regions
	 * set the product root path if changed in playerConfig
	 * initlize router and also will look into the query string to override any default value of product
	 * e.g product language and debug mode.
	 * @param None
	 * @return None
	 * @memberof Main#
	 * @acccess private
	 */
	PlayerDataInitalizer.prototype.initalizePlyerAndRegions = function() {
		var objPlayerData = {}, queryObjectData = {}, pairs, qs;

		this.objRouter = new Router(NavController);

		objPlayerData.playerConfig = this.playerConfigData;
		objPlayerData.activityConfig = this.activityConfigData;
		objPlayerData.router = this.objRouter;
		objPlayerData.popupTemplates = this.popupTemplates;
		this.Popup_Manager = PopupManager.getInstance();
		this.Popup_Manager.setAnimationObjects(this.popupAnimObjects);

		//Adding activityPath
		//.. used to when user want to change product root path.
		if (this.playerConfigData.activityPath !== undefined) {
			//later we will move this section will in main.js
			this.setRootNameSpace(this.playerConfigData.activityPath);
		}
		//..will created region(s) dynamically based on the provided
		//..data in ActivityConfig xml.
		this.createDynamicRegions(this.activityConfigData);

		//Parseing query stirng
		qs = window.location.search.replace('?', '');
		pairs = qs.split('&');
		$.each(pairs, function(i, v) {
			var pair = v.split('=');
			queryObjectData[pair[0]] = pair[1];
		});

		objPlayerData.queryData = queryObjectData;

		this.trigger(this.PLAYER_DATA_INIT_COMPLETE, objPlayerData);

		// start the player/app
		//this.mPlayer.start(objPlayerData);
		//Backbone.history.start();
	};

	/**
	 * This function handles display for player's region
	 * @access private
	 * @return none
	 */
	PlayerDataInitalizer.prototype.handlePlayerRegionsShow = function(objEvent) {
		var strOrientFunc = "resize", userAgent = navigator.userAgent, objClassref = this;
		this.tempRegionCount = this.tempRegionCount + 1;
		if (userAgent.indexOf('iPad') > -1) {
			strOrientFunc = "onorientationchange";
		}
		if (this.totalRegion - 1 === this.tempRegionCount && this.playerConfigData.size !== undefined) {
			if (this.playerConfigData.hasOwnProperty('size')) {
				if (this.playerConfigData.size.scale.isScalable === "true") {
					$(window).resize(function() {
						objClassref.scaleMPlayer(objClassref.playerConfigData.size, objClassref);
					});
					objClassref.scaleMPlayer(objClassref.playerConfigData.size, objClassref);
				} else {
					$(window).resize(function() {
						objClassref.updatePlayerSize(objClassref.playerConfigData.size, objClassref);
					});
					objClassref.updatePlayerSize(objClassref.playerConfigData.size, objClassref);
				}
			}
		}
	};

	/**
	 * Creating and adding regions
	 * @param None
	 * @return None
	 * @memberof Main#
	 * @acccess private
	 */
	PlayerDataInitalizer.prototype.createDynamicRegions = function() {
		var key, obj, regionDiv, i, arrRegions, objClassRef = this, tempParent;
		if (this.activityConfigData.regions === undefined) {
			this.activityConfigData.regions = {};
			this.activityConfigData.regions.region = this.activityConfigData.region;
			delete this.activityConfigData.region;
		}
		if (this.activityConfigData.regions.region.length === undefined) {
			arrRegions = [];
			arrRegions.push(this.activityConfigData.regions.region);
		} else {
			arrRegions = this.activityConfigData.regions.region;
		}

		this.totalRegion = arrRegions.length;
		obj = {};
		for ( i = this.totalRegion - 1; i >= 0; i -= 1) {
			arrRegions[i].id = this.objProductConfig.prefixId + arrRegions[i].id;
			regionDiv = $("<div></div>").attr({
				"id" : arrRegions[i].id,
				'class' : arrRegions[i].styleClass
			});

			this.playerDiv.prepend(regionDiv);
			obj[arrRegions[i].id] = "#" + arrRegions[i].id;
			// objClassRef.mPlayer.addRegion(arrRegions[i].id, "#objClassRef.mPlayer");

			if (arrRegions[i].drag === "true" || arrRegions[i].drag === true) {
				this.makeDraggable(regionDiv);
			}
		}

		tempParent = objClassRef.mPlayer;
		if (objClassRef.objApplication) {
			tempParent = objClassRef.objApplication;
			objClassRef.objApplication.addRegions(obj);
		} else {
			objClassRef.mPlayer.addRegions(obj);
		}

		objClassRef.tempRegionCount = 0;

		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				tempParent.getRegion(key).on('show', objClassRef.handlePlayerRegionsShow, objClassRef);
			}
		}
	};

	/**
	 * Method 'setRootNameSpace' is resposnible to set the root directory path in
	 * requirejs.
	 * This is useful to when user wan to change product root path from product config xml, then also
	 * a root path declaration is required in mPlayerConfig xml file to adopt the new root path in require js at run time
	 *
	 * @param {Object} objPathData
	 * @return None
	 * @memberof Main#
	 * @acccess private
	 */
	PlayerDataInitalizer.prototype.setRootNameSpace = function(objPathData) {
		/*
		 if (objPathData.keyword !== undefined && objPathData.relativePath !== undefined) {
		 this.objRequireConfigData.paths[objPathData.keyword] = objPathData.relativePath;
		 require.config(this.objRequireConfigData);
		 }
		 */
	};

	PlayerDataInitalizer.prototype.makeDraggable = function(objTarget) {
		objTarget.draggable({
			containment : 'document'
		});
		//$(objTarget).css("position", "absolute");
	};

	/**
	 * This is handler function for data loader, if loading failes
	 * @param None
	 * @return None
	 * @memberof Main#
	 * @acccess private
	 */
	PlayerDataInitalizer.prototype.handleDataLoadFailed = function() {
		this.dataLoader.off(this.dataLoader.DATA_LOAD_SUCCESS);
		this.dataLoader.off(this.dataLoader.DATA_LOAD_FAILED);
	};

	/**
	 * Method 'scaleMPlayer' is responsible to update the playersize when scaled value set to true
	 * in playerConfig file.
	 *
	 * Also this method is wrapped in debounce method to avoid multiple calls during resize.
	 * browser very frequently.
	 * @param {Object} objSize
	 * @return None
	 * @memberof Main#
	 * @acccess private
	 */
	PlayerDataInitalizer.prototype.scaleMPlayer = _.debounce(function(objSize, objClassref) {
		var nUpdatedTop = 0, nScalePercent, objChild, nChildWidth, nChildHeight, playerWidth, playerHeight, scaleFunc, cssObj, nUpdatedLeft = 0;
		nScalePercent = 1;
		objChild = objClassref.playerDiv;
		nChildWidth = objClassref.playerContainerDiv.width();
		nChildHeight = objClassref.playerContainerDiv.height();
		playerWidth = this.DEFAULT_PLAYER_WIDTH;
		playerHeight = this.DEFAULT_PLAYER_HEIGHT;

		if (objSize.hasOwnProperty('width')) {
			playerWidth = objSize.width;
		}
		if (objSize.hasOwnProperty('height')) {
			playerHeight = objSize.height;
		}

		if ((playerWidth / playerHeight) > (nChildWidth / nChildHeight)) {
			nScalePercent = nChildWidth / playerWidth;
		} else {
			nScalePercent = nChildHeight / playerHeight;
		}

		if (nScalePercent > objSize.scale.maxScale) {
			nScalePercent = objSize.scale.maxScale;
		}

		if (nScalePercent < objSize.scale.minScale) {
			nScalePercent = objSize.scale.minScale;
		}
		//stageScale = nScalePercent;
		scaleFunc = "scale(" + nScalePercent + ")";
		cssObj = {};

		if (objSize.align.horizontal === "center") {
			nUpdatedLeft = (nChildWidth - (objChild.width() * nScalePercent)) / 2;
		} else if (objSize.align.horizontal === "left") {
			nUpdatedLeft = 0;
		}
		if (nUpdatedLeft < 0) {
			nUpdatedLeft = 0;
		}
		cssObj.left = nUpdatedLeft + "px";

		if (objSize.align.vertical === "middle") {
			nUpdatedTop = (nChildHeight - (objChild.height() * nScalePercent)) / 2;
		} else if (objSize.align.vertical === "top") {
			nUpdatedTop = 0;
		}
		if (nUpdatedTop < 0) {
			nUpdatedTop = 0;
		}
		//applying new scaled value.
		cssObj.top = nUpdatedTop + "px";

		cssObj.transform = scaleFunc;
		cssObj["-ms-transform"] = scaleFunc;
		cssObj["-moz-transform"] = scaleFunc;
		cssObj["-webkit-transform"] = scaleFunc;
		cssObj["-o-transform"] = scaleFunc;
		cssObj["transform-origin"] = "0% 0%";
		cssObj["-ms-transform-origin"] = "0% 0%";
		cssObj["-moz-transform-origin"] = "0% 0%";
		cssObj["-webkit-transform-origin"] = "0% 0%";
		cssObj["-o-transform-origin"] = "0% 0%";
		$(objChild).css(cssObj);
		objClassref.updateNewScaledValue(nScalePercent);
		objClassref.Popup_Manager.setScreenInCenter();
		objClassref.setPreloaderInCenter();
		objClassref.playerDiv.show();
	}, 50);
	// this.delayTime);

	/**
	 * This function updates the size of the player container. It also
	 * adds listener for activity region so that the activity area
	 * can be resized according to the header and footer.
	 * @access private
	 * @param {Object} objPlayerSize Player config data
	 * @return None
	 * @memberof Main#
	 */
	PlayerDataInitalizer.prototype.updatePlayerSize = _.debounce(function(objPlayerSize, objClassref) {
		var nPlayerWidth, nPlayerHeight, nUpdatedLeft, nUpdatedTop, objChild, nChildWidth, nChildHeight, cssObj;
		nPlayerWidth = this.DEFAULT_PLAYER_WIDTH;
		nPlayerHeight = this.DEFAULT_PLAYER_HEIGHT;

		nChildWidth = objClassref.playerContainerDiv.width();
		nChildHeight = objClassref.playerContainerDiv.height();
		objChild = objClassref.playerDiv;
		if (objPlayerSize) {

			if (objPlayerSize.hasOwnProperty('width')) {
				nPlayerWidth = parseInt(objPlayerSize.width, 10);
				if (isNaN(nPlayerWidth) || nPlayerWidth <= 0) {
					objChild.css("width", "100%");
				} else {
					objChild.width(nPlayerWidth);
				}
			} else {
				objChild.css("width", "100%");
			}

			if (objPlayerSize.hasOwnProperty('height')) {
				nPlayerHeight = parseInt(objPlayerSize.height, 10);
				if (isNaN(nPlayerHeight) || nPlayerHeight <= 0) {
					objChild.css("height", "100%");
				} else {
					objChild.height(nPlayerHeight);
				}
			} else {
				objChild.css("height", "100%");
			}
		}
		// set alignment
		cssObj = {};
		if (objPlayerSize.align.horizontal === "center") {
			nUpdatedLeft = (nChildWidth - objChild.width()) / 2;
		} else if (objPlayerSize.align.horizontal === "left") {
			nUpdatedLeft = 0;
		}
		// if left is negative, set it zero
		if (nUpdatedLeft < 0) {
			nUpdatedLeft = 0;
		}

		cssObj.left = nUpdatedLeft + "px";

		if (objPlayerSize.align.vertical === "middle") {
			nUpdatedTop = (nChildHeight - objChild.height()) / 2;
		} else if (objPlayerSize.align.vertical === "top") {
			nUpdatedTop = 0;
		}

		// if top is negative, set it zero
		if (nUpdatedTop < 0) {
			nUpdatedTop = 0;
		}

		cssObj.top = nUpdatedTop + "px";
		objChild.css(cssObj);

		objClassref.playerDiv.show();
		objClassref.Popup_Manager.setScreenInCenter();
		// set preloader's position
		objClassref.setPreloaderInCenter();
	}, 50);
	//delayTime);

	/**
	 * here we are using debounce method to avoid multiple calls during
	 * resize event, this will reduce extra load on system, and will be very
	 * useful when applicaiton is running on lower memory devices.
	 * here we are making sure that updatePlayerScaleValue will be called
	 * only once during specified delayTime
	 * @param {Function} updated scale value
	 * @return None
	 * @memberof Main#
	 * @acccess private
	 */
	PlayerDataInitalizer.prototype.updateNewScaledValue = function(updatedValue) {
		updatedValue = Number(updatedValue).toFixed(2);
		this.mPlayer.getPlayerHelper().updatePlayerScaleValue(updatedValue);
	};

	/**
	 * @description This function sets the preloader div into the center
	 * @param None
	 * @return None
	 * @memberof Main#
	 * @acccess private
	 */
	PlayerDataInitalizer.prototype.setPreloaderInCenter = function() {
		var l, t, preloaderDiv = $("#preloaderContent");
		if (preloaderDiv.hasClass("container")) {
			preloaderDiv.removeClass("container");
		}
		l = (window.innerWidth - preloaderDiv.width()) / 2;
		t = (window.innerHeight - preloaderDiv.height()) / 2;
		preloaderDiv.css('left', l + "px");
		preloaderDiv.css('top', t + "px");
	};

	PlayerDataInitalizer.prototype.handlePlayerCommonTask = function(objEvent) {
		var strTask = objEvent.task;
		switch(strTask) {
		case "updatePlayerSizeEvent":
			this.handlePlayerRegionsShow();
			break;
		}
	};

	/**
	 * Method   'onPlayerInitlizeCompleteEvent' is bind with the 'playerInitlizeCompleteEvent'
	 * event. which invoked only one time in a player life cycle.
	 *
	 * from here we can notfiy the outer world that player is ready.
	 */
	PlayerDataInitalizer.prototype.onPlayerInitlizeCompleteEvent = function(objEvent) {
		this.testMethod();
		this.handlePlayerRegionsShow();
		this.mPlayer.off("playerInitlizeCompleteEvent");
		this.launchPopup();
	};

	PlayerDataInitalizer.prototype.launchPopup = function() {
		var strPopupId, popupData;
		popupData = this.mPlayer.getPlayerHelper().getRegionManager().getInlineTemplateData();
		this.Popup_Manager.setBlockerDivRef(popupData.templatePopupBlocker);
		this.Popup_Manager.setPopupTemplateRef(popupData);

		if (jQuery.url.param("popupId") !== undefined) {
			strPopupId = jQuery.url.param("popupId");
			this.Popup_Manager.launchAsPopup(strPopupId, null, true, this, "testinMain");
		}
	};

	PlayerDataInitalizer.prototype.testMethod = function() {
		//console.log("tesetMethd......");
	};
	/**
	 * Destroys Helper
	 * @param None
	 * @return None
	 * @access private
	 * @memberof PlayerDataInitalizer#
	 */
	PlayerDataInitalizer.prototype.destroy = function() {
		//remove region reference todo
		this.mPlayer.mActivity.off('show');
		this.mPlayer.mActivity.off('UPDATE_ACTIVITY_SIZE');
		this.mPlayer.off("playerInitlizeCompleteEvent");
		this.mPlayer.off("playerCommonTaskEvent");
	};

	return PlayerDataInitalizer;
});
