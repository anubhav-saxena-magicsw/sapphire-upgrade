/*jslint nomen: true*/
/*globals Backbone,_,$,console*/
/**
 * ToggleButtonModel
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private 
 */
define(
/**
 *A module representing a ToggleButtonModel.
 *@class ToggleButtonModel
 *@augments Backbone.Model
 *@access private 
 *@example
 * 
 *require(['components/toggleButton/model/ToggleButtonModel'], function(ToggleButtonModel) {
 *    var toggleButtonModel = new ToggleButtonModel();
 *});         
 */		
function(){
	"use strict";
	
	var ToggleButtonModel = Backbone.Model.extend({
		/**
		 * contains the default values {normalClass:"DefaultbtnNormal",label:"ToggleButton",shouldToggle:true,state:0}
		 * @memberof ToggleButtonModel
		 * @access private
		 */
		defaults : {
			normalClass : "DefaultbtnNormal",
			label:"ToggleButton",
			shouldToggle:true,
			state : 0
		}
	});
	
	return ToggleButtonModel;
});
