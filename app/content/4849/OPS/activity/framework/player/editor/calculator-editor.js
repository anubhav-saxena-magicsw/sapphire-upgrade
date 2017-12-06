/*jslint nomen: true*/
/*globals Backbone,_,$, console, Data_Loader*/

/**
 * CalculatorEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/base-editor'], function(Marionette, BaseEditor) {'use strict';
	var CalculatorEditor;

	/**
	 * CalculatorEditor is responsible to load and return calculator component class
	 * signature and also prepare default data which is required by a calculator
	 * to initlized itself
	 *
	 *@augments CalculatorEditor
	 *@example
	 *Load module
	 *
	 var objCalculatorEditor = BaseEditor.extend({

	 CalculatorEditor.prototype.getComponent = function(compData) {
	 //Asking to BaseEditor to create a component
	 this.createCompData($(compData));
	 };

	 };

	 return objCalculatorEditor;
	 */

	CalculatorEditor = BaseEditor.extend({
		defaultCompData : {},
		componentHTMLDiv : undefined
	});

	/**
	 * Will be invoked by Editor when an calculatorComponent needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof CalculatorEditor#
	 * @access private
	 */
	CalculatorEditor.prototype.getComponent = function(compData,isSimComp) {
		// this.componentHTMLDiv = $(compData);
		// //Asking BaseEditor to create a component
		// if(compData.attributes.defaultdata)
		// {
			// this.createCompData($(compData));
		// }
		// else
		// {
			// this.createComponent(this.componentHTMLDiv);
		// }
		
		
		 this.isSimComp = isSimComp;
		//Asking to BaseEditor to create a component
		var objData = (compData.data !== undefined) ? compData : $(compData);
		this.componentHTMLDiv = objData;
		if((compData.data) || (compData.attributes.defaultdata))
		//if(compData.data)
		{
			this.createCompData(objData);
		}
		else
		{
			this.createComponent(this.componentHTMLDiv);
		}
		
		
	};

	/**
	 * Preparing constructor data for calculator component which will be passed to calculator
	 * through its constructor method.
	 * @param {Object} compData
	 * @return none
	 * @memerof CalculatorEditor#
	 * @access private
	 */
	CalculatorEditor.prototype.createCompData = function(compData) {
		//console.log("compData",compData)
		this.prepareDefaultData(compData, this.onDefaultDataCreationComplete, this);
	};

	CalculatorEditor.prototype.onDefaultDataCreationComplete = function(context, defaultData) {
		context.defaultCompData = defaultData;
		//console.log("defaultData",defaultData);
		//return;
		//if calculator data is provided in html, then we will load before calculator comp initlization.
		if (context.defaultCompData.calculatorData !== undefined) {
			context.getCalculatorData();
		} 
		else
		{
			//if calculator data not provided but renderer object found in html entry.
			context.createComponent(context.componentHTMLDiv);
		}
	};

	/**
	 * Method 'getCalculatorData' is responsible to load calculator data xml with the help of
	 * DATA_LOADER object and pass the controll to 'successHandler' method for
	 * further initlization.
	 * @param none
	 * @return none
	 * @memberof CalculatorEditor#
	 * @access private
	 */
	CalculatorEditor.prototype.getCalculatorData = function() {

		var objClassRef = this;
		Data_Loader.on(Data_Loader.DATA_LOAD_SUCCESS, $.proxy(objClassRef.successHandler, objClassRef));
		Data_Loader.on(Data_Loader.DATA_LOAD_FAILED, $.proxy(objClassRef.errorHandler, objClassRef));
		Data_Loader.load({
			url : objClassRef.defaultCompData.calculatorData,
			dataType : 'xml',
			contentType : 'application/xml',
			returnType : 'json',
			scope : objClassRef
		});
	};

	/**
	 * Method 'successHandler' will invoked when data xml loaded successfully with the help of
	 * data loader object.
	 * assign the loaded data in component default data in required format. 
	 * 
	 * If no item renderer required then this method pass the controll to 'createComponent'
	 * to initlizate component.
	 * 
	 * @param {Obejct} data loaded calculator xml data.
	 * @return none
	 * @memberof CalculatorEditor#
	 * @access private
	 */
	CalculatorEditor.prototype.successHandler = function(data) {
		Data_Loader.off(Data_Loader.DATA_LOAD_SUCCESS);
		Data_Loader.off(Data_Loader.DATA_LOAD_FAILED);
		//console.log("data",data);
		this.defaultCompData.buttonCollection = data;
		this.createComponent(this.componentHTMLDiv);
	};
	/**
	 * Invoked when calculator xml data failed to load.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof CalculatorEditor#
	 */
	CalculatorEditor.prototype.errorHandler = function() {
		Data_Loader.off(Data_Loader.DATA_LOAD_SUCCESS);
		Data_Loader.off(Data_Loader.DATA_LOAD_FAILED);
	};
	
	/**
	 * Overriding 'BaseEditor' method to get notifiy when calculatorComponent class is
	 * required successfully.
	 * This method is also resposible to append default data for calculator component
	 * in objComponent (received as parameter when component created successfully)
	 *
	 * @param {Object} objComponent calculator coponent class signature
	 * @return none
	 * @memberof CalculatorEditor#
	 * @access private
	 */
	CalculatorEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};

	/**
	 * This method destroy the CalculatorEditor class.
	 * @param none
	 * @return none
	 * @memberof CalculatorEditor#
	 * @access private
	 */
	CalculatorEditor.prototype.destroy = function() {
		return CalculatorEditor.__super__.destroy(true, this);
	};

	return CalculatorEditor;
});
