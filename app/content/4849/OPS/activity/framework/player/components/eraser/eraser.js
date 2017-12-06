/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * EraserComp
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['components/pencil/pencil'], function(Pencil) {
	'use strict';
	var EraserComp;
	/**
	 * @class EraserComp
	 *
	 *
	 */

	EraserComp = Pencil.extend({
		imgURL : 'framework/player/components/eraser/eraser.cur',
		initialize : function(objData) {
			this.EraserCompSuper.prototype.initialize.call(this, objData);
			this.componentType = "eraser";

		}
	});

	/**
	 * This method is responsible for start Draw.
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 * @memberof EraserComp#
	 */
	EraserComp.prototype.startDraw = function() {
		this.canvas.isDrawingMode = true;
		if(this.canvas.backgroundColor !== ''){
		this.canvas.freeDrawingBrush.color = this.canvas.backgroundColor;}
		else{this.canvas.freeDrawingBrush.color = this.objData.erasercolor;}
		this.canvas.freeDrawingBrush.width = 10;
		if (this.objData.imgurl !== '') {
			this.imgURL = this.objData.imgurl;
		}
		this.canvas.freeDrawingCursor = 'url(' + this.imgURL + '),default';
		this.canvas.selectable = false;
		this.canvas.renderAll();
	};

	EraserComp.prototype.EraserCompSuper = Pencil;

	EraserComp.prototype.destroy = function() {
		return this.EraserCompSuper.prototype.destroy.call(this, true);
	};

	return EraserComp;
});
