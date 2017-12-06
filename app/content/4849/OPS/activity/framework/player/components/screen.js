/*jslint nomen : true*/
/*global console*/

/**
 * ScreenComp
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2014 Magic Software Private Limited.
 * @copyright (c) 2014 Magic Software
 */

define(['components/container'],

/**
 * This is a Screen component which can be used to create an screen for activity. It may have other components in it.
 *
 * @class ScreenComp
 * @augments ContainerComp
 *
 * @example
 *
 * TO BE ADDED
 */
function(Container) {
	"use strict";

	var ScreenComp = Container.extend({
		isScreenInitalized:true,
		
		initialize : function() {
			this.componentType = "screen";
		}
	});

	ScreenComp.prototype.isValid = function(strCompType) {
		var validComponent = true;
		if (strCompType === "radio" || strCompType === "answer") {
			validComponent = false;
		}
		return validComponent;
	};

	ScreenComp.prototype.ScreenSuper = Container;

	/**
	 * This function destroys the ScreenComp
	 * @memberof ScreenComp#
	 * @access public
	 * @param {Boolean} bChildDestroyed flag to check if childs are destroyed.
	 * @returns {Boolean} true or false
	 */
	ScreenComp.prototype.destroy = function() {
		return this.ScreenSuper.prototype.destroy.call(this, true);
	};

	return ScreenComp;
});
