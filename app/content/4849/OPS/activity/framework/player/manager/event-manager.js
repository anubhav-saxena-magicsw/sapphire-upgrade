/*globals console,$*/
/**
 * EventManager
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
	 *A module representing EventManager.
	 *@class EventManager
	 *@access private
	 *@example
	 *Load module
	 *require(['player/manager/EventManager'], function(EventManager) {
	 *    var eventManager = new EventManager();
	 *});
	 */
	var EventManager = /** @lends EventManager.prototype */
	function() {
		this.members.objDictonary = {};
	};

	/**
	 * An Object containing constants and object of dictionary.
	 *@access private
	 *@memberof EventManager#
	 */
	EventManager.prototype.members = {
		EVENT_TYPE : 'eventType',
		EVENT_CONTEXT : "eventContext",
		EVENT_TARGET : 'eventTarget',
		EVENT_CALLBACK : 'eventCallback',
		objDictonary : undefined
	};

	/**
	 * addEventListener
	 * @memberof EventManager#
	 * @access private
	 * @param {Object} context Context of event.
	 * @param {Object} objTarget Target object of event.
	 * @param {String} strEventType Type/Name of event.
	 * @param {String} strCallBack Name of callback method.
	 * @returns None
	 */
	EventManager.prototype.addEventListener = function(context, objTarget, strEventType, strCallBack) {
		var members, objEventData, strId;
		strId = this.getTargetID(objTarget);
		if (strId === undefined) {
			throw new Error(errorConst.ID_IS_NOT_ASSOCIATED_WITH_OBJECT, objTarget);
		}

		if (this.searchEventReference() === true) {
			throw new Error(strEventType + errorConst.IS_ALREADY_REGISTERED + strId);
		}

		members = this.members;
		objEventData = {};
		objEventData[members.EVENT_CONTEXT] = context;
		objEventData[members.EVENT_TARGET] = objTarget;
		objEventData[members.EVENT_TARGET] = strEventType;
		objEventData[members.EVENT_CALLBACK] = strCallBack;

		members.objDictonary[strId + "_" + strEventType] = objEventData;
		objTarget.bind(strEventType, context, context[strCallBack]);
	};

	/**
	 * removeEventListener
	 * @memberof EventManager#
	 * @access private
	 * @param {Object} objTarget Target object of event.
	 * @param {String} strEventType Type/Name of event.
	 * @param {String} strCallBack Name of callback method.
	 * @returns none.
	 */
	EventManager.prototype.removeEventListener = function(objTarget, strEventType, strCallBack) {
		var strId = this.getTargetID(objTarget);
		objTarget.unbind(strEventType);
		delete this.members.members.objDictonary[strId + "_" + strEventType];
	};

	/**
	 * Returns the id of target
	 * @memberof EventManager#
	 * @access private
	 * @param {Object} objComp contains reference of component
	 * @returns None
	 */
	EventManager.prototype.getTargetID = function(objComp) {
		var strId;
		strId = undefined;
		if ($(objComp[0]).attr("id") === undefined) {
			strId = objComp.getID();
		} else {
			strId = objComp.attr('id');
		}
		return strId;
	};
	/**
	 * searchEventReference
	 * @memberof EventManager#
	 * @access private
	 * @param {String} strId ID of event.
	 * @param {String} strEventType Type of event.
	 * @returns {Boolean}
	 */
	EventManager.prototype.searchEventReference = function(strId, strEventType) {
		var bFound, eventObject;
		bFound = false;
		eventObject = this.members.objDictonary[strId + "_" + strEventType];
		return (eventObject !== undefined);
	};

	EventManager.prototype.destroy = function() {
		return true;
	};

	return EventManager;
});
