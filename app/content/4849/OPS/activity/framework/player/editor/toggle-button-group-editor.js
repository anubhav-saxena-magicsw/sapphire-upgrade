/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * ToggleButtonGroupEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/base-editor'], function(Marionette, BaseEditor) {'use strict';
	var ToggleButtonGroupEditor;

	/**
	 * ToggleButtonGroupEditor is responsible to load and return LifeMeter component class
	 * signature and also prepare default data which is required by an LifeMeter
	 * to initlized itself
	 *
	 */

	ToggleButtonGroupEditor = BaseEditor.extend({
		defaultCompData : {}
	});

	/**
	 * Will be invoked by Editor when an LifeMeterComponent needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof ToggleButtonGroupEditor
	 * @access private
	 */
	ToggleButtonGroupEditor.prototype.getComponent = function(compData, isSimComp) {
		this.isSimComp = isSimComp;
		//Asking to BaseEditor to create a component
		var objData = (compData.data !== undefined) ? compData : $(compData);
		this.createCompData(objData);
	};

	/**
	 * Preparing constructor data for LifeMeter component
	 * @param {Object} compData
	 * @return none
	 * @memerof ToggleButtonGroupEditor
	 * @access private
	 */
	ToggleButtonGroupEditor.prototype.createCompData = function(compData) {
		this.defaultCompData = this.prepareDefaultData(compData);
		if (this.defaultCompData === undefined) {
			throw new Error("Constructor error for ToggleButtonGroup");
		}
		this.createComponent(compData);
	};

	/**
	 * Overriding 'BaseEditor' method to get notifiy when LifeMeterComponent class is
	 * required successfully.
	 * This method is also resposible to append default data for LifeMeter component
	 * in objComponent (received as parameter when component created successfully)
	 *
	 * @param {Object} objComponent LifeMeter coponent class signature
	 * @return none
	 * @memberof ToggleButtonGroupEditor
	 * @access private
	 */
	ToggleButtonGroupEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};

	/**
	 * This method destroy the ToggleButtonGroupEditor class.
	 * @param none
	 * @return none
	 * @memberof ToggleButtonGroupEditor
	 * @access private
	 */
	ToggleButtonGroupEditor.prototype.destroy = function() {
		return ToggleButtonGroupEditor.__super__.destroy(true, this);
	};

	return ToggleButtonGroupEditor;
});
