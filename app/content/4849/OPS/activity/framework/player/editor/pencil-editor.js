/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * PencilEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/button-editor'], function(Marionette, ButtonEditor) {'use strict';
	var PencilEditor;

	/**
	 * PencilEditor is responsible to load and return Case component class
	 * signature and also prepare default data which is required by an Case
	 * to initlized itself
	 *
	 *@augments PencilEditor
	 *@example
	 *Load module
	 *
	 var objPencilEditor = ButtonEditor.extend({

	 PencilEditor.prototype.getComponent = function(compData) {
	 //Asking to ButtonEditor to create a component
	 this.createCompData($(compData));
	 };

	 };

	 return objPencilEditor;
	 */

	PencilEditor = ButtonEditor.extend({
		defaultCompData : {}
	});

	/**
	 * Will be invoked by Editor when an CaseComponent needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof PencilEditor
	 * @access private
	 */
	PencilEditor.prototype.getComponent = function(compData, isSimComp) {
		this.isSimComp = isSimComp;
		//Asking to ButtonEditor to create a component
		var objData = (compData.data !== undefined) ? compData : $(compData);
		this.createCompData(objData);
	};

	/**
	 * Preparing constructor data for Case component which will be passed to Case
	 * through its constructor method.
	 * @param {Object} compData
	 * @return none
	 * @memerof PencilEditor
	 * @access private
	 */
	PencilEditor.prototype.createCompData = function(compData) {
		this.defaultCompData = this.prepareDefaultData(compData);
		
		/*
		if (this.defaultCompData === undefined) {
			throw new Error(this.errorConst.IMAGE_DEFAULT_DATA_MISSING);
		}
		*/
		this.createComponent(compData);
	};

	/**
	 * Overriding 'ButtonEditor' method to get notifiy when CaseComponent class is
	 * required successfully.
	 * This method is also resposible to append default data for Case component
	 * in objComponent (received as parameter when component created successfully)
	 *
	 * @param {Object} objComponent Case coponent class signature
	 * @return none
	 * @memberof PencilEditor
	 * @access private
	 */
	PencilEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};

	/**
	 * This method destroy the PencilEditor class.
	 * @param none
	 * @return none
	 * @memberof PencilEditor
	 * @access private
	 */
	PencilEditor.prototype.destroy = function() {
		return PencilEditor.__super__.destroy(true, this);
	};

	return PencilEditor;
});
