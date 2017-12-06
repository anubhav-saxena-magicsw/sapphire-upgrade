/*jslint nomen: true*/
/*globals _ ,console, Backbone*/

/**
 * EventBroadcaster
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette'], function(Marionette) {'use strict';

	/**
	 * EventBroadcaster introduced to create a communication channel in between more then one
	 * activity/region.
	 *
	 * This Class is responsible to broadcast a event through out the application and allow
	 * to any activity to listen or broadcast a event.
	 *
	 * Through broadcaster a Activity can also pass the data.
	 * 
	 * The object of eventbroadcaste in created and managed by 'ActivityManager'
	 * @class EventBroadcaster
	 **/
	var EventBroadcaster = function() {
		var objEvent_dict = {};
		return _.extend(this, Backbone.Events);
	};

	/**@constant
	 * @memberof EventBroadcaster#
	 * @access public
	 * @type {string}
	 * @default
	 */
	EventBroadcaster.prototype.BROADCAST_EVENT = "broadcastEvent";
	
	/**@constant
	 * @memberof EventBroadcaster#
	 * @access public
	 * @type {string}
	 * @default
	 */
	EventBroadcaster.prototype.BUBBLE_EVENT = "bubbleEvent";

	/**
	 * broadcasting a event.
	 * @param {Object} objEvent
	 * @memberof EventBroadcaster#
	 * @return None
	 * @access public
	 */
	EventBroadcaster.prototype.broadcastEvent = function(objEvent) {
		var strEvent, objData;
		strEvent = objEvent.eventToBroadcast;
		objData = objEvent.data;
		this.trigger(this.BUBBLE_EVENT, objEvent);
	};
	return EventBroadcaster;
});
