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

define(['marionette', 'player/mplayer-helper', 'player/mplayer-initalizer', 'player/constants/playerconst', 'jqueryUI'], function(Marionette, PlayerHelper, PlayerInitalizer, PlayerConst) {
	'use strict';
	//var objConfigData, objActivityConfigData, objRouter, objActivityManager, objPlayerHelper, mApp;

	var MPlayer;
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
	MPlayer = new Backbone.Marionette.Controller.extend({
		//MPlayer = new Backbone.Marionette.Controller.extend({
		objConfigData : undefined,
		objActivityConfigData : undefined,
		objPopupTemplates : undefined,
		objRouter : undefined,
		objActivityManager : undefined,
		objPlayerHelper : undefined,

		initalize : function(objPlayerData) {
			//	console.log(objPlayerData);
		}
	});

	MPlayer.prototype.startPlayer = function(objPlayerData) {
		//MPlayer.prototype.start = function(objPlayerData) {
		var i, bShowHide, arrRegions;
		console.log("player start..........");
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
	};

	/**
	 * Invoked when initlisation of all region is done
	 * @param objEvent
	 * @return none
	 * @access privatge
	 * @memberof #mPlayer
	 */
	MPlayer.onPlayerInitlizeComplete = function(objEvent) {
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
	MPlayer.getPlayerHelper = function() {
		return this.objPlayerHelper;
	};

	/**
	 * Return the player config data
	 * @access private
	 * @memberof MPlayer
	 * @param None
	 * @return {Object} objConfigData
	 */
	MPlayer.getPlayerConfig = function() {
		return this.objConfigData;
	};

	/**
	 * Return the Activity Config data
	 * @access private
	 * @memberof MPlayer
	 * @param None
	 * @return {Object} objActivityConfigData
	 */
	MPlayer.getActivityConfig = function() {
		return this.objActivityConfigData;
	};

	MPlayer.getPopupTemplatesData = function() {
		return this.objPopupTemplates;
	};

	MPlayer.startPlayerInitalizer = function(configFilePath) {
		console.log("in start player initalizer...");
		new PlayerInitalizer(configFilePath, this);
	};

	/**
	 * Return the Activity Config data
	 * @access private
	 * @memberof MPlayer
	 * @param None
	 * @return {Object} objActivityConfigData
	 */
	MPlayer.destroy = function() {
		return objPlayerHelper.destroy();
	};

	return MPlayer;
});
