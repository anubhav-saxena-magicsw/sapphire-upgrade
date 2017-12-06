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

define(['marionette', 'player/mplayer-helper', 'player/mplayer-initalizer', 'player/constants/playerconst', 'jqueryUI'], function(Marionette, PlayerHelper, PlayerInitializer, PlayerConst) {
	'use strict';
	//var objConfigData, objActivityConfigData, objRouter, objActivityManager, objPlayerHelper, mApp;

	var MPlayer;
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
	//MPlayer = new Backbone.Marionette.Application({
	MPlayer = Backbone.Marionette.Layout.extend({
		objConfigData : undefined,
		objActivityConfigData : undefined,
		objPopupTemplates : undefined,
		objRouter : undefined,
		objActivityManager : undefined,
		objPlayerHelper : undefined,
		objPlayerInitalizer : undefined,
		objApplication : undefined,
		playerDiv : undefined,
		playerId : undefined,
		objPlayerData : undefined,

		template : _.template('<div></div>'),

		PLAYER_INITIALIZE_COMPLETE_EVENT : "playerInitlizeCompleteEvent",
		PLAYER_INIT_COMPLETE : "playerInitComplete",
		BROADCAST_EVENT : "broadcastEvent",
		PLAYER_COMMON_EVENT : "managePlayerCommonRequest",

		initialize : function(playerData) {
			this.objPlayerData = playerData;
			this.objApplication = playerData.mainApp;
			this.playerDiv = playerData.containerDiv;
		},

		onRender : function() {
			this.startPlayerInitalizer(this.objPlayerData);
		}
	});

	MPlayer.prototype.start = function(objPlayerData) {
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
		this.objPlayerHelper = new PlayerHelper(this, this.objApplication);
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
			}
		}
	};

	/**
	 * Invoked when initlisation of all region is done
	 * @param objEvent
	 * @return none
	 * @access privatge
	 * @memberof #mPlayer
	 */
	MPlayer.prototype.onPlayerInitlizeComplete = function(objEvent) {
		objEvent.target = this;
		//triggering a event to notify the main app for its completion
		this.trigger(objEvent.type, objEvent);
	};

	/**
	 * return the playerHelper reference
	 * @access private
	 * @memberof MPlayer
	 * @param None
	 * @return {Object} objPlayerHelper
	 */
	MPlayer.prototype.getPlayerHelper = function() {
		return this.objPlayerHelper;
	};

	MPlayer.prototype.broadcastEventHandler = function(objEvent) {
		this.objPlayerHelper.broadcastEventHandler(objEvent);
	};

	/**
	 * Return the player config data
	 * @access private
	 * @memberof MPlayer
	 * @param None
	 * @return {Object} objConfigData
	 */
	MPlayer.prototype.getPlayerConfig = function() {
		return this.objConfigData;
	};

	/**
	 * Return the Activity Config data
	 * @access private
	 * @memberof MPlayer
	 * @param None
	 * @return {Object} objActivityConfigData
	 */
	MPlayer.prototype.getActivityConfig = function() {
		return this.objActivityConfigData;
	};

	MPlayer.prototype.getPopupTemplatesData = function() {
		return this.objPopupTemplates;
	};

	MPlayer.prototype.startPlayerInitalizer = function(objPlayerData) {
		var objPlayerInitializer = new PlayerInitializer(this);
		objPlayerInitializer.start(objPlayerData, this.objApplication);
		objPlayerInitializer.on(objPlayerInitializer.PLAYER_DATA_INIT_COMPLETE, this.onPlayerDataInitComplete, this);
	};

	MPlayer.prototype.onPlayerDataInitComplete = function(objEvent) {
		this.start(objEvent);
	};

	MPlayer.prototype.getId = function() {
		return this.playerId;
	};

	MPlayer.prototype.setId = function(id) {
		this.playerId = id;
		this.id = this.playerId;
	};

	MPlayer.prototype.getRegion = function(strRegionId) {
		var objRegion;
		if (this.objApplication) {
			objRegion = this.objApplication[strRegionId];
		} else {
			objRegion = this[strRegionId];
		}
		return objRegion;
	};

	MPlayer.prototype.managePlayerCommonTask = function(objEventData) {
		if (this.objPlayerHelper) {
			this.objPlayerHelper.managePlayerCommonTask(objEventData);
		}
	};

	MPlayer.prototype.handleOutsideCall = function(objEventData) {
		this.objPlayerHelper.handleOutsideCall(objEventData);
	};

	/**
	 * 'setPlayerData' API introduced
	 */
	MPlayer.prototype.setPlayerData = function(objData, regionsName) {
		this.objPlayerHelper.setPlayerData(objData, regionsName);
	};

	/**
	 * Return the Activity Config data
	 * @access private
	 * @memberof MPlayer
	 * @param None
	 * @return {Object} objActivityConfigData
	 */
	MPlayer.prototype.destroy = function() {
		return this.objPlayerHelper.destroy();
	};

	return MPlayer;
});
