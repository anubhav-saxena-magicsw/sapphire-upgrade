/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * MessageBoxEdit
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/base-editor'], function(Marionette, BaseEditor) {'use strict';
	var MessageBoxEditor;

	/**
	 * MessageBoxEditor is responsible to load and return message box component class
	 * signature and also prepare default data which is required by an message box
	 * to initlized itself
	 *
	 *@augments MessageBoxEditor
	 *@example
	 *Load module
	 *
	 var objMessageBoxEditor = BaseEditor.extend({

	 MessageBoxEditor.prototype.getComponent = function(compData) {
	 //Asking to BaseEditor to create a component
	 this.createCompData($(compData));
	 };

	 };

	 return objMessageBoxEditor;
	 */

	MessageBoxEditor = BaseEditor.extend({
		defaultCompData : {}
	});

	/**
	 * Will be invoked by Editor when an message box component needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof MessageBoxEditor
	 * @access private
	 */
	MessageBoxEditor.prototype.getComponent = function(compData, isSimComp) {
		this.isSimComp = isSimComp;
		//Asking to BaseEditor to create a component
		var objData = (compData.data !== undefined) ? compData : $(compData);
		this.createCompData(objData);
	};

	/**
	 * Preparing constructor data for message box component which will be passed to message box
	 * through its constructor method.
	 * @param {Object} compData
	 * @return none
	 * @memerof MessageBoxEditor
	 * @access private
	 */
	MessageBoxEditor.prototype.createCompData = function(compData) {
		this.defaultCompData = this.prepareDefaultData(compData);
		this.createComponent(compData);
	};

	/**
	 * Overriding 'BaseEditor' method to get notifiy when sliderComponent class is
	 * required successfully.
	 * This method is also resposible to append default data for slider component
	 * in objComponent (received as parameter when component created successfully)
	 *
	 * @param {Object} objComponent slider coponent class signature
	 * @return none
	 * @memberof MessageBoxEditor
	 * @access private
	 */
	MessageBoxEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};

	/**
	 * This method destroy the MessageBoxEditor class.
	 * @param none
	 * @return none
	 * @memberof MessageBoxEditor
	 * @access private
	 */
	MessageBoxEditor.prototype.destroy = function() {
		return MessageBoxEditor.__super__.destroy(true, this);
	};

	return MessageBoxEditor;
});
