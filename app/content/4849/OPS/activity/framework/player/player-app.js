/*jslint nomen: true*/
/*globals Backbone,jQuery,_,$,console*/
/**
 * mPlayer
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

define(['marionette', 'player/mplayer', 'player/mplayer-helper', 'player/mplayer-initalizer', 'player/constants/playerconst', 'jqueryUI'],

/** --------------- **/
function(Marionette, Player, PlayerHelper, PlayerInitalizer, PlayerConst) {
	'use strict';
	//var objConfigData, objActivityConfigData, objRouter, objActivityManager, objPlayerHelper, mApp;

	var PlayerApplication;
	//, mApp;
	/**
	 * Class mPlayer is the main class, and creating a object of Backbone.Marionette.Application() to use the
	 * Marionette features within the application.
	 *
	 * The mPlayer class is having a helper calss ,mPlayerHelper' class to manage its own work.
	 *
	 * The main responsibility of this class is create a object of Helper Class and pass the control.
	 *
	 * This class also have the referecne of playerconfig and activityconfig data.
	 *
	 * @class mPlayer
	 * @access private
	 * @example
	 * var playerHelper = new mPlayerHelper();
	 */
	// create new instance of marionette application
	PlayerApplication = new Backbone.Marionette.Application({
		//MPlayer = new Backbone.Marionette.Controller.extend({
		objConfigData : undefined,
		objActivityConfigData : undefined,
		objPopupTemplates : undefined,
		objPlayerInitalizer : undefined,
		arrProductConfig : undefined,
		objPlayerDict : undefined,
		playerIndex : 0,

		initalize : function(objPlayerData) {
			//	console.log(objPlayerData);
		}
	});

	/**
	 * when applicaton initalize itself 'addInitializer' method get fired.
	 * now we are ready to create mPlayer instance.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof PlayerApplication@
	 */
	PlayerApplication.addInitializer(function() {
		this.objPlayerDict = {};
		window.playersRef = {};
		this.getMPlayer(this.arrProductConfig[this.playerIndex]);
	});

	/**
	 * Getting player one by one
	 */
	PlayerApplication.getMPlayer = function(objProductConfigData) {
		var obPlayerjData = {}, playerId, objMPlayer;
		obPlayerjData.containerDiv = (objProductConfigData.containerDiv === undefined) ? "#playerContainer" : objProductConfigData.containerDiv;
		obPlayerjData.activityConfig = objProductConfigData.src;
		obPlayerjData.prefixId = (objProductConfigData.prefixId === undefined) ? "" : objProductConfigData.prefixId;
		obPlayerjData.mainApp = this;
		playerId = (objProductConfigData.playerId === undefined) ? "" : objProductConfigData.playerId;

		objMPlayer = new Player(obPlayerjData);
		objMPlayer.setId(playerId);
		this.objPlayerDict[playerId] = objMPlayer;
		objMPlayer.render();

		this.initPlayerEvents(this.arrProductConfig[this.playerIndex], this.objPlayerDict[playerId]);
		window.playersRef[playerId] = this.objPlayerDict[playerId];

		objMPlayer.on(objMPlayer.PLAYER_INITIALIZE_COMPLETE_EVENT, this.onPlayerCreationComplete, this);
		objMPlayer.on(objMPlayer.BROADCAST_EVENT, this.bubbleEvent, this);
		objMPlayer.on(objMPlayer.PLAYER_COMMON_EVENT, this.managePlayerCommonRequest, this);
	};

	PlayerApplication.bubbleEvent = function(objEvent) {
		var key;
		for (key in this.objPlayerDict) {
			if (this.objPlayerDict.hasOwnProperty(key)) {
				this.objPlayerDict[key].broadcastEventHandler(objEvent);
			}
		}
	};

	PlayerApplication.managePlayerCommonRequest = function(objEvent) {
		var key;
		for (key in this.objPlayerDict) {
			if (this.objPlayerDict.hasOwnProperty(key)) {
				this.objPlayerDict[key].managePlayerCommonTask(objEvent);
			}
		}
	};

	PlayerApplication.onPlayerCreationComplete = function(objEvent) {
		this.objPlayerDict[objEvent.target.getId()].off(this.objPlayerDict[objEvent.target.getId()].PLAYER_INITIALIZE_COMPLETE_EVENT);
		//this.initPlayerEvents(this.arrProductConfig[this.playerIndex], this.objPlayerDict[objEvent.target.getId()]);
		//window.playersRef[objEvent.target.getId()] = this.objPlayerDict[objEvent.target.getId()];
		this.playerIndex = this.playerIndex + 1;
		if (this.arrProductConfig[this.playerIndex] !== undefined) {
			this.getMPlayer(this.arrProductConfig[this.playerIndex]);
		}
	};

	PlayerApplication.initPlayerEvents = function(objPlayerData, objPlayerRef) {
		if (objPlayerData.drag === "true") {
			this.makeDraggable(objPlayerData.containerDiv);
		}
		if (objPlayerData.onEventBubble !== undefined) {
			objPlayerRef.on("playerBubbleEvent", window[objPlayerData.onEventBubble]);
		}
	};

	PlayerApplication.makeDraggable = function(objTarget) {
		$(objTarget).draggable({
			containment : 'document'
		});
	};

	/*
	PlayerApplication.addInitializer(function(objPlayerData) {
	//MPlayer.prototype.start = function(objPlayerData) {
	var i, bShowHide, arrRegions;
	this.objActivityConfigData = objPlayerData.activityConfig;
	arrRegions = this.objActivityConfigData.regions.region;
	this.objConfigData = objPlayerData.playerConfig;
	this.objRouter = objPlayerData.router;
	this.objPopupTemplates = objPlayerData.popupTemplates;

	if (arrRegions.length > 0) {
	for ( i = 0; i < arrRegions.length; i += 1) {
	if (objPlayerData.queryData !== undefined) {
	if (arrRegions[i].id === objPlayerData.queryData.region && objPlayerData.queryData.defaultAct !== undefined) {
	arrRegions[i].activities.defaultLaunchID = objPlayerData.queryData.defaultAct;
	}
	}
	}
	}

	//initlizing player helper and passing the player reference.
	this.objPlayerHelper = new PlayerHelper(this);
	this.objPlayerHelper.initlize();

	// show or hide header/footer as per the player config.

	if (arrRegions.length > 0) {
	for ( i = 0; i < arrRegions.length; i += 1) {

	bShowHide = true;
	if (arrRegions[i].type === PlayerConst.REGION_TYPE_HEADER) {
	if (this.objConfigData.header.visible === "false") {
	bShowHide = false;
	}
	}

	if (arrRegions[i].type === PlayerConst.REGION_TYPE_FOOTER) {
	if (this.objConfigData.footer.visible === "false") {
	bShowHide = false;
	}
	}
	//this.objPlayerHelper.showHideRegionById(arrRegions[i].id, bShowHide);
	}
	}
	});
	*/

	/**
	 * Invoked when initlisation of all region is done
	 * @param objEvent
	 * @return none
	 * @access privatge
	 * @memberof #mPlayer
	 */
	PlayerApplication.onPlayerInitlizeComplete = function(objEvent) {
		objEvent.target = this;
		//triggering a event to notify the main app for its completion
		this.trigger(objEvent.type, objEvent);
	};

	/**
	 * Return the player config data
	 * @access private
	 * @memberof MPlayer
	 * @param None
	 * @return {Object} objConfigData
	 */
	PlayerApplication.getPlayerConfig = function() {
		return this.objConfigData;
	};

	/**
	 * Return the Activity Config data
	 * @access private
	 * @memberof MPlayer
	 * @param None
	 * @return {Object} objActivityConfigData
	 */
	PlayerApplication.getActivityConfig = function() {
		return this.objActivityConfigData;
	};

	PlayerApplication.getPopupTemplatesData = function() {
		return this.objPopupTemplates;
	};

	/**
	 * Method 'startPlayerInitalizer' invoked from main when product config
	 * loaded sucessfully.
	 * @param {Object} productConfigData
	 */
	PlayerApplication.startPlayerInitalizer = function(productConfigData) {
		//valdaing data if array then do nothing otherwise we need to
		//convert config data into array
		if (_.isArray(productConfigData) === true) {
			this.arrProductConfig = productConfigData;
		} else {
			this.arrProductConfig = [productConfigData];
		}

		//start initalization
		this.start();
	};

	PlayerApplication.onPlayerInitializeComplete = function(objEvent) {
		//console.log("in Application......onPlayerInitializeComplete!!!!!!!!!", objEvent);
	};

	PlayerApplication.onPlayerDataInitComplete = function(objEvent) {
		this.start(objEvent);
	};

	/**
	 * Return the Activity Config data
	 * @access private
	 * @memberof MPlayer
	 * @param None
	 * @return {Object} objActivityConfigData
	 */
	PlayerApplication.destroy = function() {
		var objMPlayer, key;
		for (key in this.objPlayerDict) {
			if (this.objPlayerDict.hasOwnProperty(key)) {
				objMPlayer = this.objPlayerDict[key];
				objMPlayer.off(objMPlayer.PLAYER_INITIALIZE_COMPLETE_EVENT);
				objMPlayer.off(objMPlayer.BROADCAST_EVENT);
				objMPlayer.off(objMPlayer.PLAYER_COMMON_EVENT);
			}
		}
		this.objPlayerDict = {};
	};

	return PlayerApplication;
});
