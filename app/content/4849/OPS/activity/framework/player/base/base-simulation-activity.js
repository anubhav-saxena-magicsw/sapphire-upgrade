/*jslint nomen: true */
/*globals Backbone, $, console*/

/**
 * BaseSimulationActivity
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['player/base/base-activity', 'player/controllers/media-controller', 'components/confirmpopup/confirm-popup'], function(BaseActivity, MediaController, ConfirmPopup) {
	'use strict';
	var BaseSimulationActivity;

	/**
	 * @class BaseSimulationActivity
	 * Class 'BaseSimulationActivity' is introduced to provide a base to sim-pictor functionality.
	 * This class create a brigde bewteen framework and extended framework feature, which is know as
	 * sim-pictor.
	 *
	 * 'BaseSimulationActivity' is having basic API method which makes pictor eanble to communicate within framework
	 * and also add some new api to make user enable to done pictor level task.
	 * e.g nevigation between screen to screen.
	 */

	BaseSimulationActivity = BaseActivity.extend({
		bEditor : false,
		objSimPictor : undefined,
		type : "simulation",
		nScreenIndex : 0,
		nTotalScreen : 0,
		screenEventName : undefined,
		bGlobalControls : false,
		bGlobalComponents : false,
		objScreen : null,
		objSelectedComp : null,
		objPathUpdater : null,
		initialize : function(objData) {
		}
	});

	BaseSimulationActivity.prototype.onActivityCreationComplete = function() {
		if (this.bEditor === true) {
			this.broadcastEventReceiver("componentDataPropertyUpdated", this, "componentPropertyDataUpdated");
			this.broadcastEventReceiver("forceUnload", this, "forceUnloadInEditMode");
		}
	};

	/**
	 * Load next screen
	 */
	BaseSimulationActivity.prototype.moveToNextScreen = function() {
		var nIndex = this.nScreenIndex;
		nIndex = this.nScreenIndex + 1;
		if (nIndex >= this.nTotalScreen) {
			nIndex = this.nTotalScreen - 1;
			return;
		}

		this.launchScreen(nIndex);
	};

	BaseSimulationActivity.prototype.forceUnloadInEditMode = function() {
		this.isDataSaved(true);
	};
	/**
	 * Load previous screen
	 */
	BaseSimulationActivity.prototype.moveToPreviousScreen = function() {
		var nIndex = this.nScreenIndex;
		nIndex = nIndex - 1;
		if (nIndex < 0) {
			nIndex = 0;
			return false;
		}
		this.launchScreen(nIndex);
	};

	/**
	 * Responsible to load given screen index.
	 * @param {Number} nIndex screen index which needs to be loaded.
	 * @return none
	 * @access public
	 * @memberof BaseSimulationActivity
	 */
	BaseSimulationActivity.prototype.jumpToScreenByIndex = function(nIndex) {

		if (nIndex < 0 && nIndex >= this.nTotalScreen) {
			console.warn("Provided screen index is not within range!!!!!");
			return false;
		}
		this.launchScreen(nIndex);
	};

	/**
	 * Method 'resetScreen' will reload the current loaded screen
	 * @param none
	 * @return none
	 * @access private
	 * @memberof BaseSimulationActivity#
	 */
	BaseSimulationActivity.prototype.resetScreen = function() {
		this.launchScreen(this.nScreenIndex);
	};

	/**
	 * 'launchScreen' method is responsible to start the process to load screen
	 * based on the give index as parameter, this method also unload current screen by calling
	 * 'endCurrentScreen' method.
	 * @param {Number} nIndex screen index which needs to be loaded.
	 * @return none
	 * @access private
	 * @memberof BaseSimulationActivity#
	 */
	BaseSimulationActivity.prototype.launchScreen = function(nIndex) {
		var IsScreenDestroySuccess = this.endCurrentScreen(), strEventName = this.ActivityEventConst.MIDDLE_SCREEN_LOAD_EVENT;
		this.screenEventName = strEventName;
		this.removeAllPopupWindow();

		if (IsScreenDestroySuccess === true) {

			this.nScreenIndex = nIndex;
			this.startScreenInitlization();
		} else {
			throw new Error(this.objErrConst.ERROR_OCCURED_WHILE_DESTROYING_SCREEN_AND_ITS_EVENTS);
		}
	};

	/**
	 * Start the screen initlization process, while initlizing the screen
	 * this method also look that screen json file is a external file or not.
	 * if external json file needs to be loaded for a particular screen then
	 * data loader object will be invoked to load screeen json file before to start init
	 * process
	 * @param none
	 * @return none
	 * @access private
	 * @memberof BaseSimulationActivity#
	 */
	BaseSimulationActivity.prototype.startScreenInitlization = function() {
		var objData = {}, templateId;
		objData.activityRef = this;
		this.nTotalScreen = this.jsonData.screens.length;
		objData.jsonData = this.jsonData.screens[this.nScreenIndex];

		if (this.languageSupport) {
			templateId = this.getScreenText("templateId" + this.nScreenIndex);
			if (templateId && templateId.length > 0) {
				objData.jsonData.templateId = templateId;
			}
		}

		if (objData.jsonData.jsonSource === undefined) {
			//this.objPathUpdater.script
			objData.template = this.objInlineTmplDict;
			this.objSimPictor.initalize(objData, this);
		} else {
			//loading screen json file.
			this.loadScreenData(objData.jsonData.jsonSource);
		}
	};

	/**
	 * Method loadScreenData is responsible to invoked Data Loader object
	 * to load screen json data.
	 * @param {String} strPath Screen json file path
	 * @return none
	 * @access private
	 * @memberof BaseSimulationActivity#
	 */
	BaseSimulationActivity.prototype.loadScreenData = function(strPath) {
		this.loadJSONData(strPath, 'json', 'application/json', 'json', this.onScreenJSONLoadComplete, this.dataLoadErrorHandler);
	};

	/**
	 * Invoked when Screen json data loaded successfully. this method is responsbile
	 * to push loaded data in screen data array which will make sure that
	 * in when screen needs to be reloaded then system will use preloaded data.
	 *
	 * This method is also responsible to start the process of screen intlization by calling 'startScreenInitlization'
	 * method.
	 *
	 * @param {JSON Object} objLoadedData screen json data
	 * @param {Object} objClassref class reference
	 * @return none
	 * @access private
	 * @memberof BaseSimulationActivity#
	 */
	BaseSimulationActivity.prototype.onScreenJSONLoadComplete = function(objLoadedData, objClassref) {
		objClassref.jsonData.screens[objClassref.nScreenIndex] = objLoadedData;
		objClassref.objDataLoader.off(objClassref.objDataLoader.DATA_LOAD_SUCCESS);
		objClassref.objDataLoader.off(objClassref.objDataLoader.DATA_LOAD_FAILED);
		objClassref.startScreenInitlization();
	};

	/**
	 * Invoked when screen json data loading failed.
	 * @param none
	 * @return none
	 * @access private
	 */
	BaseSimulationActivity.prototype.onScreenJSONLoadFailed = function() {
		this.objDataLoader.off(this.objDataLoader.DATA_LOAD_SUCCESS);
		this.objDataLoader.off(this.objDataLoader.DATA_LOAD_FAILED);
		throw new Error(this.objErrConst.ERROR_WHILE_LOADING_FILE);
	};

	/**
	 * Mehtod 'loadJSONData' is introduced to load json data multiple time with
	 * differece parameter and callback method. When any json file needs to be loaded
	 * this method will manage and deliver the loaded json data to given callback method.
	 * @param {String} strPath JSON file path which needs to be loaded.
	 * @param {String} strDataType possible value will be 'json'/'xml'
	 * @param {Stirng} strContentType  'application/json'
	 * @param {Stirng} strReturnType 'json/xml' convert Loaded data in json or xml
	 * @param {Function} successHandler Data will be delivered when loaded
	 * @param {Funciton} errorHandler Error handler method reference
	 * @acccess private
	 * @memberof BaseSimulationActivity#
	 */
	BaseSimulationActivity.prototype.loadJSONData = function(strPath, strDataType, strContentType, strReturnType, successHandler, errorHandler) {
		var objClassRef = this;
		this.objDataLoader.on(this.objDataLoader.DATA_LOAD_SUCCESS, successHandler);
		this.objDataLoader.on(this.objDataLoader.DATA_LOAD_FAILED, errorHandler);
		this.objDataLoader.load({
			url : strPath,
			dataType : strDataType,
			contentType : strContentType,
			returnType : strReturnType,
			scope : objClassRef
		});
	};

	/**
	 * Method onScreenChangeComplete invoked everytime when a screen
	 * initlized successfully.
	 * This method is responsible to trigger 'PLAYER_COMMON_TASK_EVENT' with
	 * 'MANAGE_NEXT_BACK_NEVIGATION_BUTTON' to maintain the
	 * nevigation buttons if provided in json data.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof BaseSimulationActivity#
	 */
	BaseSimulationActivity.prototype.onScreenChangeComplete = function() {
		var isFirstScreen, isLastScreen, objEventData = {};
		objEventData.type = this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT;
		objEventData.task = this.ActivityEventConst.MANAGE_NEXT_BACK_NEVIGATION_BUTTON;
		objEventData.isFirstScreen = (this.nScreenIndex === 0);
		objEventData.screenIndex = this.nScreenIndex;
		objEventData.controls = this.getNavButtonData();
		objEventData.isLastScreen = ((this.nTotalScreen - 1) === this.nScreenIndex);
		this.trigger(this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT, objEventData);
	};

	BaseSimulationActivity.prototype.initlizeControls = function() {
		this.bGlobalControls = (this.jsonData.controls !== undefined);
		this.bGlobalComponents = (this.jsonData.globalComponents !== undefined);
	};

	/**
	 * Responsible to end current screen and return
	 * the return value will be true if destroy is success if fail then
	 * return value will be false.
	 * @param none
	 * @return none
	 * @memberof BaseSimulationActivity#
	 */
	BaseSimulationActivity.prototype.endCurrentScreen = function() {
		return this.objSimPictor.destroyCurrentScreen();
	};

	/**
	 * Method 'getNavButtonData' is responsible to fetch the nav button
	 * References based on the provided json data and store their
	 * object for future uses.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof BaseSimulationActivitiy#
	 */
	BaseSimulationActivity.prototype.getNavButtonData = function() {
		var i, arrButtons, obj, arrData = [];
		arrButtons = this.jsonData.controls.nevigation.buttons;
		for ( i = 0; i < arrButtons.length; i += 1) {
			obj = {};
			obj.id = arrButtons[i].id;
			obj.region = arrButtons[i].region;
			obj.method = arrButtons[i].methodName;
			obj.param = (arrButtons[i].type === "nextButton") ? "isFirstScreen" : "isLastScreen";
			arrData.push(obj);
		}
		obj = {};
		obj.id = this.jsonData.controls.nevigation.id;
		obj.region = this.jsonData.controls.nevigation.region;
		obj.method = this.jsonData.controls.nevigation.methodName;
		obj.param = "screenIndex";
		arrData.push(obj);
		return arrData;
	};

	/**
	 * When screen change this method will be invoked and set the state
	 * of nav button.
	 * @param {Object} objData
	 * @return {none}
	 * @access private
	 * @memberof BaseSimulationActivity#
	 */
	BaseSimulationActivity.prototype.updateNevigationControl = function(objData) {
		if (this.objScreen[objData.id] === undefined) {
			console.warn(objData.id + " not found!!!!!");
			return;
		}
		this.objScreen[objData.id][objData.method].apply(this.objScreen[objData.id], [objData.param]);
	};

	/**
	 * 'setStageValue' method is responsible to update the activity with the updated scaled value of player.
	 * this mehtod will be invoked only when 'scaleMode' set to true in config file.
	 * @param {Number} newScaleValue updated player scaled value
	 * @return {None}
	 * @access private
	 * @memberof BaseSimulationActivity#
	 */
	BaseSimulationActivity.prototype.setStageValue = function(newScaleValue) {
		this.nScaleValue = newScaleValue;
		if (this.objSimPictor !== undefined) {
			this.objSimPictor.setStageScaleValue(this.nScaleValue);
		}
	};

	/**
	 * Binded with the screen change event, this method will launch the screen
	 * as provied in paramebter
	 * @param {Object} objData
	 * @return none
	 * @acccess private
	 * @memberof BaseSimulationActivity#
	 */
	BaseSimulationActivity.prototype.onScreenChangEvent = function(objData) {
		this.launchScreen(objData.screenIndex);
	};

	BaseSimulationActivity.prototype.toggleMedia = function(bStopAllMedia) {
		if (bStopAllMedia === true) {
			MediaController.getInstance().pauseAllMedia();
		} else {
			MediaController.getInstance().resumeAllMedia();
		}
	};

	BaseSimulationActivity.prototype.setLocalText = function() {

	};

	/**
	 * With the help of PopupManager user can launch any HTML element as popup even
	 * they are not 'popup' category object, and this method responsibility is send the notification
	 * to screen helper object when popup is removed.
	 * @param {String} strPopupId
	 * @return none
	 */
	BaseSimulationActivity.prototype.onPopupClose = function(strPopuId) {
		if (this.objScreen.onPopupClose !== undefined) {
			this.objScreen.onPopupClose(strPopuId);
		} else if (this.objScreenHelper.onPopupClose !== undefined) {
			this.objScreenHelper.onPopupClose(strPopuId);
		}
	};

	/**
	 * invoked when a html content added in dom with the help of 'baseActivity' api 'launchAsPopup'
	 *
	 */
	BaseSimulationActivity.prototype.onPopupAddedInDom = function(objPopuData) {
		if (this.objScreenHelper.onPopupAddedInDom !== undefined) {
			this.objScreenHelper.onPopupAddedInDom(objPopuData);
		}
	};

	/**
	 * This method is responsible to pass the updated component data to Pictor.
	 * Pictor is the main engine to handle the dynamic creation/modification of
	 * component with their support classes.
	 * @param {Obejct} objEvent Event data
	 * @return {none}
	 * @access private
	 * @memberof BaseSimulationActivity#
	 */
	BaseSimulationActivity.prototype.onCompUpdatedFromSelector = function(objEvent) {
		this.objSimPictor.oncomponentPropertyDataUpdated(objEvent.customData);
	};

	/**
	 * This method is responsible to pass the updated component data to Pictor.
	 * Pictor is the main engine to handle the dynamic creation/modification of
	 * component with their support classes.
	 * @param {Obejct} objEvent Event data
	 * @return {none}
	 * @access private
	 * @memberof BaseSimulationActivity#
	 */
	BaseSimulationActivity.prototype.componentPropertyDataUpdated = function(objEvent) {
		var objDataToSend = {};
		objDataToSend.compData = objEvent.data;
		if (this.objSelectedComp === undefined) {
			console.log("error received while selecting component......", objEvent);
			return;
		}
		objDataToSend.compData.compId = this.objSelectedComp.childElement.getID();
		if (objDataToSend.compData.data.task === "DELETE_COMPOPNENT") {
			this.deselectComponent();
		}
		this.objSimPictor.oncomponentPropertyDataUpdated(objDataToSend);
	};

	/**
	 * Invoked when a component selected through the 'select' component.
	 * this method is responsible to collect component data and pass
	 * to the property panel region by dispatching 'COMPONENT_SELECTED' evnet.
	 * @param {Obejct} objEvent Event data
	 * @return {none}
	 * @access private
	 * @memberof BaseSimulationActivity#
	 */
	BaseSimulationActivity.prototype.onComponentSelected = function(objEvent) {
		var b, objSelector = objEvent.target.componentSelector, objDataToSend = {};
		this.deselectComponent();
		objDataToSend.jsonData = this.objSimPictor.getComponentData(objEvent.customData);
		objDataToSend.componentList = this.objSimPictor.getChildComponentListAndData();
		this.handleEditorEvents(this.ActivityEventConst.COMPONENT_SELECTED, objDataToSend);
		this.objSelectedComp = objSelector;
		this.objSelectedComp.isSelected.call(this.objSelectedComp, true);
	};

	BaseSimulationActivity.prototype.isDataSaved = function(bSave) {
		this.broadcastEvent("onActivityEdit", bSave);
		if (bSave !== undefined) {
			this.objSimPictor.isScreenSaved = bSave;
			if (this.objScreenHelper && this.objScreenHelper.isDataSaved !== undefined) {
				this.objScreenHelper.isDataSaved(bSave);
			}
		}

		if (this.objSimPictor) {
			return this.objSimPictor.isScreenSaved;
		} else {
			return true;
		}

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
	BaseActivity.prototype.modifyActivityListInRegion = function(strRegionId, strAct, bAdd, bImmediateStart, actData) {
		var objEventData = {};
		objEventData.regionId = strRegionId;
		objEventData.strActList = strAct;
		objEventData.regionToUpdate = strRegionId;
		objEventData.immediateStart = bImmediateStart;
		objEventData.bAdd = bAdd;
		objEventData.data = actData;
		objEventData.task = this.ActivityEventConst.APPEND_ACTIVITY_IN_REGION;
		objEventData.type = this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT;
		this.trigger(this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT, objEventData);
	};

	/**
	 * Invoked when a component tab button clicked
	 * this method is responsible to set the visibility true if component state is hidden
	 * @param {Obejct} objEvent Event data
	 * @return {none}
	 * @access private
	 * @memberof BaseSimulationActivity#
	 */
	BaseSimulationActivity.prototype.onComponentTabBtnClick = function(strBtnId) {
		this.objSimPictor.selectComponent(strBtnId);
	};

	/**
	 * Invoked everytime when a component deselected by user or by system.
	 * this method is help player to update selection object reference when they
	 * are deslected from other sources.
	 * @param {Object} objEvent
	 * @return none
	 * @access private
	 * @memberof BaseSimulationActivity#
	 */
	BaseSimulationActivity.prototype.onComponentDeselected = function(objEvent) {
		this.handleEditorEvents(this.ActivityEventConst.COMPONENT_DESELECTED, objEvent);
	};

	/**
	 * Attached with every component selector object if player is running in edit mode.
	 * Responsible to set the component in deselect mode.
	 *
	 * @param none
	 * @return none
	 * access private
	 * @memberof BaseSimulationActivity#
	 */
	BaseSimulationActivity.prototype.deselectComponent = function() {
		if (this.objSelectedComp) {
			this.objSelectedComp.isSelected(false);
			this.objSelectedComp = undefined;
		}
	};

	/**
	 * Attached with every component selector object if player is running in edit mode.
	 * Responsible to set the component in deselect mode.
	 *
	 * @param none
	 * @return none
	 * access private
	 * @memberof BaseSimulationActivity#
	 */
	BaseSimulationActivity.prototype.selectComponent = function(strCompId, setFoucs) {
		this.deselectComponent();
		if (this.objSelectedComp) {
			this.objSelectedComp.isSelected(false, setFoucs);
			this.objSelectedComp = undefined;
		}
	};

	/**
	 * This method can be access from the screen helper classes which allow
	 * helper classes to invoke web service call without any reference of webservice object
	 *
	 * @param {Object} objData
	 * @return none
	 */
	BaseSimulationActivity.prototype.manageWebServiceCall = function(objData) {
		var objEventData = {};
		objEventData.task = this.ActivityEventConst.EXECUTE_WEB_SERVICE_CALL;
		objEventData.type = this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT;
		objEventData.customData = objData;
		this.trigger(this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT, objEventData);
	};

	/**This method can be access from the screen helper classes which allow
	 * helper classes to invoke web service call to store user last action
	 * @param {Object} objData
	 * @return none
	 */
	BaseSimulationActivity.prototype.executeUserLastActionFromOtherRegion = function(objData) {
		var objEventData = {};
		objEventData.task = this.ActivityEventConst.EXECUTE_USER_LAST_ACTION_FROM_ANOTHER_REGION;
		objEventData.type = this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT;
		objEventData.customData = objData;
		this.trigger(this.ActivityEventConst.PLAYER_COMMON_TASK_EVENT, objEventData);
	};

	/**
	 * Overriding 'Baes-Activiity' method to received  region change notification and
	 * update the screen helpers.
	 * @param {Object} objData - region data in details
	 * @return {none}
	 */
	BaseSimulationActivity.prototype.getRegionChangeNotification = function(objData) {
		if (this.objScreenHelper && this.objScreenHelper.getRegionChangeNotification !== undefined) {
			this.objScreenHelper.getRegionChangeNotification(objData);
		}
	};

	BaseSimulationActivity.prototype.flush = function() {
		this.deselectComponent();
	};

	/**
	 * Responsible to launch alert popup window with the help
	 * of popupManager class and return the popup reference.
	 * @param {Object} objPopupData
	 * @return {Object} objPopup - popup reference.
	 */
	BaseSimulationActivity.prototype.showAlert = function(objPopupData) {
		var objPopup = new ConfirmPopup(objPopupData);
		this.PopupManager.getInstance().launchPopup(objPopup);
		return objPopup;
	};

	/**
	 * This method introduced to improve the performance of property Panel window.
	 * and minimize recreate activtiy everytime even same component is selected.
	 * This method will be invoked from controller and responsible to send the new data
	 * to its helper class
	 * @param {Object} objData
	 * @return {none}
	 * @access private
	 * @memberof BaseSimulationActivity#
	 */
	BaseSimulationActivity.prototype.refreshActivityData = function(objData) {
		this.objScreenHelper.refreshHelperScreen(objData);
	};

	/**
	 * This method is responsible to manage editor related events while player is in edit mode.
	 * @param {String} strTask - task name (e.g. componentSelected)
	 * @param {Object} compData - data which need to pass with event
	 * @return none
	 * @access private
	 * @memberof BaseActivity#
	 */
	BaseSimulationActivity.prototype.handleEditorEvents = function(strTask, compData) {
		var objEventData = {}, deselectData = {};
		objEventData.task = strTask;
		objEventData.type = this.ActivityEventConst.PLAYER_EDIT_COMPONENT_EVENT;
		objEventData.compData = compData;
		objEventData.regionToUpdate = this.strRegionName;
		this.trigger(this.ActivityEventConst.PLAYER_EDIT_COMPONENT_EVENT, objEventData);

		if (objEventData.task === "componentSelected") {
			objEventData.compType = objEventData.compData.jsonData.type;
			this.broadcastEvent(strTask, objEventData);
		} else if (objEventData.task === "componentDeselected") {
			deselectData.task = strTask;
			deselectData.compType = objEventData.compData.data.componentType;
			this.broadcastEvent(strTask, deselectData);
		}
	};

	BaseSimulationActivity.prototype.handlePlayerCommonBubbleEvent = function(objData) {
		if (this.objScreenHelper && this.objScreenHelper.handlePlayerCommonBubbleEvent) {
			this.objScreenHelper.handlePlayerCommonBubbleEvent.call(this.objScreenHelper, objData);
		}
	};

	//super class reference.
	BaseSimulationActivity.prototype.BaseSimulationActivitySuper = BaseActivity;

	/**
	 * destroy references
	 * @param {Object} bChildDestroyed
	 */
	BaseSimulationActivity.prototype.destroy = function(bChildDestroyed) {
		this.stopBroadcastEventReceiver("componentDataPropertyUpdated", this, "componentPropertyDataUpdated");
		this.stopBroadcastEventReceiver("forceUnload", this, "forceUnloadInEditMode");
		return this.BaseSimulationActivitySuper.prototype.destroy.call(this, bChildDestroyed);
	};

	return BaseSimulationActivity;
});
