/*jslint nomen: true */
/*globals Backbone,_,$,jQuery, console*/

/**
 * PlayerHelper
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(['marionette', 'player/constants/playerconst', 'player/manager/region-manager', 'player/manager/editor-manager', 'player/manager/media-manager', "underscore", 'player/model/mplayer-model', 'player/manager/factory-manager', 'player/factory/factory', 'player/constants/errorconst', 'player/manager/webservice-manager'],
//'player/manager/EventManager',  -- will be removed.

/**
 * Class is introduced to help and Handle the mPlayer task at high level.
 *
 * This class is only class which have the direct access at player level and can communicate directly.
 *
 * MPlayerHelper class manage Player task e.g creating activity region/factory/theme/local support and also
 * create model for player level.
 *
 * This class is responsible to manage every task of player, few of them are managed by itself e.g applying/remove theme and
 * some tasks are managing by manager level obects which are created by itself.  e.g 'Regions' are managing by ActivityManager object.
 *
 * @class PlayerHelper
 * @access private
 * @example
 * var playerHelper = new PlayerHelper();
 */
function(Marionette, PlayerConst, RegionManager, Editormanager, MediaManager, _, mPlayerModelRef, FactoryManager, FactoryComp, errorConst, WebServiceManager) {
	'use strict';
	var PlayerHelper;

	PlayerHelper = Backbone.Marionette.Controller.extend({

		objPlayerRef : undefined,
		objWebServiceManager : undefined,
		objRegionManager : undefined,
		objMediaManager : undefined,
		objEditorManager : undefined,
		objFactoryManager : undefined,
		objDrawingManager : undefined,
		bDrawingMode : undefined,
		nUpdatedScaleValue : undefined,
		objTinCanManager : undefined,

		constructor : function(playerRef) {
			this.objPlayerRef = playerRef;
			this.objDrawingManager = undefined;
			this.bDrawingMode = false;
			this.nUpdatedScaleValue = 1;
		}
	});

	/**This function initializes the player helper
	 * @access private
	 * @memberof PlayerHelper#
	 * @param None
	 * @returns None
	 */
	PlayerHelper.prototype.initlize = function() {

		this.setTheme();

		this.getTinCanManager();

		this.initWebServiceManager();

		//will add drawing capabilites if value set in config file
		this.bDrawingMode = this.initDrawingManager();

		//initlizing Activity Manager.
		this.initlizeActivityManager();

		//initlizing Factory Manager.
		this.initlizeFactoryManager();

		//creating editor
		this.initEditor();

		//lauch the default activity.
		this.launchDefaultActivity();

	};

	PlayerHelper.prototype.initWebServiceManager = function() {
		if (this.objPlayerRef.getPlayerConfig().webService) {
			this.objWebServiceManager = new WebServiceManager(this.objPlayerRef, this.objPlayerRef.getPlayerConfig().webService);
			this.registerManagersEvent(this.objWebServiceManager);
		}
	};

	PlayerHelper.prototype.getTinCanManager = function() {
		var objClassRef = this;
		if (this.objPlayerRef.getPlayerConfig().tinCan) {
			require(['player/manager/tincan-manager'], function(TinCanManager) {
				objClassRef.objTinCanManager = new TinCanManager(objClassRef.objPlayerRef, objClassRef.objPlayerRef.getPlayerConfig().tinCan);
				objClassRef.registerManagersEvent(objClassRef.objTinCanManager);
			});
		}
	};

	PlayerHelper.prototype.registerManagersEvent = function(objManager) {
		var objClassRef = this;
		objManager.on(PlayerConst.MANAGE_MANAGERS_EVENTS, objClassRef.handleManagerRequest, objClassRef);
		objManager.on("playerBubbleEvent", objClassRef.handlePlayerBubbleEvents, objClassRef);
		objManager.on("broadcastEvent", objClassRef.bubbleEvent, objClassRef);
	};

	/**This function initializes the Activity Manager
	 * @access private
	 * @memberof PlayerHelper#
	 * @param None
	 * @returns None
	 */
	PlayerHelper.prototype.initlizeActivityManager = function() {
		this.objRegionManager = new RegionManager(this.objPlayerRef, this.objPlayerRef.getPlayerConfig(), this.objPlayerRef.getActivityConfig(), mPlayerModelRef.getInstance(), this.bDrawingMode, this.objPlayerRef.getPopupTemplatesData());
		this.registerManagersEvent(this.objRegionManager);

	};

	/**This function initializes the Media Manager
	 * @access private
	 * @memberof PlayerHelper#
	 * @param None
	 * @returns None
	 */
	PlayerHelper.prototype.initMediaManager = function() {
		this.objMediaManager = new MediaManager(this.objPlayerRef);
	};

	/**This function initializes the Editor Manager
	 * @access private
	 * @memberof PlayerHelper#
	 * @param None
	 * @returns None
	 */
	PlayerHelper.prototype.initEditor = function() {
		this.objEditorManager = new Editormanager(this.objPlayerRef);
	};

	/**This function initializes the Activity Manager
	 * @access private
	 * @memberof PlayerHelper#
	 * @param None
	 * @returns None
	 */
	PlayerHelper.prototype.initlizeFactoryManager = function() {
		this.objFactoryManager = new FactoryManager(this.objPlayerRef);
	};

	/**This function is called when activity is initialized
	 * @access private
	 * @memberof PlayerHelper#
	 * @param None
	 * @returns None
	 */
	PlayerHelper.prototype.onActivityInitlized = function(strRegionId, bEditor) {
		this.objEditorManager.createEditorController(strRegionId, bEditor);
	};

	/**This function launches default activity
	 * @access private
	 * @memberof PlayerHelper#
	 * @param None
	 * @returns None
	 * @access private
	 */
	PlayerHelper.prototype.launchDefaultActivity = function() {
		var objConfigData = this.objPlayerRef.getActivityConfig();
		this.objRegionManager.initlizeAllRegions();
	};

	PlayerHelper.prototype.launchActivityInRegion = function(objEvent) {
		objEvent.playerId = this.objPlayerRef.getId();
		this.objPlayerRef.trigger(PlayerConst.MANAGE_PLAYER_COMMON_REQUEST, objEvent);
	};

	/**
	 * Method is responsible to initlize the drawing capabilites in
	 * player based on the player config data.
	 * @param none
	 * @return {Boolean} isDrawingEnabled true|false the default value is false
	 * @access private
	 * @memberof mPlayerHelper
	 */
	PlayerHelper.prototype.initDrawingManager = function() {
		var isDrawingEnabled = false, objClassRef = this;

		if (this.objPlayerRef.getPlayerConfig().drawing !== undefined) {
			isDrawingEnabled = (this.objPlayerRef.getPlayerConfig().drawing.enable === "true") ? true : false;
		}

		//initlizing drawing manager if drawaing feature is enabled in playerConfig file.
		if (isDrawingEnabled === true) {
			require(['player/manager/drawing-manager'], function(DrawingManager) {
				objClassRef.objDrawingManager = new DrawingManager();
			});
		}

		return isDrawingEnabled;
	};

	PlayerHelper.prototype.onPlayerInitlizationComplete = function(objEvent) {
		this.objPlayerRef.onPlayerInitlizeComplete(objEvent);
	};

	/**Returns Drawing Manager
	 * @access private
	 * @memberof PlayerHelper#
	 * @param None
	 * @returns {Object}
	 * access private
	 */
	PlayerHelper.prototype.getDrawingManager = function() {
		return this.objDrawingManager;
	};

	/**Returns editor Manager
	 * @access private
	 * @memberof PlayerHelper#
	 * @param None
	 * @returns {Object}
	 */
	PlayerHelper.prototype.getEditorManager = function() {
		return this.objEditorManager;
	};

	/**
	 * Return the Activity Manager referece.
	 * @access private
	 * @memberof PlayerHelper#
	 * @param None
	 * @returns {Object}
	 */
	PlayerHelper.prototype.getRegionManager = function() {
		return this.objRegionManager;
	};

	/**
	 * Return the Factory Manager referece.
	 * @access private
	 * @memberof PlayerHelper#
	 * @param None
	 * @returns {Object}
	 */
	PlayerHelper.prototype.getFactoryManager = function() {
		return this.objFactoryManager;
	};

	/**
	 * This function is show/hide the region area based on the provied data and state.
	 * @access private
	 * @memberof PlayerHelper#
	 * @param {Stirng} strRegionId
	 * @param {Boolean}
	 * @returns None
	 */
	PlayerHelper.prototype.showHideRegionById = function(strRegionId, bShow) {
		var objRegion = $("#" + strRegionId);
		if (objRegion) {
			if (bShow === true) {
				objRegion.show();
			} else {
				objRegion.hide();
			}
		} else {
			throw new Error(errorConst.NO_REGION_FIND + '[' + strRegionId + ']!!!');
		}
	};

	/**
	 * Responsible to show preloader
	 * @access private
	 * @memberof PlayerHelper#
	 * @param None
	 * @returns None
	 */
	PlayerHelper.prototype.showPreloader = function(objEvent) {
		if (objEvent && objEvent.message !== undefined) {
			$("#messageBody", $("#preloader")).html(objEvent.message).show();
		}
		$("#preloader").show();
	};

	/**
	 * Responsible to hide preloader
	 * @access private
	 * @memberof PlayerHelper#
	 * @param {Boolean} bShow
	 * @returns None
	 */
	PlayerHelper.prototype.hidePreloader = function(bShow) {
		$("#messageBody", $("#preloader")).hide();
		$("#preloader").hide();
	};

	/**
	 * Return the default lanague provided in player config,
	 * @param None
	 * @return None
	 * @access private
	 * @memberof PlayerHelper#
	 */
	PlayerHelper.prototype.getLocalLanguage = function() {
		var langName = this.objPlayerRef.getPlayerConfig().language["default"];
		if (jQuery.url.param("language") !== undefined) {
			langName = jQuery.url.param("language");
		}
		return langName;
	};

	/**
	 * Return the default setting provided in player config for preloader,
	 * @param None
	 * @return None
	 * @access private
	 * @memberof PlayerHelper#
	 */
	PlayerHelper.prototype.getPreloaderSetting = function() {
		var bShow = false;
		if (this.objPlayerRef.getPlayerConfig().showPreloader !== undefined) {
			bShow = (this.objPlayerRef.getPlayerConfig().showPreloader === "true");
		}
		return bShow;
	};

	/**
	 * function setTheme is responsible to manage and apply theme.
	 * @param None
	 * @return None
	 * @access private
	 * @memberof PlayerHelper#
	 */
	PlayerHelper.prototype.setTheme = function() {

		var objThemesNode, defaultThemeSuffix, prefix, strThemName, themeNode, strCSSPath, objClassRef = this;

		objThemesNode = this.objPlayerRef.getPlayerConfig().themes;
		if (objThemesNode === undefined) {
			return;
		}

		if (jQuery.url !== undefined) {
			defaultThemeSuffix = jQuery.url.param("theme");
		}

		if (defaultThemeSuffix === undefined) {
			defaultThemeSuffix = objThemesNode.defaultTheme;
		}

		prefix = objThemesNode.prefix;
		strThemName = prefix + defaultThemeSuffix;
		if (objThemesNode.theme.length === undefined) {
			themeNode = objThemesNode.theme;
		} else {
			themeNode = this.getThemeObject(objThemesNode, defaultThemeSuffix);
		}

		strCSSPath = 'css!' + themeNode.path;
		this.removeAllTheme(objThemesNode, prefix);
		require([strCSSPath], function() {
			$(objClassRef.objPlayerRef.playerDiv).addClass(strThemName);
		});
	};

	/**
	 * This method return the fetch the  theme node object from xml and return
	 * based on the given id.
	 * @access private
	 * @memberof PlayerHelper#
	 * @param {Object} objThemesNode
	 * @param {Object} id theme id
	 * @return None
	 */
	PlayerHelper.prototype.getThemeObject = function(objThemesNode, id) {
		var obj = _.filter(objThemesNode.theme, function(objTheme) {
			if (objTheme.id === id) {
				return objTheme;
			}
		});
		return obj[0];
	};

	/**
	 * Removing all themese before to apply new theme
	 * @access private
	 * @memberof PlayerHelper#
	 * @param {Object} objThemesNode
	 * @param {Object} prefix
	 * @return None
	 */
	PlayerHelper.prototype.removeAllTheme = function(objThemesNode, prefix) {
		_.filter(objThemesNode.theme, function(objTheme) {
			var strThemName = prefix + objTheme.id;
			//$('body').removeClass(strThemName);
		});
	};

	/**
	 * method 'updatePlayerScaleValue' will invoked every time when application resized/scaled
	 * and will update the each component and activity with the new scaled value of mPlayer with the
	 * help of 'ActivityManager' class.
	 *
	 * @param {Object} updatedValue New scaled value of mPlayer.
	 * @return None
	 * @access private
	 * @memberof PlayerHelper#
	 */
	PlayerHelper.prototype.updatePlayerScaleValue = function(updatedValue) {
		this.nUpdatedScaleValue = updatedValue;
		this.objRegionManager.setStageScaleValue(updatedValue);
	};

	PlayerHelper.prototype.bubbleEvent = function(objEvent) {
		objEvent.playerId = this.objPlayerRef.getId();
		this.objPlayerRef.trigger(objEvent.type, objEvent);
	};

	PlayerHelper.prototype.handlePlayerBubbleEvents = function(objEvent) {
		var objEventData = {};
		objEventData.target = this.objPlayerRef;
		objEventData.customData = objEvent.customData;
		this.objPlayerRef.trigger(objEvent.type, objEventData);
	};

	PlayerHelper.prototype.handleManagerRequest = function(objEvent) {
		switch(objEvent.requestTo) {
		case PlayerConst.WEB_SERVICE_MANAGER:
			this.objWebServiceManager.managerTask(objEvent);
			break;
		case PlayerConst.REGION_MANAGER:
			break;
		case PlayerConst.REGION_CHANGE_NOTIFICATION:
			objEvent.playerId = this.objPlayerRef.getId();
			this.objPlayerRef.trigger(PlayerConst.MANAGE_PLAYER_COMMON_REQUEST, objEvent);
			break;
		default:
			objEvent.playerId = this.objPlayerRef.getId();
			this.objPlayerRef.trigger(PlayerConst.MANAGE_PLAYER_COMMON_REQUEST, objEvent);
			break;
		}
	};

	PlayerHelper.prototype.broadcastEventHandler = function(objEvent) {
		if (objEvent.playerId !== this.objPlayerRef.getId()) {
			this.objRegionManager.handleBroadcastEventFromOtherPlayer(objEvent);
		}
	};

	PlayerHelper.prototype.managePlayerCommonTask = function(objEventData) {
		if (this.objPlayerRef.getId() !== objEventData.playerId) {
			this.objRegionManager.managePlayerCommonTask(objEventData);
		}
	};

	PlayerHelper.prototype.handleOutsideCall = function(objEventData) {
		var objDataToSend = {};
		objDataToSend.customData = objEventData.customData;
		this.objRegionManager.managePlayerCommand(objDataToSend);
	};

	/**
	 * 'setPlayerData' method invoked from player class,
	 * here we are passing data to region manager for further action
	 * @param {Object} objData data which needs to be deliver to activity
	 * @param {Array/String}
	 * @return none
	 * @access public
	 * @memberof PlayerHelper#
	 */
	PlayerHelper.prototype.setPlayerData = function(objData, regionsName) {
		this.getRegionManager().onDataReceivedFromWrapper(objData, regionsName);
	};

	PlayerHelper.prototype.handleNewPlayerCreation = function(objEvent) {
		console.log("handleNewPlayerCreation!!!!!!!!!!!!!!!!!!!!  ", objEvent);
	};

	/**
	 * Destroys Helper
	 * @param None
	 * @return None
	 * @access private
	 * @memberof PlayerHelper#
	 */
	PlayerHelper.prototype.destroy = function() {
		//add in error handler
		this.objRegionManager.destroy();
	};

	return PlayerHelper;
});
