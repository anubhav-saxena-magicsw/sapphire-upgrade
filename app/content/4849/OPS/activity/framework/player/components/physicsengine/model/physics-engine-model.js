/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/
/**
 * PhysicsEngineModel
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * Here is the full license text and copyright
 * notice for this file. Note that the notice can span several
 * lines and is only terminated by the closing star and slash.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(['backbone'],
/**
 *A module representing a LifeMeterModel.
 *@class LifeMeterModel
 *@augments Backbone.Model
 *@access private
 */
function(Backbone) {
	"use strict";
	var PhysicsEngineModel = 
	Backbone.Model.extend({
		defaults : {
			canWidth : 400,
			canHeight : 300,
			canId : "phy_world"
		}
	});

	return PhysicsEngineModel;
});
