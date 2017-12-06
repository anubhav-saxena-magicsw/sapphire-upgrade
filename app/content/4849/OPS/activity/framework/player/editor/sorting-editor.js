/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * SortingEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/base-editor'], function(Marionette, BaseEditor) {'use strict';
	var SortingEditor;

	/**
	 * SortingEditor is responsible to load and return slider component class
	 * signature and also prepare default data which is required by an slider
	 * to initlized itself
	 *
	 *@augments SortingEditor
	 *@example
	 *Load module
	 *
	 var objSortingEditor = BaseEditor.extend({

	 SortingEditor.prototype.getComponent = function(compData) {
	 //Asking to BaseEditor to create a component
	 this.createCompData($(compData));
	 };

	 };

	 return objSortingEditor;
	 */

	SortingEditor = BaseEditor.extend({
		defaultCompData : {}
	});

	/**
	 * Will be invoked by Editor when an SliderComponent needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof SortingEditor
	 * @access private
	 */
	SortingEditor.prototype.getComponent = function(compData, isSimComp) {
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
	 * @memerof SortingEditor
	 * @access private
	 */
	SortingEditor.prototype.createCompData = function(compData) {
		this.defaultCompData = this.prepareDefaultData(compData);
		if (this.defaultCompData === undefined) {
			throw new Error("draggable editor compdata missing");
		}
		this.createComponent(compData);
	};
	
	SortingEditor.prototype.updateComponent = function(objComponent, objData) {
		var strPropertyName = objData.actionKeys[objData.actionKeys.length - 1].toLowerCase();
		objComponent.model.set(strPropertyName, objData.data[strPropertyName]);
		objComponent.reset();
	};

	
	
	/**
	 * Overriding 'BaseEditor' method to get notifiy when sliderComponent class is
	 * required successfully.
	 * This method is also resposible to append default data for slider component
	 * in objComponent (received as parameter when component created successfully)
	 *
	 * @param {Object} objComponent slider coponent class signature
	 * @return none
	 * @memberof SortingEditor
	 * @access private
	 */
	SortingEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};

	/**
	 * This method destroy the SortingEditor class.
	 * @param none
	 * @return none
	 * @memberof SortingEditor
	 * @access private
	 */
	SortingEditor.prototype.destroy = function() {
		return SortingEditor.__super__.destroy(true, this);
	};

	return SortingEditor;
});