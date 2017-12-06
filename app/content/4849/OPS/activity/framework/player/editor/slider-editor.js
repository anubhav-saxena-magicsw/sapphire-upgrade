/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * SliderEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/base-editor'], function(Marionette, BaseEditor) {'use strict';
	var SliderEditor;

	/**
	 * SliderEditor is responsible to load and return slider component class
	 * signature and also prepare default data which is required by an slider
	 * to initlized itself
	 *
	 *@augments SliderEditor
	 *@example
	 *Load module
	 *
	 var objSliderEditor = BaseEditor.extend({

	 SliderEditor.prototype.getComponent = function(compData) {
	 //Asking to BaseEditor to create a component
	 this.createCompData($(compData));
	 };

	 };

	 return objSliderEditor;
	 */

	SliderEditor = BaseEditor.extend({
		defaultCompData : {}
	});

	/**
	 * Will be invoked by Editor when an SliderComponent needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof SliderEditor
	 * @access private
	 */
	SliderEditor.prototype.getComponent = function(compData, isSimComp) {
		this.isSimComp = isSimComp;
		//Asking to BaseEditor to create a component
		var objData = (compData.data !== undefined) ? compData : $(compData);
		this.createCompData(objData);
	};

	/**
	 * Preparing constructor data for Slider component which will be passed to slider
	 * through its constructor method.
	 * @param {Object} compData
	 * @return none
	 * @memerof sliderEditor
	 * @access private
	 */
	SliderEditor.prototype.createCompData = function(compData) {
		this.defaultCompData = this.prepareDefaultData(compData);
		if (this.defaultCompData === undefined) {
			throw new Error(this.errorConst.SLIDER_DEFAULT_DATA_MISSING);
		}
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
	 * @memberof sliderEditor
	 * @access private
	 */
	SliderEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};

	/**
	 * This method destroy the sliderEditor class.
	 * @param none
	 * @return none
	 * @memberof sliderEditor
	 * @access private
	 */
	SliderEditor.prototype.destroy = function() {
		return SliderEditor.__super__.destroy(true, this);
	};

	return SliderEditor;
});
