/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * CloseCaptionEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/base-editor'], function(Marionette, BaseEditor) {'use strict';
	var CloseCaptionEditor;

	/**
	 * CloseCaptionEditor is responsible to load and return CloseCaption component class
	 * signature and also prepare default data which is required by an CloseCaption
	 * to initlized itself
	 *
	 *@augments CloseCaptionEditor
	 *@example
	 *Load module
	 *
	 var objCloseCaptionEditor = BaseEditor.extend({

	 CloseCaptionEditor.prototype.getComponent = function(compData) {
	 //Asking to BaseEditor to create a component
	 this.createCompData($(compData));
	 };

	 };

	 return objCloseCaptionEditor;
	 */

	CloseCaptionEditor = BaseEditor.extend({
		defaultCompData : {}
	});

	/**
	 * Will be invoked by Editor when an CloseCaptionComponent needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof CloseCaptionEditor
	 * @access private
	 */
	CloseCaptionEditor.prototype.getComponent = function(compData, isSimComp) {
		this.isSimComp = isSimComp;
		//Asking to BaseEditor to create a component
		var objData = (compData.data !== undefined) ? compData : $(compData);
		this.createCompData(objData);
	};

	/**
	 * Preparing constructor data for CloseCaption component which will be passed to CloseCaption
	 * through its constructor method.
	 * @param {Object} compData
	 * @return none
	 * @memerof CloseCaptionEditor
	 * @access private
	 */
	CloseCaptionEditor.prototype.createCompData = function(compData) {
		if (compData.attr !== undefined && compData.attr("defaultData")) {
			var objDefaultData = $.parseJSON(compData.attr("defaultData"));
			if (!$.isEmptyObject(objDefaultData) && objDefaultData !== null) {
				this.defaultCompData = this.prepareDefaultData(compData);
			}
		}
		this.createComponent(compData);
	};

	/**
	 * Overriding 'BaseEditor' method to get notifiy when CloseCaptionComponent class is
	 * required successfully.
	 * This method is also resposible to append default data for CloseCaption component
	 * in objComponent (received as parameter when component created successfully)
	 *
	 * @param {Object} objComponent CloseCaption component class signature
	 * @return none
	 * @memberof CloseCaptionEditor
	 * @access private
	 */
	CloseCaptionEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};

	/**
	 * This method destroy the CloseCaptionEditor class.
	 * @param none
	 * @return none
	 * @memberof CloseCaptionEditor
	 * @access private
	 */
	CloseCaptionEditor.prototype.destroy = function() {
		return CloseCaptionEditor.__super__.destroy(true, this);
	};

	return CloseCaptionEditor;
});
