/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * DrawingTool
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['components/button/button'], function(Button) {
	'use strict';
	var DrawingTool;
	/**
	 * @class DrawingTool
	 *
	 *
	 */

	DrawingTool = Button.extend({
		objData : null,
		objChildList : undefined,
		canvas : null,

		initialize : function(objData) {
			this.DrawingToolSuper.prototype.initialize.call(this, objData);
		}

	});

	
	
	/**
	 * This method is responsible for setting the canvas cotext.
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 * @memberof DrawingTool#
	 */
	DrawingTool.prototype.linkedWith = function(objCompRef) {
		this.canvas = objCompRef.getCanvasContext();
	};
	


	DrawingTool.prototype.DrawingToolSuper = Button;

	DrawingTool.prototype.destroy = function() {
		delete this.objData;
		this.objChildList = null;
		this.canvas = null;
		return this.DrawingToolSuper.prototype.destroy.call(this, true);
	};

	return DrawingTool;
});
