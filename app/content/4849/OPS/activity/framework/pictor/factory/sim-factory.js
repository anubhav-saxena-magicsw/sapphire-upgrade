/*jslint nomen: true*/
/*globals Backbone,_,console,$, class */

/**
 * SimPictor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */
define(["marionette", "player/factory/factory"], function(Marionette, Factory) {'use strict';

	var SimFactory;

	SimFactory = function() {
		return _.extend(this, new Factory());
	};

	SimFactory.prototype.getSimComponent = function(strCompType, objData) {
		objData.strCompType = strCompType;
		this.getComponent(objData);
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
	/*
	SimFactory.prototype.onCompCreationComplete = function(objComp, objData) {
		//console.log("callback found...", objData.callback, objData.type);
		var strClassComp = objData.strCompType, returnData;
		objData.componentRef = objComp;
		this.members.compDict[strClassComp] = objComp;
		returnData = objData.classRef[objData.callback](objData);
		console.log("sim-factory..................", returnData);
		//this.trigger(this.COMP_CREATION_COMPLETE_EVENT, objData);
	};
*/
	return SimFactory;
});
