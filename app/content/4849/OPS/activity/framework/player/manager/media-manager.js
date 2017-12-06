/*jslint nomen: true*/
/*globals Data_Loader,console,_*/

/**
 * MediaManager
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

/*jslint newcap:true */

define(['marionette', 'player/events/eventsconst'], function(Marionette, evtConst) {'use strict';
	var objThis, MediaManager;

	/**
	 *This module controls the navigation of activities
	 *@class MediaManager
	 *@access private
	 *@example
	 *Load module
	 *require(['player/controller/ActivityManager'], function(ActivityManager) {
	 *    var objActivityController = new ActivityManager();
	 *});
	 */
	MediaManager = Backbone.Marionette.Controller.extend({
		objMPlayer : undefined,
		mediaDict : undefined,

		constructor : function(objPlayerRef) {
			this.objMPlayer = objPlayerRef;
			this.mediaDict = {};
		}
	});

	/**
	 *Registers media controller
	 *@access public
	 *@memberof MediaManager#
	 *@param None
	 *@returns None
	 */
	MediaManager.prototype.registerMediaController = function() {

	};
	/**
	 * This function destroys the object refrence of activity
	 *@access public
	 *@memberof MediaManager#
	 *@param None
	 *@returns None
	 */
	MediaManager.prototype.destroy = function() {
	};

	return MediaManager;
});
