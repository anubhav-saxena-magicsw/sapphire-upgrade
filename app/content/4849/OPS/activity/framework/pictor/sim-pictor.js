/*jslint nomen: true*/
/*globals Backbone,_,console,$, class */

/**
 * SimPictor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */
define(['marionette', 'simPictor/assembler', 'simPictor/sim-event-controller', 'player/constants/errorconst', 'player/controllers/comptree-controller'],

/**
 * @Class SimPictor
 */

function(Marionette, Assembler, SimEventController, ErrorConst, CompTreeController) {
	'use strict';

	var SimPictor;
	/**
	 * Class 'simPictor' is a extension of mPlayer, which provided a mechanism to create an 'activity'
	 * by json data only. Pictor also allow users to bind and listen screen elements (buttom, component events)
	 * events by providing information in json file.
	 *
	 * Pictor also create a bridge between regions which allow screen elements to communicate
	 * other region as well.
	 *
	 * Pictor is managing its work with the help of other class, the few major classes are as below -
	 * 'Assembler' - Help to create screen elements and add them to DOM element.
	 * 'SimEventController' - Help to bind and listen events of component(s)
	 * 'Simulation-Activity' - activity class, which is extending 'BaseActivity' class
	 */

	SimPictor = Backbone.Marionette.Controller.extend({
		objData : null,
		objAssembler : {},
		objEventManager : null,
		objWarehouse : null,
		objScreen : null,
		objEditorManager : null,
		objSimActivityRef : null,
		objSimEventController : null,
		bEditor : false,
		objPropertyUpdater : null,
		isScreenSaved : true,
		objActRef : null,
		objWizardViewRef : undefined,
		isChildCreationInvoked : false,

		//EDITOR
		strJSONData : undefined,
		strSelectedCompId : undefined,
		//END EDITOR

		constructor : function(data) {
			this.objEditorManager = data.editorManager;
			this.objSimActivityRef = data.simActRef;
			this.bEditor = data.bEditor;
		}
	});

	/**
	 * call by 'activitycontroler' When an 'activity' initlization process complete.
	 * @param {Object} data
	 * @param {Object} objActivityRef
	 * @return none
	 * @access private
	 * @memberof SimPictor
	 */
	SimPictor.prototype.initalize = function(data, objActivityRef) {
		this.isChildCreationInvoked = false;
		this.objData = data;
		if (this.bEditor === true) {
			this.strJSONData = JSON.stringify(this.objData.jsonData);
		}
		this.objActRef = objActivityRef;
		this.initSimEventController();
		this.initalizeAssembler();
	};

	/**
	 * update player scaled value
	 */
	SimPictor.prototype.setStageScaleValue = function(nScaleValue) {
		if (this.objAssembler !== undefined && this.objAssembler !== null) {
			this.objAssembler.setStageScaleValue(nScaleValue);
		}
	};
	/**
	 * Init Assembler class and register its events.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof SimPictor
	 */
	SimPictor.prototype.initalizeAssembler = function() {
		var objClassRef = this, strEventName;
		this.objSimActivityRef = this.objActRef;
		this.objAssembler = new Assembler(this.objData.jsonData, this.objData.template, this.objSimActivityRef, this.objEditorManager, this.objSimEventController, this.bEditor);
		this.objAssembler.off(Assembler.COMP_CREATION_COMPLETE);
		this.objAssembler.on(Assembler.COMP_CREATION_COMPLETE, objClassRef.handleAssemblerEvent, objClassRef);
		this.objAssembler.start();

		this.objSimActivityRef.screenEventName = this.objSimActivityRef.ActivityEventConst.MIDDLE_SCREEN_LOAD_EVENT;
		if (this.objSimActivityRef.nScreenIndex === 0) {
			this.objSimActivityRef.screenEventName = this.objSimActivityRef.ActivityEventConst.FIRST_SCREEN_LOAD_EVENT;
		} else if (this.objSimActivityRef.nScreenIndex === (this.objSimActivityRef.nTotalScreen - 1)) {
			this.objSimActivityRef.screenEventName = this.objSimActivityRef.ActivityEventConst.LAST_SCREEN_LOAD_EVENT;
		}
	};

	/**
	 * This method is binded with the Assembler object, and will be invoked when "COMP_CREATION_COMPLETE"
	 * triggred by assembler.
	 * "COMP_CREATION_COMPLETE" event will be triggered once in a life cycle of a screen component.
	 * @param {Object} objEvent
	 * @return none
	 * @access private
	 * @memberof SimPictor
	 */
	SimPictor.prototype.handleAssemblerEvent = function(objEvent) {
		var objCompTreeController, objClassRef = this;
		this.objSimActivityRef.objScreen.dispatchScreenEvent(this.objSimActivityRef.screenEventName, {});
		//console.log("hellow...... i m in pictor");
		if (this.bEditor === false && this.isChildCreationInvoked === false) {
			this.isChildCreationInvoked = true;
			this.objSimActivityRef.objScreen.childCreationComplete();
			this.wizardViewRendered();
		} else if (this.bEditor === false) {
			if (this.objWizardViewRef && this.objWizardViewRef.wizardCompId !== undefined) {
				//console.log("fire wizard view change......", this.objWizardViewRef.wizardCompId);
				this.wizardViewRendered(this.objWizardViewRef.wizardCompId);
				this.objWizardViewRef.wizardCompId = undefined;

			}
		}
		//adding Global comp reference
		this.objSimActivityRef.objScreen.globalComp = this.objAssembler.globalCompDict;

		if (this.objSimActivityRef.bGlobalComponents === true) {
			this.objSimActivityRef.bGlobalComponents = false;
			this.objAssembler.on(Assembler.GLOBAL_COMP_CREATED, objClassRef.onGlobalCompCreationComplete, objClassRef);
			this.objAssembler.createGlobalComponents();
		}

		if (this.bEditor === true) {
			objCompTreeController = CompTreeController.getInstance();
			objCompTreeController.setData(objClassRef.objAssembler.arrCompToBeCreated, objClassRef.strJSONData);
			objCompTreeController.off(objCompTreeController.TREE_NODE_SELECTED).on(objCompTreeController.TREE_NODE_SELECTED, objClassRef.selectComponent, objClassRef);
			this.requirePropertyUpdater(objCompTreeController);
		}
	};

	SimPictor.prototype.wizardViewRendered = function(id) {
		$.each(this.objSimActivityRef.objScreen, function(k, obj) {
			if ( obj instanceof Object && obj.componentType === "wizard") {
				if (id && id === obj.getID()) {
					obj.wizardViewRenderComplete();
					return;
				}
				obj.wizardViewRenderComplete();
			}
		});
	};

	SimPictor.prototype.onActivityCreationComplete = function() {
	};

	/**
	 * This method will be call when global component crated succesfully and
	 * their events are registered with the help of Sim-Event-controller class.
	 *
	 * This method is responsible to attach the refereces of global component
	 * with the screen component under GlobalComp head.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof SimPictor#
	 */
	SimPictor.prototype.onGlobalCompCreationComplete = function() {
		this.objSimActivityRef.objScreen.globalComp = this.objAssembler.globalCompDict;
	};

	/**
	 * Initliazing event controller of simulation engine.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof SimPictor
	 */
	SimPictor.prototype.initSimEventController = function() {
		//console.log("initEventManager");
		this.objSimEventController = new SimEventController();
	};

	/**
	 * Responsible to desotry current screen and its objects with the help
	 * of Assembler object.
	 * @param none
	 * @return none
	 * @memberof SimPictor#
	 * @access private
	 */
	SimPictor.prototype.destroyCurrentScreen = function() {
		return this.objAssembler.flushScreen();
	};

	/** ---------------------EDITOR RELATED ---------------------------- **/

	/**
	 * Invoked by 'Simulation-activity' when a component dispatch a event and method which is
	 * associated with this event is written in different region.
	 * method is in different region.
	 * @param {Object} objTask
	 * @return none
	 * @methodof SimPictor#
	 * @access private
	 */
	SimPictor.prototype.callAndUpdateComponent = function(objTask) {
		this.objSimEventController.executeTask(objTask);
	};

	SimPictor.prototype.selectComponent = function(strcompId, bSetFocus) {
		this.objAssembler.getSelectorRef(strcompId).select(bSetFocus);
	};
	/**
	 * Responsible to return the component data based on the provided
	 * component id as a parameter.
	 * @param {String} strCompId
	 * @return {Object} component data
	 * @access private
	 * @memberof SimPictor#
	 */
	SimPictor.prototype.getComponentData = function(strCompId) {
		this.strSelectedCompId = strCompId;
		var cssData, compData = this.objAssembler.getComponentDataById(strCompId);
		cssData = this.getComponentCssData(compData);
		compData.cssData = cssData;
		//this.objPropertyUpdater.selectedCompData(compData);
		//TO BE Deleted'
		CompTreeController.getInstance().selectTreeNode(strCompId);
		////////////
		return compData;
	};

	SimPictor.prototype.getChildComponentListAndData = function() {
		return this.objAssembler.getChildComponentListAndData();
	};

	SimPictor.prototype.getComponentCssData = function(objData) {
		var self = this, objList = {};
		if (objData.data.stylelist) {
			$.each(objData.data.stylelist, function(state, strClass) {
				objList[state] = self.objPropertyUpdater.getStyleClass(strClass);
			});
		}
		if (!objList["normal"]) {
			objList["normal"] = this.objPropertyUpdater.getStyleClass(objData.data.styleClass);
		}
		return objList;
	};

	/**
	 * Invoked when a component property data updated through any
	 * channel (selector/property Panel/toolbar)
	 * Based on the property type this method select the correct helper classes and assign them
	 * to update the property object  in virtual file
	 * @param {Object} objEvent - updated data of component
	 * @return {none}
	 * @access private
	 * @memberof SimPictor#
	 */
	SimPictor.prototype.oncomponentPropertyDataUpdated = function(objEvent) {
		this.isScreenSaved = false;
		this.objActRef.isDataSaved(this.isScreenSaved);
		var compId = objEvent.compData.compId, originalCompData, updatedCompData;
		originalCompData = this.objAssembler.getComponentDataById(compId);
		updatedCompData = objEvent.compData;
		//from here we can decide and control the flow of data and component updation.
		this.objPropertyUpdater.updateComponentData(originalCompData, updatedCompData, this.objAssembler.getCompRefById(compId), objEvent);
	};

	SimPictor.prototype.handleChangeViewEvents = function(objEvent) {
		this.objActRef.changeWizardView(objEvent.compData);
	};

	SimPictor.prototype.propertyUpdaterCommonEvent = function(objEvent) {
		var strEventName = objEvent.type;
		switch(strEventName) {
		case this.PropertyUpdater.DESELECT_COMPONENT:
			this.objActRef.deselectComponent();
			break;
		}

	};

	SimPictor.prototype.requirePropertyUpdater = function(objCompTreeController) {
		var objClassRef = this, strClassPath = "player/controllers/property-updater";
		require([strClassPath], function(PropertyUpdater) {
			var objData = {};
			objData.jsonData = objClassRef.strJSONData;
			objClassRef.objPropertyUpdater = new PropertyUpdater(objData, objCompTreeController);
			objClassRef.objPropertyUpdater.setComponentCounter(objClassRef.objAssembler.arrCompToBeCreated.length);
			objClassRef.objPropertyUpdater.on(PropertyUpdater.COMP_PROPERTY_UPDATED, objClassRef.onPropertyDataUpdated, objClassRef);
			objClassRef.objPropertyUpdater.on(PropertyUpdater.CREATE_NEW_COMPONENT, objClassRef.handleNewCompCreation, objClassRef);
			objClassRef.objPropertyUpdater.on(PropertyUpdater.REMOVE_SELECTED_COMPONENT, objClassRef.removeSelectedComponent, objClassRef);
			objClassRef.objPropertyUpdater.on(PropertyUpdater.DOM_LAYOUT_UPDATE_EVENT, objClassRef.domLayoutUpdateEvent, objClassRef);
			objClassRef.objPropertyUpdater.on(PropertyUpdater.DOM_CHANGE_VIEW_EVENT, objClassRef.handleChangeViewEvents, objClassRef);

			objClassRef.objPropertyUpdater.on(PropertyUpdater.DESELECT_COMPONENT, objClassRef.propertyUpdaterCommonEvent, objClassRef);
			objClassRef.objPropertyUpdater.on(PropertyUpdater.SELECT_COMPONENT, objClassRef.propertyUpdaterCommonEvent, objClassRef);

			objClassRef.objPropertyUpdater.on(PropertyUpdater.INVALID_COMPONENT_CREATION, objClassRef.invalidComponentCreation, objClassRef);
			objClassRef.objAssembler.on(Assembler.COMPONENT_REMOVED_FROM_DOM, objClassRef.onComponentRemoveFromDOM, objClassRef);
			objClassRef.objAssembler.on(Assembler.COMP_CREATED_IN_EDITOR_MODE, objClassRef.onComponentCreationCompleteInEditMode, objClassRef);
			objClassRef.objAssembler.on(Assembler.EDIT_DOM_LAYOUT_UPDATED, objClassRef.onDomLayoutUpdated, objClassRef);

			if (objClassRef.bEditor === true) {
				objClassRef.PropertyUpdater = PropertyUpdater;
				objClassRef.objPropertyUpdater.collectStyles(objClassRef.objActRef.activityData.stylePath);
				objClassRef.objActRef.objPropertyUpdater = objClassRef.objPropertyUpdater;
			}
		});

	};

	/**
	 * Invoked when 'component removed from DOM object through assembler.
	 * will launch the default property panel
	 */
	SimPictor.prototype.onComponentRemoveFromDOM = function(objEvent) {
		this.strSelectedCompId = undefined;
		CompTreeController.getInstance().setData(this.getChildComponentListAndData(), this.objData.jsonData);
	};

	/**
	 * Invoked when 'component removed from DOM object through assembler.
	 * will launch the default property panel
	 */
	SimPictor.prototype.getJSONData = function(objEvent) {
		return this.objPropertyUpdater.getScreenJSONData();
	};

	SimPictor.prototype.getCSSText = function() {
		return this.objPropertyUpdater.getCssText();
	};

	SimPictor.prototype.getAssetsToSaveList = function() {
		return this.objPropertyUpdater.getAssetsToSaveList();
	};

	SimPictor.prototype.getJSONMediaList = function() {
		return this.objPropertyUpdater.getJSONMediaList();
	};

	/**
	 * This method is responsible to refereh the selected component property panel
	 * currently this methodis binded with assembler event 'COMP_CREATED_IN_EDITOR_MODE'
	 * which wil be dispatched by the assembler only when a component created and added in
	 * DOM and json data.
	 * @param {Object} objEvent
	 * @return {none}
	 * @access private
	 * @memberof SimPictor#
	 */
	SimPictor.prototype.onComponentCreationCompleteInEditMode = function(objEvent) {
		var objDataToSend = {};
		objDataToSend.jsonData = objEvent.data;
		objDataToSend.componentList = this.getChildComponentListAndData();
		this.objActRef.handleEditorEvents(this.objActRef.ActivityEventConst.COMPONENT_SELECTED, objDataToSend);
		CompTreeController.getInstance().setData(this.getChildComponentListAndData(), this.objData.jsonData);
		this.objPropertyUpdater.onComponentCreationCompleteInEditMode();
	};

	SimPictor.prototype.onDomLayoutUpdated = function(objEvent) {
		this.objPropertyUpdater.updateJsonNodePosition(objEvent);
	};

	SimPictor.prototype.invalidComponentCreation = function(objEvent) {
		var objStyleClass = {};
		objStyleClass.btnYesStyle = "btn-skyBlue";
		objStyleClass.btnNoStyle = "";
		objStyleClass.btnCancelStyle = "";

		if (objEvent.compData && objEvent.compData.message) {
			this.objActRef.showMessage(objEvent.compData.message, ErrorConst.PROJECT_TITLE, 1, "OK", undefined, undefined, objStyleClass);
		} else {
			this.objActRef.showMessage(ErrorConst.COMPONENT_NOT_ALLOWED_AS_CHILD_COMPONENT, ErrorConst.PROJECT_TITLE, 1, "OK", undefined, undefined, objStyleClass);
		}
	};

	SimPictor.prototype.onPropertyDataUpdated = function(objEvent) {
		this.objActRef.isScreeenEdited = true;
		this.objAssembler.editComponent(objEvent);
		if (objEvent.compData && objEvent.compData.actionKeys[2] === "name") {
			CompTreeController.getInstance().setData(this.getChildComponentListAndData(), this.objData.jsonData);
			this.selectComponent(objEvent.compData.compId, false);
		} else if (objEvent.compData && objEvent.compData.actionKeys[3] === "stylelist") {
			this.selectComponent(objEvent.compData.compId);
		}
	};

	/**
	 * This method is responsible to invoke the process of  'create new component' in
	 * assembler
	 * When component created and added successfully by assembler then 'SimPictor'
	 * perform next process if required.
	 */
	SimPictor.prototype.handleNewCompCreation = function(objEvent) {
		this.objAssembler.createComponent(objEvent.compData);
	};

	/**
	 * calling assembler "removeComponent" to delete the component from dom and its json
	 * references from memory
	 */
	SimPictor.prototype.removeSelectedComponent = function(objEvent) {
		this.objActRef.deselectComponent();
		this.objAssembler.removeComponent(objEvent.compData.componentId, objEvent.compData.parentId);
	};
	/**
	 * Invoked when property data removed selected component data from json
	 */
	SimPictor.prototype.changeWizardView = function(objData) {
		this.objWizardViewRef = {};
		this.objWizardViewRef.wizardCompId = objData.compId;
		this.objAssembler.changeWizardView(objData);
	};

	SimPictor.prototype.domLayoutUpdateEvent = function(objEvent) {
		this.objAssembler.domLayoutUpdateEvent(objEvent);
		objEvent.task = objEvent.compData.task;
		this.objActRef.playerBubbleEvent(objEvent);
	};

	/** ---------------------END EDITOR RELATED ---------------------------- **/

	/** Destroy **/
	SimPictor.prototype.destroy = function() {
		this.objActRef = null;
		if (this.objPropertyUpdater !== null) {
			this.objPropertyUpdater.off(this.PropertyUpdater.COMP_PROPERTY_UPDATED);
			this.objPropertyUpdater.off(this.PropertyUpdater.CREATE_NEW_COMPONENT);
			this.objPropertyUpdater.off(this.PropertyUpdater.REMOVE_SELECTED_COMPONENT);
			this.objPropertyUpdater.off(this.PropertyUpdater.DOM_LAYOUT_UPDATE_EVENT);
			this.objPropertyUpdater.off(this.PropertyUpdater.DOM_CHANGE_VIEW_EVENT);

			this.objPropertyUpdater.off(this.PropertyUpdater.DESELECT_COMPONENT);
			this.objPropertyUpdater.off(this.PropertyUpdater.SELECT_COMPONENT);

			this.objPropertyUpdater.off(this.PropertyUpdater.INVALID_COMPONENT_CREATION);
			this.objAssembler.off(Assembler.COMPONENT_REMOVED_FROM_DOM);
			this.objAssembler.off(Assembler.COMP_CREATED_IN_EDITOR_MODE);
			this.objAssembler.off(Assembler.EDIT_DOM_LAYOUT_UPDATED);
		}

		this.objPropertyUpdater = null;
		this.objAssembler.off(Assembler.COMPONENT_REMOVED_FROM_DOM);
		this.objAssembler.off(Assembler.COMP_CREATION_COMPLETE);
		this.objData = undefined;
		this.objEventManager = undefined;
		this.objWarehouse = undefined;
		this.objScreen = undefined;
		this.objEditorManager = undefined;
		this.objAssembler.destroy();
		this.objAssembler.off(Assembler.COMP_CREATION_COMPLETE);
		this.objAssembler = undefined;
	};

	return SimPictor;

});
