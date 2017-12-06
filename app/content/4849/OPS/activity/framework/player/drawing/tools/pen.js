/*jslint nomen: true*/
/*globals Backbone,_,console,$, class */

/**
 * Pen.js
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */

define(['marionette', 'player/drawing/base/base-tool'], function(Marionette, BaseTool) {'use strict';
	var Pen;

	Pen = BaseTool.extend({
		objCanvas : undefined,
		canvasCTX : undefined,
		previousX : 0,
		previousY : 0,
		currentX : 0,
		currentY : 0,
		lineWidth : 4,
		strokeStyle : "#FF0099",
		flag : false,
		mouseEventHandler : undefined,

		constructor : function(canvas) {
			this.objCanvas = canvas;
		}
	});

	Pen.prototype.start = function(canvasRef) {
		this.lineWidth = 1;
		this.strokeStyle = "rgba(0,0,0)";
		this.objCanvas = canvasRef;
		this.initPenTool();
	};

	Pen.prototype.initPenTool = function() {
		this.canvasCTX = this.objCanvas.getContext("2d");
		this.addEventsToCanvas();
	};

	Pen.prototype.addEventsToCanvas = function() {
		var objClassRef = this;
		this.mouseEventHandler = function(objEvent) {
			objClassRef.handleMouseOnCanvas(objEvent);
		};
		this.objCanvas.addEventListener(BaseTool.MOUSE_MOVE, objClassRef.mouseEventHandler);
		this.objCanvas.addEventListener(BaseTool.MOUSE_DOWN, objClassRef.mouseEventHandler);
		this.objCanvas.addEventListener(BaseTool.MOUSE_UP, objClassRef.mouseEventHandler);
		this.objCanvas.addEventListener(BaseTool.MOUSE_OUT, objClassRef.mouseEventHandler);
	};

	Pen.prototype.handleMouseOnCanvas = function(objEvent) {
		var strSwitch = objEvent.type;
		switch(strSwitch) {
			case BaseTool.MOUSE_MOVE:
				if (this.flag === true) {
					this.previousX = this.currentX;
					this.previousY = this.currentY;
					this.currentX = objEvent.offsetX;
					this.currentY = objEvent.offsetY;

					this.drawLine();
				}
				break;

			case BaseTool.MOUSE_DOWN:
				this.canvasCTX.beginPath();
				this.previousX = this.currentX;
				this.previousY = this.currentY;
				this.currentX = objEvent.offsetX;
				this.currentY = objEvent.offsetY;

				this.flag = true;
				break;
			case BaseTool.MOUSE_UP:
				this.flag = false;
				break;
			case BaseTool.MOUSE_OUT:
				this.flag = false;
				break;
		}
	};

	Pen.prototype.drawLine = function() {
		this.canvasCTX.beginPath();
		this.canvasCTX.moveTo(this.previousX, this.previousY);
		this.canvasCTX.lineTo(this.currentX, this.currentY);
		this.canvasCTX.strokeStyle = this.strokeStyle;
		this.canvasCTX.lineWidth = this.lineWidth;
		this.canvasCTX.stroke();
		this.canvasCTX.closePath();
	};

	Pen.prototype.stop = function() {
		var objClassRef = this;
		this.objCanvas.removeEventListener(BaseTool.MOUSE_MOVE, this.mouseEventHandler);
		this.objCanvas.removeEventListener(BaseTool.MOUSE_DOWN, this.mouseEventHandler);
		this.objCanvas.removeEventListener(BaseTool.MOUSE_UP, this.mouseEventHandler);
		this.objCanvas.removeEventListener(BaseTool.MOUSE_OUT, this.mouseEventHandler);
	};

	Pen.prototype.destroy = function() {
		var objClassRef = this;
		this.stop();
	};
	return Pen;
});
