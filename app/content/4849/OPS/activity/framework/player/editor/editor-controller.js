/*jslint nomen: true*/
/*globals Backbone,$,_,console */

/**
 * EditorController
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * Here is the full license text and copyright
 * notice for this file. Note that the notice can span several
 * lines and is only terminated by the closing star and slash.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */
define(['marionette', 'player/utils/data-loader', 'player/constants/errorconst'], function(Marionette, DataLoader, errorConst) {
	"use strict";
	var EditorController;

	/**
	 * TODO: comment will be added later.
	 *
	 *
	 * @access private
	 * @class Editor
	 * @augments Backbone.Marionette.Controller.extend
	 */

	EditorController = Backbone.Marionette.Controller.extend({
		objEditorDict : {},
		objPlayerRef : undefined,
		compEditor : undefined,
		data_loader : undefined,
		regionId : undefined,
		activityTemplate : undefined,
		activityData : undefined,
		arrCompList : undefined,
		arrCreatedCompList : undefined,
		ACTIVITY_CREATED_SUCCESSFULLY : "activitytCreationSuccess",
		SIM_COMP_CREATION_COMPLETE : "simCompCreationComplete",
		EDITOR_PATH : 'player/editor/',
		EDITOR_SUFFIX : "-editor",
		COMP_NAME : "compName",
		jsonData : undefined,
		bEditor : false,
		constructor : function(strRegion, objMPlayer, bInEditorMode) {
			this.objEditorDict = {};
			this.objPlayerRef = objMPlayer;
			this.data_loader = new DataLoader();
			this.regionId = strRegion;
			this.arrCreatedCompList = [];
			this.bEditor = bInEditorMode;
		},

		initialize : function(strRegionId, actData) {
			var strHtmlSrc, that = this;
			this.activityData = actData;
			strHtmlSrc = "text!" + this.activityData.html.source;
			require([strHtmlSrc], function(activityTmpl) {
				that.activityTemplate = activityTmpl;
				that.getComponentList();
			});
		}
	});

	/**
	 * Method 'getComponentList' is manage a list of required component by HTML and pass that
	 * list to 'createMCompComponent' function to create them.
	 *
	 * If no mComp list found then this method pass the html content to its manager class directly
	 * for further process.
	 *
	 * @param none
	 * @return none
	 * @access private
	 */
	EditorController.prototype.getComponentList = function() {
		// creating mComp List
		if (this.activityTemplate.search('mComp') !== -1) {
			this.arrCompList = $("<div>" + this.activityTemplate + "<div>").find("[type=mComp]");
		}

		if (this.arrCompList !== undefined && this.arrCompList.length > 0) {//if mComp type component found in given html
			this.arrCreatedCompList = [];
			this.createMCompComponents(this.arrCompList);
		} else {
			//.. No mComp type component entry found in HTML.
			this.onHTMLParsingComplete();
		}
	};

	/**
	 * 'createMCompComponent' is responsible to require first mcomp in provided component list with the
	 * help of component editor class.
	 * A Editor class is basically a class which is responsible to create and prepare data for the component.
	 *
	 * @param {Array} arrMComp the list of required component
	 * @return none
	 * @access private
	 */
	EditorController.prototype.createMCompComponents = function(arrMComp) {
		var strCompClassName, rootRef = this;
		strCompClassName = $(arrMComp[0]).attr(this.COMP_NAME) + this.EDITOR_SUFFIX;
		require([this.EDITOR_PATH + strCompClassName], function(MCompData) {
			rootRef.onEditorCreationComplete(MCompData);
		});
	};

	/**
	 * Invoked when a component created successfully by its editor class
	 * @param {Object} objCompData
	 * @return none
	 * @access private
	 */
	EditorController.prototype.onComponentCreationComplete = function(objCompData) {

		//removing event from component editor class.
		objCompData.target.off(this.compEditor.ON_COMP_CREATED);

		//adding created component data to list.
		this.arrCreatedCompList.push(objCompData);

		//removing first element from required component list.
		this.arrCompList.splice(0, 1);

		//if required comp list found more then 0 then again we will call createMCompComponents method to
		//create next component in the list otherwise controll will be passed to method 'onHTMLParsingComplete'
		//for further initlization process.
		if (this.arrCompList.length > 0) {
			this.createMCompComponents(this.arrCompList);
		} else {
			this.onHTMLParsingComplete();
		}
	};

	EditorController.prototype.flush = function() {
		var i, objCompEditor, isDestroySuccess;
		for ( i = 0; i < this.arrCreatedCompList.length; i += 1) {
			objCompEditor = this.arrCreatedCompList[i].target;
			isDestroySuccess = objCompEditor.destroy();
			if (objCompEditor.isDestroyCalled !== true) {
				throw new Error(errorConst.PLEASE_CALL_SUPER_CLASS_DESTORY_FROM_COMPONENT_EDITOR);
			}
		}
	};

	/**
	 * Create a instance of component editor class based on the required mComp type and
	 * when component created successfully with the help of its editor class, 'component editor' class
	 * notify to others by dispatching 'ON_COMP_CREATED' event.
	 * @param none
	 * @return none
	 * @access private
	 */
	EditorController.prototype.onEditorCreationComplete = function(MCompEditorClass) {
		this.compEditor = new MCompEditorClass();
		this.compEditor.setEditorMode(this.bEditor);
		this.compEditor.on(this.compEditor.ON_COMP_CREATED, this.onComponentCreationComplete, this);
		this.compEditor.getComponent(this.arrCompList[0], this.objPlayerRef.getPlayerHelper().nUpdatedScaleValue);
	};

	/**
	 * Invoked every time when all component created successfully. This method is responsible
	 * to send created component class references to its manager class 'editorManager' to pass the data
	 * to activity controller with the help of activityManager class.
	 * @return none
	 * @access private
	 */
	EditorController.prototype.onHTMLParsingComplete = function() {
		var objDataToSend = {}, arrTemplatesList, bHasInlineTemplate = false;

		// look for inline templates...
		if (this.activityTemplate.search('text/template') !== -1) {
			bHasInlineTemplate = true;
			this.activityTemplate = $("<div>" + this.activityTemplate + "</div>");
			//...inline templates are available
			arrTemplatesList = this.activityTemplate.find("[type='text/template']");
		}
		// check if inline template is available...
		if (arrTemplatesList !== undefined && arrTemplatesList.length > 0) {
			objDataToSend.inlineTemplates = arrTemplatesList;
			// ...remove it
			arrTemplatesList.remove();
		}

		objDataToSend.regionId = this.regionId;
		if (bHasInlineTemplate) {
			objDataToSend.activityTemplate = this.activityTemplate.html();
		} else {
			objDataToSend.activityTemplate = this.activityTemplate;
		}
		objDataToSend.createdCompList = this.arrCreatedCompList;
		if (this.compEditor !== undefined) {
			this.compEditor.off(this.compEditor.ON_COMP_CREATED);
		}
		this.trigger(this.ACTIVITY_CREATED_SUCCESSFULLY, objDataToSend);

	};

	//-----------Sim editor related method -------------

	EditorController.prototype.createSimComp = function(strType, objCompData) {
		var strCompClassName, rootRef = this;
		strCompClassName = strType + this.EDITOR_SUFFIX;
		require([this.EDITOR_PATH + strCompClassName], function(EditorClass) {
			rootRef.onSimCompEditorCreationComplete(EditorClass, objCompData);
		});

	};
	/**
	 * Invoked every time when a 'component editor' created, A comp editor is a class which is
	 * responsible to create a component.
	 * @param {Object} SimCompEditor - Component editor class
	 * @param {Object} objCompData - component data in JSON format.
	 * @return {none}
	 * @access private
	 * @memberof EditorController
	 */
	EditorController.prototype.onSimCompEditorCreationComplete = function(SimCompEditor, objCompData) {
		this.jsonData = objCompData;
		var objEditor = new SimCompEditor(objCompData, this.regionId);
		objEditor.bEditor = this.bEditor;
		objEditor.on(objEditor.ON_COMP_CREATED, this.onSimCompCreationComplete, this);
		objEditor.getComponent(objCompData, true);
		this.objEditorDict[objCompData.id] = objEditor;
	};

	EditorController.prototype.onSimCompCreationComplete = function(objCompData) {
		var objData = {};
		objData.jsonData = this.jsonData;
		objData.compData = objCompData;
		objData.bEditor = this.bEditor;

		//removing event from component editor class.
		this.objEditorDict[objCompData.id].off(objCompData.target.ON_COMP_CREATED);
		if (this.bEditor === false) {
			delete this.objEditorDict[objCompData.id];
		}
		this.trigger(this.SIM_COMP_CREATION_COMPLETE, objData);
	};
	//-----------------------------------------------------------------------------------------

	EditorController.prototype.editComponent = function(objComp, dataObject) {
		this.objEditorDict[objComp.getID()].updateExistingComponent(objComp, dataObject);
	};
	/**
	 * Destroys the Editor object.
	 * @param none.
	 * @returns none.
	 * @access private
	 */
	EditorController.prototype.destroy = function() {
		if (this.compEditor !== undefined) {
			this.compEditor.off(this.compEditor.ON_COMP_CREATED);
		}
	};

	return EditorController;
});
