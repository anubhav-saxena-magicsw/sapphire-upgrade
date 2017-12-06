/*jslint nomen: true*/
/*globals Backbone,_,console,$, class */

/**
 * ActivityController
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */
define(['marionette', 'player/events/eventsconst', 'player/controllers/activity-event-controller', 'player/utils/data-loader', 'player/controllers/audio-controller', 'player/constants/errorconst'], function(Marionette, eventconst, ActEventControllers, DataLoader, audioController, errorConst) {
	"use strict";
	var ActivityController;

	/**
	 * Class 'ActivityController' is controller class for a activity area. this class is responsible to keep up-to-date activity with
	 * updated value which can be changed during run time. e.g new scaled value.
	 *
	 * Initlize a region and load default activity if any otherwise launch the 0 index activity.
	 *
	 * Also responsible to verify the activity before to load and append in region area that a activity is valid or not. A valid activity is a class which
	 * is extending 'BaseActivity' class.
	 *
	 * Also manage a list of components which are created by a activity in run time and make sure that each component destroyed before to unload activity.
	 *
	 * This class is act like a bridge between activity and player, Activity can create components, broadcast or receiveBroadCastEvent through the player with
	 * the help of this class.
	 *
	 * Launch Next activity (if any) triggred by an "activity" will be handled by this class.
	 *
	 *
	 *@access private
	 *@class ActivityController
	 *@augments Backbone.Marionette.Controller.extend
	 */

	ActivityController = Backbone.Marionette.Controller.extend({
		bEditor : false,
		SEARCH_BY_ID : "searchByID",
		SEARCH_BY_INDEX : "searchByIndex",
		COMP_SUFFIX : "COMP_",
		SIM_PICTOR : "sim-pictor",
		SIM_PICTOR_PATH : "frameworkRoot/activities/simulation-activity",
		MPLAYER : "mPlayer",
		editorData : undefined,
		objEventController : undefined,
		objEventBroadcaster : undefined,
		objCompDict : undefined,
		regionData : undefined,
		allActivities : undefined,
		arrActivity : undefined,
		groupModelDict : undefined,
		activityRegion : undefined,
		objActivityList : undefined,
		objEventConst : undefined,
		playerConfig : undefined,
		localLanguageName : undefined,
		objActRef : undefined,
		compCounter : 0,
		nActivityIndex : 0,
		strRegionName : "",
		broadcastEventDict : undefined,
		showPreloader : false,
		stageScaleValue : 1,
		mPlayerModel : undefined,
		nTotalActivityLength : -1,
		data_loader : undefined,
		html_comp_list : undefined,
		allRegionActivityList : undefined,
		bDrawingMode : undefined,
		isReady : undefined,
		activityPreloadedData : undefined,
		actPreloadedData : {},
		objActivityRef : undefined,
		isPictorInitliazed : false,
		//objNextActionInEditor : {},
		isActivityInitalized : true,

		constructor : function(actRegion, mConfig, regionName, evtBroadcaster, setDrawingMode, bEditMode) {
			this.html_comp_list = [];
			this.objEventController = new ActEventControllers();
			this.groupModelDict = {};
			this.activityRegion = actRegion;
			this.objEventConst = eventconst;
			this.playerConfig = mConfig;
			this.objActivityList = {};
			this.objCompDict = {};
			this.nActivityIndex = 0;
			this.arrActivity = [];
			this.strRegionName = regionName;
			this.objEventBroadcaster = evtBroadcaster;
			this.broadcastEventDict = {};
			this.data_loader = new DataLoader();
			this.bDrawingMode = setDrawingMode;
			this.dispatchInitEvent(this.objEventConst.REGION_INITLIZE_START_EVENT);
			this.actPreloadedData = undefined;
			this.bEditor = bEditMode;
		},

		initlize : function() {
			//console.log("initlized.....");
		}
	});

	/**
	 *A unique id provided by framework to each activity.
	 *@memberof ActivityController
	 *@param {Object} objEvent contains the reference of event object
	 *@returns None
	 *@access public
	 */
	function handlePlayAudio(objEvent) {
		audioController.getInstance().playAudio(objEvent);
	}

	function handleWebApiAudio(objEvent) {
		audioController.getInstance().playWebAudio(objEvent);
	}

	function unloadWebApiBufferAudio(objEvent) {
		audioController.getInstance().unloadWebApiBufferAudio(objEvent);
	}

	function initWebAudio(objEvent) {
		audioController.getInstance().initWebAudio(objEvent);
	}

	/**
	 *Stops all the sounds playing in the background
	 *@memberof ActivityController
	 *@param {Object} objEvent contains the reference of event object
	 *@returns None
	 *@access public
	 */
	function handleStopAllAudio(objEvent) {
		audioController.getInstance().stopAllAudio(objEvent);
	}

	/**
	 *Restarts the audio
	 *@memberof ActivityController
	 *@param {Object} objEvent contains the reference of event object
	 *@returns None
	 *@access private
	 */
	function handleRestartAudio(objEvent) {
		audioController.getInstance().restartAudio(objEvent);
	}

	/**
	 *Stops the audio
	 *@memberof ActivityController
	 *@param {Object} objEvent contains the reference of event object
	 *@returns None
	 *@access private
	 */
	function handleStopAudio(objEvent) {
		audioController.getInstance().stopAudio(objEvent.trackId, objEvent.destroy);
	}

	/**
	 *Restarts the audio
	 *@memberof ActivityController
	 *@param {Object} objEvent contains the reference of event object
	 *@returns None
	 *@access private
	 */
	function handlePauseAudio(objEvent) {
		audioController.getInstance().pauseAudio(objEvent);
	}

	/**
	 *Resumes the audio
	 *@memberof ActivityController
	 *@param {Object} objEvent contains the reference of event object
	 *@returns None
	 *@access private
	 */
	function handleResumeAudio(objEvent) {
		audioController.getInstance().resumeAudio(objEvent);
	}

	/**
	 *Handles volume control
	 *@memberof ActivityController
	 *@param {Object} objEvent contains the reference of event object
	 *@returns None
	 *@access private
	 */
	function handleAudioVolumeChange(objEvent) {
		audioController.getInstance().setVolume(objEvent);
	}

	/**
	 *Handles default volume control
	 *@memberof ActivityController
	 *@param {Object} objEvent contains the reference of event object
	 *@returns None
	 *@access private
	 */
	function handleAudioDefaultVolumeChange(objEvent) {
		audioController.getInstance().setDefaultVolume(objEvent);
	}

	/**
	 * Invoked every time when a component created (requested by activity)
	 * This method is responsbile to initlized the component with its data if provided
	 * by acitivity and deliver the component to activity.
	 * @param {Object} objCompData component data
	 * @memberof ActivityController#
	 * @return None
	 * @access private
	 */
	ActivityController.prototype.onComponentCreated = function(objCompData) {
		var objComp, ObjCompClass;
		ObjCompClass = objCompData.componentRef;
		if (objCompData !== undefined && objCompData.data !== undefined) {
			objCompData.data.updatedScale = this.stageScaleValue;
			objCompData.data.objInlineTmplDict = this.objActivityRef.objInlineTmplDict;
		}
		objComp = new ObjCompClass(objCompData.data, this.stageScaleValue);
		this.objCompDict[objCompData.id] = objComp;
		objComp.setID(objCompData.id);
		objCompData.context[objCompData.strCallback](objComp);
		objCompData = undefined;
		objComp.setStageScaleValue(this.stageScaleValue);
	};

	//-----------------------------------------------------------------------------------------

	/**
	 * Invoked by "ActivityManager" to initliaze the controller and associate a region with the
	 * controller object.
	 *
	 * Also this method is responsible create a list of associated activity list within this region based on
	 * provided data.
	 *
	 * @param {Object} reg Region reference
	 * @memberof ActivityController#
	 * @return None
	 * @access private
	 */
	ActivityController.prototype.initController = function(reg) {
		var i;
		this.regionData = reg;
		this.allActivities = this.regionData.activities;
		if (this.allActivities.activity.length === undefined) {
			this.arrActivity.push(this.allActivities.activity);
		} else {
			/*jslint plusplus: true*/
			for ( i = 0; i < this.allActivities.activity.length; i++) {
				this.arrActivity.push(this.allActivities.activity[i]);
			}
		}

		this.nTotalActivityLength = this.arrActivity.length;
	};

	/**
	 * Invoked by ActivityManager only once in life time when associed region cretated successfully.
	 * This method is responsible to launch default activity (if any), otherwise by default engine will
	 * launch the 0 index activity.
	 *
	 * @param None
	 * @return None
	 * @access private
	 * @memberof ActivityController#
	 */
	ActivityController.prototype.launchDefaultActivity = function(objData) {
		if (this.arrActivity.length > 0) {
			// check if the 'defaultLaunchId' property is available...
			if (this.allActivities.hasOwnProperty('defaultLaunchID')) {
				// ...it is available, launch the default activity now...
				this.launchActivityById(this.allActivities.defaultLaunchID, objData);
			} else {
				// ...launch the first activity from the available list
				this.launchActivityByIndex(0, objData);
			}
		} else {
			throw new Error(errorConst.CONFIG_MISSING_ACTIVITY_DATA);
		}
	};

	/**
	 * This is the first method which will be invoked from region manager
	 * @param {Object} objData
	 * @return none
	 * @access private
	 * @memberof ActivityController#
	 */
	ActivityController.prototype.start = function(objData, strActivityID, bLaunchByIndex) {
		var objTempData = {};
		objTempData.data = objData;
		if (strActivityID !== undefined) {

			switch(bLaunchByIndex) {
			case true:
				this.launchActivityByIndex(Number(strActivityID), objTempData);
				break;

			case false:
				this.launchActivityById(String(strActivityID), objTempData);
				break;
			}
		} else {
			this.launchDefaultActivity(objTempData);
		}

		this.nTotalActivityLength = this.arrActivity.length;
	};

	ActivityController.prototype.stopAndUnload = function() {
		var bDestroySuccessfully = this.handleEndActvityEvent();
	};
	/**
	 * This function launches the activity by given index.
	 *
	 * @param {int} nIndex Index of activity.
	 * @memberof ActivityController#
	 * @returns None
	 * @access private
	 */
	ActivityController.prototype.launchActivityByIndex = function(nIndex, objData) {
		this.activityPreloadedData = undefined;
		if (objData !== undefined) {
			this.activityPreloadedData = objData.data;
		}
		var selectedActData = this.arrActivity[nIndex];
		if (selectedActData === undefined) {
			return;
		}//found invalid activity index.
		this.nActivityIndex = nIndex;
		this.launchActivity(selectedActData);
	};

	/**
	 * This function launches the activity of given id.
	 *
	 * @param {String} strId Id of activity.
	 * @memberof ActivityController#
	 * @returns None
	 * @access private
	 */
	ActivityController.prototype.launchActivityById = function(strId, objData) {
		this.activityPreloadedData = undefined;
		if (objData !== undefined) {
			this.activityPreloadedData = objData.data;
		}
		var actItem = _.filter(this.arrActivity, function(item) {
			return item.id === String(strId);
		});

		if (actItem.length > 0) {
			this.nActivityIndex = this.arrActivity.indexOf(actItem[0]);
			this.launchActivity(actItem[0]);
		} else {
			throw new Error(errorConst.ACTIVITY_NOT_FOUND_BY_THIS_ID + "...." + strId);
		}
	};

	/**
	 * Method 'dispatchInitEvent' is invoked at when an activity is ready to load
	 * or initlization of an activity is complete.
	 * This mehtod is introduced to dispatch 'REGION_INITLIZE_UPATE_EVENT' every time
	 * with a new progress data, a progress data could be 'REGION_INITLIZE_START_EVENT'
	 * or 'REGION_INITLIZE_COMPLETE_EVENT'
	 *
	 * @param {String} strEvent
	 * @return none
	 * @access private
	 * @memberof ActivityController
	 */
	ActivityController.prototype.dispatchInitEvent = function(strEvent) {
		var objEventData = {};
		objEventData.type = this.objEventConst.REGION_INITLIZE_UPATE_EVENT;
		objEventData.progressType = strEvent;
		objEventData.target = this;
		this.trigger(this.objEventConst.REGION_INITLIZE_UPATE_EVENT, objEventData);
	};

	/**
	 * Method 'onPlayerInitComplete' is introduced to give initlize complete
	 * notification to an 'activity'
	 * 'onPlayerInitComplete' method of each activity will be invoked when player initlized
	 * itself at very first time.
	 * @param none
	 * @return none
	 * @acccess private
	 * @memberof ActivityController
	 */
	ActivityController.prototype.onPlayerInitComplete = function() {
		_.filter(this.objActivityList, function(act) {
			act.onPlayerInitComplete();
		});
	};

	/**
	 * This function launches the activity
	 *
	 * @param {Object} actData This contains the data releated to activity to be launched
	 * @returns None
	 * @memberof ActivityController#
	 * @access private
	 */
	ActivityController.prototype.launchActivity = function(actData) {
		//Launch preloader by default before to load an activity if value set to true in player config file.
		var objEventData = {}, objGroupModel, bUseModel, bCreateModel, strClassPath, objClassRef;

		if (this.isActivityInitalized === false) {
			console.log("in process please wait......");
			//return;
		}
		this.isActivityInitalized = false;
		this.nTotalActivityLength = this.arrActivity.length;
		this.dispatchInitEvent(this.objEventConst.REGION_INITLIZE_START_EVENT);

		//show preloader by default before loading an activity if value set to true in player config file.
		if (this.bEditor === false) {
			if (this.showPreloader === true) {
				objEventData.task = this.objEventConst.SHOW_PRELOADER;
			} else {
				objEventData.task = this.objEventConst.HIDE_PRELOADER;
			}
		}
		objEventData.type = this.objEventConst.PLAYER_COMMON_TASK_EVENT;
		this.trigger(this.objEventConst.PLAYER_COMMON_TASK_EVENT, objEventData);

		objClassRef = this;
		//strClassPath = "../" + actData['class'];
		strClassPath = actData['class'];
		if (this.MPLAYER !== strClassPath) {
			this.isPictorInitliazed = (strClassPath === this.SIM_PICTOR);
			strClassPath = (strClassPath === this.SIM_PICTOR) ? this.SIM_PICTOR_PATH : strClassPath;

			if (actData.groupName !== undefined) {
				bCreateModel = (actData.modelPath !== undefined && this.groupModelDict[actData.groupName] === undefined);
				bUseModel = (this.groupModelDict[actData.groupName] !== undefined);
			}

			//if same model instance created earlier then we will reassign with its old value and state.
			objGroupModel = this.groupModelDict[actData.groupName];
			//verify if loaded activity required model or belong to any group which model is not alreay initlized.
			//if (bCreateModel && bUseModel === false && objGroupModel === undefined && actData.modelPath.length > 0) {
			if (objGroupModel === undefined && actData.modelPath !== undefined && actData.modelPath.length > 0) {
				require([strClassPath, actData.modelPath], function(objActivity, ObjActModel) {
					objGroupModel = new ObjActModel();
					objClassRef.groupModelDict[actData.groupName] = objGroupModel;
					objClassRef.initLoadedActivity(actData, bCreateModel, bUseModel, objActivity, objGroupModel);
				});
			} else {
				require([strClassPath], function(objActivity) {
					objClassRef.initLoadedActivity(actData, bCreateModel, bUseModel, objActivity, objGroupModel);
				});
			}
		} else {
			this.trigger(this.objEventConst.PLAYER_INIT_FROM_CONTROLLER_EVENT, {
				"testData" : "testDAta"
			});
		}

		//push activity index in player model.
		this.mPlayerModel.set(this.strRegionName + "__index", this.nActivityIndex);
	};

	/**
	 * Method 'initLoadedActivity' is responsible to check that current activty is need any dynamic html creation and object
	 * The dynamic html file path value can be provided in activity config file.  if no xml node provided in config file
	 * then simply 'loadAndRegisterActivity' activitity will be called for further initlizatoin.
	 *
	 * exmaple
	 * <activity id="1" name="" modelPath="" groupName="" lang="testActivity" class="testActivity/js/TestActivity">
	 *			<html source="testActivity/testHtmlFile.html"/>
	 *	</activity>
	 *
	 * @param {Object} actData  activity data eg. id, groupName, modelName
	 * @param {Boolean} bCreateModel Is model need to create for this activity
	 * @param {Boolean} bUseModel is alreay initlized model will be used by this activity.
	 * @param {Object} objActivty Loaded Activity
	 * @param {Object} objModel Model reference if any
	 * @return None
	 * @memberof ActivityController#
	 * @access private
	 */
	ActivityController.prototype.initLoadedActivity = function(actData, bCreateModel, bUseModel, ObjActivity, objModel) {

		if (actData.html === undefined) {
			//no html node found in activity node
			this.loadAndRegisterActivity(actData, bCreateModel, bUseModel, ObjActivity, objModel);
		} else {
			var objEventData = {};
			objEventData.controller = this;
			objEventData.actData = actData;
			objEventData.bCreateModel = bCreateModel;
			objEventData.bUseModel = bUseModel;
			objEventData.ObjActivity = ObjActivity;
			objEventData.objModel = objModel;
			this.trigger(this.objEventConst.CREATE_AND_INIT_ACTIVITY_HTML, objEventData);
		}
	};

	/**
	 * Method 'onHtmlLoadComplete' is invoked when dynamic component found in html file
	 * and they are created successfully with the help of their editor.
	 * @param {Object} objEventData
	 * @return none
	 * @memberof ActivityController#
	 * @access private
	 */
	ActivityController.prototype.onHtmlLoadComplete = function(objEventData) {
		var objData = this.editorData, objEvent = {};
		if (objEventData.inlineTemplates !== undefined) {
			objEvent.task = this.objEventConst.PREPARE_INLINE_TEMPLATE_DATA;
			objEvent.data = objEventData;
			objEvent.callback = true;
			this.trigger(this.objEventConst.PLAYER_COMMON_TASK_EVENT, objEvent);
		} else {
			this.loadAndRegisterActivity(objData.actData, objData.bCreateModel, objData.bUseModel, objData.ObjActivity, objData.objModel, objEventData);
		}

	};

	/**
	 * Method 'appendComponentDiv' is responsible to add regions for component(s) which are
	 * created dynamically through html entry.
	 * @param {Object} actRef activity refrence
	 * @param {Object} objData all dynamic component reference and associated data
	 * @return none
	 * @memberof ActivityController#
	 * @access private
	 */
	ActivityController.prototype.appendComponentDiv = function(actRef, objData) {
		var i, bAddInDom, strCompId, objCompData, objCompDiv, objComp, htmlData, arrCompList = objData.createdCompList;
		_.filter(this.objActivityList, function(act) {
			//console.log("created component list....... ", act.mComp);
			//actRef = act;
		});

		actRef.mComp = {};
		for ( i = 0; i < arrCompList.length; i += 1) {

			objCompData = arrCompList[i];
			strCompId = objCompData.id;

			//checking for duplicate object, if object found with same id then we will throw error.
			if (actRef.mComp[strCompId] !== undefined) {
				throw new Error('"id= ' + strCompId + '"!!!!! ' + errorConst.DUPLICATE_COMPONENT_ID_FOUND_IN_HTML);
			}

			htmlData = actRef.$el;
			//creating new instance of component
			objComp = new objCompData.componentRef(objCompData.defaultData);
			bAddInDom = objCompData.target.appendChild(htmlData, objCompData, objComp);

			if (bAddInDom === true) {
				//create and add region for component
				//actRef.regions[strCompId] = "#" + strCompId;
				//objComp.render();
				//actRef.addRegions(actRef.regions);

				//will show the component in dom area.
				objComp.render();
				if (objComp.onShow !== undefined) {
					objComp.onShow();
				}

				//objComp.onShow();
				//actRef[strCompId].show(objComp);
			}

			//maintain html created list for further use, e.g system is responsible to
			//delete and destroy the component.
			this.html_comp_list.push(objComp);
			objComp.id = strCompId;
			actRef.mComp[strCompId] = objComp;
		}
		return true;
	};

	/**
	 * This mehtod 'loadAndRegisterActivity' is responsible to initialize and verify the loaded activtiy. if activity is not extending
	 * with the 'BaseActivity' class, throw an error to force to user to extend 'BaseActivity' class.
	 * By only extending the 'BaseActivity' class activity get the use the engine API classes.
	 *
	 * @param {Object} actData  activity data eg. id, groupName, modelName
	 * @param {Boolean} bCreateModel Is model need to create for this activity
	 * @param {Boolean} bUseModel is alreay initlized model will be used by this activity.
	 * @param {Object} objActivty Loaded Activity
	 * @param {Object} objModel Model reference if any
	 * @return None
	 * @memberof ActivityController#
	 * @access private
	 */
	ActivityController.prototype.loadAndRegisterActivity = function(actData, bCreateModel, bUseModel, ObjActivity, objModel, objLoadedHTML) {
		var isValid, strPath, fileName, act, actModel, objClassRef = this;
		actModel = undefined;
		actModel = objModel;

		// create new instance of activity and pass the model into it
		act = new ObjActivity({
			model : actModel,
			activityData : this.activityPreloadedData,
			dataPath : ((actData.data !== undefined) ? actData.data.source : undefined),
			stylePath : ((actData.style !== undefined) ? actData.style.source : undefined)
		});

		this.objActivityRef = act;
		this.objActivityRef.strRegionName = this.strRegionName;

		if (objLoadedHTML !== undefined && objLoadedHTML.hasOwnProperty("activityTemplate")) {
			act.template = _.template(objLoadedHTML.activityTemplate);
		}

		//objEventData.processData
		act.setID(actData.id);
		//..set the activity ID for framework use.
		act.groupName = actData.groupName;
		//set the group name for future reference if required
		act.modelName = actData.modelName;
		//..set the model name for future reference if required

		//..validating loaded activity type if found flase then activity will not initlize.
		isValid = this.registerActivity(act);

		// show the activity
		if (isValid === true) {

			if (objLoadedHTML !== undefined && objLoadedHTML.hasOwnProperty('processData')) {
				act.setData(objLoadedHTML.processData);
			}
			if (this.bEditor === false) {
				// calling pre initialize method
				act.preinitialize();
				//calling post initialize method to perform pre init task if any required by activity
				act.postInitialize();
				this.setStageScaleValue(this.stageScaleValue);

				//Checking if language support required if required then load and deliver the data
				//to activity before append it to region
				if (objClassRef.checkForLanguageSupport() === true) {
					fileName = "screentext.xml";
					strPath = this.playerConfig.language.rootPath + "/" + actData.lang + "/" + this.getLocalLanguage() + "/" + fileName;
					this.objActRef = act;
					this.objActRef.languageSupport = objClassRef.checkForLanguageSupport();
					//Loading Screen Text data for Activity
					this.loadData(strPath, 'xml', 'application/xml', 'xml', this.handleLangDataLoadComplete, this.handleDataLoadFailed);
				} else {//No language support required
					//appending loaded activity in its associated region.
					objClassRef.appendActivity(act, objLoadedHTML);
				}
			} else {
				objClassRef.appendActivity(act, objLoadedHTML);
			}
		}
	};

	/**
	 * Verify Activity type and Registers.
	 * @param {Object} objActivity Object of activity.
	 * @returns None
	 * @access private
	 * @memberof ActivityController#
	 */
	ActivityController.prototype.registerActivity = function(objActivity) {

		if (objActivity.isBaseActivity !== true) {
			//Find invalid activity and throw the error
			throw new Error(errorConst.ACITIVITY_MUST_EXTEND_BASE_CLASS);
		}

		if (this.objActivityList[objActivity.getID()]) {
			//found activity already loaded in same region and throw the error
			throw new Error(this.objActivityList[objActivity.getID()].getID() + errorConst.ACTIVITY_ALREADY_REGISTERED);
		}

		objActivity.strRegionName = this.strRegionName;
		objActivity.localLangName = this.localLanguageName;
		//setting the region name/id in activity
		this.objActivityList[objActivity.getID()] = objActivity;
		//making a entry in its dictionary
		objActivity.setEventController(this.objEventController);
		//init activity events.
		this.attachActivityEvents(objActivity);
		//Registering activity events.
		return true;
	};

	/**
	 * This function shows the activity in the container
	 * @param {Object} actRef - ActivityReference
	 * @returns None
	 * @access private
	 * @memberof ActivityController#
	 */
	ActivityController.prototype.appendActivity = function(actRef, actCompList) {
		var objData = {}, strID;
		this.activityRegion.show(actRef);
		//.. check before the render the activity html file and if any html file

		//component found then render first and after that initlize the main activity area.
		if (actCompList !== undefined) {
			//APPENDING COMPONENT IN DIV
			this.appendComponentDiv(actRef, actCompList);
		}

		objData.regionName = this.strRegionName;
		objData.activityLength = this.nTotalActivityLength;
		objData.currentActivityIndex = this.nActivityIndex;
		objData.isLastActivity = (this.nTotalActivityLength === (this.nActivityIndex + 1));
		objData.isFirstActivity = (this.nActivityIndex === 0);
		_.filter(this.objActivityList, function(act) {
			strID = act.getID();
		});
		objData.activityId = strID;
		this.trigger(this.objEventConst.ON_ACTIVITY_SUCCESSFULLY_ADDED_IN_REGION, objData);
		actRef.bEditor = this.bEditor;
		if (this.bEditor === false) {
			//need to check
			this.trigger(this.objEventConst.REMOVE_COMPONENT_EDITORS, this.strRegionName);
			actRef.allRegionActivityList = this.allRegionActivityList;
		}
		this.dispatchInitEvent(this.objEventConst.REGION_INITLIZE_COMPLETE_EVENT);
		this.isActivityInitalized = true;
		actRef.onActivityCreationComplete();

	};

	/**
	 * This method will return true if lauguage support set to true in player config xml.
	 * @param None
	 * @return None
	 * @access private
	 * @memberof ActivityController#
	 */
	ActivityController.prototype.checkForLanguageSupport = function() {
		return (this.playerConfig.language.support === "true");
	};

	/**
	 * This method will set the current language name e.g en/ch
	 * @param {String} langName
	 * @return None
	 * @access private
	 * @memberof ActivityController#
	 */
	ActivityController.prototype.setLocalLanguage = function(langName) {
		this.localLanguageName = langName;
	};

	/**
	 * This method will return the local language name e.g en/ch
	 * Local language can be set in mPlayerConfig and also user allow to override
	 * defautl value of language query object also.
	 *
	 * e.g. server/index.html?language=en.
	 *
	 * @param {String} langName
	 * @return None
	 * @access private
	 * @memberof ActivityController#
	 */
	ActivityController.prototype.getLocalLanguage = function() {
		return this.localLanguageName;
	};

	/**
	 * This method will be invoked by Activity manager every time when a region initlized.
	 * The default value of is false
	 * Also this functionaliy can be controlled through the PlayerConfig xml file.
	 * @param {Boolean} bShow default value is false if nothing is defined in config file.
	 * @return None
	 * @access private
	 * @memberof ActivityController#
	 */
	ActivityController.prototype.showPreloaderBeforeActivityLaunch = function(bShow) {
		this.showPreloader = bShow;
	};

	/**
	 * loadData method is responsible to load data(xml file) through this.data_loader Obejct based on provied parameters.
	 * @param {Stirng} strURL file path
	 * @param {String} strDataType Text
	 * @param {String} strContentType Text/XML
	 * @param {String} strReturnType JSON/XML form
	 * @param {Function} successHandler, When data load success, control will be passed to this callback method
	 * @param {Function} errorHandler, If data load fail then control will be passed to this callback method
	 * @return None
	 * @access private
	 * @memberof ActivityController#
	 */
	ActivityController.prototype.loadData = function(strURL, strDataType, strContentType, strReturnType, successHandler, errorHandler) {
		var objClassRef = this;
		this.data_loader.on(this.data_loader.DATA_LOAD_SUCCESS, successHandler);
		this.data_loader.on(this.data_loader.DATA_LOAD_FAILED, errorHandler);
		this.data_loader.load({
			url : strURL,
			dataType : strDataType,
			contentType : strContentType,
			returnType : strReturnType,
			scope : objClassRef
		});
	};

	/**
	 * This mehtod is Invoked when localized language file loaded successfully. Responsible
	 * to assign Localized data to actiivty and Invoked 'appendActivity' method to show the activity
	 * into the region.
	 *
	 * @param {Object} objLangData Loaded Screen text data
	 * @param {Object} objClassref class reference to avoid any scope issue.
	 * @return None
	 * @access private
	 * @memberof ActivityController#
	 */
	ActivityController.prototype.handleLangDataLoadComplete = function(objLangData, objClassref) {

		objClassref.objActRef.localText = objLangData;
		objClassref.appendActivity(objClassref.objActRef);
		objClassref.data_loader.off(objClassref.data_loader.DATA_LOAD_SUCCESS);
		objClassref.data_loader.off(objClassref.data_loader.DATA_LOAD_FAILED);
	};

	/**
	 * If data/xml load fail
	 * @param None
	 * @returns None
	 * @access private
	 * @memberof ActivityController#
	 */
	ActivityController.prototype.handleDataLoadFailed = function() {
		this.data_loader.off(this.data_loader.DATA_LOAD_SUCCESS);
		this.data_loader.off(this.data_loader.DATA_LOAD_FAILED);
		throw new Error(errorConst.LOCALIZATION_LANGUAGE_LOAD_FAILD);
	};

	/**
	 * Triggers objEventConst.LAUNCH_NEXT_ACTVITY on this.
	 * @memberOf ActivityController#
	 * @access private
	 * @param {Object} objEvent Object of event.
	 * @returns None
	 */
	ActivityController.prototype.handleGoToNextActivityEvent = function(objEvent) {
		var bDestroySuccessfully;
		if (this.isValidIndexOrId(this.nActivityIndex + 1, this.SEARCH_BY_INDEX) === false) {
			console.warn("Invalid activity index");
			return;
		}

		bDestroySuccessfully = this.handleEndActvityEvent(objEvent);
		if (bDestroySuccessfully === true) {
			this.nActivityIndex = this.nActivityIndex + 1;
			this.launchActivityByIndex(this.nActivityIndex);
		}
	};

	/**
	 * Load next activity based on current activity index within a region
	 * @memberOf ActivityController#
	 * @access private
	 * @param {Object} objEvent Object of event.
	 * @returns None
	 */
	ActivityController.prototype.moveToNextActivity = function(objEvent) {
		if (this.isValidIndexOrId(this.nActivityIndex + 1, this.SEARCH_BY_INDEX) === false) {
			console.warn("Invalid activity index");
			return;
		}
		var bDestroySuccessfully = this.handleEndActvityEvent(objEvent);
		if (bDestroySuccessfully) {
			this.nActivityIndex = this.nActivityIndex + 1;
			this.launchActivityByIndex(this.nActivityIndex);
		}
	};

	/**
	 * Load previous activity based on current activity index within a region
	 * @memberOf ActivityController#
	 * @access private
	 * @param {Object} objEvent Object of event.
	 * @returns None
	 */
	ActivityController.prototype.moveToPreviousActivity = function(objEvent) {
		if (this.isValidIndexOrId(this.nActivityIndex - 1, this.SEARCH_BY_INDEX) === false) {
			console.warn("Invalid activity index");
			return;
		}
		var bDestroySuccessfully = this.handleEndActvityEvent(objEvent);
		if (bDestroySuccessfully) {
			this.nActivityIndex = this.nActivityIndex - 1;
			this.launchActivityByIndex(this.nActivityIndex);
		}
	};

	/**
	 * Triggers objEventConst.LAUNCH_PREVIOUS_ACTIVITY on this.
	 * @memberOf ActivityController#
	 * @access private
	 * @param {Object} objEvent Object of event.
	 * @returns None
	 * @access private
	 */
	ActivityController.prototype.handleGoToPreviousActivityEvent = function(objEvent) {
		var bDestroySuccessfully;
		bDestroySuccessfully = this.handleEndActvityEvent(objEvent);
		if (this.isValidIndexOrId(this.nActivityIndex - 1, this.SEARCH_BY_INDEX) === false) {
			console.warn("Invalid activity index");
			return;
		}
		if (bDestroySuccessfully === true) {
			this.nActivityIndex = this.nActivityIndex - 1;
			this.launchActivityByIndex(this.nActivityIndex);
		}
	};

	/**
	 * Handles End of an activity.
	 * @memberOf ActivityController#
	 * @access private
	 * @param {Object} objEvent Object of event.
	 * @returns {Boolean} The value returned from destroyActivity(objActivity) .
	 */
	ActivityController.prototype.handleEndActvityEvent = function(objEvent) {
		var self = this;
		if (this.objActivityRef && this.objActivityRef.isScreenInitalized === false) {
			return false;
		}
		var objActivity, objClassRef, objPopup;
		objClassRef = this.classReference.classRef;
		objActivity = this.objActivityRef;
		if (objActivity === undefined) {
			return true;
		}
		return this.destroyActivity(objActivity);
	};

	/**
	 * Destroys activity.
	 * @memberOf ActivityController#
	 * @access private
	 * @param {Object} objActivity Object of activity.
	 * @returns {Boolean}
	 */
	ActivityController.prototype.destroyActivity = function(objActivity) {
		//Calling destroy method of activity before unloading from view.
		var i, key, bDestroyed = objActivity.destroy();

		_.filter(this.objCompDict, function(createdComp) {
			if (createdComp.isDestroyCalled === false) {
				throw new Error(errorConst.ALL_ACTIVITY_COMPONENT_NOT_DESTROYED);
			}
		});

		for (key in this.broadcastEventDict) {
			if (this.broadcastEventDict.hasOwnProperty(key)) {
				//removing all broadcast event signature and its associated callback method.
				this.objEventBroadcaster.off(this.broadcastEventDict[key].eventToListen);
			}
		}

		if (objActivity.objEventController.isAllRegisteredListenerDeattached() === false) {
			//all attched listener does not removed by activity
			return false;
		}

		if ((bDestroyed === true && objActivity.isDestroyCalled !== true) || bDestroyed !== true) {
			//Super destory method ('BaseActivity') must be called with true parameter from the activity
			throw new Error(errorConst.BASE_ACTIVITY_DESTROY_NOT_CALLED);
		}

		for ( i = 0; i < this.html_comp_list.length; i += 1) {
			//destroy components which are created through html entry.
			this.html_comp_list[i].destroy();
		}
		//TODO
		this.html_comp_list = [];

		//TODO
		this.actPreloadedData = {};

		//removing events associated with the current activity.
		this.detachActivityEvents(objActivity);

		//flush the broadcast event dictionary.
		this.broadcastEventDict = {};

		//unload the activity from view and Marionette destroy its view .
		objActivity.close();
		delete this.objActivityList[objActivity.getID()];

		//remvoing reference of activity.
		objActivity = null;

		return bDestroyed;
	};

	/**
	 * Triggers objEventConst.JUMP_TO_ACTIVITY_BY_INDEX_EVENT on this.
	 * @memberOf ActivityController#
	 * @access private
	 * @param {Object} objEvent Object of event.
	 * @returns None
	 */
	ActivityController.prototype.handleJumpToActivityByIndexEvent = function(objEvent) {
		var nActivityIndex, bDestroySuccessfully;
		if (this.isValidIndexOrId(objEvent.activityIndex, this.SEARCH_BY_INDEX) === false) {
			console.warn("invalid activity index ", objEvent.activityIndex);
			//found invalid jump by index and now engine will not unload current activity
			return;
		}
		//unloading loaded activity before to load new activity.
		console.log("handleEndActivity!!!!!!!!!!", this.strRegionName);
		bDestroySuccessfully = this.handleEndActvityEvent(objEvent);
		//another activtitiy load only when current loaded activity unloaded successfully.
		if (bDestroySuccessfully === true) {
			_.filter(this.objActivityList, function(act) {
				act.mComp = {};
			});
			nActivityIndex = Number(objEvent.activityIndex);
			this.launchActivityByIndex(nActivityIndex);
		}
	};

	/**
	 * Triggers objEventConst.JUMP_TO_ACTIVITY_BY_INDEX_EVENT on this.
	 * @memberOf ActivityController#
	 * @access private
	 * @param {String} strID contains Id or index of activity to be launched
	 * @param {String} strSearchBY criteria of serach
	 * @returns None
	 */
	ActivityController.prototype.isValidIndexOrId = function(strID, strSearchBY) {
		var bValid = false, actItem;
		switch(strSearchBY) {
		case this.SEARCH_BY_ID:
			actItem = _.filter(this.arrActivity, function(item) {
				return item.id === String(strID);
			});

			bValid = (actItem.length > 0);
			break;

		case this.SEARCH_BY_INDEX:
			bValid = (Number(strID) < 0) ? false : (Number(strID) >= this.nTotalActivityLength) ? false : true;
			break;
		}

		return bValid;
	};

	/**
	 * Triggers objEventConst.JUMP_TO_ACTIVITY_BY_ID_EVENT on this.
	 * @memberOf ActivityController#
	 * @access private
	 * @param {Object} objEvent Object of event.
	 * @returns None
	 */
	ActivityController.prototype.handleJumpToActivityByIDEvent = function(objEvent) {
		var strActID, bDestroySuccessfully;
		if (this.isValidIndexOrId(objEvent.activityID, this.SEARCH_BY_ID) === false) {
			console.warn("invalid activity id ", objEvent.activityID);
			//found invalid jump by index and now engine will not unload current activity
			return;
		}
		//will work in edit mode only.
		//unloading current loaded activity before to load new activity.
		bDestroySuccessfully = this.handleEndActvityEvent(objEvent);
		//another activtitiy load only when current loaded activty unloaded successfully.
		if (bDestroySuccessfully === true) {
			strActID = objEvent.activityID;
			this.launchActivityById(strActID);
			this.trigger(this.objEventConst.JUMP_TO_ACTIVITY_BY_ID_EVENT, objEvent);
		}
	};

	/**
	 * detaching ActivityEvents
	 * @memberOf ActivityController#
	 * @access private
	 * @param {Object} objActivity Object of activity.
	 * @returns None
	 * @access private
	 */
	ActivityController.prototype.detachActivityEvents = function(objActivity) {
		objActivity.off(this.objEventConst.JUMP_TO_ACTIVITY_BY_ID_EVENT);
		objActivity.off(this.objEventConst.JUMP_TO_ACTIVITY_BY_INDEX_EVENT);
		objActivity.off(this.objEventConst.ACTIVITY_END_EVENT);
		objActivity.off(this.objEventConst.ACTIVITY_GO_TO_NEXT_ACTIVITY_EVENT);
		objActivity.off(this.objEventConst.ACTIVITY_GO_TO_PREVIOUS_ACTIVITY_EVENT);
		objActivity.off(this.objEventConst.CREATE_COMPONENT_EVENT);
		objActivity.off(this.objEventConst.PLAYER_COMMON_TASK_EVENT);
		objActivity.off(this.objEventConst.PLAYER_BUBBLE_EVENT);

		objActivity.off(this.objEventConst.PLAYER_EDIT_COMPONENT_EVENT);

		objActivity.off(this.objEventConst.BROADCAST_EVENT);
		objActivity.off(this.objEventConst.BROADCAST_EVENT_RECEIVER);
		objActivity.off(this.objEventConst.STOP_BROADCAST_EVENT_RECEIVER);
		objActivity.off(this.objEventConst.REMVOE_CSS_REFERENCE);

		//addint audio related event(s)
		objActivity.off(this.objEventConst.PLAY_AUDIO);
		objActivity.off(this.objEventConst.PLAY_WEB_API_AUDIO);
		objActivity.off(this.objEventConst.UNLOAD_WEB_API_BUFFERS_AUDIO);
		objActivity.off(this.objEventConst.INIT_WEB_API_AUDIO);

		objActivity.off(this.objEventConst.RESTART_AUDIO);
		objActivity.off(this.objEventConst.STOP_AUDIO);
		objActivity.off(this.objEventConst.PAUSE_AUDIO);
		objActivity.off(this.objEventConst.RESUME_AUDIO);
		objActivity.off(this.objEventConst.VOLUME_CHANGE);
		objActivity.off(this.objEventConst.DEFAULT_VOLUME_CHANGE);

		//remove css and js reference.
		objActivity.off(this.objEventConst.REMVOE_REFERENCE);
		//Drawing related events
		objActivity.off(this.objEventConst.SET_DRAWING_CANVAS);
		objActivity.off(this.objEventConst.DRAWING_COMMON_TASK);

	};

	/**
	 * Triggers objEventConst.LAUNCH_PREVIOUS_ACTIVITY on this.
	 * @memberOf ActivityController#
	 * @access private
	 * @param {Object} objEvent Object of event.
	 * @returns None
	 * @access private
	 */
	ActivityController.prototype.handleCreateComponentEvent = function(objEvent) {
		objEvent.id = this.COMP_SUFFIX + this.compCounter;
		objEvent.actController = this;
		this.trigger(this.objEventConst.CREATE_COMPONENT_EVENT, objEvent);
		this.compCounter += 1;
	};

	/**
	 * Bubble the event(s) which is having "common task" type signature.
	 * e.g hide/show foooter,header, preloader related task
	 * @memberOf ActivityController#
	 * @param {Object} objEvent
	 * @return None
	 * @access private
	 */
	ActivityController.prototype.handleActivityCommonTask = function(objEvent) {
		objEvent.regionId = this.strRegionName;
		this.trigger(objEvent.type, objEvent);
	};

	ActivityController.prototype.handlePlayerBubbleEvents = function(objEvent) {
		objEvent.regionId = this.strRegionName;
		this.trigger(objEvent.type, objEvent);
	};

	/**
	 * Bubble the event(s) which is having "edit mode" type signature.
	 * e.g component selected, deselected events
	 * @memberOf ActivityController#
	 * @param {Object} objEvent
	 * @return None
	 * @access private
	 */
	ActivityController.prototype.handlePlayerEditorTask = function(objEvent) {
		objEvent.regionId = this.strRegionName;
		this.trigger(objEvent.type, objEvent);
	};

	/**
	 * Invoked every time when a event is required to broadcast by a activity. method is responsible to re-dispatch
	 * the event with new broadCast event type.
	 *
	 * By broadcasting a event more then one actitiy can communicate in a single time.
	 * @memberOf ActivityController#
	 * @param {Object} objEvent
	 * @return None
	 * @access private
	 */
	ActivityController.prototype.handleAndBroadcastEvent = function(objEvent) {
		objEvent.type = this.objEventConst.BROADCAST_EVENT;
		objEvent.regionId = this.strRegionName;
		this.trigger(objEvent.type, objEvent);
	};

	/**
	 * By calling this mehtod activity enable itself for specific event which can be broadcast by other
	 * activity.
	 * @memberOf ActivityController#
	 * @param {Object} objEvent event data
	 * @return None
	 * @access private
	 */
	ActivityController.prototype.broadcastEventReceiver = function(objEvent) {
		this.broadcastEventDict[objEvent.eventToListen] = objEvent;
	};

	/**
	 * By calling this mehtod a Activity can detach listener aired global events
	 * @memberOf ActivityController#
	 * @param {Object} objEvent
	 * @return None
	 * @access private
	 */
	ActivityController.prototype.stopBroadcastEventReceiver = function(objEvent) {
		delete this.broadcastEventDict[objEvent.eventToListen];
	};

	/**
	 * Broadcasting event received from Activity.
	 * @memberOf ActivityController#
	 * @param {Object} objEvent Event need to be broadcast
	 * @return None
	 * @access private
	 */
	ActivityController.prototype.broadcastEventHandler = function(objEvent) {
		this.trigger(this.objEventConst.BROADCAST_EVENT_IN_AIR, objEvent);
	};

	/**
	 * Bubble other region activity event
	 * @memberOf ActivityController#
	 * @param {Object} objEvent
	 * @return None
	 * @access private
	 */
	ActivityController.prototype.bubbleEvent = function(objEvent) {
		var objTargetData = this.broadcastEventDict[objEvent.eventToBroadcast], objData = {};
		if (objTargetData !== undefined) {
			//does not broadcast when region id is same as event region id.
			if (objEvent.regionId === this.strRegionName) {
				return;
			}
			objData.type = objEvent.eventToBroadcast;
			objData.data = objEvent.data;
			objTargetData.context[objTargetData.callback](objData);
		}
	};

	ActivityController.prototype.handleBroadcastEventFromOtherPlayer = function(objEvent) {

		var objTargetData = this.broadcastEventDict[objEvent.eventToBroadcast], objData = {};
		if (objTargetData !== undefined) {
			objData.type = objEvent.eventToBroadcast;
			objData.data = objEvent.data;
			objTargetData.context[objTargetData.callback](objData);
		}
	};

	/**
	 * This method will be invoked when an activity change request event 'LAUNCH_ACTIVITY_IN_REGION'
	 * will be invoked by other region activity.
	 *
	 * This method will launch the activity by calling launchActivityById or launchActivityByIndex based
	 * on the provided data.
	 *
	 * @param {Object} objData information about the activity which needs to be launched.
	 * @return none
	 * @access private
	 */
	ActivityController.prototype.onActivityLaunchRequestByAnotherRegion = function(objData) {
		var bDestroySuccessfully = this.handleEndActvityEvent();
		if (bDestroySuccessfully === false) {
			return;
		}
		switch(objData.bLaunchByIndex) {
		case true:
			this.launchActivityByIndex(Number(objData.strActivityID), objData);
			break;

		case false:
			this.launchActivityById(String(objData.strActivityID), objData);
			break;
		}
	};

	ActivityController.prototype.updateNevigationControl = function(objData) {
		this.objActivityRef.updateNevigationControl(objData);
	};

	ActivityController.prototype.setDrawingCanvas = function(objEvent) {
		var objEventData = {};
		objEventData.canvas = objEvent;
		this.trigger(this.objEventConst.SET_DRAWING_CANVAS, objEventData);
	};

	ActivityController.prototype.handleDrawingTask = function(objEvent) {

	};

	/**
	 * method 'removeJSCSSFileRefernece' is binded with the 'REMVOE_JS_REFERENCE' and 'REMVOE_CSS_REFERENCE' events,
	 * which can be invoked by an activity with the help of its base class 'BaseActivity'.
	 *
	 * Responsible to remove footprints of unused/unnecssary js and css references.
	 *
	 * @param {Object} objEvent contain file name and its type.
	 * @return {none}
	 * @access private
	 */
	ActivityController.prototype.removeJSCSSFileRefernece = function(objEvent) {
		var targetelement, targetattr, allsuspects, i, fileName, fileType, const_ref = this.objEventConst;
		fileName = objEvent.fileName;
		fileType = objEvent.type;
		//determine element type to create nodelist from
		targetelement = (fileType === const_ref.TYPE_JS) ? const_ref.SCRIPT : (fileType === const_ref.TYPE_CSS) ? const_ref.LINK : const_ref.NONE;

		//determine corresponding attribute to test for
		targetattr = (fileType === const_ref.TYPE_JS) ? const_ref.SRC : (fileType === const_ref.TYPE_CSS) ? const_ref.HREF : const_ref.NONE;
		allsuspects = document.getElementsByTagName(targetelement);
		//search backwards within nodelist for matching elements to remove
		for ( i = allsuspects.length; i >= 0; i -= 1) {
			if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) !== null && allsuspects[i].getAttribute(targetattr).indexOf(fileName) !== -1) {
				//remove element by calling parentNode.removeChild()
				allsuspects[i].parentNode.removeChild(allsuspects[i]);
			}
		}
	};

	/**
	 * Sets stage scale value
	 * @memberOf ActivityController#
	 * @param {Number} nScaleValue scale vlaue of activity
	 * @return None
	 * @access private
	 */
	ActivityController.prototype.setStageScaleValue = function(nScaleValue) {
		var i;
		_.filter(this.objCompDict, function(createdComp) {
			createdComp.setStageScaleValue(nScaleValue);
			if (createdComp.onPlayerResizeEvent !== undefined) {
				createdComp.onPlayerResizeEvent();
			}
		});

		_.filter(this.objActivityList, function(act) {
			act.nStageScale = nScaleValue;
		});

		if (this.stageScaleValue !== nScaleValue) {
			this.stageScaleValue = nScaleValue;
		}

		for ( i = 0; i < this.html_comp_list.length; i += 1) {
			//setting stage scale value in components which are created through html entry.
			this.html_comp_list[i].nStageScale = nScaleValue;
		}

		if (this.isPictorInitliazed === true) {
			this.objActivityRef.setStageValue(this.stageScaleValue);
		}
	};

	/**
	 *
	 * @param {type} objInlineTmplDict
	 * @returns {undefined}
	 */
	ActivityController.prototype.setInlineTemplates = function(objInlineTmplDict) {
		var objClassRef = this;
		$.each(this.objActivityList, function(key, bActivity) {
			bActivity.objInlineTmplDict = objInlineTmplDict;
			objClassRef.actPreloadedData = objInlineTmplDict;
		});
	};

	/**
	 * Called on every region updated
	 * @memberOf ActivityController#
	 * @param {Object} objData reference of event object
	 * @return None
	 * @access private
	 */
	ActivityController.prototype.onRegionUpdate = function(objData, bIgnore) {

		_.filter(this.objActivityList, function(act) {
			if (bIgnore !== true) {
				act.allRegionData = objData;
			}
			act.getRegionChangeNotification(objData);
		});

	};

	/**
	 * attachActivityEvents
	 * @memberOf ActivityController#
	 * @access private
	 * @param {Object} objActivity Object of activity.
	 * @returns None
	 * @access private
	 */
	ActivityController.prototype.attachActivityEvents = function(objActivity) {
		var objEventData = {}, objClassRef = this;
		objEventData.classRef = objClassRef;

		objActivity.on(objClassRef.objEventConst.ACTIVITY_GO_TO_NEXT_ACTIVITY_EVENT, this.handleGoToNextActivityEvent, this);
		objActivity.on(objClassRef.objEventConst.ACTIVITY_GO_TO_PREVIOUS_ACTIVITY_EVENT, this.handleGoToPreviousActivityEvent, this);
		objActivity.on(objClassRef.objEventConst.JUMP_TO_ACTIVITY_BY_INDEX_EVENT, this.handleJumpToActivityByIndexEvent, this);
		objActivity.on(objClassRef.objEventConst.JUMP_TO_ACTIVITY_BY_ID_EVENT, this.handleJumpToActivityByIDEvent, this);
		objActivity.on(objClassRef.objEventConst.CREATE_COMPONENT_EVENT, this.handleCreateComponentEvent, this);
		objActivity.on(objClassRef.objEventConst.ACTIVITY_END_EVENT, objClassRef.handleEndActvityEvent, this);
		objActivity.on(objClassRef.objEventConst.PLAYER_COMMON_TASK_EVENT, objClassRef.handleActivityCommonTask, this);
		objActivity.on(objClassRef.objEventConst.PLAYER_BUBBLE_EVENT, objClassRef.handlePlayerBubbleEvents, this);

		objActivity.on(objClassRef.objEventConst.PLAYER_EDIT_COMPONENT_EVENT, objClassRef.handlePlayerEditorTask, this);

		//adding broadcast event to communicate within activities.
		objActivity.on(objClassRef.objEventConst.BROADCAST_EVENT, objClassRef.handleAndBroadcastEvent, this);
		objActivity.on(objClassRef.objEventConst.BROADCAST_EVENT_RECEIVER, objClassRef.broadcastEventReceiver, this);
		objActivity.on(objClassRef.objEventConst.STOP_BROADCAST_EVENT_RECEIVER, objClassRef.stopBroadcastEventReceiver, this);

		//addint audio related event(s)
		objActivity.on(objClassRef.objEventConst.PLAY_WEB_API_AUDIO, handleWebApiAudio);
		objActivity.on(objClassRef.objEventConst.UNLOAD_WEB_API_BUFFERS_AUDIO, unloadWebApiBufferAudio);
		objActivity.on(objClassRef.objEventConst.INIT_WEB_API_AUDIO, initWebAudio);
		objActivity.on(objClassRef.objEventConst.PLAY_AUDIO, handlePlayAudio);
		objActivity.on(objClassRef.objEventConst.RESTART_AUDIO, handleRestartAudio);
		objActivity.on(objClassRef.objEventConst.STOP_AUDIO, handleStopAudio);
		objActivity.on(objClassRef.objEventConst.PAUSE_AUDIO, handlePauseAudio);
		objActivity.on(objClassRef.objEventConst.RESUME_AUDIO, handleResumeAudio);
		objActivity.on(objClassRef.objEventConst.VOLUME_CHANGE, handleAudioVolumeChange);
		objActivity.on(objClassRef.objEventConst.DEFAULT_VOLUME_CHANGE, handleAudioDefaultVolumeChange);
		objActivity.on(objClassRef.objEventConst.STOP_ALL_AUDIO, handleStopAllAudio);

		//remove css and js reference.
		objActivity.on(this.objEventConst.REMVOE_REFERENCE, objClassRef.removeJSCSSFileRefernece, this);
		//objActivity.off(this.objEventConst.REMVOE_JS_REFERENCE, objClassRef.removeJSCSSFileRefernece, this);

		if (this.bDrawingMode === true) {
			//Drawing related events
			objActivity.on(objClassRef.objEventConst.SET_DRAWING_CANVAS, objClassRef.setDrawingCanvas, this);
			objActivity.on(objClassRef.objEventConst.DRAWING_COMMON_TASK, objClassRef.handleDrawingTask, this);
		}
	};

	//---------------------------------EDITOR RELATED METHOD----------------------------------

	/**
	 * Method 'componentPropertyDataUpdated' invoked when component data (JSON or CSS) updated from
	 * selector itself or through the propertyPanel window.
	 * This method is responsible to pass the event and data to activity for the process.
	 * @param {Object} objEvent -  updated data and component reference or id
	 * @return {none}
	 * @access private
	 * @memberof ActivityController#
	 */
	ActivityController.prototype.componentPropertyDataUpdated = function(objEvent) {
		if (this.objActivityRef.componentPropertyDataUpdated !== undefined) {
			this.objActivityRef.componentPropertyDataUpdated(objEvent);
		} else {
			console.warn(errorConst.ACTIVITY_CAN_NOT_EDIT);
		}
	};

	/**
	 * This method introduced to improve the performance of property Panel window.
	 * and minimize recreate activtiy everytime even same component is selected
	 * @param {Object} objData
	 * @return {none}
	 * @access private
	 * @memberof ActivityController#
	 */
	ActivityController.prototype.refreshActivityData = function(objData) {
		this.objActivityRef.refreshActivityData(objData);
	};

	ActivityController.prototype.handlePlayerCommonBubbleEvent = function(objData) {
		this.objActivityRef.handlePlayerCommonBubbleEvent(objData);
	};

	ActivityController.prototype.selectComponent = function(objEvent) {

	};

	ActivityController.prototype.deselectComponent = function() {
		this.objActivityRef.deselectComponent();
	};

	ActivityController.prototype.getSelectedCompRef = function() {

	};

	//-----------------------------------------------------------------------------------------

	/**
	 * Destroys the ActivityController object.
	 * @memberOf ActivityController#
	 * @param None
	 * @returns {Boolean} true or false
	 * @access private
	 */
	ActivityController.prototype.destroy = function() {
		this.destroyActivity();
		return true;
	};

	return ActivityController;
});
