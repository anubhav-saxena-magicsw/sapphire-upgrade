/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * ScreenNavigatorEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['player/editor/base-editor'], function(BaseEditor) {'use strict';
	var ScreenNavigatorEditor;

	/**
	 * ScreenNavigatorEditor is responsible to load and return screen navigator component class
	 * signature and also prepare default data which is required by an screen navigator
	 * to initlized itself
	 *
	 *@augments ScreenNavigatorEditor
	 *@example
	 *Load module
	 *
	 var objScreenNavigatorEditor = BaseEditor.extend({

	 ScreenNavigatorEditor.prototype.getComponent = function(compData) {
	 //Asking to BaseEditor to create a component
	 this.createCompData($(compData));
	 };

	 };

	 return objScreenNavigatorEditor;
	 */

	ScreenNavigatorEditor = BaseEditor.extend({
		defaultCompData : {}
	});

	/**
	 * Will be invoked by Editor when an screen navigator component needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof ScreenNavigatorEditor
	 * @access private
	 */
	ScreenNavigatorEditor.prototype.getComponent = function(compData, isSimComp) {
		this.isSimComp = isSimComp;
		//Asking to BaseEditor to create a component
		var objData = (compData.data !== undefined) ? compData : $(compData);
		this.createCompData(objData);
	};

	/**
	 * Preparing constructor data for screen navigator component which will be passed to screen navigator
	 * through its constructor method.
	 * @param {Object} compData
	 * @return none
	 * @memerof ScreenNavigatorEditor
	 * @access private
	 */
	ScreenNavigatorEditor.prototype.createCompData = function(compData) {
		this.defaultCompData = this.prepareDefaultData(compData);
		if (this.defaultCompData === undefined) {
			throw new Error(this.errorConst.SCREEN_NAV_DEFAULT_DATA_MISSING);
		}
		this.createComponent(compData);
	};

	/**
	 * Overriding 'BaseEditor' method to get notifiy when screen navigator class is
	 * required successfully.
	 * This method is also resposible to append default data for screen navigator component
	 * in objComponent (received as parameter when component created successfully)
	 *
	 * @param {Object} objComponent screen navigator coponent class signature
	 * @return none
	 * @memberof SCREEN_NAV_DEFAULT_DATA_MISSING
	 * @access private
	 */
	ScreenNavigatorEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};

	/**
	 * This method destroy the ScreenNavigatorEditor class.
	 * @param none
	 * @return none
	 * @memberof ScreenNavigatorEditor
	 * @access private
	 */
	ScreenNavigatorEditor.prototype.destroy = function() {
		return ScreenNavigatorEditor.__super__.destroy(true, this);
	};

	return ScreenNavigatorEditor;
});
