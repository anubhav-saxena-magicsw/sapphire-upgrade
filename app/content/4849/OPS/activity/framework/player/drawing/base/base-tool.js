/*jslint nomen: true*/
/*globals Backbone,_,console,$, class */

/**
 * BaseTool
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */

define(['marionette'], function(Marionette) {'use strict';

	var BaseTool;

	BaseTool = Backbone.Marionette.Layout.extend({
		objCanvas : undefined
	});
	
	BaseTool.MOUSE_MOVE = "mousemove";
	BaseTool.MOUSE_DOWN = "mousedown";
	BaseTool.MOUSE_UP = "mouseup";
	BaseTool.MOUSE_OUT = "mouseout";

	BaseTool.prototype.activateTool = function(canvasRef) {
		this.objCanvas = canvasRef;
	};

	BaseTool.prototype.start = function() {

	};

	return BaseTool;
});
