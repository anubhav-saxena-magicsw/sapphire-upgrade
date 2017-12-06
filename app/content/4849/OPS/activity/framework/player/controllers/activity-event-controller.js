/*jslint nomen: true*/
/*globals console,_,$*/
/**
 * ActivityEventController
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(['marionette', 'player/constants/errorconst'], function(Marionette, errorConst) {'use strict';
	/**
	 * Class 'ActivityEventController' introduced to provide a central area within a 'region' to help the activity to manage their
	 * object events. Each region will have their own 'ActivityEventController'.
	 *
	 * An 'Activity' can add/removed events on their object by calling the 'attachListener' method of 'BaseActivity' Class. A 'BaseActivity' is a class
	 * which is extended by every activity. see 'BaseActivity' for more detail.
	 *
	 * This class does not allow to bind repeated events on same object also give call to associated callback method without changing
	 * the scope, means callback method will always invoked within Class scope.
	 *
	 * Also when an activity is ready to unload this class checked that every registered event is removed by activity, if any registered event
	 * left then controller throw an error to force user to unregister the event.
	 *
	 * Object of this class will be created by activityController to facilitate the player to load same activity in multiple region
	 * in single time.
	 *
	 *@class ActivityEventController
	 *@access private
	 *@example
	 *Load module
	 *require(['player/controllers/ActivityEventController'], function(ActivityEventController) {
	 *    var activityEventController = new ActivityEventController();
	 *});
	 */
	var ActivityEventController = function() {
		this.objDictonary = {};
	};

	/**
	 *This function executes the web service call depending upon the type of service
	 *@memberof ActivityEventController#
	 *@access private
	 *@param {Object} objData data to send.
	 *@returns None
	 */
	ActivityEventController.prototype.members = {

		EVENT_TYPE : 'eventType',
		EVENT_CONTEXT : "eventContext",
		EVENT_TARGET : 'eventTarget',
		EVENT_CALLBACK : 'eventCallback'
	};

	/**
	 *This function attaches the events on to the target object
	 *@access private
	 *@memberof ActivityEventController#
	 *@param {Object} context reference of the context
	 *@param {Object} objTarget object that will dispatch the event
	 *@param {string} strEventType event type
	 *@param {String} strCallBack name of callback function
	 *@returns None
	 */
	ActivityEventController.prototype.addEventListener = function(context, objTarget, strEventType, strCallBack) {
		var arrTargets = [], i;
		if (objTarget.length === 0 || objTarget.length === undefined) {
			arrTargets.push(objTarget);
		} else {
			arrTargets = objTarget;
		}
		for ( i = 0; i < arrTargets.length; i += 1) {
			this.addEventsToTarget(context, arrTargets[i], strEventType, strCallBack);
		}
	};

	/**
	 *Adds events to the target
	 *@access private
	 *@memberof ActivityEventController#
	 *@param {Object} context reference of the context
	 *@param {Object} objTarget object that will dispatch the event
	 *@param {string} strEventType event type
	 *@param {String} strCallBack name of callback function
	 *@returns None
	 */
	ActivityEventController.prototype.addEventsToTarget = function(context, objTarget, strEventType, strCallBack) {
		if (objTarget.length === 0) {
			throw new Error("not a valid object to register events");
		}
		var objClassRef, members, objEventData, strType, strId, arrTargets = [], i;
		strId = this.getTargetID(objTarget);
		strType = (objTarget.getID === undefined) ? 2 : 1;
		if (strId === undefined) {
			throw new Error(errorConst.ID_IS_NOT_ASSOCIATED_WITH_OBJECT, objTarget);
		}

		if (this.searchEventReference(strId, strEventType) === true) {
			throw new Error("[" + strEventType + "]" + errorConst.IS_ALREADY_REGISTERED + "[" + strId + "]");
		}

		members = this.members;
		objEventData = {};
		objEventData[members.EVENT_CONTEXT] = context;
		objEventData[members.EVENT_TARGET] = objTarget;
		objEventData[members.EVENT_TYPE] = strEventType;
		objEventData[members.EVENT_CALLBACK] = strCallBack;

		this.objDictonary[strId + "_" + strEventType] = objEventData;
		objClassRef = this;
		if (strType === 1) {
			objTarget.on(strEventType, objClassRef, objClassRef.handleCallBack);
		} else {
			$(objTarget).on(strEventType, function(objEvent) {
				var objData = {};
				objData.eventTarget = objEvent;
				objData.data = objClassRef;
				objClassRef.handleCallBack(objData);
			});
		}
	};

	/**
	 *Returns target id
	 *@access private
	 *@memberof ActivityEventController#
	 *@param {Object} objComp contains the reference of the component
	 *@returns {String}
	 */
	ActivityEventController.prototype.getTargetID = function(objComp) {
		var strId;
		strId = undefined;
		if (objComp.id === undefined) {
			if (objComp.hasOwnProperty("getID") === true) {
				strId = objComp.getID();
			} else {
				console.warn("Please check Object ", objComp);
			}

		} else {
			strId = objComp.id;
		}
		return strId;
	};

	/**
	 *This function executes the callback function
	 *@access private
	 *@memberof ActivityEventController#
	 *@param {Object} objEvent reference of the event
	 *@returns None
	 */
	ActivityEventController.prototype.handleCallBack = function(objEvent) {
		var objEventData, members, strId, strEventType, objClassRef;
		objClassRef = objEvent.data;
		if (objEvent.eventTarget) {
			strId = objEvent.eventTarget.id;
		}
		strId = (strId === undefined) ? objEvent.eventTarget.currentTarget.id : strId;
		strId = (strId === undefined) ? objEvent.eventTarget.data.getID() : strId;

		strEventType = objEvent.eventTarget.type;
		objEvent.type = strEventType;
		objEvent.target = objEvent.eventTarget.data;

		strEventType = objEvent.type;
		members = objClassRef.members;
		objEventData = objClassRef.objDictonary[strId + "_" + strEventType];
		objEventData[members.EVENT_CONTEXT][objEventData[members.EVENT_CALLBACK]](objEvent.eventTarget);
	};

	/**
	 *This function removes the event from the target object
	 *@access private
	 *@memberof ActivityEventController#
	 *@param {Object} objTarget refernce of target object
	 *@param {Object} strEventType event type.
	 *@param {Object} strCallBack call back function.
	 *@returns None
	 */
	ActivityEventController.prototype.removeEventListener = function(objTarget, strEventType, strCallBack) {
		var i, strId, _arrTarget = [];
		_arrTarget = _.toArray(objTarget);
		for ( i = 0; i < _arrTarget.length; i += 1) {
			strId = this.getTargetID(_arrTarget[i]);
			_arrTarget[i] = (_arrTarget[i].jquery !== undefined) ? _arrTarget[i] : $(_arrTarget[i]);
			_arrTarget[i].off(strEventType);
			delete this.objDictonary[strId + "_" + strEventType];
		}
	};

	/**
	 *This function searches the event reference
	 *@access private
	 *@memberof ActivityEventController#
	 *@param {String} strId
	 *@param {Object} strEventType tyoe of event
	 *@returns None
	 */
	ActivityEventController.prototype.searchEventReference = function(strId, strEventType) {
		var eventObject = this.objDictonary[strId + "_" + strEventType];
		return (eventObject !== undefined);
	};

	/**
	 *This function checks if all the listeners which were attached previously have been dettached
	 *@access private
	 *@memberof ActivityEventController#
	 *@param None
	 *@returns {Boolean} true or false
	 */
	ActivityEventController.prototype.isAllRegisteredListenerDeattached = function() {
		var members, strMessage, objData, eventList, eventDcit;
		eventDcit = this.objDictonary;
		eventList = _.filter(eventDcit, function(item) {
			return item;
		});

		if (parseInt(eventList.length, 10) > 0) {
			members = this.members;
			objData = eventList[0];
			strMessage = "'" + objData[members.EVENT_TYPE] + errorConst.IS_ATTACHED_WITH + "'" + objData[members.EVENT_TARGET].id;
			strMessage = strMessage + errorConst.CALLBACK_METHOD_IS + objData[members.EVENT_CALLBACK] + errorConst.REMOVE_REFERENCE_BEFOER_TO_UNLOAD;
			throw new Error(strMessage);
		}
		return true;
	};

	return ActivityEventController;
});
