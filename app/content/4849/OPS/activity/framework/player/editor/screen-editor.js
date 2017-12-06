/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * ScreenEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/base-editor'], function(Marionette, BaseEditor) {'use strict';
	var ScreenEditor;

	/**
	 * ScreenEditor is responsible to load and return Screen component class
	 * signature and also prepare default data which is required by an Screen
	 * to initlized itself
	 *
	 *@augments ScreenEditor
	 *@example
	 *Load module
	 *
	 var ScreenEditor = BaseEditor.extend({

	 ScreenEditor.prototype.getComponent = function(compData) {
	 //Asking to BaseEditor to create a component
	 this.createCompData($(compData));
	 };

	 };

	 return ScreenEditor;
	 */

	ScreenEditor = BaseEditor.extend({
		defaultCompData : {}
	});

	/**
	 * Will be invoked by Editor when an SliderComponent needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof ScreenEditor
	 * @access private
	 */
	ScreenEditor.prototype.getComponent = function(compData, isSimComp) {
		this.isSimComp = isSimComp;
		//Asking to BaseEditor to create a component
		var objData = (compData.data !== undefined) ? compData : $(compData);
		objData = (objData.length === undefined)?objData:objData[0];
		this.createCompData(objData);
	};

	/**
	 * Preparing constructor data for Slider component which will be passed to slider
	 * through its constructor method.
	 * @param {Object} compData
	 * @return none
	 * @memerof ScreenEditor
	 * @access private
	 */
	ScreenEditor.prototype.createCompData = function(compData) {
		this.defaultCompData = this.prepareDefaultData(compData);
		this.createComponent(compData);
	};

	/**
	 * Overriding 'BaseEditor' method to get notifiy when sliderComponent class is
	 * required successfully.
	 * This method is also resposible to append default data for slider component
	 * in objComponent (received as parameter when component created successfully)
	 *
	 * @param {Object} objComponent Screen coponent class signature
	 * @return none
	 * @memberof ScreenEditor
	 * @access private
	 */
	ScreenEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};

	/**
	 * This method destroy the sliderEditor class.
	 * @param none
	 * @return none
	 * @memberof ScreenEditor
	 * @access private
	 */
	ScreenEditor.prototype.destroy = function() {
		return ScreenEditor.__super__.destroy(true, this);
	};

	return ScreenEditor;
});
