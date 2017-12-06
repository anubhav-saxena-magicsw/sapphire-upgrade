/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * MCQEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/base-editor'],

/**
 * @class MCQEditor
 * MCQEditor is responsible to load and return slider component class
 * signature and also prepare default data which is required by an MCQ
 * to initlized itself
 *
 * @augments MCQEditor
 */

function(Marionette, BaseEditor) {'use strict';
	var MCQEditor;

	MCQEditor = BaseEditor.extend({
		defaultCompData : {}
	});

	/**
	 * Will be invoked by Editor when an SliderComponent needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof MCQEditor
	 * @access private
	 */
	MCQEditor.prototype.getComponent = function(compData, isSimComp) {
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
	 * @memerof MCQEditor
	 * @access private
	 */
	MCQEditor.prototype.createCompData = function(compData) {
		this.defaultCompData = undefined;
		if (compData.attr === undefined) {
			this.defaultCompData = this.prepareDefaultData(compData);
		} else {
			if (compData.attr("defaultData")) {
				var objDefaultData = $.parseJSON(compData.attr("defaultData"));
				if (!$.isEmptyObject(objDefaultData) && objDefaultData !== null) {
					this.defaultCompData = this.prepareDefaultData(compData);
				}
			}
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
	 * @memberof MCQEditor
	 * @access private
	 */
	MCQEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};

	/**
	 * This method destroy the MCQEditor class.
	 * @param none
	 * @return none
	 * @memberof MCQEditor
	 * @access private
	 */
	MCQEditor.prototype.destroy = function() {
		return MCQEditor.__super__.destroy(true, this);
	};

	return MCQEditor;
});
