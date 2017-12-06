/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * CalloutEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/base-editor'], function(Marionette, BaseEditor) {'use strict';
	var CalloutEditor;

	/**
	 * CalloutEditor is responsible to create and load callout component.
	 *
	 *@augments CalloutEditor
	 *@example
	 *Load module
	 *
	 var objCalloutEditor = BaseEditor.extend({

	 CalloutEditor.prototype.getComponent = function(compData) {
	 //Asking to BaseEditor to create a component
	 this.createCompData($(compData));
	 };

	 };

	 return CalloutEditor;
	 */

	CalloutEditor = BaseEditor.extend({
		defaultCompData : {}
	});

	/**
	 * Will be invoked by Editor when an CalloutComponent needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof CalloutEditor
	 * @access private
	 */
	CalloutEditor.prototype.getComponent = function(compData, isSimComp) {
		this.isSimComp = isSimComp;
		//Asking to BaseEditor to create a component
		var objData = (compData.data !== undefined) ? compData : $(compData);
		this.createCompData(objData);
	};

	/**
	 * Preparing constructor data for "Callout" component which will be passed to slider
	 * through its constructor method.
	 * @param {Object} compData
	 * @return none
	 * @memerof CalloutEditor
	 * @access private
	 */
	CalloutEditor.prototype.createCompData = function(compData) {
		this.defaultCompData = this.prepareDefaultData(compData);
		this.createComponent(compData);
	};

	/**
	 * Overriding 'BaseEditor' method to get notifiy when calloutComponent class is
	 * required successfully.
	 * This method is also resposible to append default data for callout component
	 * in objComponent (received as parameter when component created successfully)
	 *
	 * @param {Object} objComponent callout coponent class signature
	 * @return none
	 * @memberof CalloutEditor
	 * @access private
	 */
	CalloutEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};

	/**
	 * This method destroy the calloutEditor class.
	 * @param none
	 * @return none
	 * @memberof CalloutEditor
	 * @access private
	 */
	CalloutEditor.prototype.destroy = function() {
		return CalloutEditor.__super__.destroy(true, this);
	};

	return CalloutEditor;
});
