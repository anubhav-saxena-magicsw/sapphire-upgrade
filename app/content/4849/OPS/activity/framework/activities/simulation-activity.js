/*jslint nomen:true */
/*global console,_,$*/

define(['player/base/base-simulation-activity', 'player/utils/data-loader', "frameworkRoot/activities/simulation-model", 'utiljs/json-helper', 'player/controllers/path-updater'], function(BaseSimulationActivity, Data_Loader, SimModel, JsonHelper, PathUpdater) {
	"use strict";

	var SimulationActivity = BaseSimulationActivity.extend({
		template : _.template("<div>simulation activity</div>"),
		activityData : undefined,
		jsonData : undefined,
		objDataLoader : undefined,
		userData : {}, //store user data which is deliverd to activity in constructor.
		objJsonHelper : undefined,
		arrCompFileToLoad : undefined,
		counterIndex1 : 5,
		isScreeenEdited : false,
		regions : {
			screenHolder : "#screenHolder",
			globalCompHolder : "#globalCompHolder"
		},
		initialize : function(objData) {
			this.objJsonHelper = new JsonHelper();
			this.initBaseActivity();
			this.activityData = objData;
			this.userData = this.activityData.activityData;
			this.SimulationActivitySuper.prototype.initialize.call(this, true);
		}
	});

	/**
	 * 'onActivityCreationComplete' is the method of "BaseActivity" class.
	 * By overriding this method we are ensuring that 'Pictor' will be inilized only after
	 * when activity is inilized and then we start the process of initlizing 'PICTOR' by
	 * loading the screen json data.
	 * @param none
	 * @return none
	 */
	SimulationActivity.prototype.onActivityCreationComplete = function() {
		var objData = this.activityData, strPath;
		this.objDataLoader = new Data_Loader();
		this.SimulationActivitySuper.prototype.onActivityCreationComplete.call(this, true);

		if (this.bEditor === true) {//will work in edit mode only
			this.broadcastEventReceiver("getJSONDataForSave", this, "getUpdatedJSONData");
			this.broadcastEventReceiver("reloadPropertyUpdatorCssData", this, "reloadPropertyUpdatorCssData");
			this.broadcastEventReceiver(this.ActivityEventConst.MANAGE_COMMON_BROADCAST_EVENT, this, "manageCommonBroadcastEvent");
			//Adding root path for assets folder to path updater with regionName
			this.broadcastEventReceiver("GET_TEMPLATE_PATH", this, "getTemplatePath");
		}

		this.objPathUpdater = PathUpdater.getInstance();
		this.objPathUpdater.setRootPath(this.strRegionName, objData.dataPath);

		if (objData.dataPath !== undefined) {
			strPath = (this.bEditor === true) ? objData.dataPath + "?" + (new Date()).getTime() : objData.dataPath;
			this.loadJSONData(strPath, 'json', 'application/json', 'json', this.handleJsonDataLoadComplete, this.dataLoadErrorHandler);
		}
		this.objSimPictor.onActivityCreationComplete();
	};

	SimulationActivity.prototype.getTemplatePath = function(evtData) {
		this.broadcastEvent("ON_TEMPLATE_CHANGE", this.activityData.dataPath);
	};

	/**
	 * 'manageCommonBroadcastEvent' is introduced to establised a bridge between multiple
	 * pictor which are created and initlized in different regions.
	 * @param {Object} objData
	 * @return none
	 * @access private
	 * @memberof SimulationActivity#
	 */
	SimulationActivity.prototype.manageCommonBroadcastEvent = function(objData) {
		if (this.strRegionName !== objData.data.region) {
			return;
		}
		switch(objData.type) {
		case this.ActivityEventConst.MANAGE_COMMON_BROADCAST_EVENT:
			switch(objData.data.subTask) {
			//Calling component method
			case this.ActivityEventConst.CALL_AND_UPDATE_COMPONENT:
				console.log("case this.ActivityEventConst.MANAGE_COMMON_BROADCAST_EVENT:!!", objData);
				delete objData.data.region;
				this.objSimPictor.callAndUpdateComponent(objData.data);
				break;
			}
			break;
		}
	};

	SimulationActivity.prototype.SimulationActivitySuper = BaseSimulationActivity;

	/**
	 * store the sim-pictor reference.
	 */
	SimulationActivity.prototype.setPictorRef = function(objPictorRef) {
		this.objSimPictor = objPictorRef;
	};

	/**
	 * Invoked when screen json data loaded successfully.
	 * @param {JSON} objLoadedData
	 * @param {Object} objClassref
	 * @return none
	 * @access private
	 * @memberof SimulationActivity.
	 */
	SimulationActivity.prototype.handleJsonDataLoadComplete = function(objLoadedData, objClassref) {
		objClassref.jsonData = objLoadedData;
		objClassref.objDataLoader.off(objClassref.objDataLoader.DATA_LOAD_SUCCESS);
		objClassref.objDataLoader.off(objClassref.objDataLoader.DATA_LOAD_FAILED);
		if (objLoadedData.defaults !== undefined) {
			$.each(objLoadedData.defaults, function(key, value) {
				objClassref.model.set(key, value);
			});
		}

		//load css file if tag added in activity config file.
		if (objClassref.activityData.stylePath !== undefined) {
			objClassref.loadCSSData(objClassref.activityData.stylePath);
		} else {
			objClassref.onAllDataLoadComplete();
		}
	};

	/**
	 * 'onAllDataLoadComplete' method is binded with the json data load complete event
	 * this method is responsible to load component json file if required, and start the
	 * screen init process.
	 * @param none
	 * @return none
	 * @memberof SimulationActivity#
	 * @access private
	 */
	SimulationActivity.prototype.onAllDataLoadComplete = function() {
		var arr = this.objJsonHelper.searchCompJsonFilePath(this.jsonData, "compjsonsrc");
		this.arrCompFileToLoad = arr;
		this.counterIndex1 = 0;
		if (arr.length === 0) {
			this.initlizeControls();
			this.startScreenInitlization();
		} else {
			this.prepareScreenComponentsList(arr[this.counterIndex1]);
		}
	};

	/**
	 * Preparing component json
	 */
	SimulationActivity.prototype.prepareScreenComponentsList = function(dataObject) {
		this.loadJSONData(dataObject.path, 'json', 'application/json', 'json', this.onCompJsonLoadDone, this.dataLoadErrorHandler);
	};

	/**
	 * invoked when component json file loaded this method also responsible to merge
	 * new component json file with correct index position.
	 * @param {Object} data
	 * @param {Object} scope reference of this
	 * @return {none}
	 * @memberof SimulationActivity
	 * @access private
	 */
	SimulationActivity.prototype.onCompJsonLoadDone = function(data, scope) {
		scope.objDataLoader.off(scope.objDataLoader.DATA_LOAD_SUCCESS);
		scope.objDataLoader.off(scope.objDataLoader.DATA_LOAD_FAILED);
		scope.arrCompFileToLoad[scope.counterIndex1].loadedData = data;

		if (scope.arrCompFileToLoad.length > scope.counterIndex1 + 1) {
			scope.counterIndex1 = scope.counterIndex1 + 1;
			scope.prepareScreenComponentsList(scope.arrCompFileToLoad[scope.counterIndex1]);
		} else {
			scope.combineArray();
		}
	};

	/**
	 * combing component json file with screen json data and start the screen init
	 * process
	 * @param {none}
	 * @return {none}
	 * @access priavte
	 * @memberof SimulationActivity#
	 */
	SimulationActivity.prototype.combineArray = function() {
		var j, part1, part2, i, startIndex, arrToMerge, arrOriginal = this.jsonData.screens[0].components, finalArray = [], updatedArray = [];
		this.counterIndex1 = 0;
		i = this.arrCompFileToLoad.length - 1;
		updatedArray = arrOriginal;
		for ( i = this.arrCompFileToLoad.length - 1; i >= 0; i = i - 1) {
			startIndex = Number(this.arrCompFileToLoad[i].index);
			arrToMerge = this.arrCompFileToLoad[i].loadedData.components;
			updatedArray = this.mergeArrays(updatedArray, arrToMerge, startIndex);
		}

		this.jsonData.screens[0].components = updatedArray;
		this.initlizeControls();
		this.startScreenInitlization();
	};

	/**
	 * Merging two array of component json.
	 * @param {Array} arrray1
	 * @param {Array} arrayy2,
	 * @param {Number}, mergeIndex
	 * @return {Array} tempArray
	 * @access private
	 * @memberof SimulationActivity#
	 */
	SimulationActivity.prototype.mergeArrays = function(array1, array2, mergeInex) {
		var i = 0, tempArray = [];
		for ( i = 0; i < mergeInex; i = i + 1) {
			tempArray.push(array1[i]);
		}
		for ( i = 0; i < array2.length; i = i + 1) {
			tempArray.push(array2[i]);
		}
		for ( i = mergeInex + 1; i < array1.length; i = i + 1) {
			tempArray.push(array1[i]);
		}
		return tempArray;
	};
	/**
	 * Handling screen json load error.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof SimulationActivitiy#
	 */
	SimulationActivity.prototype.dataLoadErrorHandler = function() {
		this.objDataLoader.off(this.objDataLoader.DATA_LOAD_SUCCESS);
		this.objDataLoader.off(this.objDataLoader.DATA_LOAD_FAILED);
		throw new Error(this.objErrConst.ERROR_WHILE_LOADING_FILE);
	};

	/**
	 * Method loadCSSData is responsible to load CSS file
	 * @param {Object} strPath CSS file path
	 * @return none
	 * @access private
	 * @memberof SimulationActivity#
	 */
	SimulationActivity.prototype.loadCSSData = function(strPath) {
		var objClassref = this;
		//we are loading css file with time stamp.
		//this will force requirejs to reload the same css file again.
		require(["css!" + strPath + "?" + (new Date()).getTime()], function() {
			objClassref.onAllDataLoadComplete();
		});
	};

	/**
	 *  method 'getUpdatedJSONData' will return the updated json/css and media file
	 * name with its path to its callback method.
	 * @param {Object} objData
	 * @return none
	 * @access priavte
	 * @memberof SimulationActivity#
	 */
	SimulationActivity.prototype.getUpdatedJSONData = function(objData) {
		var jsonData, objDataToSend = {};
		if (this.objPropertyUpdater !== undefined) {
			this.isDataSaved(true);
			jsonData = this.objSimPictor.getJSONData();
			objDataToSend.jsonFilePath = this.activityData.dataPath;
			objDataToSend.jsonFileData = jsonData;
			objDataToSend.cssFilePath = this.activityData.stylePath;
			objDataToSend.cssFileData = this.objSimPictor.getCSSText();
			objDataToSend.assetsList = this.objSimPictor.getAssetsToSaveList().concat(this.objSimPictor.getJSONMediaList());
			objData.data.scope[objData.data.callback].apply(objData.data.scope, [objDataToSend]);
		}
	};

	SimulationActivity.prototype.reloadPropertyUpdatorCssData = function(objData) {
		var jsonData, objDataToSend = {};
		if (this.objPropertyUpdater !== undefined) {
			this.objPropertyUpdater.collectStyles(this.activityData.stylePath);
		}
	};

	/**
	 * 'showAlertMsg' method is responsible to launch given message template as popup
	 * with the help of popup manager class.
	 * @access private
	 */
	SimulationActivity.prototype.showAlertMsg = function(strMsg, htmlTemplate, nButtons, strTitle, labelYes, labelNo, labelCancel, objStyle) {
		var objPopupData = {}, objPopup;
		objPopupData.title = strTitle;
		objPopupData.message = strMsg;

		if (labelYes !== undefined) {
			objPopupData.yesBtnLabel = labelYes;
		}

		if (labelNo !== undefined) {
			objPopupData.noBtnLabel = labelNo;
		}

		if (labelCancel !== undefined) {
			objPopupData.cancelBtnLabel = labelCancel;
		}

		if (nButtons !== undefined) {
			objPopupData.button = nButtons;
		}

		objPopupData.styles = objStyle;
		objPopupData.htmlTemplate = htmlTemplate;
		return this.showAlert(objPopupData);
	};

	/**
	 * Responsible to launch confirm/information popup
	 * @param {Object} strMessage
	 * @param {Object} strTitle
	 * @param {Object} nButton
	 */
	SimulationActivity.prototype.showMessage = function(strMessage, strTitle, nButton, labelYes, labelNo, labelCancel, objStyle) {
		this.showAlertMsg(strMessage, this.getInlineTemplateById("msgBoxTemplate"), nButton, strTitle, labelYes, labelNo, labelCancel, objStyle);
	};

	/**
	 * Responsible for setting the screen text
	 * @param {Object} object compoent
	 * @param {Object} object component json data
	 */
	SimulationActivity.prototype.setScreenText = function(objComp, objJsonData) {
		if (objJsonData && objJsonData.data && objJsonData.data.screenText) {
			if (objComp.hasOwnProperty("setScreenText")) {
				objComp.setScreenText(this.getScreenText(objJsonData.data.screenText));
			}
		}
	};

	/**
	 * Responsible to change the wizard View
	 * @param {Object} 
	 */
	SimulationActivity.prototype.changeWizardView = function(objEvent) {
		this.objSimPictor.changeWizardView(objEvent.customData);
	};


	SimulationActivity.prototype.destroy = function() {
		this.flush();
		console.log("destroing.........", this.strRegionName);
		this.screenHolder.close();

		if (this.activityData.stylePath !== undefined) {
			this.removeCSS(this.activityData.stylePath.split(".css")[0]);
		}
		if (this.objSimPictor) {
			this.objSimPictor.destroy();
		}
		delete this.objSimPictor;
		this.removeJS("player/base/base-simulation-activity");
		return this.SimulationActivitySuper.prototype.destroy.call(this, true);
	};

	return SimulationActivity;
});
