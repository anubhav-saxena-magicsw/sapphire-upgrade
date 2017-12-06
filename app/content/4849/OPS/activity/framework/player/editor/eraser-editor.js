/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * EraserEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/button-editor'], function(Marionette, ButtonEditor) {'use strict';
	var EraserEditor;

	/**
	 * EraserEditor is responsible to load and return Case component class
	 * signature and also prepare default data which is required by an Case
	 * to initlized itself
	 *
	 *@augments EraserEditor
	 *@example
	 *Load module
	 *
	 var objEraserEditor = ButtonEditor.extend({

	 EraserEditor.prototype.getComponent = function(compData) {
	 //Asking to ButtonEditor to create a component
	 this.createCompData($(compData));
	 };

	 };

	 return objEraserEditor;
	 */

	EraserEditor = ButtonEditor.extend({
		defaultCompData : {}
	});

	/**
	 * Will be invoked by Editor when an CaseComponent needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof EraserEditor
	 * @access private
	 */
	EraserEditor.prototype.getComponent = function(compData, isSimComp) {
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
	 * @memerof EraserEditor
	 * @access private
	 */
	EraserEditor.prototype.createCompData = function(compData) {
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
	 * @memberof EraserEditor
	 * @access private
	 */
	EraserEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};

	/**
	 * This method destroy the EraserEditor class.
	 * @param none
	 * @return none
	 * @memberof EraserEditor
	 * @access private
	 */
	EraserEditor.prototype.destroy = function() {
		return EraserEditor.__super__.destroy(true, this);
	};

	return EraserEditor;
});
