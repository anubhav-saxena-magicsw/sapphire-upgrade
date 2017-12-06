/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * countDownTimerEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/base-editor'], function(Marionette, BaseEditor) {'use strict';
	var CountDownTimerEditor;

	/**
	 * CountDownTimerEditor is responsible to load and return countDownTimer component class
	 * signature and also prepare default data which is required by the component
	 * to initlized itself
	 *
	 *@augments CountDownTimerEditor
	 *@example
	 *Load module
	 *
	 var objCountDownTimerEditor = BaseEditor.extend({

	 CountDownTimerEditor.prototype.getComponent = function(compData) {
		 //Asking to BaseEditor to create a component
		 this.createCompData($(compData));
		 };

	 };

	 return objCountDownTimerEditor;
	 */

	CountDownTimerEditor = BaseEditor.extend({
		defaultCompData : {}
	});

	/**
	 * Will be invoked by Editor when an countDownTimer component needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof CountDownTimerEditor
	 * @access private
	 */
	CountDownTimerEditor.prototype.getComponent = function(compData, isSimComp) {
		this.isSimComp = isSimComp;
		//Asking to BaseEditor to create a component
		var objData = (compData.data !== undefined) ? compData : $(compData);
		this.createCompData(objData);
	};

	CountDownTimerEditor.prototype.updateComponent = function(objComponent, objData) {
		var strPropertyName = objData.actionKeys[objData.actionKeys.length - 1];
		objComponent.compData[strPropertyName] = objData.data[strPropertyName];
		//objComponent.model.set(strPropertyName, objData.data[strPropertyName]);
		//objComponent.render();
		objComponent.redrawComponent();
	};	

	/**
	 * Preparing constructor data for countDownTimer component which will be passed to it during initialization
	 * through its constructor method.
	 * @param {Object} compData
	 * @return none
	 * @memerof CountDownTimerEditor
	 * @access private
	 */
	CountDownTimerEditor.prototype.createCompData = function(compData) {
		this.defaultCompData = this.prepareDefaultData(compData);
		if (this.defaultCompData === undefined) {
			throw new Error(this.errorConst.COUNTDOWN_TIMER_DEFAUTL_DATA_MISSING);
		}
		this.createComponent(compData);
	};

	/**
	 * Overriding 'BaseEditor' method to get notifiy when countDownTimer class is
	 * required successfully.
	 * This method is also resposible to append default data for countDownTimer component
	 * in objComponent (received as parameter when component created successfully)
	 *
	 * @param {Object} objComponent countDownTimer coponent class signature
	 * @return none
	 * @memberof CountDownTimerEditor
	 * @access private
	 */
	CountDownTimerEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};
	
	CountDownTimerEditor.prototype.CountDownTimerEditorSuper = BaseEditor;
	
	/**
	 * This method destroy the CountDownTimerEditor class.
	 * @param none
	 * @return none
	 * @memberof CountDownTimerEditor
	 * @access private
	 */
	CountDownTimerEditor.prototype.destroy = function()
	{
		return CountDownTimerEditor.CountDownTimerEditorSuper.destroy(true, this);
	};

	return CountDownTimerEditor;
});
