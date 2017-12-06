/*jslint nomen: true*/
/*globals Backbone,_,Data_Loader, console*/

/**
 * Factory
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

define(['marionette', "player/factory/complist"], function(Marionette, objCompRawData) {"use strict";

	/**
	 * Class 'Factory' introduced to create/manage/load components and return.
	 * it also responsible to load and maintain available component list.
	 * @class Factory
	 * The primary work of this class is to create component if its first time request if earlier
	 * same component was created then clone it and return
	 * @access private
	 */
	var Factory = function() {
		this.initFactory();
		return _.extend(this, Backbone.Events);
	};

	/**@constant
	 * @memberof Factory#
	 * @access private
	 * @type {string}
	 * @default
	 */
	Factory.prototype.COMP_CREATION_COMPLETE_EVENT = "compCreationCompleteEvent";

	/**
	 * @memberof Factory#
	 * @access private
	 */
	Factory.prototype.members = {
		compDict : null,
		compRawData : null
	};

	/**
	 * Initlizing Factory and load the all available component list.
	 * @param none
	 * @memberof Factory#
	 * @return none
	 * @access private
	 */
	Factory.prototype.initFactory = function() {
		//laod factory data. e.g compList.xml
		this.members.compDict = {};
		/*var objCalssRef = this;
		 Data_Loader.on(Data_Loader.DATA_LOAD_SUCCESS, function(objData) {
		 objCalssRef.successHandler(objData);
		 });
		 Data_Loader.load({
		 url : basePath+'framework/player/factory/compList.txt',
		 dataType : "text",
		 contentType : 'application/xml',
		 returnType : 'json'
		 });*/
		this.members.compRawData = objCompRawData;
	};

	/**
	 * Invoked when a component list loaded successfully.
	 * @param {Object} objData Available component list
	 * @memberof Factory#
	 * @return none
	 * @access private
	 */
	Factory.prototype.successHandler = function(objData) {
		Data_Loader.off(Data_Loader.DATA_LOAD_SUCCESS);
		this.members.compRawData = objData;
	};

	/**
	 * Returns components data
	 * @param None
	 * @memberof Factory#
	 * @return {Object}
	 * @access private
	 */
	Factory.prototype.getRawData = function() {
		//comp xml list data.
		return this.members.compRawData.components;
	};

	/**
	 * Invoked from FactoryManager to get new component.
	 * @param {Object} objData
	 * @return none
	 * @access private
	 * @memberof Factory#
	 */
	Factory.prototype.getComponent = function(objData) {
		return this.createComponent(objData);
	};

	/**
	 * Creating new component based on the given parameter(s)
	 * @param {Object} objData required component data.
	 * @return {Object} new loaded component reference.
	 * @access private
	 * @memberof Factory#
	 */
	Factory.prototype.createComponent = function(objData) {
		var strClassComp, mComp, strJSPath, objRawData, strCompType, compDescription, strCompClassPath, objThis, suffix;
		strClassComp = objData.strCompType;
		suffix = "Comp";
		strJSPath = suffix;
		objRawData = this.getRawData().mComp;
		strCompType = String(strClassComp + suffix).replace(/-/g, "");
		//console.log(strCompType,  " ::::: " , objData.strCompType, " ::::: " ,  objData);
		compDescription = _.filter(objRawData, function(item) {
			return item.id.toLowerCase() === strCompType.toLowerCase();
		});
		
		strCompClassPath = compDescription[0].classpath;

		objThis = this;
		return require([strCompClassPath], function(objComp) {
			objThis.onCompCreationComplete(objComp, objData);
		});
	};

	/**
	 * Invoked every time when a component required through requiredJS succcessfully.
	 * This method also dispatch a  'COMP_CREATION_COMPLETE_EVENT' event with the loaded
	 * component data.
	 *
	 * @param {Object} objComp
	 * @param {Object} objData
	 * @access private
	 * @memberof Factory#
	 */
	Factory.prototype.onCompCreationComplete = function(objComp, objData) {
		var strClassComp = objData.strCompType;
		objData.componentRef = objComp;
		this.members.compDict[strClassComp] = objComp;
		this.trigger(this.COMP_CREATION_COMPLETE_EVENT, objData);

	};

	return Factory;
});
