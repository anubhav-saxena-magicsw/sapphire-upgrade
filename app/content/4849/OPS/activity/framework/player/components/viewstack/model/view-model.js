/*jslint nomen: true*/
/*globals _,$,console,Backbone*/
/**
 * ViewModel
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
 *A module representing a ViewModel.
 *@augments Backbone.Model
 *@access private
 *@example
 * 
 *require(['components/viewStack/model/viewModel'], function(ViewModel) {
 *    var viewModel = new ViewModel();
 *});         
 */
function () {
	/**
	 * Intializes ViewModel.
	 * @constructor
	 * @augments Backbone.Model
	 * @access private
	 */
	"use strict";
	
	var ViewModel = /** @lends ViewModel.prototype */
	Backbone.Model.extend({
		defaults : {
			Viewclass : '',
			isVisible : false,
			viewContent : 'view'
		}
	});

	return ViewModel;
});