/*jslint nomen: true*/
/*globals Backbone,_,Data_Loader*/

/**
 * TinCanManager
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

define(['marionette', 'player/controllers/tincan-controller'], function(Marionette, TinCanController) {
	"use strict";
	var TinCanManager;

	/**
	 * TinCan Manager inroduced to provided central access of tincan controller from any
	 * region or player.
	 *
	 * @class TinCanManager
	 * @access private
	 */

	TinCanManager = Backbone.Marionette.Controller.extend({

		playerRef : undefined,
		objTinCanController : undefined,
		objTinCanData : undefined,

		constructor : function(objPlayerRef, tincanData) {
			this.playerRef = objPlayerRef;
			this.objTinCanData = tincanData;
			this.initlize();
		}
	});

	/**
	 * Init tincan controller
	 *@access private
	 *@memberof TinCanManager#
	 *@param None
	 *@returns None
	 */
	TinCanManager.prototype.initlize = function() {
		this.objTinCanController = TinCanController.getInstance(this.objTinCanData);
	};

	/**
	 * Destroys factory object
	 * @access public
	 * @memberof TinCanManager#
	 * @param {Object} objData comonent details which needs to be ceated
	 * @return none;
	 */
	TinCanManager.prototype.destroy = function(objData) {
		this.objFactory.off(this.objFactory.COMP_CREATION_COMPLETE_EVENT);
		this.objFactory = undefined;

		return true;
	};

	return TinCanManager;

});
