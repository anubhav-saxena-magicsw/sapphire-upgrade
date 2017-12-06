/*jslint nomen: true*/
/*globals Backbone,_,console,$, class */

/**
 * screenHelper
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */
define(['marionette'], function(Marionette) {
	'use strict';
	var ScreenHelper;

	ScreenHelper = Backbone.Marionette.Controller.extend({
		objActivity : null,
		screenId : undefined,
		model : undefined
	});

	/**
	 * Introduced to manage the web service call from helper classes.
	 */
	ScreenHelper.prototype.manageWebServiceCall = function(strServiceName, userData, context, strSuccessCallback, strFailCallback) {
		var objEventData = {};
		objEventData.serviceName = strServiceName;
		objEventData.context = context;
		objEventData.successFunction = strSuccessCallback;
		objEventData.failFunction = strFailCallback;
		objEventData.userData = userData;
		this.objActivity.manageWebServiceCall(objEventData);
	};

	/**
	 * Stop all other regions
	 * @param {Object} bStart
	 */
	ScreenHelper.prototype.stopAllRegion = function(bStart, bIgnoreCaller) {
		this.objActivity.stopAllRegion(bStart, bIgnoreCaller);
	};

	/**
	 * Start all other regions
	 * @param {Object} bStart
	 */
	ScreenHelper.prototype.startAllRegion = function(bStart, bIgnoreCaller, objData) {
		this.objActivity.stopAllRegion(!bStart, bIgnoreCaller, objData);
	};

	ScreenHelper.prototype.showAlert = function(objPopupData) {
		return this.objActivity.showAlert(objPopupData);
	};

	ScreenHelper.prototype.showAlertMsg = function(strMsg, htmlTemplate, nButtons, strTitle, labelYes, labelNo, labelCancel, objStyle) {
		var objPopupData = {}, objPopup;
		objPopupData.title = strTitle;
		objPopupData.message = strMsg;

		if (labelYes !== undefined) {
			objPopupData.yesBtnLabel = labelYes;
		}

		if (labelNo !== undefined) {
			objPopupData.noBtnLabel = labelNo;
		}

		if (labelCancel !== undefined) {
			objPopupData.cancelBtnLabel = labelCancel;
		}

		if (nButtons !== undefined) {
			objPopupData.button = nButtons;
		}
		objPopupData.styles = objStyle;
		objPopupData.htmlTemplate = htmlTemplate;
		return this.showAlert(objPopupData);
	};

	ScreenHelper.prototype.destroy = function() {
		return true;
	};

	return ScreenHelper;
});
