/*jslint nomen: true*/
/* globals Backbone,_,$, console Data_Loader*/

/**
 * BaseEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/factory/factory', 'player/constants/errorconst', 'player/controllers/path-updater'], function(Marionette, Factory, errorConst, PathUpdater) {
	'use strict';
	var BaseEditor, extend;
	/**
	 * Class 'BaseEditor' is introduce to help component editor, and
	 * each component editor class must be extended by this class.
	 *
	 * A editor class is a class which will be responsbile to create a
	 * component based on provided parameter  in html file. Each
	 * MComp type component will have their own editor.
	 *
	 * This class (BaseEditor) is having few basic method to create a
	 * component, preparing default data by reading provided string in
	 * HTML, ask factory to create a object and also will notify the
	 * 'editor controller class when a component created with customize
	 * dataObject.
	 */
	
	BaseEditor = function(regionId) {
		this.bEditor = false;
		this.objComp = undefined;
		this.compType = undefined;
		this.regionId = regionId;
		this.objPathUpdater = PathUpdater.getInstance();
		this.objFactory = new Factory();
		this.rootRef = this;
		this.errorConst = errorConst;
		this.isDestroyCalled = false;
		this.objFactory.on(this.objFactory.COMP_CREATION_COMPLETE_EVENT, this.rootRef.onComponentCreationComplete, this);

		return _.extend(this, Backbone.Events);
	};

	BaseEditor.prototype.ID = "id";
	BaseEditor.prototype.COMP_NAME = "compname";
	BaseEditor.prototype.ON_COMP_CREATED = "onComponentCreationComplete";

	/**
	 * Creating an object of default data which is provided with the html entry in
	 * string format.
	 * @param {Object} compData component data
	 * @return {Object} objCompData modified component data
	 * @access private
	 */
	BaseEditor.prototype.prepareDefaultData = function(compData, callback, context) {
		var objCompData = {}, arrAttrList, i, splitData;
		objCompData.target = this;
		if (compData.attr === undefined) {//compData.data !== undefined) {
			objCompData = compData.data;
			//return objCompData;
		} else {
			if (compData.attr("defaultData") === undefined) {
				return undefined;
			}
			objCompData = $.parseJSON(compData.attr("defaultData"));
		}

		if (callback !== undefined) {
			callback(context, objCompData);
		} else {
			return objCompData;
		}

	};

	/**
	 * This method is binded with the 'COMP_CREATION_COMPLETE_EVENT' event which
	 * fired by object factory when a component created successfully.
	 * This method must be overidden its child class to listen a event creation complete
	 * event.
	 *
	 * @param {Object} objEvent
	 * @return none
	 * @memberof BaseEditor
	 */
	BaseEditor.prototype.onComponentCreationComplete = function(objEvent) {
	};

	/**
	 * Asking factory to create a component based on the provided data.
	 *
	 * @param {Object} compData
	 * @return none
	 * @access private
	 * @memberof BaseEditor
	 */
	BaseEditor.prototype.createComponent = function(compData) {
		var objCompData = {};
		if (compData.attr === undefined) {
			objCompData[this.ID] = compData.id;
			objCompData.strCompType = compData.type;
		} else {
			objCompData[this.ID] = compData.attr(this.ID);
			objCompData.strCompType = compData.attr(this.COMP_NAME);
		}
		this.objFactory.createComponent(objCompData);
	};

	/**
	 * method 'appendChild' will be invoke when dom element is rendered and
	 * shown, to make sure complete the life cycle of a component.
	 *
	 * This method also help to create component in different way. e.g if a component
	 * needs to work as controller object or when an non visual component required
	 * then this method can be overridden in its child class and new instruction can be
	 * provied in that method.
	 *
	 * This method is returning boolean value
	 *
	 * True means activityController class call objComp.show() method to make sure the append
	 * this component in DOM element
	 *
	 * false means activityController will not call objComp.show() method and allow this component
	 * to behave in its own way.
	 *
	 * @param {String} htmlData DOM reference
	 * @param {Object} objCompData  component required data as provided in attributes
	 * @param {Object} objComp component signature class.
	 * @return {Boolean} true|false
	 *
	 * @access private
	 * @memberof BaseEditor
	 */
	BaseEditor.prototype.appendChild = function(htmlData, objCompData, objComp) {
		var objCompDiv, objCompDivParent, regionDiv, style, strClass;
		objCompDiv = $(htmlData).find('[id=' + objCompData.id + ']');
		objCompDivParent = objCompDiv.parent();
		style = objCompDiv.attr("style");
		strClass = objCompDiv.attr("class");
		if (strClass !== undefined) {
			objComp.$el.addClass(strClass);
		}

		if (style !== undefined) {
			objComp.$el.attr('style', style);
		}
		(objComp.$el).insertBefore(objCompDiv);

		//now component information is not required so we are deleting
		$(objCompDiv).remove();
		objCompDiv = undefined;
		return true;
	};

	/**
	 * This method must be called by its child class when a component class file data
	 * received within its editor classs.
	 * This method is responsible to notify EditorController class with custom object.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof BaseEditor
	 */
	BaseEditor.prototype.componentCreated = function() {
		this.objComp.target = this;
		this.trigger(this.ON_COMP_CREATED, this.objComp);
	};

	/**
	 * Destroy the BaseEditor class and event, this method
	 * must be overridden by its child class to complete the life cycle
	 * of a editor class.
	 *
	 * if ChildEditorClass does not override this method then an error
	 * will be thrown in runtime.
	 *
	 * Uses:
	 * ChildEditor.prototype.destroy(ChildEditor, this);
	 *
	 * @param {Boolean} bChildDestroyed must be set to true from its child class
	 * @param {Object} ref child reference object
	 * @return {Boolean} true
	 */
	BaseEditor.prototype.destroy = function(bChildDestroyed, ref) {
		//console.log("super class Destory method!!!!!!!!", ref.testValue);
		if (bChildDestroyed !== true) {
			throw new Error(errorConst.DESTROY_NOT_IMPLMENENTED_IN_CHILD_CLASS);
		}
		if (ref.objFactory !== undefined) {
			ref.objFactory.off(ref.objFactory.COMP_CREATION_COMPLETE_EVENT);
		}
		ref.objComp = undefined;
		ref.compType = undefined;
		ref.objFactory = undefined;
		ref.rootRef = undefined;
		ref.errorConst = undefined;
		ref.isDestroyCalled = true;

		return ref.isDestroyCalled;
	};

	/**
	 * adding static method to allow to exated a component editor class to allow a
	 * child class to call a method wihout creating its object.
	 *
	 * User can inherit this call by using below syntext
	 *
	 * BaseEditor.exten({});
	 *
	 * @param {Object} protoProps
	 * @param {Object} staticProps
	 * @return {Object}
	 * @memberof BaseEditor
	 */
	extend = function(protoProps, staticProps) {
		var Surrogate, child, parent = this;

		// The constructor function for the new subclass is either defined by you
		// (the "constructor" property in your `extend` definition), or defaulted
		// by us to simply call the parent's constructor.
		if (protoProps && _.has(protoProps, 'constructor')) {
			child = protoProps.constructor;
		} else {
			child = function() {
				return parent.apply(this, arguments);
			};
		}

		// Add static properties to the constructor function, if supplied.
		_.extend(child, parent, staticProps);
		//_.extend(child, Backbone.Events);

		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		Surrogate = function() {
			this.constructor = child;
		};
		Surrogate.prototype = parent.prototype;
		child.prototype = new Surrogate();
		// Add prototype properties (instance properties) to the subclass,
		// if supplied.
		if (protoProps) {
			_.extend(child.prototype, protoProps);
			//_.extend(child.prototype, Backbone.Events);
		}

		// Set a convenience property in case the parent's prototype is needed
		// later.

		child.__super__ = parent.prototype;

		return child;
	};

	/**
	 * Method 'getTableData' is responsible to load table data xml with the help of
	 * DATA_LOADER object and pass the controll to 'successHandler' method for
	 * further initlization.
	 * @param none
	 * @return none
	 * @memberof TableEditor#
	 * @access private
	 */
	BaseEditor.prototype.loadData = function(strUrl, strDataType, strReturnType) {

		var objClassRef = this;
		Data_Loader.on(Data_Loader.DATA_LOAD_SUCCESS, $.proxy(objClassRef.successHandler, objClassRef));
		Data_Loader.on(Data_Loader.DATA_LOAD_FAILED, $.proxy(objClassRef.errorHandler, objClassRef));
		Data_Loader.load({
			url : strUrl,
			dataType : strDataType,
			contentType : 'application/xml',
			returnType : strReturnType,
			scope : objClassRef
		});
	};

	/**
	 * Method 'successHandler' will invoked when data xml loaded successfully with the help of
	 * data loader object.
	 * assign the loaded data in component default data in required format.
	 *
	 * If no item renderer required then this method pass the controll to 'createComponent'
	 * to initlizate component.
	 *
	 * @param {Obejct} data loaded table xml data.
	 * @return none
	 * @memberof TableEditor#
	 * @access private
	 */
	BaseEditor.prototype.successHandler = function(data) {
		Data_Loader.off(Data_Loader.DATA_LOAD_SUCCESS);
		Data_Loader.off(Data_Loader.DATA_LOAD_FAILED);
		this.onDataLoadSuccess(data);
	};
	/**
	 * Invoked when table xml data failed to load.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof TableEditor#
	 */
	BaseEditor.prototype.errorHandler = function() {
		Data_Loader.off(Data_Loader.DATA_LOAD_SUCCESS);
		Data_Loader.off(Data_Loader.DATA_LOAD_FAILED);
	};

	BaseEditor.prototype.setEditorMode = function(bEditor) {
		this.bEditor = bEditor;
	};

	BaseEditor.prototype.onDataLoadSuccess = function(objData) {

	};

	BaseEditor.prototype.updateExistingComponent = function(objComponent, objData) {
		var strAction = objData.actionKeys[1];
		if (strAction === "HTML") {
			if (objComponent.setHtmlAttr !== undefined) {
				objComponent.setHtmlAttr(objData.data);
			} else {
				console.warn("no setHtmlAttr method found!!!!");
			}
		} else {
			this.updateComponent(objComponent, objData);
		}
	};

	BaseEditor.prototype.updateComponent = function(objComponent, objData) {
	};

	BaseEditor.extend = extend;
	//_.extend(BaseEditor.extend, Backbone.Events);
	return BaseEditor;
});
