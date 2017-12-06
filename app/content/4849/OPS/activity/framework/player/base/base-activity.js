/*jslint nomen: true*/
/*globals Backbone,$,console,_*/
/*jshint -W065*/

/**
 * BaseActivity
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */

define(['marionette', 'player/events/eventsconst', 'player/manager/popup-manager', 'player/constants/errorconst', 'player/controllers/tincan-controller'],

/**
 * @class BaseActivity
 * Class 'BaseActivity' is introduced to enable an activity to use framework feature and aPI. This class must be extended by an activity to lauch itself
 * with in framework (mPlayer) environment.
 */
function(marionette, objActEvent, PopupManagerClass, errorConst, TinCanController) {
	'use strict';
	var BaseActivity;

	/**
	 * @class BaseActivity
	 * Class 'BaseActivity' is introduced to enable an activity to use framework feature and aPI. This class must be extended by an activity to lauch itself
	 * with in framework (mPlayer) environment.
	 *
	 * By extending this class a 'acitity' can broadcast/listen global event (Event broadcaster is a mechanism to build a communication channel between more then one activity)
	 * can create new component with the help of 'getComponent' method, also activity will enable to Play background audio, and update volume level as well.
	 *
	 * This class have many external API to support an activity to perform various task at player level few of them are as below:
	 * <i>getID, getLanguageName, getStageScaleValue, showPreloader, hidePreloader
	 * broadcastEvent, broadcastEventReceiver, stopBroadcastEventReceiver, getScreenText
	 * customEventDispatcher, showHideRegionById, attachListener, deattachListener,
	 * launchPreviousActivity, jumpToActivityByIndex, jumpToActivityByID, launchNextActivity</i>
	 *
	 *@augments Backbone.Marionette.Layout
	 *@example
	 *Load module
	 *
	 require(['player/base/BaseActivity'], function(BaseActivity) {
	 var myActivity = BaseActivity.extend({
	 template : _.template(htmlBody),
	 initialize : function() {
	 },

	 onRender : function() {
	 this.initBaseActivity();
	 });

	 myActivity.prototype.__super__ = BaseActivity;
	 myActivity.prototype.destroy = function() {
	 return this.__super__.prototype.destroy(true);
	 };

	 return myActivity;

	 *});
	 */

	BaseActivity = Backbone.Marionette.Layout.extend({
		bEditor : false,
		className : "defaultActivityStyle",
		ActivityEventConst : objActEvent,
		strActivityName : undefined,
		nActivityIndex : undefined,
		isBaseActivity : true,
		isDestroyCalled : false,
		nStageScale : 1,
		localLangName : undefined,
		objEventController : undefined,
		groupName : undefined,
		modelName : undefined,
		localText : undefined,
		strName : undefined,
		allRegionData : undefined,
		allRegionActivityList : undefined,
		//component reference which are created through html entry.
		mComp : {},
		activityRegionId : undefined,
		objErrConst : errorConst,
		PopupManager : undefined,
		//tool box reference
		toolbox : undefined,
		objInlineTmplDict : undefined,
		strRegionName : undefined,
		popupData : null,
		popupCounter : 0,
		popupDiv_dict : {},
		broadcastEventDict : undefined
	});

	BaseActivity.prototype.preinitialize = function() {
		// This function might get deprecated at later release versions.
	};

	/**
	 * By oveririding this method an activity can do their post initlization task. if any 'Actiivity' want to
	 * perform any task before its initlization process then activity need to override this method.
	 *
	 *@memberof BaseActivity#
	 *@access public
	 *@param None
	 *@returns None
	 */
	BaseActivity.prototype.postInitialize = function() {
		//console.log("post initlization Task!!!!!!!!!");
	};

	/**
	 * This method invoked every time when an activity initlization process is complete
	 * By overriding this method an activty will get notify when their all component created
	 * and intlizaed.
	 *
	 *@memberof BaseActivity#
	 *@access public
	 *@param None
	 *@returns None
	 */
	BaseActivity.prototype.onActivityCreationComplete = function() {
		//console.log("onActivityCreationComplete!!!!!!!!!");
	};

	/**

	 *
	 * This method is introduced to provide a notification to an activity when change event
	 * occured in any region(activity area)
	 *
	 * If any activity want to get the regions change notification then this method must be overridden
	 * in activity js file.
	 * @access public
	 * @param {Object} objData Contain region name and its activity details
	 * @return None
	 * @memberof BaseActivity#
	 */
	BaseActivity.prototype.getRegionChangeNotification = function(objData) {
		//console.log("in base activity.. getRegionChangeNotification.....", objData, this.strActivityName);
	};

	/**
	 * This method will be invoked only one time in a player life cycle when all regions
	 * of a player is initlzed at very first time.
	 *
	 * Activity must be override this method to get notification of a player ready complete event.
	 *
	 * @param none
	 * @return none
	 * @access public
	 * @memberof BaseActivity
	 */
	BaseActivity.prototype.onPlayerInitComplete = function() {
		//console.log("player init complete..... ");
	};

	/**
	 * Method setData is the very first method which executed by its controller class to set the
	 * data in scope of activity level, and make sure that data is available to activity before 'initliaze and preinitialize' method
	 * called.
	 * @param {Object} objData data
	 * @return none
	 * @access private
	 * @memberof BaseActivity#
	 */
	BaseActivity.prototype.setData = function(objData) {
		this.objInlineTmplDict = objData;
	};

	/**
	 *A unique id provided by framework to each activity.
	 *@memberof BaseActivity#
	 *@param {String} strID avtivityID to be assigned.
	 *@returns None
	 *@access public
	 */
	BaseActivity.prototype.setID = function(strID) {
		this.strActivityName = strID;
	};

	/**
	 * Return the activity id which is assiged by the framework
	 *@memberof BaseActivity#
	 *@access public
	 *@param None
	 *@returns {String} acitivity id.
	 */
	BaseActivity.prototype.getID = function() {
		return this.strActivityName;
	};

	/**
	 * By calling this method an 'Activity' initlize itself with the framework.
	 * @memberof BaseActivity#
	 *@access public
	 * @param None
	 * @returns None
	 */
	BaseActivity.prototype.initBaseActivity = function() {
		var AudioContext;
		this.broadcastEventDict = {};
		this.broadcastEventReceiver(this.ActivityEventConst.MANAGE_COMMON_BROADCAST_EVENT, this, "manageCommonBroadcastEvent");
		this.PopupManager = PopupManagerClass;
		this.ActivityEventConst = objActEvent;
		AudioContext = window.AudioContext || window.webkitAudioContext;
		if (AudioContext) {
			this.bWebApiEnable = true;
		}
	};

	/**
	 * Return the toolbox reference.
	 */
	BaseActivity.prototype.getToolbox = function() {
		return this.toolbox;
	};

	/**
	 * User can preseve activity state.
	 * @param {Object} objState
	 * @returns None
	 *@access public
	 * @memberof BaseActivity#
	 */
	BaseActivity.prototype.setState = function(objState) {

	};

	/**
	 * resetActivity
	 * @param None
	 * @memberof BaseActivity#
	 * @returns None
	 * @access public
	 */
	BaseActivity.prototype.resetActivity = function() {
	};

	/**
	 * Help activity to unload itself from the framework.
	 * @param None
	 * @returns None
	 * @access public
	 * @memberof BaseActivity#
	 */
	BaseActivity.prototype.endActivity = function() {
		this.trigger(this.ActivityEventConst.ACTIVITY_END_EVENT, this);
	};

	/**
	 * Method is introduced to launch any activity by their index.
	 * @param {int} activityIndex
	 * @returns None
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.jumpToActivityByIndex = function(activityIndex) {
		this.activityIndex = activityIndex;
		this.trigger(this.ActivityEventConst.JUMP_TO_ACTIVITY_BY_INDEX_EVENT, this);
	};

	/**
	 * Help user to launch an activity by their id, 'ID' must be same as provided in activity config file.
	 * @param {String} activityID
	 * @returns None
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.jumpToActivityByID = function(activityID) {
		this.activityID = activityID;
		this.trigger(this.ActivityEventConst.JUMP_TO_ACTIVITY_BY_ID_EVENT, this);
	};

	/**
	 * Help to launch next activity, the actvitity indexing is starting from 0,
	 * if currnet loaded activity is "1" and 'launchNextActivity' invoked then the 'Activity' fall at
	 * index 2 will be launched.
	 *
	 * @param None
	 * @returns None
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.launchNextActivity = function() {
		this.trigger(this.ActivityEventConst.ACTIVITY_GO_TO_NEXT_ACTIVITY_EVENT, this);
	};

	/**
	 * Help to trigger user action after clicking save button
	 * @param None
	 * @returns None
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.userActionPerform = function() {
		this.trigger(this.ActivityEventConst.USER_ACTION, this);
	};

	/**
	 *
	 * This method Help to launch previous activity, the actvitity indexing is starting from 0,
	 * if currnet loaded activity is "1" and method 'launchNextActivity' called then the 'Activity' fall at
	 * index 0 will be launched.
	 *
	 * @param None
	 * @returns None
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.launchPreviousActivity = function() {
		this.trigger(this.ActivityEventConst.ACTIVITY_GO_TO_PREVIOUS_ACTIVITY_EVENT, this);
	};

	/**
	 * Framework set the event controller object.
	 * A Event controller object is an object which help the activity to manage events of activity elements.
	 * @param {Object} evtController EventController object allow activity to register its elements event with the framework
	 * @returns None
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.setEventController = function(evtController) {
		this.objEventController = evtController;
	};

	/**
	 * Introduced to allow an activity to hide any region if required. e.g hide/show footer area region.
	 * This method work on based on the provied region id which must be same as activity config file.
	 *
	 * @param {String} strRegionID Region id which need to show or hide.
	 * @param {Boolea} bShow Possible value will be true/false
	 * @returns None
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.showHideRegionById = function(strRegionId, bShow) {
		var objEventData = {};
		objEventData.task = this.ActivityEventConst.SHOW_HIDE_REGION;
		objEventData.type = this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT;
		objEventData.regionToHIde = strRegionId;
		objEventData.state = bShow;
		this.trigger(this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT, objEventData);
	};

	/**
	 * Fucntion attachListener responsible to bind the event(click/tap) with the object and
	 * manage to return the callback within the object scope.
	 *
	 * @param {Object} context callback method will be called within context scope, context can be the reference of activity.
	 * @param {Object} objTarget A jquery object/selector or mComp
	 * @param {String} strEventType Event Name e.g click,tap
	 * @param {Stirng} strCallBack Callback method name in string format.
	 * @returns None
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.attachListener = function(context, objTarget, strEventType, strCallBack) {
		this.objEventController.addEventListener(context, objTarget, strEventType, strCallBack);
	};

	/**
	 * Events registred with "attachListener" method can be unbind by calling deattachListener.
	 * @param {Object} objTarget A jquery object/selector or mComp
	 * @param {String} strEventType Event Name e.g click,tap
	 * @param {Stirng} strCallBack Callback method name in string format.
	 * @returns None
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.deattachListener = function(objTarget, strEventType, strCallBack) {
		this.objEventController.removeEventListener(objTarget, strEventType, strCallBack);
	};

	/**
	 * Method getComponent is responsible to create and initlize the component and return
	 * to its associated callback method as parameter
	 * e.g this.getComponent(this, "actionButton", "compReceiverMethod", objData)
	 * objData is optional parameter, and will be passed in component constructor method.
	 *
	 * @param context {Object} Scope of the callback method.
	 * @param {String} strCompType required component name
	 * @param {String}  strCallback callback method name in String format to avoid any scope issue.
	 * @param  {Object} objCompDefaultData Optional and will be passed as paramenter in component constructor.
	 * @returns None
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.getComponent = function(context, strCompType, strCallback, objCompDefaultData) {
		var objData = {};
		objData.context = context;
		objData.strCompType = strCompType;
		objData.strCallback = strCallback;
		objData.data = objCompDefaultData;
		this.trigger(this.ActivityEventConst.CREATE_COMPONENT_EVENT, objData);
	};

	/**
	 * Method "getScreenText" is introduced to help when application is running with language support.
	 * User can get the localized text by their id
	 * e.g this.getScreenText("textNodeId")
	 * @param {String} strID  As provided in screenText xml node.
	 * @returns {String} strTextValue Text value provided with CDATA.
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.getScreenText = function(strID) {
		var xmlList, strTextValue;
		xmlList = $(this.localText).find("text[id=" + strID + "]");
		strTextValue = $(xmlList[0]).text();
		return strTextValue;
	};

	/**
	 * Method "customEventDispatcher" is useful to send event and data in a custom way.
	 * Useful when two mComp (framework) component want to exchange data or notify each other. Also Event dispatched from this method
	 * is observed by framework which notifies or destory its linkage when required.
	 * @param  {String} strEvent Event Name
	 * @param {Object} context
	 * @param {Object} data [optional]
	 * @return none
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.customEventDispatcher = function(strEvent, context, data) {
		var objEvent = {};
		objEvent.data = context;
		objEvent.customData = data;
		objEvent.target = context;
		objEvent.type = strEvent;
		context.trigger(strEvent, objEvent);
	};

	/**
	 * Method "broadcastEvent" provide a mechanism to communication within more then one activity,
	 * and an 'activity' can receive/listen aired events with the help of "broadcastEventReceiver" method
	 *
	 * Example:
	 * var strEventName = "test_event"
	 * this.broadcastEvent(strEventName, [optional data])
	 *
	 * //Broadcasting a event, eventName [event name could be anything in string fromat]
	 * this.broadcastEventReceiver(strEventName, context, "listenBroadcastEvents")
	 *
	 * function listenBroadcastEvents(objEvent)
	 * {
	 *		//code....
	 * }
	 *
	 * //deattaching itself from a brocast event receiver group.
	 * this.stopBroadcastEventReceiver(strEventName, context, "listenBroadcastEvents");
	 *

	 * @param {Stirng} strEvent Event name/signagture which need to be broadcast globally.
	 * @param {Object/Stirng} data which need to be send with the event .This is optional parameter
	 * @return none
	 * @memberof BaseActivity#
	 * @access public
	 */

	BaseActivity.prototype.broadcastEvent = function(strEvent, data) {
		var objData = {};
		objData.eventToBroadcast = strEvent;
		objData.data = data;
		this.trigger(this.ActivityEventConst.BROADCAST_EVENT, objData);
	};

	/**
	 * Method "broadcastEventReceiver" provide a mechanism to listen/recevie event which are air globally with
	 * the help of "broadcastEvent" method.
	 * @param {Stirng} strEvent Event name which will be aired globally
	 * @param {Object} context
	 * @param {Stirng} strCallback callback method name as string
	 * @return none
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.broadcastEventReceiver = function(strEvent, context, strCallback) {
		var objData = {};
		objData.eventToListen = strEvent;
		objData.context = context;
		objData.callback = strCallback;
		this.trigger(this.ActivityEventConst.BROADCAST_EVENT_RECEIVER, objData);
	};

	/**
	 * User can stop listening Globally aired events by this method
	 * @param {Stirng} strEvent Event name which needs to be deattached from the 'Event Broadcaster'
	 * @param {Object} context
	 * @param {Stirng} strCallback callback method name as string
	 * @return none
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.stopBroadcastEventReceiver = function(strEvent, context, strCallback) {
		var objData = {};
		objData.eventToListen = strEvent;
		objData.context = context;
		objData.callback = strCallback;
		this.trigger(this.ActivityEventConst.STOP_BROADCAST_EVENT_RECEIVER, objData);
	};

	/**
	 * Allow an activity to play sound in background, Also this method allow an activity to play multiple sound
	 * at a single time.
	 * The sound played by this method does not have any audio controlls. e.g stop/start/pause/play
	 *
	 * @param {Stirng} strPath audio path
	 * @param {int} bLoop set true if sound need to be play loop.
	 * @param {Stirng} strTrack a unique identifier of sound file, by the track id activity is allow stop/play selected track.
	 * @param {Boolean} bReload if set true then files will be reloaded.
	 * @param {Function} sCallBack when track start associated callback method will be invoked.
	 * @param {Function} fCallBack when track finish associated callback method will be invoked.
	 * @return none
	 * @access public
	 * @memberof BaseActivity#
	 */
	BaseActivity.prototype.playAudio = function(strPath, bLoop, strTrack, bReload, fCallBack, sCallback) {
		var objData = {};
		objData.strPath = strPath;
		objData.bLoop = bLoop;
		objData.strTrack = strTrack;
		objData.reload = bReload;
		objData.onStart = sCallback;
		objData.onFinish = fCallBack;
		this.trigger(this.ActivityEventConst.PLAY_AUDIO, objData);
	};

	BaseActivity.prototype.isWebApiEnable = function() {
		return this.bWebApiEnable;
	};

	BaseActivity.prototype.initWebApi = function(objData) {
		if (this.bWebApiEnable === true) {
			this.trigger(this.ActivityEventConst.INIT_WEB_API_AUDIO, objData);
		}
	};

	BaseActivity.prototype.playWebAudio = function(urlObj) {
		if (this.bWebApiEnable === true) {
			this.trigger(this.ActivityEventConst.PLAY_WEB_API_AUDIO, urlObj);
		}
	};

	BaseActivity.prototype.unloadBuffers = function(objData) {
		if (this.bWebApiEnable === true) {
			this.trigger(this.ActivityEventConst.UNLOAD_WEB_API_BUFFERS_AUDIO, objData);
		}
	};

	/**
	 * Allow an activity to stop all sound playing in background
	 * @param {Boolean} bDestroy if set true then files will be reloaded.
	 * @return none
	 * @access public
	 * @memberof BaseActivity#
	 */
	BaseActivity.prototype.stopAllAudio = function(bDestroy) {
		var objData = {};
		objData.bDestroy = bDestroy;
		this.trigger(this.ActivityEventConst.STOP_ALL_AUDIO, objData);
	};

	/**
	 * Help to restart background audio by their unique identifer (strTrack), see 'playAudio' method
	 * to get more details on identifier
	 * @param {Stirng} strTrack a Unique identifier of playing audio
	 * @return None
	 * @access public
	 * @memberof BaseActivity#
	 */
	BaseActivity.prototype.restart = function(strTrack) {
		this.trigger(this.ActivityEventConst.RESTART_AUDIO, strTrack);
	};

	/**
	 * Pause background audio by their unique identifer (strTrack), see 'playAudio' method
	 * to get more details on identifier
	 *
	 * @param {Stirng} strTrack a Unique identifier of playing audio
	 * @return none
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.pauseAudio = function(strTrack) {
		this.trigger(this.ActivityEventConst.PAUSE_AUDIO, strTrack);
	};

	/**
	 * resume background audio by their unique identifer (strTrack), see 'playAudio' method
	 * to get more details on identifier
	 *
	 * @param {Stirng} strTrack a Unique identifier of playing audio
	 * @return None
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.resumeAudio = function(strTrack) {
		this.trigger(this.ActivityEventConst.RESUME_AUDIO, strTrack);
	};

	/**
	 * stop background audio by their unique identifer (strTrack), see 'playAudio' method
	 * to get more details on identifier
	 *
	 * @param {Stirng} strTrack a Unique identifier of playing audio
	 * @return None
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.stopAudio = function(strTrack, bDestroy) {
		var objData = {};
		objData.trackId = strTrack;
		objData.destroy = bDestroy;
		this.trigger(this.ActivityEventConst.STOP_AUDIO, objData);
	};

	/**
	 * Volume level can be updated through this method.
	 * @param {Stirng} strTrack a Unique identifier of playing audio
	 * @param {Number} nVolume
	 *
	 * @return None
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.setVolume = function(strTrack, nVolume) {
		this.trigger(this.ActivityEventConst.VOLUME_CHANGE, {
			strTrackID : strTrack,
			volume : nVolume
		});
	};

	/**
	 * Default volume level can be updated through this method.
	 * @param {Number} nVolume Volume to be set for currently playing audios.
	 * @return None
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.setDefaultVolume = function(nVolume) {
		this.trigger(this.ActivityEventConst.DEFAULT_VOLUME_CHANGE, {
			volume : nVolume
		});
	};

	/**
	 * Allow an activity to show preloader. A preloaded is useful when activity is waiting to load its assets and
	 * want to notifiy user and also block the activity screen area.
	 *
	 * @param None
	 * @return None
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.showPreloader = function(strMessage) {
		var objEventData = {};
		objEventData.message = strMessage;
		objEventData.task = this.ActivityEventConst.SHOW_PRELOADER;
		objEventData.type = this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT;

		this.trigger(this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT, objEventData);
	};

	/**
	 * Allow an activity to hide preloader.
	 * @param None
	 * @return None
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.hidePreloader = function() {
		var objEventData = {};
		objEventData.task = this.ActivityEventConst.HIDE_PRELOADER;
		objEventData.type = this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT;

		this.trigger(this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT, objEventData);
	};

	/**TODO:NEED TO CHECK **/
	BaseActivity.prototype.updatePlayerSize = function(objEventData) {
		objEventData.task = this.ActivityEventConst.UPDATE_PLAYER_SIZE_EVENT;
		objEventData.type = this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT;
		this.trigger(this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT, objEventData);
	};

	/**
	 * Return the current stage scale value.
	 * @param None
	 * @return {Number} nStageScale Stage Scaled value.
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.getStageScaleValue = function() {
		return this.nStageScale;
	};

	/**
	 * Method 'getActivityListByRegion' return the activity list array based on
	 * the region id provided as parameter.
	 *
	 * @param {String} strREgionId region id
	 * @return {Array} an filterd array of activity list
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.getActivityListByRegion = function(strRegionId) {
		return this.allRegionActivityList[strRegionId].slice();
	};

	/**
	 * Method 'launchActivityInRegion' will allow an user to launch an activity from
	 * one 'Activity' to another 'Activity'.
	 *
	 * @param {String} strRegionId RegionId where activity change task need to be perform
	 * @param {String} strActivtiyID value could be activityID or actvitiy index
	 * @param {Object} objData data
	 * @param {Boolean} bLaunchByIndex is an optional parameter, the defualt value of
	 * this parametere is false, when user set this value to true then activtity will be launched by their index.
	 *
	 */
	BaseActivity.prototype.launchActivityInRegion = function(strRegionId, strActivityID, objData, bLaunchByIndex) {
		bLaunchByIndex = (bLaunchByIndex === undefined) ? false : bLaunchByIndex;
		var objEventData = {};
		objEventData.regionId = strRegionId;
		objEventData.regionToChange = strRegionId;
		objEventData.data = objData;
		objEventData.strActivityID = strActivityID;
		objEventData.bLaunchByIndex = bLaunchByIndex;
		objEventData.task = this.ActivityEventConst.LAUNCH_ACTIVITY_IN_REGION;
		objEventData.type = this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT;
		this.trigger(this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT, objEventData);
	};

	/**
	 * This method introduced to start a region initalization process if their 'immediateStart' value
	 * is set to false in xml (immediate='false') node.
	 * by default this value is true for all regions
	 * set this value to false if a region need to be start after specific process
	 *
	 * @param {String} strRegionId RegionId where activity change task need to be perform
	 * @param {Object} objData this is optionl set if you want to pass data in constructor
	 * @param {String} strActivtiyID - this is optional value could be activityID or actvitiy index
	 * @param {Boolean} bLaunchByIndex is an optional parameter, the defualt value of
	 * this parametere is false, when user set this value to true then activtity will be launched by their index.
	 */
	BaseActivity.prototype.startRegion = function(strRegionId, objData, strActivityID, bLaunchByIndex) {
		bLaunchByIndex = (bLaunchByIndex === undefined) ? false : bLaunchByIndex;
		var objEventData = {};
		objEventData.regionToStart = strRegionId;
		objEventData.regionId = "";
		objEventData.data = objData;
		objEventData.strActivityID = strActivityID;
		objEventData.bLaunchByIndex = bLaunchByIndex;
		objEventData.task = this.ActivityEventConst.START_REGION_FROM_OTHER_REGION;
		objEventData.type = this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT;
		this.trigger(this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT, objEventData);
	};

	/**
	 * This method introduced to start a region initalization process if their 'immediateStart' value
	 * is set to false in xml (immediate='false') node.
	 * by default this value is true for all regions
	 * set this value to false if a region need to be start after specific process
	 *
	 * @param {String} strRegionId RegionId where activity change task need to be perform
	 * @param {Object} objData this is optionl set if you want to pass data in constructor
	 * @param {String} strActivtiyID - this is optional value could be activityID or actvitiy index
	 * @param {Boolean} bLaunchByIndex is an optional parameter, the defualt value of
	 * this parametere is false, when user set this value to true then activtity will be launched by their index.
	 */
	BaseActivity.prototype.changeRegionActivities = function(strRegionId, strActXml, bImmediateStart, defaultActId, actData) {
		//bImmediateStart = (bImmediateStart === undefined) ? true : bImmediateStart;
		var objEventData = {};
		objEventData.regionId = strRegionId;
		objEventData.strActList = strActXml;
		objEventData.immediateStart = bImmediateStart;
		objEventData.defaultActId = defaultActId;
		objEventData.data = actData;
		objEventData.task = this.ActivityEventConst.UPDATE_REGION_ACTIVITY_LIST;
		objEventData.type = this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT;
		this.trigger(this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT, objEventData);
	};

	/**
	 * Application current local language id will be returned eg 'en' will be return for english
	 * also this value will be overridden when language value is passed with the query string
	 * @param None
	 * @return {String} localLangName currnt langue id/name
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.getLanguageName = function() {
		return this.localLangName;
	};

	/**
	 * Remove given JS file reference form memory.
	 * @param {String} strFileName File Name in string format without its extension.
	 * By using this method we can save an extra memory, will be very usefull when we are targetting
	 * small memory devices.
	 *
	 * @return none
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.removeJS = function(strFileName) {
		var objEventData = {};
		objEventData.fileName = strFileName + ".js";
		objEventData.type = this.ActivityEventConst.TYPE_JS;
		this.trigger(this.ActivityEventConst.REMVOE_REFERENCE, objEventData);
	};

	/**
	 * Remove given CSS file reference form memory.
	 * @param {String} strFileName File Name in string format with its extension.
	 * By using this method we can save an extra memory, will be very usefull when we are targetting
	 * small memory devices.
	 *
	 * @return none
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.removeCSS = function(strFileName) {
		var objEventData = {};
		objEventData.fileName = strFileName + ".css";
		objEventData.type = this.ActivityEventConst.TYPE_CSS;
		this.trigger(this.ActivityEventConst.REMVOE_REFERENCE, objEventData);
	};

	/** incomplete functionality **/
	BaseActivity.prototype.setDrawingCanvas = function(objCanvas) {
		this.trigger(this.ActivityEventConst.SET_DRAWING_CANVAS, objCanvas);
	};
	/**
	 * This function is used to get inline template by id
	 * @param {String} strId inline template id
	 * @return
	 */
	BaseActivity.prototype.getInlineTemplateById = function(strId) {
		return this.objInlineTmplDict[strId];
	};

	/**
	 * Method 'createRegion' allow user to create a region (see 'marionette') in runtime
	 * @param {String} strRegionId, Div id
	 * @return none
	 * @access public
	 * @memberof #BaseActivity
	 */
	BaseActivity.prototype.createRegion = function(strRegionId) {
		var obj = {};
		obj[strRegionId] = "#" + strRegionId;
		if (this.regions[strRegionId] !== undefined) {
			console.warn(strRegionId + errorConst.ACTIVITY_ALREADY_REGISTERED);
		} else {
			this.addRegions(obj);
		}
	};

	/**
	 * Method 'launchAsPopup' will lauched the given div content as popup
	 * @param {String} templateId, template id which need to be shown as popup
	 * @param {String} targetArea, reference if where content will be added as popup
	 * @param {Boolean} isModel, if true then a blocker window will be added
	 * @param {Stirng} btnClose, close button id
	 * @param {Object} animationObject, animation object if popup needs to be shown with some effect
	 * @param {Object} dataObjects, blocker window style class can be provided with this reference.
	 * @return none
	 * @memberof #BaseActivity
	 * @access public
	 */
	BaseActivity.prototype.launchAsPopup = function(templateId, targetArea, isModel, btnClose, animationObject, dataObjects) {
		var styleName, btnCloseRef, strNewID, blockerDiv, strCloseId, objClassRef = this, closeBtnRef, popupParent = "#" + targetArea, template = this.getInlineTemplateById("screenPopupBlockerDiv");
		if (this.popupDiv_dict[templateId] !== undefined) {
			return;
		}

		styleName = $(this.getInlineTemplateById(templateId)).attr("class");
		template = this.getInlineTemplateById("screenPopupBlockerDiv");
		this.popupData = {};

		//adding blocker window
		if (isModel === true) {
			blockerDiv = $(template);
			$("#" + targetArea).append(blockerDiv);
			this.popupData.blockerDiv = blockerDiv;
		}

		//getting content
		template = this.getInlineTemplateById(templateId);

		//preserving popup data will be used when popup will be removing from DOM
		this.popupData.templateId = templateId;
		this.popupData.popupRef = $(template);
		this.popupData.targetArea = $("#" + targetArea);
		this.popupData.popupParent = popupParent;

		//will apply animation effect if provided
		if (animationObject) {
			this.popupData.popupRef.hide().appendTo(this.popupData.targetArea).show().animate(animationObject, parseInt(animationObject.duration));
		} else {
			this.popupData.popupRef.hide().appendTo(this.popupData.targetArea).show();
		}

		//notify activity when popup added in DOM
		objClassRef.onPopupAddedInDom(objClassRef.popupData);

		//when isModel set to true then provide a new id to the blocker div
		//to avoid any confict
		if (isModel === true) {
			this.popupCounter = this.popupCounter + 1;
			blockerDiv.attr("id", blockerDiv.attr("id") + (this.popupCounter));
			this.popupData.blockerDiv = blockerDiv;
		}
		//adding new style class to blocker div
		if (dataObjects !== undefined && dataObjects.styleClass !== undefined) {
			blockerDiv.removeClass();
			blockerDiv.addClass(dataObjects.styleClass);
		}

		this.popupData.popupRef.attr("tempId", this.popupData.templateId);
		this.popupData.objClassRef = this;
		this.popupDiv_dict[templateId] = this.popupData;

		//initlizing close button events
		if (btnClose !== undefined) {
			strNewID = templateId + "___" + btnClose;
			strCloseId = "#" + btnClose;
			btnCloseRef = $("#" + btnClose, "#" + this.popupData.popupRef.attr("id"));
			btnCloseRef.attr("id", strNewID);
			btnCloseRef.on("click", function(objEvent) {
				$(objEvent.target).off("click");
				objClassRef.removePopupWindow(objEvent.target.id.split("___")[0]);
			});
			objClassRef.popupDiv_dict[templateId].strCloseId = strNewID;
		}
	};

	/**
	 * This method invoked everytime when a content launched as popup with the help
	 * of 'launchAsPopup' method of this class.
	 * If activity want a notification when given content added in DOM then simply
	 * override this method.
	 * @param none
	 * @return none
	 * @memberof #BaseActivity
	 * @access public
	 */
	BaseActivity.prototype.onPopupAddedInDom = function() {
	};

	/**
	 * This method invoked everytime when a content which was launched as popup with the help
	 * of 'launchAsPopup' method.
	 * If activity want a notification when given content is getting removed from DOM then this method
	 * must be overridden by the activity.
	 *
	 * @param {String} strPopupId remove popup id
	 * @return none
	 * @memberof #BaseActivity
	 * @access public
	 */
	BaseActivity.prototype.onPopupClose = function(strPopupId) {
	};

	/**
	 * Responsible to remove all popup window
	 */
	BaseActivity.prototype.removeAllPopupWindow = function() {
		var objClassRef = this;
		_.filter(this.popupDiv_dict, function(popupobj) {
			objClassRef.removePopupWindow(popupobj.templateId);
		});
	};

	/**
	 * Invoked everytime when a popup close button is clicked.
	 * this method is responsible to close its associated popup window
	 * with the help of removePopupWindow method
	 * @param {Object} objEvent
	 * @return none
	 * @memberof #BaseActivity
	 * @access private
	 */
	BaseActivity.prototype.closePopup = function(objEvent) {
		var objClassRef = objEvent.data.objClassRef;
		objClassRef.removePopupWindow(objEvent.data.templateId);
	};

	/**
	 * 'removePopupWindow' is responsible to close popup window which is
	 * launched with the help of 'launchAsPopup' method.
	 * @param {String} strPopupId popup id which needs to be removed.
	 * @return none
	 * @access public
	 * @memberof #BaseActivity
	 */
	BaseActivity.prototype.removePopupWindow = function(strPopupId) {

		if (strPopupId === undefined) {
			return;
		}

		var objPopupObject, objClassRef = this;
		objPopupObject = this.popupDiv_dict[strPopupId];

		if (objPopupObject === undefined || objPopupObject === null) {
			//delete this.popupDiv_dict[strPopupId];
			return;
		}

		//calling onPopupClsoe method to notify the activity
		objClassRef.onPopupClose(objPopupObject.templateId);
		//remove close button event if added
		if (objPopupObject.strCloseId !== undefined) {
			$("#" + objPopupObject.strCloseId, $(objPopupObject.popupRef)).off("click");
		}

		//removing popup reference
		objPopupObject.popupRef.remove();
		if (objPopupObject.blockerDiv !== null || objPopupObject.blockerDiv !== undefined) {
			$(objPopupObject.blockerDiv).css("display", "none");
			$(objPopupObject.blockerDiv).remove();
		}
		//removing reference from the dictionary
		this.popupDiv_dict[strPopupId] = null;
		delete this.popupDiv_dict[strPopupId];
	};

	/**
	 * 'manageCommonBroadcastEvent' is introduced to establised a bridge between multiple
	 * pictor which are created and initlized in different regions.
	 * @param {Object} objData
	 * @return none
	 * @access private
	 * @memberof SimulationActivity#
	 */
	BaseActivity.prototype.manageCommonBroadcastEvent = function(objData) {
		if (this.strRegionName !== objData.data.region) {
			return;
		}
		var targetObject;
		switch(objData.type) {

		case this.ActivityEventConst.MANAGE_COMMON_BROADCAST_EVENT:
			switch(objData.data.subTask) {
			//Calling component method
			case this.ActivityEventConst.CALL_AND_UPDATE_COMPONENT:
				targetObject = (objData.data.targetId === "self") ? this : this[objData.data.targetId];
				targetObject[objData.data.methodName].apply(this, objData.data.params);
				break;
			}
			break;
		}
	};

	/**
	 * Responsible to stop all other regions.
	 * @param {Boolean} bStart true/false
	 * @param {Boolean} bIgnoreCaller if true then caller(region) will be ignored to stop or start
	 * @param {Object} objActData if user want to pass data
	 */
	BaseActivity.prototype.stopAllRegion = function(bStart, bIgnoreCaller, objActData) {
		var objEventData = {};
		objEventData.task = this.ActivityEventConst.STOP_ALL_REGIONS;
		objEventData.type = this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT;
		objEventData.state = bStart;
		objEventData.ignoreCaller = bIgnoreCaller;
		objEventData.activitiesData = objActData;
		this.trigger(this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT, objEventData);
	};

	/**
	 * Responsible to START/STOP region.
	 * @param {Boolean} bStart true/false
	 * @param {Object} objActData if user want to pass data
	 */
	BaseActivity.prototype.startRegion = function(strRegion, bStart, objActData) {
		var objEventData = {};
		objEventData.task = this.ActivityEventConst.START_STOP_REGION;
		objEventData.regionToStart = strRegion;
		objEventData.type = this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT;
		objEventData.state = bStart;
		objEventData.activitiesData = objActData;
		this.trigger(this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT, objEventData);
	};

	/**
	 * Responsible to stop all other regions.
	 * @param {Boolean} bStart true/false
	 * @param {Boolean} bIgnoreCaller if true then caller(region) will be ignored to stop or start
	 * @param {Object} objActData if user want to pass data
	 */
	BaseActivity.prototype.hideAllRegions = function(bState) {
		var objEventData = {};
		objEventData.task = this.ActivityEventConst.HIDE_ALL_REGION;
		objEventData.type = this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT;
		objEventData.state = bState;
		this.trigger(this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT, objEventData);
	};

	BaseActivity.prototype.playerBubbleEvent = function(objData) {
		var objEventData = {};
		objEventData.task = objData.task;
		objEventData.type = this.ActivityEventConst.PLAYER_BUBBLE_EVENT;
		objEventData.customData = objData;
		this.trigger(this.ActivityEventConst.PLAYER_BUBBLE_EVENT, objEventData);
	};

	BaseActivity.prototype.handlePlayerCommonBubbleEvent = function(objData) {
	};

	BaseActivity.prototype.performTinCanOperation = function(arrArgs) {
		TinCanController.getInstance().tincanOperation(arrArgs);
	};

	/**
	 * Destroy BaseActivity
	 * @param {Boolean} bChildDestroyed will set to true when called by the activity
	 * @return {Boolean} true if destroy success
	 * @memberof BaseActivity#
	 * @access public
	 */
	BaseActivity.prototype.destroy = function(bChildDestroyed) {
		this.removeAllPopupWindow();
		if (bChildDestroyed !== true) {
			throw new Error(errorConst.DESTROY_NOT_IMPLMENENTED_IN_CHILD_CLASS);
		}
		this.isDestroyCalled = true;
		return this.isDestroyCalled;
	};

	return BaseActivity;
});
