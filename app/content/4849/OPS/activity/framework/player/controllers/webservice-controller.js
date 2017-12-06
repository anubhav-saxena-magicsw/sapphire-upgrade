/**
 * WebServiceController
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */
define(['marionette', 'player/utils/data-loader'], function(Marionette, ServiceDataLoader) {
	"use strict";
	var WebServiceController,
	    objInstance;

	/**
	 * Class 'WebServiceController' is controller class for every web service related task for each regions
	 *
	 *
	 *@access private
	 *@class WebServiceController
	 *@augments Backbone.Marionette.Controller.extend
	 */

	WebServiceController = Backbone.Marionette.Controller.extend({

		/** USER DATA **/
		userDataOptions : undefined,
		userDataToken : undefined,
		userDataUserName : undefined,
		userDataUserId : undefined,
		userDataActivityId : undefined,
		userDataActivityData : undefined,
		userMActivityRegionXml : undefined,
		/** END USER DATA **/

		bEditor : false,
		objServiceData : undefined,
		webConfigData : undefined,
		errorConst : undefined,
		serviceConst : undefined,
		eventConst : undefined,
		objServiceDataLoader : undefined,
		isServiceActive : false,
		activityName : null,
		classRef : undefined,
		arrIgnoreList : ["getUserName"],

		initialize : function() {
		}
	});

	WebServiceController.prototype.initWebService = function(webConfigData, eventConst, errorConst, webServiceConst) {
		this.webConfigData = webConfigData;
		this.errorConst = errorConst;
		this.serviceConst = webServiceConst;
		this.eventConst = eventConst;
		this.classRef = this;
		this.initaliazeWebService();
	};

	WebServiceController.GET = "get";
	WebServiceController.POST = "post";
	WebServiceController.GET_USER_NAME = "getUserName";
	WebServiceController.GET_ACTIVITY_NAME = "getActivityName";
	WebServiceController.GET_ACTIVITY_ID = "getActivityId";

	WebServiceController.prototype.initaliazeWebService = function() {
		if (this.webConfigData.enable === "true" || this.webConfigData === true) {
			this.objServiceDataLoader = new ServiceDataLoader();
		}
	};

	/**
	 * Method 'executeWebService' is responsible execute the web service call based on the provided parameters by
	 * using dataLoader class object. data loader object will call back to success or error handler method after service
	 * execution.
	 *
	 * @param {String} serviceName
	 * @param {String} serviceType GET/POST
	 * @param {String} userToken
	 * @param {Object} dataToSend
	 * @param {Function} successHandler
	 * @param {Function} errorHandler
	 * @return {none}
	 */
	WebServiceController.prototype.executeWebService = function(serviceName, serviceType, userToken, dataToSend, successHandler, errorHandler) {
		var objClassRef = this;
		this.objServiceDataLoader.off(this.objServiceDataLoader.DATA_LOAD_SUCCESS, successHandler);
		this.objServiceDataLoader.off(this.objServiceDataLoader.DATA_LOAD_FAILED, errorHandler);
		this.objServiceDataLoader.on(this.objServiceDataLoader.DATA_LOAD_SUCCESS, successHandler);
		this.objServiceDataLoader.on(this.objServiceDataLoader.DATA_LOAD_FAILED, errorHandler);
		this.objServiceDataLoader.load({
			scope : objClassRef,
			errorEvent : null,
			type : serviceType,
			url : serviceName,
			async : true,
			dataType : "json",
			contentType : "application/json",
			returnType : "json",
			headers : userToken,
			data : dataToSend
		}, true);

	};

	/**
	 * Method 'serviceSuccessHandler' execute everytime when a web service call success.
	 */
	WebServiceController.prototype.serviceSuccessHandler = function(objEvent, objClassref) {
		objClassref.onServiceExecutionEnd();
		objClassref.objServiceData.context[objClassref.objServiceData.successFunction].apply(objClassref.objServiceData.context, [objEvent]);
	};

	/**
	 * Method 'serviceFailHandler' execute everytime when a web service call fail.
	 */
	WebServiceController.prototype.serviceFailHandler = function(objEvent, jqXHR, textStatus, scope) {
		scope.onServiceExecutionEnd();
		scope.objServiceData.context[scope.objServiceData.failFunction].apply(scope.objServiceData.context, [objEvent, jqXHR, textStatus]);
	};

	/**
	 * Responsible to remove the data loader events and set the
	 * 'isServiceActive' to false to allow this class to execute next service
	 * @param {none}
	 * @return {none}
	 */
	WebServiceController.prototype.onServiceExecutionEnd = function() {
		this.isServiceActive = false;
		this.objServiceDataLoader.off(this.objServiceDataLoader.DATA_LOAD_SUCCESS);
		this.objServiceDataLoader.off(this.objServiceDataLoader.DATA_LOAD_FAILED);
	};

	/**
	 * 'invokeWebService' method will be called from its manager to run a service based on
	 * the given parameter.
	 * @param  {String} strServiceName
	 * @return {none}
	 * @access #public
	 * @memberof  WebServiceController#
	 */
	WebServiceController.prototype.invokeWebService = function(strServiceName, userData) {
		var dataToSend = {},
		    strServiceToExecute = this.webConfigData.services[strServiceName];

		//console.log("strServiceName!!!!", strServiceName, " :::strServiceToExecute!!!", strServiceToExecute);
		switch(strServiceName) {

		case this.serviceConst.SERVICE_USER_LOGIN:
			userData.baseurl = this.webConfigData.baseurl;
			this.executeWebService(strServiceToExecute, WebServiceController.POST, this.userDataToken, userData, this.onLoginSuccess, this.serviceFailHandler);
			break;

		case this.serviceConst.SERVICE_USER_LOGOUT:
			this.executeWebService(strServiceToExecute, WebServiceController.POST, this.userDataToken, {}, this.onLogoutSuccess, this.serviceFailHandler);
			break;

		case this.serviceConst.SERVICE_USER_CREATE_ACTIVITY:
			dataToSend = {};
			dataToSend.id = this.userDataActivityId;
			dataToSend = userData;
			dataToSend.userid = this.userDataUserId;
			this.executeWebService(strServiceToExecute, WebServiceController.POST, this.userDataToken, dataToSend, this.onActivityDataPhysicallyCreated, this.serviceFailHandler);
			break;

		case this.serviceConst.SERVICE_USER_DELETE_ACTIVITY:
			dataToSend.id = userData;
			dataToSend.userid = this.userDataUserId;
			this.isServiceActive = false;

			this.executeWebService(strServiceToExecute, WebServiceController.GET, this.userDataToken, dataToSend, this.serviceSuccessHandler, this.serviceFailHandler);
			break;
		case this.serviceConst.SERVICE_USER_EXPORT_ACTIVITY:
			this.isServiceActive = false;
			if (userData && userData.id) {
				window.location = strServiceToExecute + '?id=' + userData.id + '&layouts=' + JSON.stringify(userData.layouts);
			} else {
				window.location = strServiceToExecute + '?layouts=' + JSON.stringify(userData.layouts);
				;

			}
			break;
		case this.serviceConst.SERVICE_USER_SAVE_ACTIVITY:
			dataToSend.data = userData;
			dataToSend.userid = this.userDataUserId;
			dataToSend.id = this.userDataActivityId;
			this.executeWebService(strServiceToExecute, WebServiceController.POST, this.userDataToken, dataToSend, this.serviceSuccessHandler, this.serviceFailHandler);
			break;
		case this.serviceConst.SERVICE_USER_MARK_ACTIVITY:
			//console.log('userData', userData);
			dataToSend.data = userData;
			dataToSend.id = userData.Id;
			this.executeWebService(strServiceToExecute, WebServiceController.POST, this.userDataToken, dataToSend, this.serviceSuccessHandler, this.serviceFailHandler);
			break;

		case this.serviceConst.SERVICE_USER_COPY_ACTIVITY:
			//need to work on data...
			dataToSend = userData;
			dataToSend.userid = this.userDataUserId;
			this.executeWebService(strServiceToExecute, WebServiceController.POST, this.userDataToken, dataToSend, this.serviceSuccessHandler, this.serviceFailHandler);
			break;

		case this.serviceConst.SERVICE_USER_PREVIEW_ACTIVITY:
			dataToSend.path = userData;
			this.executeWebService(strServiceToExecute, WebServiceController.POST, this.userDataToken, dataToSend, this.serviceSuccessHandler, this.serviceFailHandler);
			break;

		case this.serviceConst.SERVICE_USER_EDIT_ACTIVITY:
			//console.log("this.serviceConst.SERVICE_USER_EDIT_ACTIVITY!!!!!!", this.serviceConst.SERVICE_USER_EDIT_ACTIVITY);
			dataToSend = userData;
			this.executeWebService(strServiceToExecute, WebServiceController.POST, this.userDataToken, dataToSend, this.onEditActivitySuccess, this.serviceFailHandler);
			break;
		case this.serviceConst.SERVICE_USER_DELETE_ASSETS:
			dataToSend = userData;
			this.isServiceActive = false;
			dataToSend.userid = this.userDataUserId;
			this.executeWebService(strServiceToExecute, WebServiceController.GET, this.userDataToken, dataToSend, this.serviceSuccessHandler, this.serviceFailHandler);
			break;

		case this.serviceConst.SERVICE_USER_UPLOAD_ASSETS:
			userData.append('userid', this.userDataUserId);
			dataToSend = userData;
			this.executeWebService(strServiceToExecute, WebServiceController.POST, this.userDataToken, dataToSend, this.serviceSuccessHandler, this.serviceFailHandler);
			break;
		case this.serviceConst.SERVICE_USER_COPY_ASSETS:
			dataToSend = userData;
			dataToSend.id = this.userDataActivityId;
			dataToSend.userid = this.userDataUserId;
			this.executeWebService(strServiceToExecute, WebServiceController.POST, this.userDataToken, dataToSend, this.serviceSuccessHandler, this.serviceFailHandler);
			break;

		case this.serviceConst.SERVICE_USER_GET_ASSETS:
			dataToSend.userid = this.userDataUserId;
			this.executeWebService(strServiceToExecute, WebServiceController.GET, this.userDataToken, dataToSend, this.serviceSuccessHandler, this.serviceFailHandler);
			break;

		case this.serviceConst.SERVICE_USER_DASHBOARD_DATA:
			dataToSend.userid = this.userDataUserId;
			this.executeWebService(strServiceToExecute, WebServiceController.GET, this.userDataToken, dataToSend, this.serviceSuccessHandler, this.serviceFailHandler);
			break;

		case this.serviceConst.SERVICE_USER_GET_ALL_TEMPLATE:
			this.executeWebService(strServiceToExecute, WebServiceController.GET, this.userDataToken, userData, this.serviceSuccessHandler, this.serviceFailHandler);
			break;

		case this.serviceConst.SERVICE_USER_DELETE_TEMPLATE:
			//console.log('userData', userData);
			this.executeWebService(strServiceToExecute, WebServiceController.POST, this.userDataToken, userData, this.serviceSuccessHandler, this.serviceFailHandler);
			break;
		case this.serviceConst.SERVICE_USERS_DELETE_TEMPLATE:
			this.executeWebService(strServiceToExecute, WebServiceController.POST, this.userDataToken, userData, this.serviceSuccessHandler, this.serviceFailHandler);
			break;
		case this.serviceConst.SERVICE_USER_EDIT_TEMPLATE:
			this.executeWebService(strServiceToExecute, WebServiceController.POST, this.userDataToken, userData, this.serviceSuccessHandler, this.serviceFailHandler);
			break;
		case this.serviceConst.SERVICE_USER_GET_USER_TEMPLATE:
			this.executeWebService(strServiceToExecute, WebServiceController.GET, this.userDataToken, userData, this.serviceSuccessHandler, this.serviceFailHandler);
			break;
		case this.serviceConst.SERVICE_USER_SAVE_SETTINGS:
			this.executeWebService(strServiceToExecute, WebServiceController.POST, this.userDataToken, userData, this.onNewProjectCreationSuccess, this.serviceFailHandler);
			break;

		case WebServiceController.GET_USER_NAME:
			this.objServiceData.context[this.objServiceData.successFunction].apply(this.objServiceData.context, [this.userDataUserName]);
			this.isServiceActive = false;
			break;

		case WebServiceController.GET_ACTIVITY_NAME:
			this.objServiceData.context[this.objServiceData.successFunction].apply(this.objServiceData.context, [this.activityName]);
			this.isServiceActive = false;
			break;

		case WebServiceController.GET_ACTIVITY_ID:
			this.objServiceData.context[this.objServiceData.successFunction].apply(this.objServiceData.context, [this.userDataActivityId]);
			this.isServiceActive = false;
			break;

		default:
			console.warn("no service in the name of ", strServiceName);
			break;

		}
	};

	/**
	 * 'onActivityDataPhysicallyCreated' method will be invoked when user create new project
	 * and its data physically created on server.
	 * @param {Object} Event data
	 * @param {Object} class reference to maintain the scope
	 * @return {none}
	 */
	WebServiceController.prototype.onActivityDataPhysicallyCreated = function(objEventData, objClassref) {
		objClassref.userMActivityRegionXml = objEventData.data;
		objClassref.activityName = objEventData.data.LoName;
		objClassref.onServiceExecutionEnd();
		objClassref.objServiceData.context[objClassref.objServiceData.successFunction].apply(objClassref.objServiceData.context, [objEventData]);
	};

	/**
	 * This method is binded with 'this.serviceConst.SERVICE_USER_SAVE_SETTINGS' service.
	 */
	WebServiceController.prototype.onNewProjectCreationSuccess = function(objEventData, objClassref) {
		objClassref.userDataActivityId = objEventData.data.Id;
		objClassref.userDataActivityData = objEventData.data;
		objClassref.activityName = objEventData.data.LoName;
		objClassref.onServiceExecutionEnd();
		objClassref.x = objEventData;
		objClassref.objServiceData.context[objClassref.objServiceData.successFunction].apply(objClassref.objServiceData.context, [objClassref.userDataActivityData]);
	};
	/**
	 * This method is binded with 'this.serviceConst.SERVICE_USER_SAVE_SETTINGS' service.
	 */
	WebServiceController.prototype.onEditActivitySuccess = function(objEventData, objClassref) {
		objClassref.userDataActivityId = objEventData.id;
		objClassref.activityName = objEventData.name;
		objClassref.userDataActivityData = objEventData.data;
		objClassref.onServiceExecutionEnd();
		objClassref.objServiceData.context[objClassref.objServiceData.successFunction].apply(objClassref.objServiceData.context, [objClassref.userDataActivityData]);
	};
	/**
	 * Bind with login service.
	 */
	WebServiceController.prototype.onLoginSuccess = function(objEventData, objClassref) {
		this.isServiceActive = false;
		objClassref.userDataOptions = objEventData;
		objClassref.userDataToken = {};
		objClassref.userDataToken.token = objClassref.userDataOptions.token;
		objClassref.userDataUserName = objClassref.userDataOptions.data.UserName;
		objClassref.userDataUserId = objClassref.userDataOptions.data.UserId;
		objClassref.userDataActivityId = objEventData;
		objClassref.onServiceExecutionEnd();
		objClassref.objServiceData.context[objClassref.objServiceData.successFunction].apply(objClassref.objServiceData.context, [objClassref.userDataUserName]);
	};

	/**
	 * Bind with logout service.
	 */
	WebServiceController.prototype.onLogoutSuccess = function(objEventData, objClassref) {
		objClassref.userDataOptions = undefined;
		objClassref.userDataToken = undefined;
		objClassref.userDataUserName = undefined;
		objClassref.userDataUserId = undefined;
		objClassref.userDataActivityId = undefined;
		objClassref.onServiceExecutionEnd();
		objClassref.objServiceData.context[objClassref.objServiceData.successFunction].apply(objClassref.objServiceData.context, [objEventData]);
	};

	/**
	 * Received service execution request from outside.
	 */
	WebServiceController.prototype.manageServiceRequest = function(objEvent) {
		//console.log("service busy.................", this.isServiceActive);
		if (this.isServiceActive === true) {
			if (this.arrIgnoreList.indexOf(objEvent.customData.serviceName) !== -1) {
				objEvent.customData.context[objEvent.customData.successFunction].apply(objEvent.customData.context, [this.userDataUserName]);
				return true;
			}
			return false;
		}
		this.isServiceActive = true;
		this.objServiceData = objEvent.customData;
		this.invokeWebService(this.objServiceData.serviceName, this.objServiceData.userData);
		return true;
	};

	WebServiceController.prototype.flush = function() {
		this.onServiceExecutionEnd();
	};

	/**
	 * Destroy the WebServiceController object.
	 * @memberOf WebServiceController#
	 * @param None
	 * @returns {Boolean} true or false
	 * @access private
	 */
	WebServiceController.prototype.destroy = function() {
		this.flush();
		return true;
	};

	return {
		getInstance : function() {
			if (objInstance === null || objInstance === undefined) {
				objInstance = new WebServiceController();
			}
			return objInstance;
		}
	};
});
