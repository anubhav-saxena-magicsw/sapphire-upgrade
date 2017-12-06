/*jslint nomen: true*/
/*globals Data_Loader,console,_,$ */
/**
 * RegionManager
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */

/*jslint newcap:true */

define(['marionette', "backbone", 'player/controllers/activity-controller', 'player/events/eventsconst', 'player/events/event-broadcaster', 'simPictor/sim-pictor', 'player/controllers/media-controller', 'player/constants/errorconst', 'player/constants/playerconst'], function(Marionette, Backbone, ActivityController, evtConst, EvtBroadcaster, SimPictor, MediaController, errorconst, PlayerConst) {
	'use strict';

	/**
	 * Class "RegionManager" allow MPlayer to run multiple activity in a single time. To achive this 'ActivityManger' create differents regions as specified in
	 * ActivityConfig file. A 'ActivityConfig' file is a xml file which is having region data and its activity details. A 'Region' could be considered as functional block.
	 * MPlayer can have multiple regions as many as mentioned (e.g Header, Footer, Main) in config file.
	 *
	 * A region can show only one activity in a single time but a single activity can be launch in multiple regions in single time.
	 *
	 * All activity regions (activity area) is managing by this class. Class 'RegionManager' creates 'ActivtyController' objects to manage each regions.
	 * The number of 'Controller' objects depends on how many regions needs to be created. Manager creates a seperate Controller objects for each
	 * regions.
	 *
	 * This class also create and establish communication channel in between regions. A user can communication in between more then on activity area/region by
	 * broadcasting a event. @see "BaseActivity" for more details.
	 *
	 * Also this class is responsible to create a list of activities for each region and assign to associated controller object. create component with the help of
	 * 'FactoryManager' and return those component to 'ActivityController'. update current stage scale value to perform drag&drop related task accurately.
	 *
	 * Manage and handle player common task e.g hiding footer/header when required by any activity.
	 *
	 * @class RegionManager
	 * @example
	 * Load module
	 * require(['player/controller/RegionManager'], function(RegionManager) {
	 *     var objActivityController = new RegionManager();
	 * });
	 * @access private
	 */

	var RegionManager = Backbone.Marionette.Controller.extend({
		regionState : {},
		mPlayerModel : undefined,
		objMPlayer : undefined,
		objPlayerConfig : undefined,
		objActConfig : undefined,
		objActivityController : undefined,
		objEventConst : undefined,
		groupModelDict : {},
		nActivityIndex : undefined,
		objActControllerDict : undefined,
		objEventBroadcaster : undefined,
		objInlineTemplates : {},
		objInlineTmplDict : {},
		bAllRegionReady : false,
		arrKey : [],
		objActivtyToLaunch : {},
		bDrawingMode : false,
		objToolController : undefined,
		objTemplateData : undefined,
		objSelectedRegion : undefined,

		/** *************  EDTIOR RELATED DECLARATION **************************/
		strEditorRegion : "mActivity", //hard coded value, must be dynamic in later stage
		objCurrentSelection : undefined,

		/** *************  END EDTIOR RELATED DECLARATION **********************/

		constructor : function(objPlayerRef, objPlayerConfigData, objActivityConfigData, modelRef, bDrawingMode, templateData) {
			var i, tempHtml;
			this.regionState = {};
			this.mPlayerModel = modelRef;
			this.objMPlayer = objPlayerRef;
			this.objPlayerConfig = objPlayerConfigData;
			this.objActConfig = objActivityConfigData;
			this.objActControllerDict = {};
			this.objInlineTemplates = {};
			this.objEventConst = evtConst;
			this.groupModelDict = {};
			this.objEventBroadcaster = new EvtBroadcaster();
			this.objEventBroadcaster.on(this.objEventBroadcaster.BUBBLE_EVENT, this.bubbleEvent, this);
			this.bDrawingMode = bDrawingMode;
			this.objToolController = undefined;
			this.objTemplateData = templateData;

			if (this.objTemplateData !== undefined) {
				for ( i = 0; i < this.objTemplateData.length; i += 1) {
					tempHtml = $(this.objTemplateData[i]);
					this.objInlineTmplDict[tempHtml.attr('id')] = tempHtml.html();
				}
			}
		}
	});

	/**
	 * Method 'initlizeAllRegions' is responsible to create regions based on the activityConfig xml file.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof RegionManager#
	 */
	RegionManager.prototype.initlizeAllRegions = function() {
		var i = 0, arrRegion = [], regionId, allRegionActList = {};

		//if region length found undefined it means regions is having only single actvity.
		if (this.objActConfig.regions.region.length === undefined) {
			arrRegion.push(this.objActConfig.regions.region);
		} else {//activity is having more then one activity.
			arrRegion = this.objActConfig.regions.region;
		}
		this.mPlayerModel.set("arrRegionList", []);
		this.mPlayerModel.set("objRegions", {});

		/*jslint plusplus: true*/
		for ( i = 0; i < arrRegion.length; i++) {
			regionId = arrRegion[i].id;
			allRegionActList[regionId] = this.initRegion(arrRegion[i]);
		}

		this.mPlayerModel.set("objRegions", this.objActControllerDict);

		//By calling this method we will launch the default activity of each region.
		this.initlizeAllActivity(allRegionActList);

		if (this.objActConfig.toolbox !== undefined) {
			this.initlizeToolbox();
		}
	};

	RegionManager.prototype.addRemoveActListInRegion = function(objEvent) {
		var nNextIndex, nActIndex = -1, i, xmlJsonData, objActivityController, objController = this.objActControllerDict[objEvent.regionToUpdate];

		switch(objEvent.bAdd) {
		case true:
			xmlJsonData = $.parseXML(objEvent.strActList).documentElement;
			xmlJsonData = $.xml2json(xmlJsonData);
			objController.arrActivity.push(xmlJsonData);
			objController.allActivities.activity = objController.arrActivity;
			if (objEvent.immediateStart === true) {
				objController.launchActivityByIndex(objController.arrActivity.length - 1, objEvent.data);
			}
			break;
		case false:
			objController.allActivities.activity = objController.arrActivity;
			for ( i = 0; i < objController.arrActivity.length; i = i + 1) {
				if (objEvent.strActList === objController.arrActivity[i].id) {
					nActIndex = i;
					break;
				}
			}
			if (nActIndex !== -1) {

				nNextIndex = nActIndex;
				if (nActIndex === objController.arrActivity.length - 2) {
					nNextIndex = objController.arrActivity.length - 2;
				}
				objController.arrActivity.splice(nActIndex, 1);
				if (objController.nActivityIndex === nNextIndex) {
					objController.launchActivityByIndex(nNextIndex, objEvent.data);
				}
			}
			break;
		}
	};

	/**
	 * method 'prepareRegionDataFromXML' is responsible to prepare region data in runtime and
	 * will assigne this new region data to a 'activityController' object. which makes player enable
	 * to change region activity list at any time.
	 * @param {Object} objEvent contain event type and new region data in xml format
	 * @return {Object} updatedRegionData
	 */
	RegionManager.prototype.prepareRegionDataFromXML = function(objEvent) {
		var objXml, xmlJsonData = {}, updatedRegionData, objController = this.objActControllerDict[objEvent.regionId];
		objXml = objEvent.strActList;
		objXml = $.parseXML(objXml).documentElement;
		xmlJsonData = $.xml2json(objXml);
		updatedRegionData = $.makeArray(xmlJsonData.activities.activity).slice();

		objController.arrActivity = updatedRegionData;
		objController.allActivities.activity = updatedRegionData;
		if (objEvent.defaultActId !== undefined) {
			objController.allActivities.defaultLaunchID = objEvent.defaultActId;
		} else {
			delete objController.allActivities.defaultLaunchID;
		}

		if (objEvent.immediateStart !== undefined) {
			objController.immediateStart = objEvent.immediateStart;
		}
		if (objEvent.immediateStart === true) {
			this.startActivityController(objController, objEvent.data);
		}
		return updatedRegionData;
	};

	/**
	 * Initlize a region based on the passed parameters and return region list
	 * which still needs to be initlized.
	 * @param {Object} objRegion
	 * @return {Array} Region list.
	 * @access private
	 * @memberof RegionManager#
	 */
	RegionManager.prototype.initRegion = function(objRegion) {
		var objClassRef = this, actController, objCustomData, regionId = objRegion.id, bEditMode;
		//..adding region id in player model
		this.mPlayerModel.get("arrRegionList").push(objRegion.id);

		bEditMode = (objRegion.edit === undefined) ? false : ((objRegion.edit === "true") ? true : false);

		//.. will create "ActivityController" for every region.
		actController = new ActivityController(this.objMPlayer.getRegion(regionId), this.objPlayerConfig, regionId, this.objEventBroadcaster, this.bDrawingMode, bEditMode);
		objCustomData = {};
		objCustomData.classRef = actController;
		objCustomData.testID = regionId;
		actController.classReference = objCustomData;
		actController.mPlayerModel = this.mPlayerModel;

		//..updating dictionary of 'activity controller(s)'
		//..store the "controller" object reference with their associated region id.
		this.objActControllerDict[regionId] = actController;

		//..set the local language name to 'activityController', default value of default language can be set
		//..through playerConfig file.
		//..Also local language property can be override with queryString object
		this.objActControllerDict[regionId].setLocalLanguage(this.objMPlayer.getPlayerHelper().getLocalLanguage());

		//..setting the preloader setting to activity controller Based on playerConfig data
		//..<showPreloader>true</showPreloader>
		this.objActControllerDict[regionId].showPreloaderBeforeActivityLaunch(this.objMPlayer.getPlayerHelper().getPreloaderSetting());

		this.objActControllerDict[regionId].initController(objRegion);
		//..init activity controller.

		actController.on(this.objEventConst.REGION_INITLIZE_UPATE_EVENT, objClassRef.handleActivityInitProcess, objClassRef);

		//..Register the "ActivityController" event(s)
		actController.on(this.objEventConst.CREATE_COMPONENT_EVENT, objClassRef.createComponent, objClassRef);
		actController.on(this.objEventConst.PLAYER_COMMON_TASK_EVENT, objClassRef.handlePlayerCommonTaskEvent, objClassRef);
		actController.on(this.objEventConst.PLAYER_BUBBLE_EVENT, objClassRef.handlePlayerBubbleEvents, objClassRef);

		//actController.on(this.objEventConst.PLAYER_EDIT_COMPONENT_EVENT, objClassRef.handlePlayerEditorTask, objClassRef);

		actController.on(this.objEventConst.BROADCAST_EVENT, objClassRef.broadcastEvent, objClassRef);
		actController.on(this.objEventConst.ON_ACTIVITY_SUCCESSFULLY_ADDED_IN_REGION, objClassRef.onActivityAddedInRegion, objClassRef);
		actController.on(this.objEventConst.REMOVE_COMPONENT_EDITORS, objClassRef.flushEditor, objClassRef);

		actController.on(this.objEventConst.CREATE_AND_INIT_ACTIVITY_HTML, objClassRef.createHTMLComponent, objClassRef);

		actController.on(this.objEventConst.PLAYER_INIT_FROM_CONTROLLER_EVENT, objClassRef.createPlayerFromControllerEvent, objClassRef);

		if (this.bDrawingMode === true) {
			actController.on(this.objEventConst.SET_DRAWING_CANVAS, objClassRef.setDrawingCanvasEvent, objClassRef);
			actController.on(this.objEventConst.DRAWING_COMMON_TASK, objClassRef.handleDrawingCommonTask, objClassRef);
		}

		//initlizing editor
		this.objMPlayer.getPlayerHelper().onActivityInitlized(regionId, bEditMode);
		actController.loadPriority = objRegion.loadPriority;
		actController.immediateStart = (objRegion.immediateStart === undefined) ? true : (objRegion.immediateStart === "false") ? false : true;
		return $.makeArray(objRegion.activities.activity).slice();
	};

	/**
	 * This mehtod force to every activity controller to launch its default activity.
	 * The default activity can be defined in config file, if not defined then 0 will be the default activity.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof RegionManager#
	 */
	RegionManager.prototype.initlizeAllActivity = function(allRegionActList) {
		var key, arrPriorityList = [];
		this.arrKey = [];
		for (key in this.objActControllerDict) {
			if (this.objActControllerDict.hasOwnProperty(key)) {
				if (this.objActControllerDict[key].loadPriority === undefined) {
					this.objActControllerDict[key].allRegionActivityList = allRegionActList;
					this.startActivityController(this.objActControllerDict[key]);
				} else {
					this.objActControllerDict[key].loadPriority = Number(this.objActControllerDict[key].loadPriority);
					this.objActivtyToLaunch[this.objActControllerDict[key].loadPriority] = key;

					if (this.arrKey.indexOf(this.objActControllerDict[key].loadPriority) !== -1) {
						throw new Error(errorconst.SAME_LOAD_PRIORITY_DEFINED);
					}
					this.arrKey.push(Number(this.objActControllerDict[key].loadPriority));
				}
			}
		}

		if (this.arrKey.length > 0) {
			//'this.sortRule' is a method, which will set the sorting rule,
			//and make the 1,3,33,5, will be 1,3,5 and 33.
			this.arrKey = this.arrKey.sort(this.sortRule);
			this.initActivityControllerByPriorityList(0);
		}
	};

	RegionManager.prototype.startActivityController = function(objActController, objData, strActivityID, bLaunchByIndex) {
		if (objActController.immediateStart === true) {
			objActController.immediateStart = "done";
			objActController.start(objData, strActivityID, bLaunchByIndex);
		} else {
			this.objMPlayer.getPlayerHelper().showHideRegionById(objActController.strRegionName, false);
		}
	};

	/**
	 * Method 'sortRule' is introduced to make sure the sorting order for
	 * activity load priority list. this method is setting the sorting rule when
	 * activity priority list will be sort.
	 *
	 * @param {Number} value1
	 * @param {Number} value2
	 * @return {Number} difference
	 * @access private
	 * @memberof RegionManager#
	 */
	RegionManager.prototype.sortRule = function(value1, value2) {
		return value1 - value2;
	};

	/**
	 * Load and initlize activity by their priority value.
	 * @param {Number} index, activity index which need to be initlized.
	 * @return none
	 * @access private
	 * @memberof RegionManager#
	 */
	RegionManager.prototype.initActivityControllerByPriorityList = function(index) {
		if (index < this.arrKey.length) {
			this.startActivityController(this.objActControllerDict[this.objActivtyToLaunch[this.arrKey[index]]]);
		}
	};

	RegionManager.prototype.initlizeToolbox = function() {
		var classRef = this, toolboxData = this.objActConfig.toolbox;

		require(['player/controllers/toolbox-controller'], function(toolController) {
			classRef.objToolController = new toolController(toolboxData);
		});
	};

	/**
	 * This function is responsible to get the new component through FactoryManager.
	 * @param ObjeEvent
	 * @returns None
	 * @access private
	 * @memberof RegionManager#
	 */
	RegionManager.prototype.createComponent = function(objEvent) {
		//Asking factory manager for a component.
		this.objMPlayer.getPlayerHelper().getFactoryManager().getComponent(objEvent);
	};

	/**
	 * This method is attached with the 'CREATE_AND_INIT_ACTIVITY_HTML', which will be dispatched from activity controller
	 * class if some dynamic component needs to be created before activity initlization.
	 * @access private
	 * @memberof RegionManager#
	 * @param {Object}
	 * @return none
	 */
	RegionManager.prototype.createHTMLComponent = function(objEvent) {
		objEvent.controller.editorData = objEvent;
		this.objMPlayer.getPlayerHelper().getEditorManager().renderActivityHTML(objEvent.controller.strRegionName, objEvent.actData);
		//this.OnHTMLCreationCompleteComponent(objEvent);
	};

	/**
	 * Invoked when an activity want to set its own drawing canvas area.
	 * This method is registered with the controller event 'SET_DRAWING_CANVAS'.
	 * method is responsible to set the drawing canvas area in drawing manager classs
	 *
	 * @param {Object} objEvent data received with the event.
	 * @return none
	 * @access private
	 * @memberof RegionManager
	 */
	RegionManager.prototype.setDrawingCanvasEvent = function(objEvent) {
		this.objMPlayer.getPlayerHelper().getDrawingManager().setUserCanvas(objEvent);
	};

	/**
	 * Invoked every time when 'DRAWING_COMMON_TASK' event dispatched from an
	 * activity through its cotroller class.
	 *
	 * This method is responsible to perform on various task which will be delivered
	 * with the event object.
	 *
	 * @param {Object} objEvent data received with the event.
	 * @return none
	 * @access private
	 * @memberof RegionManager
	 */
	RegionManager.prototype.handleDrawingCommonTask = function(objEvent) {

	};

	/**
	 * method handleActivityInitProcess is responsible to manage activity/region initlize
	 * process
	 * will be invoked every time when an activity controller is about to reload or
	 * launch a new activity within its own area.
	 *
	 * These events will be useful when a region area can start its own work
	 * only after when a region is initlized successfully.
	 *
	 * @param {Object} objEvent event reference
	 * @return none
	 * @access private
	 * @memberof RegionManager
	 */

	RegionManager.prototype.handleActivityInitProcess = function(objEvent) {
		var strProgressType, key, bAllRegionReady = false, data = {}, objPictorData = {}, objClassRef = this;
		strProgressType = objEvent.progressType;
		switch (strProgressType) {
		case this.objEventConst.REGION_INITLIZE_START_EVENT:
			objEvent.target.isReady = false;
			break;

		case this.objEventConst.REGION_INITLIZE_COMPLETE_EVENT:
			bAllRegionReady = true;
			objEvent.target.isReady = true;
			if (objEvent.target.objActivityRef.type === "simulation") {
				objPictorData.editorManager = objClassRef.objMPlayer.getPlayerHelper().getEditorManager();
				objPictorData.simActRef = objEvent.target.objActivityRef;
				objPictorData.bEditor = objEvent.target.bEditor;
				objEvent.target.objActivityRef.setPictorRef(new SimPictor(objPictorData));
			}
			for (key in objClassRef.objActControllerDict) {
				if (objClassRef.objActControllerDict.hasOwnProperty(key)) {
					if ((objClassRef.objActControllerDict[key].immediateStart) === true && (objClassRef.objActControllerDict[key].isReady) !== true) {
						bAllRegionReady = false;

						//Creating load priority list for activity if provided in 'activityConfig.xml'.
						if (objClassRef.arrKey.indexOf(objEvent.target.loadPriority) !== -1) {
							objClassRef.initActivityControllerByPriorityList(this.arrKey.indexOf(objEvent.target.loadPriority) + 1);
						}
						return;
					}
				}
			}

			if (bAllRegionReady === true) {
				data = {};
				data.type = objClassRef.objEventConst.PLAYER_INITLIZE_COMPLETE_EVENT;
				data.target = objClassRef;
				objClassRef.objMPlayer.getPlayerHelper().onPlayerInitlizationComplete(data);

				for (key in objClassRef.objActControllerDict) {
					if (objClassRef.objActControllerDict.hasOwnProperty(key)) {
						objClassRef.objActControllerDict[key].onPlayerInitComplete();
					}
				}
			}

			break;
		}
		this.bAllRegionReady = bAllRegionReady;
	};

	RegionManager.prototype.handlePlayerBubbleEvents = function(objEvent) {
		this.trigger(objEvent.type, objEvent);
	};

	/**
	 * This function is responsible to handle common task at player level
	 * e.g show/hide any activity region by id or show/hide preloader
	 * @param {objEvent} Event object
	 * @return {none}
	 * @access private
	 * @memberof RegionManager#
	 */
	RegionManager.prototype.handlePlayerCommonTaskEvent = function(objEvent) {
		var strTaskName = objEvent.task;

		switch (strTaskName) {

		case this.objEventConst.SHOW_HIDE_REGION:
			this.objMPlayer.getPlayerHelper().showHideRegionById(objEvent.regionToHIde, objEvent.state);
			break;

		case this.objEventConst.SHOW_PRELOADER:
			this.objMPlayer.getPlayerHelper().showPreloader(objEvent);
			break;

		case this.objEventConst.HIDE_PRELOADER:
			this.objMPlayer.getPlayerHelper().hidePreloader();
			break;

		case this.objEventConst.LAUNCH_ACTIVITY_IN_REGION:
			//handling activity change request when thrown by another region's activity
			if (this.objActControllerDict[objEvent.regionToChange]) {
				this.objActControllerDict[objEvent.regionToChange].onActivityLaunchRequestByAnotherRegion(objEvent);
			} else {
				this.objMPlayer.getPlayerHelper().launchActivityInRegion(objEvent);
			}
			break;

		case this.objEventConst.UPDATE_PLAYER_SIZE_EVENT:
			this.objMPlayer.getPlayerHelper().onPlayerInitlizationComplete(objEvent);
			break;

		case this.objEventConst.PREPARE_INLINE_TEMPLATE_DATA:
			objEvent.data.inlineTemplates = undefined;
			this.prepareInlineTemplates(objEvent);
			break;

		case this.objEventConst.PAUSE_ALL_MEDIA:
			MediaController.getInstance().pause();
			break;

		case this.objEventConst.RESUME_ALL_MEDIA:
			MediaController.getInstance().resume();
			break;

		case this.objEventConst.MANAGE_NEXT_BACK_NEVIGATION_BUTTON:
			this.manageNextBackNevigationEvent(objEvent);
			break;
		case this.objEventConst.START_REGION_FROM_OTHER_REGION:
			this.startRegion(objEvent);
			break;

		case this.objEventConst.UPDATE_REGION_ACTIVITY_LIST:
			this.prepareRegionDataFromXML(objEvent);
			break;

		case this.objEventConst.EXECUTE_WEB_SERVICE_CALL:
			objEvent.requestTo = PlayerConst.WEB_SERVICE_MANAGER;
			this.trigger(PlayerConst.MANAGE_MANAGERS_EVENTS, objEvent);
			break;

		case this.objEventConst.STOP_ALL_REGIONS:
			this.stopAllRegions(objEvent.state, (objEvent.ignoreCaller === true) ? objEvent.regionId : undefined, objEvent);
			break;

		case this.objEventConst.APPEND_ACTIVITY_IN_REGION:
			this.addRemoveActListInRegion(objEvent);
			break;

		case this.objEventConst.HIDE_ALL_REGION:
			this.hideAllRegion(objEvent);
			break;
		/*
		 case this.objEventConst.EXECUTE_USER_LAST_ACTION_FROM_ANOTHER_REGION:
		 if (this.objActControllerDict[objEvent.customData.regionToChange]) {
		 this.objActControllerDict[objEvent.customData.regionToChange].userlastActionRecord();
		 }
		 objEvent.requestTo = this.objEventConst.EXECUTE_USER_LAST_ACTION_FROM_ANOTHER_REGION;
		 objEvent.task = objEvent.requestTo;
		 this.trigger(PlayerConst.MANAGE_MANAGERS_EVENTS, objEvent);
		 break;
		 */

		case this.objEventConst.START_STOP_REGION:
			if (objEvent.state === false) {
				this.stopRegion(objEvent.regionToStart);
			} else {
				this.startRegion(objEvent);
			}
			break;
		}
	};

	/**
	 * This method is binded with 'START_REGION_FROM_OTHER_REGION' event
	 * Which is responsible to start a region by calling its controller
	 * The 'START_REGION_FROM_OTHER_REGION' event can be invoked from
	 * base-activity's api 'startRegion'.
	 *
	 */
	RegionManager.prototype.startRegion = function(objEvent) {
		if (objEvent.regionToStart !== undefined) {
			objEvent.regionId = objEvent.regionToStart;
		}
		var objActivityData, objController = this.objActControllerDict[objEvent.regionId];
		if (objController) {
			objController.immediateStart = true;
			this.objMPlayer.getPlayerHelper().showHideRegionById(objEvent.regionId, true);
			objActivityData = objEvent.data;
			if (objEvent.dataToActivity) {
				objActivityData = objEvent.dataToActivity;
			}
			this.startActivityController(this.objActControllerDict[objEvent.regionId], objActivityData, objEvent.strActivityID, objEvent.bLaunchByIndex);
		}

	};

	/**
	 * Responsible to stop region and unload all its activity.
	 */
	RegionManager.prototype.stopRegion = function(strRegionId) {
		this.objActControllerDict[strRegionId].stopAndUnload();
		this.objMPlayer.getPlayerHelper().showHideRegionById(strRegionId, false);
	};

	/**
	 * This method is responsible to stop all regions
	 */
	RegionManager.prototype.stopAllRegions = function(bStart, strRegionToIgnore, objActionData) {
		var objClassref = this, objEventData = {}, dataForActivities = objActionData.activitiesData, actData;
		bStart = (bStart !== undefined) ? bStart : false;
		$.each(objClassref.objActControllerDict, function(key, value) {
			switch(bStart) {
			case true:
				if (strRegionToIgnore !== key) {
					objClassref.stopRegion(key);
				}
				break;

			case false:
				objEventData = {};
				objEventData.regionId = key;
				if (strRegionToIgnore !== key) {
					if (dataForActivities !== undefined) {
						actData = dataForActivities[key];
					}
					if (actData === undefined || actData.regionData === undefined) {
						objClassref.startRegion(objEventData);

					} else {
						var objTempData = {};
						objTempData.regionId = key;
						objTempData.strActList = actData.regionData;
						objTempData.immediateStart = true;
						objTempData.data = actData.deliverToActivity;
						objTempData.defaultActId = actData.defaultLaunchId;
						objClassref.prepareRegionDataFromXML(objTempData);
						objClassref.objMPlayer.getPlayerHelper().showHideRegionById(objTempData.regionId, true);
					}
				} else {
					objClassref.stopRegion(key);
				}

				break;
			}
		});
	};

	RegionManager.prototype.manageNextBackNevigationEvent = function(objEvent) {
		var arrControls = objEvent.controls, i, strId, strRegionName, objData;
		for ( i = 0; i < arrControls.length; i += 1) {
			strId = arrControls[i].id;
			strRegionName = arrControls[i].region;
			objData = arrControls[i];
			objData.param = objEvent[arrControls[i].param];
			this.objActControllerDict[strRegionName].updateNevigationControl(objData);
		}
	};

	/**
	 * This method is registred with the bubble event.
	 * A Bubble event will be invoked by activity to broadcast a event to every region(s)
	 *
	 * @param {Object} objEvent Event to broadcast
	 * @return none
	 * @access private
	 * @memberof RegionManager#
	 */
	RegionManager.prototype.bubbleEvent = function(objEvent) {
		var key;
		for (key in this.objActControllerDict) {
			if (this.objActControllerDict.hasOwnProperty(key)) {
				this.objActControllerDict[key].bubbleEvent(objEvent);
			}
		}
		this.trigger(objEvent.type, objEvent);
	};

	RegionManager.prototype.handleBroadcastEventFromOtherPlayer = function(objEvent) {
		var key;
		for (key in this.objActControllerDict) {
			if (this.objActControllerDict.hasOwnProperty(key)) {
				this.objActControllerDict[key].handleBroadcastEventFromOtherPlayer(objEvent);
			}
		}
	};

	/**
	 * This method is responsible to broadcast a event to every region(s)
	 * @param {Object} objEvent Event to broadcast
	 * @return none
	 * @access private
	 * @memberof RegionManager#
	 */
	RegionManager.prototype.broadcastEvent = function(objEvent) {
		this.objEventBroadcaster.broadcastEvent(objEvent);
	};

	//TODO COMMENT
	//TODO: NEED TO CHECK WHEN PLAYER WILL RUN LIKA A MODULE
	RegionManager.prototype.flushEditor = function(strRegionId) {
		//removing component editorReferences if any.
		this.objMPlayer.getPlayerHelper().getEditorManager().flushEditor(strRegionId);
	};

	/**
	 * Method 'onActivityAddedInRegion' is responsible to provide a notification
	 * to other regions when a activity is loaded or changed in their region.
	 *
	 * 'onRegionUpdate' method of an 'Activity' in each region will be invoked when
	 * a region change its activity.
	 *
	 * @param {Obejct} objEvent
	 * @return none
	 * @memberof RegionManager#
	 * @access private
	 */
	RegionManager.prototype.onActivityAddedInRegion = function(objEvent) {
		this.regionState[objEvent.regionName] = objEvent;
		var key;
		for (key in this.objActControllerDict) {
			if (this.objActControllerDict.hasOwnProperty(key)) {
				this.objActControllerDict[key].onRegionUpdate(this.regionState);
			}
		}
		objEvent.requestTo = PlayerConst.REGION_CHANGE_NOTIFICATION;
		objEvent.task = PlayerConst.REGION_CHANGE_NOTIFICATION;
		objEvent.regionState = this.regionState;
		this.trigger(PlayerConst.MANAGE_MANAGERS_EVENTS, objEvent);
	};

	/**
	 * Invoked when all rquired component created by factory manager
	 * now we are passing the control to activity controller class to load and intilize activity.
	 * @param {Object} objEvent contain all data related to current activity.
	 * @return {none}
	 * @access private
	 * @memberof RegionManager#
	 */
	RegionManager.prototype.OnHTMLCreationCompleteComponent = function(objEvent) {

		var objActController = this.objActControllerDict[objEvent.regionId];
		this.setInlineTemplates(objEvent.regionId, objEvent);
		objActController.onHtmlLoadComplete(objEvent);
	};

	/**
	 * set and prepare script text and store this data globaly, any region can access this data
	 * @param {type} strRegionId
	 * @param {type} activityHtmlData
	 * @returns {undefined}
	 */
	RegionManager.prototype.setInlineTemplates = function(strRegionId, activityHtmlData) {
		if (activityHtmlData.hasOwnProperty('inlineTemplates')) {
			this.objInlineTemplates[strRegionId] = activityHtmlData.inlineTemplates;
			if (this.bAllRegionReady) {
				this.prepareInlineTemplates();
			}
		}
	};

	/**
	 *
	 * @returns {undefined}
	 */
	RegionManager.prototype.prepareInlineTemplates = function(objEvent) {
		var i, objClassref = this;

		$.each(objClassref.objInlineTemplates, function(key, value) {
			if (objClassref.objInlineTemplates.hasOwnProperty(key)) {
				for ( i = 0; i < value.length; i += 1) {
					var $tmpl = $(value[i]);
					objClassref.objInlineTmplDict[$tmpl.attr('id')] = $tmpl.html();
				}
			}
		});

		// send it to all controllers...
		$.each(objClassref.objActControllerDict, function(key, value) {
			if (objClassref.objActControllerDict.hasOwnProperty(key)) {
				objClassref.objActControllerDict[key].setInlineTemplates(objClassref.objInlineTmplDict);
			}
		});

		if (objEvent !== undefined && objEvent.callback === true) {
			objEvent.data.processData = objClassref.objInlineTmplDict;
			objClassref.objActControllerDict[objEvent.data.regionId].onHtmlLoadComplete(objEvent.data);
		}

	};

	/**
	 * This funciton is binded with FactoryManager instance and will be invoked every time
	 * when a component created successfully and ready to used by activity.
	 *
	 * @param {Objcect} objData component reference
	 * @return none
	 * @access private
	 * @memberof RegionManager#
	 */
	RegionManager.prototype.onComponentCreationComplete = function(objData) {
		//..pass the component to ActivityController for further action
		objData.actController.onComponentCreated(objData);
	};

	RegionManager.prototype.setStageScaleValue = function(nStageScale) {
		var key, objClassRef = this;
		for (key in objClassRef.objActControllerDict) {
			if (objClassRef.objActControllerDict.hasOwnProperty(key)) {
				objClassRef.objActControllerDict[key].setStageScaleValue(nStageScale);
			}
		}
	};

	RegionManager.prototype.getInlineTemplateData = function() {
		return this.objInlineTmplDict;
	};

	/**
	 * This function is responsible to handle editor related events at player level
	 * @param {objEvent} Event object
	 * @return {none}
	 * @access private
	 * @memberof RegionManager#
	 */
	RegionManager.prototype.handlePlayerEditorTask = function(objEvent) {
		var strTaskName = objEvent.task, objData;
		switch (strTaskName) {
		case this.objEventConst.COMPONENT_SELECTED:
			break;
		case this.objEventConst.COMPONENT_DESELECTED:
			break;
		case this.objEventConst.COMPONENT_DATA_PROPERTY_UPDATED:
			break;
		}
	};

	RegionManager.prototype.managePlayerCommonTask = function(objPlayerData) {
		var strTask, objController, key;
		strTask = objPlayerData.task;
		switch(strTask) {
		case this.objEventConst.LAUNCH_ACTIVITY_IN_REGION:
			objController = this.objActControllerDict[objPlayerData.regionToChange];
			if (objController !== undefined) {
				objController.onActivityLaunchRequestByAnotherRegion(objPlayerData);
			}
			break;
		case PlayerConst.REGION_CHANGE_NOTIFICATION:
			for (key in this.objActControllerDict) {
				if (this.objActControllerDict.hasOwnProperty(key)) {
					this.objActControllerDict[key].onRegionUpdate(objPlayerData.regionState, true);
				}
			}
			break;
		/*
		 case this.objEventConst.EXECUTE_USER_LAST_ACTION_FROM_ANOTHER_REGION:
		 if (this.objActControllerDict[objPlayerData.customData.regionToChange]) {
		 this.objActControllerDict[objPlayerData.customData.regionToChange].userlastActionRecord();
		 }
		 break;
		 */
		}

	};

	RegionManager.prototype.managePlayerCommand = function(objPlayerData) {
		var strTaskName = objPlayerData.customData.task, updatedRegionActivity, objTempData = {}, objDataToSend = {};
		switch(strTaskName) {
		case "startRegion":
			objTempData.regionId = objPlayerData.customData.regionToStart;
			if (objPlayerData.customData.data && this.objActControllerDict[objPlayerData.customData.regionToStart]) {
				objTempData.strActList = objPlayerData.customData.data[objPlayerData.customData.regionToStart].regionData;
				objTempData.immediateStart = true;
				objTempData.data = objPlayerData.customData.data[objPlayerData.customData.regionToStart].deliverToActivity;
				objTempData.defaultActId = objPlayerData.customData.data[objPlayerData.customData.regionToStart].defaultLaunchId;
				this.prepareRegionDataFromXML(objTempData);
				this.objMPlayer.getPlayerHelper().showHideRegionById(objPlayerData.customData.regionToStart, true);
			} else {
				if (objPlayerData.customData.dataToActivity) {
					//objPlayerData.customData.data = objPlayerData.customData.dataToActivity;
				}
				this.startRegion(objPlayerData.customData);
			}
			break;
		case "stopRegion":
			if (this.objActControllerDict[objPlayerData.customData.regionToStart]) {
				this.stopRegion(objPlayerData.customData.regionToStart);
			}
			break;
		case "startAllRegion":
			this.stopAllRegions(true);
			break;
		case "refreshRegion":
			objDataToSend.regionId = objPlayerData.customData.regionToStart;
			objDataToSend.strActList = objPlayerData.customData.data[objPlayerData.customData.regionToStart].regionData;
			updatedRegionActivity = this.prepareRegionDataFromXML(objDataToSend);
			this.objActControllerDict[objDataToSend.regionId].immediateStart = true;
			this.startActivityController(this.objActControllerDict[objDataToSend.regionId]);
			break;
		}
	};

	RegionManager.prototype.onPlayerBubbleEvent = function(objEventData) {
		var objClassref = this;
		$.each(objClassref.objActControllerDict, function(key, value) {
			objClassref.objActControllerDict[key].handlePlayerCommonBubbleEvent(objEventData);
		});
	};

	/*
	 RegionManager.prototype.onComponentPropertyUpdatedFromPanel = function(objEvent) {

	 };
	 */

	RegionManager.prototype.hideAllRegion = function(objEvent) {
		var objClassref = this;
		$.each(objClassref.objActControllerDict, function(key, value) {
			objClassref.objMPlayer.getPlayerHelper().showHideRegionById(objClassref.objActControllerDict[key].strRegionName, false);
		});
	};

	RegionManager.prototype.onNoComponentSelectedInEditor = function(objEvent) {
		this.objCurrentSelection = undefined;
	};

	/**
	 * Invoked from player to deliver data to activity
	 * @param (Object) objData
	 * @param {Array/String} regionsName
	 * @return none
	 * @memberof RegionManager#
	 * @access private
	 */
	RegionManager.prototype.onDataReceivedFromWrapper = function(objData, regionsName) {
		var regionList = _.isArray(regionsName) ? regionsName : [regionsName];
		//console.log("objData!!!!!!!", objData, " :::::::::::::::: ", regionList)
	};

	RegionManager.prototype.createPlayerFromControllerEvent = function(objEvent) {
		this.objMPlayer.getPlayerHelper().handleNewPlayerCreation(objEvent);
	};

	/**
	 * This function destroys the object refrence of activity
	 * @param None
	 * @returns None
	 * @access private
	 * @memberof RegionManager#
	 */
	RegionManager.prototype.destroy = function() {
		var objClassRef = this, key, actController;
		objClassRef.removeEvents();
		objClassRef.objEventBroadcaster.off(objClassRef.objEventBroadcaster.BUBBLE_EVENT);
		for (key in objClassRef.objActControllerDict) {
			if (objClassRef.objActControllerDict.hasOwnProperty(key)) {
				actController = objClassRef.objActControllerDict[key];
				actController.off(objClassRef.objEventConst.CREATE_COMPONENT_EVENT);
				actController.off(objClassRef.objEventConst.PLAYER_COMMON_TASK_EVENT);
				actController.off(objClassRef.objEventConst.PLAYER_EDIT_COMPONENT_EVENT);
				actController.off(objClassRef.objEventConst.BROADCAST_EVENT);
				actController.off(objClassRef.objEventConst.ON_ACTIVITY_SUCCESSFULLY_ADDED_IN_REGION);
				actController.off(objClassRef.objEventConst.REMOVE_COMPONENT_EDITORS);
				actController.off(objClassRef.objEventConst.CREATE_AND_INIT_ACTIVITY_HTML);
				actController.off(objClassRef.objEventConst.SET_DRAWING_CANVAS);
				actController.off(objClassRef.objEventConst.DRAWING_COMMON_TASK);
				actController.off(objClassRef.objEventConst.DRAWING_COMMON_TASK);
				actController.off(objClassRef.objEventConst.REGION_INITLIZE_START_EVENT);
				actController.off(objClassRef.objEventConst.PLAYER_INIT_FROM_CONTROLLER_EVENT);
			}
		}
		objClassRef.objActivityController.destroy();
		return true;
	};

	return RegionManager;
});
