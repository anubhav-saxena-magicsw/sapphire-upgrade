/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * PopupEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/base-editor'], function(Marionette, BaseEditor) {
	'use strict';
	var PopupEditor;

	/**
	 * PopupEditor is responsible to load and return popup component class
	 * signature and also prepare default data which is required by an popup
	 * to initlized itself
	 *
	 *@augments PopupEditor
	 *@example
	 *Load module
	 *
	 var objPopupEditor = BaseEditor.extend({

	 PopupEditor.prototype.getComponent = function(compData) {
	 //Asking to BaseEditor to create a component
	 this.createCompData($(compData));
	 };

	 };

	 return objPopupEditor;
	 */

	PopupEditor = BaseEditor.extend({
		defaultCompData : {}
	});

	/**
	 * Will be invoked by Editor when an PopupComponent needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof PopupEditor
	 * @access private
	 */
	PopupEditor.prototype.getComponent = function(compData, isSimComp) {
		this.isSimComp = isSimComp;
		//Asking to BaseEditor to create a component
		var objData = (compData.data !== undefined) ? compData : $(compData);
		this.createCompData(objData);
	};

	/**
	 * Preparing constructor data for Popup component which will be passed to Popup
	 * through its constructor method.
	 * @param {Object} compData
	 * @return none
	 * @memerof PopupEditor
	 * @access private
	 */
	PopupEditor.prototype.createCompData = function(compData) {
		this.defaultCompData = this.prepareDefaultData(compData);

		/*
		 if (this.defaultCompData === undefined) {
		 throw new Error(this.errorConst.IMAGE_DEFAULT_DATA_MISSING);
		 }
		 */
		this.createComponent(compData);
	};

	/**
	 * Overriding 'BaseEditor' method to get notifiy when POPUP class is
	 * required successfully.
	 * This method is also resposible to append default data for POPUP component
	 * in objComponent (received as parameter when component created successfully)
	 *
	 * @param {Object} objComponent popup coponent class signature
	 * @return none
	 * @memberof PopupEditor
	 * @access private
	 */
	PopupEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};

	PopupEditor.prototype.updateComponent = function(objComponent, objData) {
		console.log("!!!!!!!!!!updateComponent!!!!!", objComponent, objData.data);
		if (objData.type === "html") {
			if (objComponent.setHtmlAttr !== undefined) {
				console.log("settng property......");
				objComponent.setHtmlAttr(objData.data);
			}
		}
	};

	/**
	 * This method destroy the PopupEditor class.
	 * @param none
	 * @return none
	 * @memberof PopupEditor
	 * @access private
	 */
	PopupEditor.prototype.destroy = function() {
		return PopupEditor.__super__.destroy(true, this);
	};

	return PopupEditor;
});
