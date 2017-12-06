/*jslint nomen: true */
/*globals Backbone,$,console, _, jQuery*/
/*jshint -W065*/

/** Assembler
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2014 Magic Software Private Limited.
 * @copyright (c) 2014 Magic Software
 *
 */

define(['marionette', 'simPictor/factory/sim-factory', 'simPictor/pictor-const', 'player/utils/json-manipulator', 'components/componentselector/component-selector'], function(Marionette, SimFactory, PictorConst, JsonUtil, CompSelector) {
	'use strict';
	var Assembler;

	/**
	 * @class Assembler
	 * This class will be initiated by the sim-pictor class to start the screen init process.
	 *
	 * Class Assembler is mainly responsible to create component with the help of
	 * sim-editor-controller class, (Editor Controller class is responsible to create and return new
	 * component) then add those component in DOM element with the help of screen helper.
	 *
	 * Also this class is responsible to invoke the 'sim-event-controller' to manage the component
	 * events which are provided in json data.
	 *
	 *@augments Backbone.Marionette.Controller
	 *@example
	 *Load module
	 */
	Assembler = Backbone.Marionette.Controller.extend({
		wizardChildRoot : undefined,
		objCurrentCompJson : undefined,
		objJsonUtil : undefined,
		jsonDictById : {},
		screenDict : {},
		objEditorManager : null,
		arrCompToBeCreated : [],
		arrScreenCompList : [],
		objWarehouse : null,
		jsonData : null,
		objFactory : null,
		objActivity : null,
		editorController : null,
		objSimEventController : null,
		compCounter : 0,
		compDict : undefined,
		screenJsPath : undefined,
		objScreenHelper : undefined,
		objScreenClassDefinitation : undefined,
		objGlobalScreenRef : undefined,
		globalCompDict : undefined,
		bEditor : false,
		bEditorModeCompCreation : false,
		objEditorModeComponent : null,
		objSelectorDict : null,
		objScreenRef : undefined,
		objChildrenTab : {},
		memoryObjRef : {},
		nTabIndex : 0,
		//wizardJsonInEditMode : {},

		constructor : function(json, htmlTemplates, activityRef, objEditorManager, simEventController, isEditor) {
			this.objJsonUtil = new JsonUtil();
			this.jsonDictById = {};
			this.resetAllVariable();
			this.jsonData = json;
			this.objEditorManager = objEditorManager;
			this.htmlTemplates = htmlTemplates;
			this.objActivity = activityRef;
			this.objSimEventController = simEventController;
			this.objSimEventController.objActivityRef = this.objActivity;
			this.objSelectorDict = {};
			this.objScreenRef = {};
			this.objChildrenTab = {};
			this.bEditor = isEditor;
			this.memoryObjRef = {};
			this.init();

		}
	});

	/** comp_creation_complete */
	Assembler.COMP_CREATION_COMPLETE = "comp_creation_complete";

	/** comp_ready_to_attach */
	Assembler.COMP_READY_TO_ATTACH = "comp_ready_to_attach";

	/** gloabl_components_created */
	Assembler.GLOBAL_COMP_CREATED = "gloabl_components_created";

	/** comp_created_in_editor_mode */
	Assembler.COMP_CREATED_IN_EDITOR_MODE = "comp_created_in_editor_mode";

	/** component_removed_from_dom */
	Assembler.COMPONENT_REMOVED_FROM_DOM = "component_removed_from_dom";

	/** editDomLayoutUpdated */
	Assembler.EDIT_DOM_LAYOUT_UPDATED = "editDomLayoutUpdated";

	/**
	 * Will be invoked every time from Assembler 'constructor' method.
	 *
	 * Method 'resetAllVariable' introduced to make sure that all
	 * variables are reset before start.
	 * Some time we are fail to reset array type variables, even they
	 * are set to blank[] in destroy its method.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof Assembler#
	 */
	Assembler.prototype.resetAllVariable = function() {
		this.arrScreenCompList.splice(0, this.arrScreenCompList.length);
		this.objActivity = null;
		this.objEditorManager = null;
		this.jsonData = null;
		this.objSimEventController = null;
	};

	/**
	 * Initliazing object(s) which will be required when component will be
	 * created by this class.
	 * Also will registring object events to listen when they are done with their job.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof Assembler#
	 */
	Assembler.prototype.init = function() {
		var objClassRef = this;
		this.objFactory = new SimFactory();
		this.objFactory.on(objClassRef.objFactory.COMP_CREATION_COMPLETE_EVENT, objClassRef.onComponentCreated);
		this.objSimEventController.on(this.objActivity.ActivityEventConst.COMP_EVENT_REGISTER_COMPLETE, objClassRef.onCompEventRegisterComplete, objClassRef);
	};

	/**
	 * 'start' method will be invoked by sim_pictor class to initiate component creation.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof Assembler#
	 */
	Assembler.prototype.start = function() {
		var objClassRef = this;
		this.compDict = {};
		this.editorController = this.objEditorManager.getEditorController(this.objActivity.strRegionName);
		this.editorController.off(this.editorController.SIM_COMP_CREATION_COMPLETE).on(this.editorController.SIM_COMP_CREATION_COMPLETE, objClassRef.onSimCompCreationComplete, this);
		this.assembleComponent(this.jsonData);
	};

	/**
	 * 'assembleComponent' is responsible to create component list and create them.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof Assembler#
	 */
	Assembler.prototype.assembleComponent = function(objJsonData) {
		var objClassRef = this, i;
		this.compCounter = 0;
		this.arrCompToBeCreated = this.getComponentList(objJsonData, []);

		if (this.jsonData.script !== undefined && this.bEditor === false) {
			this.jsonData.script = this.objActivity.objPathUpdater.getValidatedPath(this.objActivity.strRegionName, this.jsonData.script);
			this.requireHelper(this.jsonData.script);
		} else {
			this.getComponent(this.arrCompToBeCreated[0]);
		}
	};

	/**
	 * Create and return the compnent list. which needs to be created in a single screen object.
	 * @param {Object} objData list will be created
	 * @param {Array} list of components
	 * @param {Boolean}  optional true/false, required when data needs to be crated in nested object model.
	 * @memberof Assembler#
	 * @access private
	 */
	Assembler.prototype.getComponentList = function(objData, arrData, bAdd) {
		return this.objJsonUtil.getChildrenList([objData], 0);
	};
	/**
	 * call component editor to create a new component, based
	 * on the provided input.
	 * @param {Object} compData hold the component details and data
	 * @return none
	 * @member of Assembler#
	 * @access private
	 */
	Assembler.prototype.getComponent = function(compData) {
		var objData = compData;
		//when object state set to detached in json file, the assembler assume that
		//this objects creation is not required in initalization time
		//seperate command will be given when need to be assembled
		if (compData.state === "detached") {
			objData = undefined;
			this.compCounter = this.compCounter + 1;
			if (this.compCounter < this.arrCompToBeCreated.length) {
				objData = this.arrCompToBeCreated[this.compCounter];
				this.getComponent(objData);
				return 0;
			} else {
				this.handleCompCreation();
			}
		}

		if (compData.type === "wizard" && compData.components.length > 0) {
			this.objCurrentCompJson = compData;
			this.objJsonUtil.updateAttachState(compData.components, 0, undefined, undefined, "detached");
			this.objJsonUtil.updateAttachState([compData.components[Number(compData.data["default"])]], 0, undefined, undefined, "attached");
			this.objCurrentCompJson.currentIndex = this.objCurrentCompJson.data["default"];
		}

		if (objData !== undefined) {
			objData.classRef = this;
			this.jsonDictById[compData.id] = compData;
			this.getComponentEditor(compData.type, compData);
		}

	};

	/**
	 * Passing data information to 'EditorController' to create new component.
	 * @param {String} strCompType
	 * @param {Object} compData
	 * @return none
	 * @access private
	 * @memberof Assembler#
	 */
	Assembler.prototype.getComponentEditor = function(strCompType, compData) {
		this.editorController.createSimComp(strCompType, compData);
	};

	/**
	 * This method is attached with the "sim_comp_creation_complete" event, which will be
	 * thrown every time by a 'EditorController' class when an 'simComp' definition loaded by
	 * factory and component is ready for DOM.
	 * @param {Object} objData
	 * @return none
	 * @memberof Assembler#
	 * @access private
	 */
	Assembler.prototype.onSimCompCreationComplete = function(objData) {
		var parentId, objComp, objChild = {}, objComponentData = {}, parentObjectRef, strMessage, objSelector = null, objTempChild;

		//deleting extra data which is not required.
		//delete objData.compData.target;
		if (this.compDict[objData.compData.id] !== undefined) {
			throw new Error(" '" + objData.compData.id + "'!!!! " + this.objActivity.objErrConst.DUPLICATE_COMPONENT_ID_FOUND_IN_JSON);
		}
		parentId = objData.jsonData.parentId;
		objData.compData.defaultData = (objData.compData.defaultData === undefined) ? {} : objData.compData.defaultData;
		objData.compData.defaultData.updatedScale = this.objActivity.nStageScale;
		this.bEditor = objData.bEditor;

		///creating new instance of component.
		if (objData.jsonData.type !== PictorConst.SCREEN) {
			objComp = new objData.compData.componentRef(objData.compData.defaultData);
			objComp.bEditor = objData.bEditor;
			objChild.component = objComp;
			objChild.parent = parentId;
		}

		switch(objData.jsonData.type) {
		case PictorConst.SCREEN:
			this.objScreenClassDefinitation = objData.compData.componentRef;
			//need to check
			//creating new instance of screen comp and assigning a template reference.
			objComp = new objData.compData.componentRef({
				template : _.template(this.htmlTemplates[objData.jsonData.templateId])
			});

			this.objActivity[objData.compData.id] = objComp;
			this.objActivity.objScreen = objComp;
			this.objActivity.isScreenInitalized = false;
			this.objActivity.screenHolder.show(objComp);

			if (objData.compData.defaultData !== undefined && objData.compData.defaultData.styleClass !== undefined) {
				$(objComp.$el).addClass(objData.compData.defaultData.styleClass);
			}
			this.objScreenRef = objComp;
			this.objScreenRef.PopupManager = this.objActivity.PopupManager;
			$(objComp.$el).addClass("hide");
			this.applyHtmlAttributes(objComp, objData.jsonData.html);
			//this.applyStyleProperty(objComp, objData.jsonData.style);
			break;

		default:
			if (objData.compData.defaultData !== undefined && objData.compData.defaultData.templateId !== undefined) {
				//set template id if already set in data node;
				objData.compData.defaultData.templateId = this.objActivity.getInlineTemplateById(objData.compData.defaultData.templateId);
			}
			if (this.objEditorModeComponent && this.objEditorModeComponent.parentId !== undefined) {
				parentObjectRef = this.compDict[this.objEditorModeComponent.parentId].objComp;
				this.objEditorModeComponent.parentData = this.objEditorModeComponent.parentId;
				this.objEditorModeComponent.parentId = undefined;
			} else {
				parentObjectRef = this.compDict[objData.jsonData.parentObject.parentId].objComp;
			}

			objComp.setID(objData.jsonData.id);
			if (parentObjectRef.displayObject) {
				parentObjectRef[objData.jsonData.id] = objComp;
				parentObjectRef.addChild(objChild);
			} else {
				strMessage = "parent must be a display object! parent:" + parentObjectRef.getID() + " Child:" + objData.compData.id;
				throw new Error(strMessage);
			}

			if (objData.jsonData.style !== undefined) {//applying style property if defined in json.
				this.applyStyleProperty(objComp, objData.jsonData.style);
			}
			this.applyHtmlAttributes(objComp, objData.jsonData.html);
			break;
		}

		objComponentData = {};
		objComponentData.parentId = parentId;
		objComponentData.objComp = objComp;
		objComponentData.jsonData = objData.jsonData;
		objComponentData.type = objData.jsonData.type;
		if (this.objScreenHelper !== undefined) {
			this.objScreenHelper[objData.jsonData.id] = objComp;
			if (objData.jsonData.name !== undefined) {
				this.objScreenHelper[objData.jsonData.name] = objComp;
			}
		}

		//assign id to component.
		if (objComp.getID() === undefined) {//making sure that id is not set
			objComponentData.objComp.setID(objData.jsonData.id);
		}
		//assign id to component first child.
		$($(objComp.el).children()[0]).attr("id", objData.jsonData.id);
		this.arrScreenCompList.push(objComponentData);
		this.compDict[objComponentData.objComp.getID()] = objComponentData;
		this.compCounter = this.compCounter + 1;
		if (this.bEditor === false) {
			this.objSimEventController.registerComponentEvents(objComponentData);
		} else {
			objComp.$el.attr('tabindex', this.nTabIndex);
			this.nTabIndex = this.nTabIndex + 1;
			this.enableCompEditMode(objComp, (objData.jsonData.type === 'screen'));
			this.handleCompCreation();
			//this.getChildrenTab(parentObjectRef, objComponentData);
		}

		if (objComponentData.jsonData.type === 'wizard') {
			if (this.bEditor === true) {
				this.objCurrentCompJson.wizardDataInEditMode = this.objCurrentCompJson;
			}
			objComponentData.objComp.setWizardScreenData(this.objCurrentCompJson);
		}
		if (this.bEditor && this.isWizardChildAdded) {
			if (this.compCounter >= this.arrCompToBeCreated.length) {
				if (this.wizardChildRoot === undefined) {
					this.wizardChildRoot = objComponentData;
				}
				this.checkIfCompAddedInWizard(this.wizardChildRoot);
			} else if (this.wizardChildRoot === undefined) {
				this.wizardChildRoot = objComponentData;
			}

		}
		//deleting extra data which is not required.
		this.objActivity.setScreenText(objComponentData.objComp, objComponentData.jsonData);
		delete objData.compData.target;
	};

	/***************************************************************/

	/**
	 * Invoked by the sim-pictor calss when screen is ready.
	 * This method will be invoked only once in a life cycle of a activity.
	 * @param none
	 * @return none
	 * @memberof Assembler#
	 * @access private
	 */
	Assembler.prototype.createGlobalComponents = function() {
		var objClassRef = this, objComp, i;
		//creating new instance of screen comp and assigning a template reference.
		objComp = new this.objScreenClassDefinitation({
			template : _.template(this.htmlTemplates[PictorConst.GLOBAL_COMP_LAYOUT_SCRIPT])
		});
		this.objActivity.globalCompHolder.show(objComp);
		this.objGlobalScreenRef = objComp;
		this.objActivity[objComp.id] = objComp;

		//TODO:need to check in global comp area.....
		this.arrCompToBeCreated = this.getComponentList(this.objActivity.jsonData.globalComponents, [])[0];
		this.compCounter = 0;
		this.editorController = this.objEditorManager.getEditorController(this.objActivity.strRegionName);
		this.editorController.off(this.editorController.SIM_COMP_CREATION_COMPLETE);
		this.editorController.on(this.editorController.SIM_COMP_CREATION_COMPLETE, objClassRef.onGlobalCompCreationComplete, this);
		this.getComponent(this.arrCompToBeCreated[0]);
	};

	/* NEED TO CHECK:: SOMEHOW THIS METHOD NEED TO BE MERGED WITH
	 * COMP CREATION COMPLETE METHOD.
	 */
	Assembler.prototype.onGlobalCompCreationComplete = function(objData) {
		var parentId, objComp, objChild = {}, objComponentData = {};
		if (this.globalCompDict === undefined) {
			this.globalCompDict = {};
		}

		if (objData.jsonData.type !== PictorConst.SCREEN) {
			objComp = new objData.compData.componentRef(objData.compData.defaultData);
			objChild.component = objComp;
			objChild.parent = objData.jsonData.parentId;
		}
		switch(objData.jsonData.type) {

		default:
			this.objGlobalScreenRef.addChild(objChild);
			this.objGlobalScreenRef[objData.jsonData.id] = objComp;
			if (objData.jsonData.style !== undefined) {
				this.applyStyleProperty(objComp, objData.jsonData.style);
			}
			this.applyHtmlAttributes(objComp, objData.jsonData.html);
			break;
		}

		objComponentData = {};
		objComponentData.parentId = objData.jsonData.parentId;
		objComponentData.objComp = objComp;
		objComponentData.jsonData = objData.jsonData;
		objComponentData.type = objData.jsonData.type;

		//assign id to component.
		objComp.setID(objData.jsonData.id);
		//assign id to component first child.
		$($(objComp.el).children()[0]).attr("id", objData.jsonData.id);

		this.globalCompDict[objComp.getID()] = objComponentData;
		this.compCounter = this.compCounter + 1;
		this.objSimEventController.registerComponentEvents(objComponentData, true);
	};

	/**
	 * will load the helper file.
	 * @param {String} strHelperPath
	 * @return none
	 * @access private
	 * @memberof Assembler#
	 */
	Assembler.prototype.requireHelper = function(strHelperPath) {
		var objClassRef = this;
		//require the screen helper class
		require([strHelperPath], function(ScreenClass) {
			objClassRef.objScreenHelper = new ScreenClass();
			objClassRef.objScreenHelper.model = objClassRef.objActivity.model;

			objClassRef.objActivity.objScreenHelper = objClassRef.objScreenHelper;
			objClassRef.objScreenHelper.objActivity = objClassRef.objActivity;

			//now assembler will create component
			objClassRef.getComponent(objClassRef.arrCompToBeCreated[0]);

			//if 'onScreenPreInitalization' method is implemented in Helper file then
			//it will be invoked.
			if (objClassRef.objScreenHelper.onScreenPreInitalization !== undefined && objClassRef.bEditor === false) {
				objClassRef.objScreenHelper.onScreenPreInitalization.apply(objClassRef.objScreenHelper);
			}
		});
	};

	/**
	 * Invoked when a component created successfully and added into the DOM
	 * this method also responsible to create remaining component and
	 * when all component created then  'COMP_CREATED_IN_EDITOR_MODE'  or
	 * 'COMP_CREATION_COMPLETE' event will be triggred.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof Assembler#
	 */
	Assembler.prototype.handleCompCreation = function() {
		var objCompJsonNode;

		if (this.arrCompToBeCreated.length > this.compCounter) {
			this.getComponent(this.arrCompToBeCreated[this.compCounter]);
		} else {
			if (this.bEditorModeCompCreation !== true) {
				this.eventDispatcher(Assembler.COMP_CREATION_COMPLETE);
				$(this.objScreenRef.$el).removeClass("hide");
				this.objActivity.isScreenInitalized = true;
			} else {
				if (this.compCounter >= this.arrCompToBeCreated.length) {
					this.bEditorModeCompCreation = false;
					this.objEditorModeComponent.parentId = this.objEditorModeComponent.parentData;
					objCompJsonNode = this.objJsonUtil.getComponentJSONDataById(this.objEditorModeComponent.parentId, this.jsonData);
					if (objCompJsonNode !== undefined) {
						objCompJsonNode.node.components = (objCompJsonNode.node.components === undefined) ? [] : objCompJsonNode.node.components;
						if (objCompJsonNode.node.components.indexOf(this.objEditorModeComponent.compJSON) === -1) {
							objCompJsonNode.node.components.push(this.objEditorModeComponent.compJSON);
						}
					}
					this.eventDispatcher(Assembler.COMP_CREATED_IN_EDITOR_MODE, objCompJsonNode.node);
					//will update property editor
					this.eventDispatcher(Assembler.EDIT_DOM_LAYOUT_UPDATED, {});
				}
				this.objEditorModeComponent = null;
			}
		}
	};

	/**
	 * method 'executeAllChildAddedEvent' is responsible to invoke onUpdateComplete
	 * method for all components in reverse order.
	 * We are calling 'onUpdateComplete' method in reverse order to ensure that
	 * all child components are created when parent component 'update complete' method called.
	 * @param none
	 * @return none
	 * @memberof #Assembler
	 * @access private
	 */
	Assembler.prototype.executeAllChildAddedEvent = function() {
		var objClassRef = this, arrTemp = [], i;
		$.each(this.compDict, function(key, objCompRef) {
			if (objCompRef.type !== PictorConst.SCREEN) {
				if (objCompRef.jsonData.data.linked !== undefined) {
					objCompRef.objComp.linkedWith(objClassRef.compDict[objCompRef.jsonData.data.linked].objComp);
				}
				arrTemp.push(objCompRef.objComp);
				//objCompRef.objComp.onUpdateComplete();
			}
		});

		for ( i = arrTemp.length - 1; i >= 0; i = i - 1) {
			arrTemp[i].onUpdateComplete();
		}
	};

	/**
	 * Invoked everytime when a component event (mentiond in json file) registration complete with
	 * sim-event-controller.
	 *@parma {Object} objEvent
	 * @return none
	 * @access private
	 * @memberof Assembler
	 */
	Assembler.prototype.onCompEventRegisterComplete = function(objEvent) {
		if (objEvent !== true) {
			if (this.arrCompToBeCreated.length > this.compCounter) {
				this.getComponent(this.arrCompToBeCreated[this.compCounter]);
			} else {
				if (this.objScreenHelper !== undefined) {
					this.initScreenHelperData();
				} else {
					this.eventDispatcher(Assembler.COMP_CREATION_COMPLETE);
					$(this.objScreenRef.$el).removeClass("hide");
					this.objActivity.isScreenInitalized = true;
				}
				this.arrCompToBeCreated = [];
				this.compCounter = 0;
			}
		} else {
			if (this.arrCompToBeCreated.length > this.compCounter) {
				this.getComponent(this.arrCompToBeCreated[this.compCounter]);
			} else {
				this.eventDispatcher(Assembler.GLOBAL_COMP_CREATED, {});
				this.arrCompToBeCreated = [];
			}
		}
	};

	/**
	 * init screen helper
	 * @param none
	 * @return none
	 * @access private
	 * @membeof Assembler#
	 */
	Assembler.prototype.initScreenHelperData = function() {
		this.objScreenHelper.PopupManager = this.objActivity.PopupManager;
		this.objActivity.objScreenHelper = this.objScreenHelper;
		this.objScreenHelper.objActivity = this.objActivity;
		this.eventDispatcher(Assembler.COMP_CREATION_COMPLETE);
		//console.log("comp_dict...........", this.compDict);
		//$.each(this.compDict, function(key, objCompRef) {}

		$(this.objScreenRef.$el).removeClass("hide");
		this.objActivity.isScreenInitalized = true;
		if (this.bEditor === false) {
			this.executeAllChildAddedEvent();
		}

		if (this.objScreenHelper.onScreenInitComplete !== undefined) {
			this.objScreenHelper.onScreenInitComplete.apply(this.objScreenHelper);
		}
		if (this.objScreenHelper.init !== undefined) {
			this.objScreenHelper.init.apply(this.objScreenHelper);
		}
	};

	/**
	 * This method is responsible to apply css property to a component.
	 * @param {Object} objComp where new CSS property needs to be apply.
	 * @param {Object} styleObject
	 * @access private
	 * @memberof Assembler#
	 */
	Assembler.prototype.applyStyleProperty = function(objComp, styleObject) {
		if (styleObject !== undefined) {
			if (objComp.setStyle !== undefined) {
				objComp.setStyle(styleObject);
			}
		}
	};

	/**
	 * This method is responsible to update html attributes to component.
	 * @param {Object} objComp where HTML property needs to be apply.
	 * @param {Object} styleObject
	 * @access private
	 * @memberof Assembler#
	 */
	Assembler.prototype.applyHtmlAttributes = function(objComp, htmlAttributes) {
		if (htmlAttributes !== undefined) {
			if (objComp.setHtmlAttr !== undefined) {
				objComp.setHtmlAttr(htmlAttributes);
			}
		}
	};

	/**
	 * Help 'Assembler' class to dispatch a event
	 * @param {Object} strEvent "event name"
	 * @param {Object} data 'data/value if require to pass with event'
	 * @access private
	 * @memberof Assembler#
	 */
	Assembler.prototype.eventDispatcher = function(strEvent, data) {
		var objEventData = {};
		objEventData.type = strEvent;
		objEventData.data = data;
		this.trigger(objEventData.type, objEventData);
	};

	/**
	 * Method setStageScaleValue will be invoked everytime when application resize
	 * and scaling property is activated from the player config.
	 *
	 * This method is responsible to updated all pictor engine component with new
	 * stage scale value.
	 *
	 * @param {Number} nScaleValue new updated application scaled value.
	 * @return {none}
	 */
	Assembler.prototype.setStageScaleValue = function(nScaleValue) {
		$.each(this.compDict, function(key, objCompRef) {
			if (objCompRef.type !== PictorConst.SCREEN) {
				if (objCompRef.objComp.setStageScaleValue !== undefined) {
					objCompRef.objComp.setStageScaleValue(nScaleValue);
				}
				if (objCompRef.objComp.onPlayerResizeEvent !== undefined) {
					objCompRef.objComp.onPlayerResizeEvent();
				}
			}
		});
	};

	/** -------------------------EDITOR------------------------------ **/

	/**
	 * this method is responsible to set the mode of a component.
	 * add selector and its event when player is running in edit mode.
	 * @param {Object} objComponent comp reference
	 * @param {Boolean} isScreen
	 */
	Assembler.prototype.enableCompEditMode = function(objComponent, isScreen) {
		var componentSelector = new CompSelector();
		objComponent.$el.prepend(componentSelector.$el);
		componentSelector.$el.addClass('selectorStyle');
		componentSelector.render();
		componentSelector.onShow();
		this.objSelectorDict[objComponent.getID()] = componentSelector;
		componentSelector.setChildElement(objComponent);
		objComponent.selectComponent();
		objComponent.componentSelector = componentSelector;
		this.objSimEventController.registerSelectorEvent(objComponent);
	};

	/**
	 * return the selector reference based on the provided component id
	 * @param {String} strCompId
	 * @return {Object} component selector reference
	 */
	Assembler.prototype.getSelectorRef = function(strCompId) {
		return this.objSelectorDict[strCompId];
	};

	Assembler.prototype.editComponent = function(objEventData) {
		var compData = objEventData.compData;
		this.editorController.editComponent(this.getCompRefById(compData.compId), compData);
	};

	/**
	 * Responsible to create new component in edit mode only.
	 * @access private
	 * @memberof Assembler#
	 */
	Assembler.prototype.createComponent = function(objCompData) {
		var objParentNode = this.objJsonUtil.getComponentJSONDataById(objCompData.parentId, this.jsonData).node;
		if (objCompData.wizardExistingChild !== true && objParentNode && objParentNode.type === "wizard") {
			this.isWizardChildAdded = true;
			if (objParentNode.components.length > 0) {
				this.detachComponent(objParentNode.components[objParentNode.currentIndex].id, objParentNode.id);
			}
		}
		this.arrCompToBeCreated = this.getComponentList(objCompData.compJSON, []);
		this.compCounter = 0;
		this.bEditorModeCompCreation = true;
		this.objEditorModeComponent = objCompData;
		this.getComponent(this.arrCompToBeCreated[0]);
	};

	Assembler.prototype.checkIfCompAddedInWizard = function(objComponentData) {
		this.isWizardChildAdded = false;
		var childNode, objParentNode = this.objJsonUtil.getParentId(objComponentData.jsonData.id, this.jsonData);
		objParentNode = this.objJsonUtil.getComponentJSONDataById(objParentNode, this.jsonData).node;
		childNode = this.objJsonUtil.getComponentJSONDataById(objComponentData.jsonData.id, this.jsonData);
		objParentNode.currentIndex = childNode.index;
		this.wizardChildRoot = undefined;
	};

	/**
	 * Return the component json data based on the provided id.
	 * @param {Stirng} strCompId
	 * @return {JSON Data} compData
	 * @access private
	 * @memberof #Assembler
	 */
	Assembler.prototype.getComponentDataById = function(strCompId) {
		//return this.objJsonUtil.getComponentJSONDataById(strCompId, this.jsonData).node;
		return this.jsonDictById[strCompId];
	};

	/**
	 * Retunrn the component reference by id.
	 * @param {String} strCompId
	 * @return {Object} component reference
	 */
	Assembler.prototype.getCompRefById = function(strCompId) {
		return this.compDict[strCompId].objComp;
	};

	/**
	 * Removing components, associated reference and evetns.
	 * @access private
	 * @memberof Assembler#
	 */
	Assembler.prototype.removeComponent = function(strCompId, strParentId, bWizardViewChange) {
		//TODO:very important // need to check again that every object and its associated
		//events are removing properly.
		var i, compListToDelete = [], objSelectorRef, objChild, childIndex, parentObjectRef;
		compListToDelete = this.getComponentList(this.jsonDictById[strCompId], []);

		//childIndex = this.jsonDictById[strParentId].components.indexOf(this.jsonDictById[strCompId]);
		for ( i = compListToDelete.length - 1; i >= 0; i = i - 1) {
			if (compListToDelete[i].state !== "detached") {
				objChild = this.getCompRefById(compListToDelete[i].id);
				strCompId = objChild.getID();
				if (this.bEditor === false) {
					//removing child events
					objChild.jsonData = compListToDelete[i];
					this.objSimEventController.unregisterComponentEvents(this.compDict[strCompId]);
				}
				if (this.bEditor === true) {
					parentObjectRef = this.compDict[this.objJsonUtil.getParentId(compListToDelete[i].id, this.jsonData)].objComp;
					if (parentObjectRef.displayObject) {
						parentObjectRef.removeChild(objChild.getID());
					}
					this.objJsonUtil.removeJSONNode(strCompId, this.jsonData);
					delete this.jsonDictById[strCompId];
					this.objSimEventController.removeSelectorEvent(objChild);
					objSelectorRef = this.objSelectorDict[strCompId];
					$(objSelectorRef.el).remove();
					objSelectorRef = null;
					delete this.objSelectorDict[objChild.getID()];
				}
				delete this.compDict[strCompId];
				objChild.destroy();
				$(objChild.el).remove();
				objChild = null;
			}
		}

		//delete this.wizardJsonInEditMode[strCompId];
		if (this.jsonDictById[strParentId].type === "wizard" && this.bEditor === true && bWizardViewChange === undefined) {
			this.setWizardViewAfterDelete(strParentId, childIndex, this.jsonData, strCompId);
		}
		this.eventDispatcher(Assembler.COMPONENT_REMOVED_FROM_DOM, strCompId);
	};

	/**
	 * Method 'getChildrenTab' is responbile to create tab button
	 * which is related to given component reference
	 */
	Assembler.prototype.getChildrenTab = function(objParnetRef, objCompData) {
		var strBtnDiv, parentDiv;
		strBtnDiv = $("<div align='center' id='TabBtnEditor_" + objCompData.objComp.getID() + "' style='position:relative; display:inline-block;width:20px; cursor:pointer; border:1px solid #CCCCCC; background-color:#EEEEEE; font-size:10px;' title='" + objCompData.objComp.getID() + "'>T</div>");
		if (objParnetRef && objCompData.jsonData.parentId === undefined) {
			if (this.objActivity.objScreen[objParnetRef.getID() + "tab"] === undefined) {
				parentDiv = $('<div id="tabBtnHolder_Editor" align="left" style="display:none;width:100%;height:20px; position:absolute; z-index:1; top:0px; left:0px;"/>');
				objParnetRef.$el.append(parentDiv);
				this.objActivity.objScreen[objParnetRef.getID() + "tab"] = parentDiv;
			} else {
				parentDiv = this.objActivity.objScreen[objParnetRef.getID() + "tab"];
			}
			parentDiv.append(strBtnDiv);
			//this.objChildrenTab[objCompData.objComp.getID()] = strBtnDiv;
			this.objSimEventController.registerTabBtnEvent(strBtnDiv);
		} else {
			if (this.objActivity.objScreen[objCompData.jsonData.parentId] === undefined) {
				parentDiv = $('<div id="tabBtnHolder_Editor" align="left" style="display:none;width:100%;height:20px; position:absolute; z-index:1; top:0px; left:0px;"/>');
				this.objActivity.objScreen[objCompData.jsonData.parentId] = parentDiv;
				this.objActivity.objScreen.$el.append(parentDiv);
			} else {
				parentDiv = this.objActivity.objScreen[objCompData.jsonData.parentId];
			}
			//this.objChildrenTab[objCompData.objComp.getID()] = strBtnDiv;
			parentDiv.append(strBtnDiv);
			this.objSimEventController.registerTabBtnEvent(strBtnDiv);
		}
	};

	/**
	 * managing cut copy paste move up and down related task
	 */
	Assembler.prototype.domLayoutUpdateEvent = function(objEvent) {
		var objElement = this.getCompRefById(objEvent.compData.node.id), objCompJsonNode;
		switch(objEvent.compData.task) {

		case this.objActivity.ActivityEventConst.EDIT_DOM_LAYOUT_MOVE_UP:
			objElement.$el.after(objElement.$el.prev());
			this.eventDispatcher(Assembler.EDIT_DOM_LAYOUT_UPDATED, objEvent);
			break;

		case this.objActivity.ActivityEventConst.EDIT_DOM_LAYOUT_MOVE_DOWN:
			objElement.$el.before(objElement.$el.next());
			this.eventDispatcher(Assembler.EDIT_DOM_LAYOUT_UPDATED, objEvent);
			break;

		case this.objActivity.ActivityEventConst.EDIT_DOM_LAYOUT_CUT:
			this.memoryObjRef.type = this.objActivity.ActivityEventConst.EDIT_DOM_LAYOUT_CUT;
			this.memoryObjRef.element = objElement.$el.detach();
			objCompJsonNode = this.objJsonUtil.getComponentJSONDataById(objEvent.compData.node.id, this.jsonData);
			//objCompJsonNode.parent.splice(objCompJsonNode.index, 1);
			this.removeComponent(objCompJsonNode.node.id, objCompJsonNode.parentId);
			break;

		case this.objActivity.ActivityEventConst.EDIT_DOM_LAYOUT_PASTE:
			if (this.memoryObjRef.type === this.objActivity.ActivityEventConst.EDIT_DOM_LAYOUT_CUT) {
				objElement.$el.append(this.memoryObjRef.element);
				this.memoryObjRef = {};
				this.memoryObjRef.type = "";
				objCompJsonNode = this.objJsonUtil.getComponentJSONDataById(objEvent.compData.node.id, this.jsonData);
				this.objJsonUtil.appendChildComponent(objCompJsonNode.node, objEvent.compData.childElement);
				this.eventDispatcher(Assembler.EDIT_DOM_LAYOUT_UPDATED, objEvent);
			}

			break;
		}
	};

	Assembler.prototype.getChildComponentListAndData = function() {
		var arrDataToSend = [], objData = {};
		$.each(this.compDict, function(key, objCompRef) {
			objData = {};
			objData.id = key;
			objData.type = objCompRef.objComp.componentType;
			objData.name = objCompRef.jsonData.name;
			arrDataToSend.push(objData);
		});
		objData = {};
		objData.id = "self";
		objData.type = "self";
		arrDataToSend.push(objData);

		return arrDataToSend;
	};

	Assembler.prototype.detachComponent = function(strCompId, strParentId) {
		var i, compListToDelete = [], objSelectorRef, objChild, childIndex;
		compListToDelete = this.getComponentList(this.jsonDictById[strCompId], []);

		for ( i = compListToDelete.length - 1; i >= 0; i = i - 1) {
			objChild = this.getCompRefById(compListToDelete[i].id);
			strCompId = objChild.getID();
			if (this.bEditor === false) {
				//removing child events
				objChild.jsonData = compListToDelete[i];
				this.objSimEventController.unregisterComponentEvents(this.compDict[strCompId]);
			}
			if (this.bEditor === true) {
				this.objSimEventController.removeSelectorEvent(objChild);
				objSelectorRef = this.objSelectorDict[strCompId];
				$(objSelectorRef.el).remove();
				objSelectorRef = null;
				delete this.objSelectorDict[objChild.getID()];
			}
			delete this.compDict[strCompId];
			objChild.destroy();
			$(objChild.el).remove();
			objChild = null;
		}
		this.eventDispatcher(Assembler.COMPONENT_REMOVED_FROM_DOM, strCompId);
	};

	/**
	 * This method will be executed everytime when wizard child component deleted and
	 * responsible to launch next posssible wizard view.
	 * @param {String} parent Id
	 * @param {Number} child Index
	 * @param {Obect} wizard json data
	 * @param {String} child component id
	 */
	Assembler.prototype.setWizardViewAfterDelete = function(strParentId, childIndex, jsondata, strChildId) {
		var objCompJsonNode, index, arrCompList, wizardJson = this.getComponentDataById(strParentId), objDataToPrepare = {};

		index = wizardJson.currentIndex;
		this.objJsonUtil.removeJSONNode(strChildId, wizardJson);
		//need to check
		if (index < 0 || index >= wizardJson.components.length) {
			if (index < 0) {
				index = 0;
			} else if (index >= wizardJson.components.length) {
				index = wizardJson.components.length - 1;
			}
		}
		wizardJson.currentIndex = index;
		arrCompList = wizardJson.components;
		if (arrCompList.length > 0) {
			this.objJsonUtil.updateAttachState(arrCompList, 0, undefined, undefined, "detached");
			this.objJsonUtil.updateAttachState([arrCompList[index]], 0, undefined, undefined, "attached");

			objDataToPrepare.wizardExistingChild = true;
			objDataToPrepare.compJSON = arrCompList[index];
			objDataToPrepare.parentId = strParentId;
			this.createComponent(objDataToPrepare);
			this.getComponentDataById(strParentId).components = wizardJson.components;

		}
	};

	/** -------------------------END EDITOR------------------------------ **/

	/**
	 * This method is introduced to help to redraw wizard childrend items runtime
	 * @param {Object} objData
	 * @return none
	 * @access private
	 * @memberof Assembler
	 */
	Assembler.prototype.changeWizardView = function(objData) {
		var objDataToPrepare = {}, arrCompList, strCompToDelete;
		arrCompList = this.getComponentDataById(objData.compId).components;
		this.objJsonUtil.updateAttachState(arrCompList, 0, undefined, undefined, "detached");
		this.objJsonUtil.updateAttachState([arrCompList[objData.nextIndex]], 0, undefined, undefined, "attached");

		strCompToDelete = arrCompList[this.getComponentDataById(objData.compId).currentIndex].id;
		this.detachComponent(strCompToDelete, objData.parentId);

		this.getComponentDataById(objData.compId).currentIndex = objData.nextIndex;
		objDataToPrepare.compJSON = arrCompList[objData.nextIndex];
		objDataToPrepare.parentId = objData.compId;
		objDataToPrepare.wizardExistingChild = true;
		this.createComponent(objDataToPrepare);
	};

	Assembler.prototype.getHtmlText = function() {
		var mergeText = "";
		$.each(this.objActivity.objScreen.$el, function(index, obj) {
			var $this = $(this);
			mergeText = $this.html();
		});
		return mergeText;
	};
	/**
	 * Flush the assembler object and reference.
	 * @param none
	 * @return {Boolean} true if success
	 */
	Assembler.prototype.flush = function() {
		var i = 0, bSuccess, objChild, objClassRef = this;
		this.compCounter = 0;
		$.each(this.compDict, function(key, objCompRef) {
			if (objCompRef.type !== PictorConst.SCREEN) {
				bSuccess = objClassRef.objSimEventController.unregisterComponentEvents(objCompRef);
			}
		});

		$.each(this.compDict, function(key, objCompRef) {
			objChild = {};
			objChild.component = objCompRef.objComp;
			objClassRef.objSimEventController.removeSelectorEvent(objCompRef.objComp);
			objChild.parent = objCompRef.parentId;
			objClassRef.objActivity.objScreen.removeChild(objChild);
			objCompRef.objComp.destroy();
		});

		bSuccess = this.objSimEventController.unregisterScreenCompEvnets(this.compDict[this.objActivity.objScreen.getID()]);

		if (bSuccess === true) {
			if (this.objScreenHelper !== undefined) {
				this.objScreenHelper.destroy();
				this.objScreenHelper = null;
			}
			this.objSelectorDict = {};
			this.objActivity.screenHolder.close();
			this.objActivity.objScreen.destroy();
			this.objActivity.objScreen = null;
			this.arrScreenCompList = [];
			//will be deleted.
			this.compDict = {};
		}
		return bSuccess;
	};

	/**
	 * Destroy assembler, associated events and components.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof Assembler#
	 */
	Assembler.prototype.destroy = function() {
		var objClassRef = this, bSuccess;
		bSuccess = this.flush();
		if (bSuccess === false) {
			throw new Error(PictorConst.ERROR_WHILE_DESTROY_ASSEMBLER);
		}
		this.objFactory.off(this.objFactory.COMP_CREATION_COMPLETE_EVENT);
		this.editorController.off(this.editorController.SIM_COMP_CREATION_COMPLETE);
		this.editorController = null;
		this.objActivity.objScreen = null;
		return bSuccess;
	};
	return Assembler;

});
