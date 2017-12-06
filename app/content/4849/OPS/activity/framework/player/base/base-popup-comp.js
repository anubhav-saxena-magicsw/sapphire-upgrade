/*jslint nomen: true*/
/*globals Backbone,$,_, jQuery, console*/

/**
 * BasePopupComp
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2014 Magic Software Private Limited.
 * @copyright (c) 2014 Magic Software
 */

define(['player/base/base-display-comp'], function(BaseDisplayComp) {
	"use strict";

	var BasePopupComp;
	/**
	 * @class BasePopupComp
	 * Class 'BasePopupComp' is introduced to provide the basic block to a popup components,
	 *
	 * By extending this class a popup type component can be created which will inherit the basic popup properteis from
	 * this class.
	 *
	 *
	 *@augments Backbone.Marionette.Layout
	 *@example
	 *Load module
	 *
	 require(['player/base/BasePopupComp'], function(BasePopup) {
	 var objPopup = BasePopup.extend({
	 template : _.template(htmlBody),
	 initialize : function() {
	 },

	 };

	 return objPopup;

	 *});
	 */
	BasePopupComp = BaseDisplayComp.extend({
		type : "popup"
	});

	/** popupCloseEvent */
	BasePopupComp.prototype.POPUP_CLOSE_EVENT = "popupCloseEvent";

	/**
	 * Call this mehtod from its child class to close the popup.
	 * @param {Object} objData
	 * @return none
	 */
	BasePopupComp.prototype.closePopup = function(objData) {
		this.customEventDispatcher(this.POPUP_CLOSE_EVENT, this, objData);
	};

	/** Storing the parent class reference. **/
	BasePopupComp.prototype.BasePopupCompSuper = BaseDisplayComp;

	/**
	 * Destroy its object and reference if any.
	 * call this method from its child with true value.
	 *
	 * @param {Boolean} bChildDestroyed
	 * @return {Boolean} return true if destroy run successfully and implemeneted its child classes.
	 **/
	BasePopupComp.prototype.destroy = function(bChildDestroyed) {
		return this.BasePopupCompSuper.prototype.destroy.call(this, bChildDestroyed);
	};

	return BasePopupComp;
});
