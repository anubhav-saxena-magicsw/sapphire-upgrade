/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * PencilComp
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['components/drawingtool/drawingtool'], function(DrawingTool) {
	'use strict';
	var PencilComp;
	/**
	 * @class PencilComp
	 *
	 *
	 */

	PencilComp = DrawingTool.extend({
		objData : null,
		objChildList : undefined,
		canvas : null,
		imgURL : 'framework/player/components/pencil/pencil-cur.cur',
		defaultBrushColor : 'black',
		defaultBrushWidth : 1,

		initialize : function(objData) {
			this.PencilCompSuper.prototype.initialize.call(this, objData);
			this.objChildList = [];
			this.objData = objData;
			//this property is being used in component selector for editing.
			this.componentType = "pencil";
			
		},

		onRender : function() {

			if (this.objData.styleClass !== undefined) {
				this.$el.addClass(this.objData.styleClass);
				this.$el.attr('id', this.strCompId);
			}
		},

		onShow : function() {
			var scope = this;
			if (this.bEditor === false) {
				this.$el.on("click", $.proxy(scope.startDraw, scope));
			}
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		}
	});

	
	/**
	 * This method is responsible for draw.
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 * @memberof PencilComp#
	 */
	PencilComp.prototype.startDraw = function() {
		this.canvas.isDrawingMode = true;
		if (this.objData.imgurl !== '') {
			this.imgURL = this.objData.imgurl;
		}
		this.canvas.freeDrawingBrush.color = this.defaultBrushColor;
		this.canvas.freeDrawingBrush.width = this.defaultBrushWidth;
		this.canvas.freeDrawingCursor = 'url(' + this.imgURL + '),default';
		this.canvas.selectable = false;
		this.canvas.renderAll();
	};
	
	
	/**
	 * This method is responsible for setting the canvas cotext.
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 * @memberof PencilComp#
	 */
	PencilComp.prototype.linkedWith = function(objCompRef) {
		this.canvas = objCompRef.getCanvasContext();
	};
	


	PencilComp.prototype.PencilCompSuper = DrawingTool;

	PencilComp.prototype.destroy = function() {
		delete this.objData;
		this.objChildList = null;
		this.$el.off('click');
		return this.PencilCompSuper.prototype.destroy.call(this, true);
	};

	return PencilComp;
});
