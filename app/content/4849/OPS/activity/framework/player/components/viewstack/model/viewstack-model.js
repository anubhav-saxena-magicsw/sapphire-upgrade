/*jslint nomen: true*/
/*globals _,$,console,Backbone*/
/**
 * ViewStackModel
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
  *@example
 * 
 *require(['components/viewStack/model/ViewStackModel'], function(ViewStackModel) {
 *    var viewStackModel = new ViewStackModel();
 *});         
 */
define(
/**
 *A module representing a ViewStackModel.
 *@exports player/components/viewStack/model/ViewStackModel
 *@access private
 */
function () {
	/**
	 * Intializes ViewStackModel.
	 * @constructor
	 * @augments Backbone.Model
	 * @access private
	 */
	"use strict";
	
	var ViewStackModel = /** @lends ViewStackModel.prototype */
	Backbone.Model.extend({
		defaults : {
			currentView : 1,
			totalViews : 2
		}
	});

	return ViewStackModel;
});
