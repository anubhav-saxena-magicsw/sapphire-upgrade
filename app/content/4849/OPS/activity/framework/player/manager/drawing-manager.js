/*jslint nomen: true*/
/*globals Data_Loader,console,_,$,Backbone*/
/**
 * DrawingManager
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */

/*jslint newcap:true */

define(['marionette', 'player/drawing/drawing-controller'], function(Marionette, DrawingController) {'use strict';

	var DrawingManager;

	DrawingManager = Backbone.Marionette.Controller.extend({

		objData : undefined,
		drawingController : undefined,

		constructor : function() {
			this.objData = undefined;
			this.drawingController = undefined;
			this.initDrawingManager();
		}
	});

	DrawingManager.prototype.initDrawingManager = function() {
		this.drawingController = new DrawingController();
	};

	DrawingManager.prototype.setUserCanvas = function(objData) {
		this.objData = objData;
		this.drawingController.setUserCanvasData(this.objData);
	};

	DrawingManager.prototype.enable = function(bEnable) {

	};

	DrawingManager.prototype.destroy = function() {
		this.objData = null;
		this.drawingController = null;
		return true;
	};

	return DrawingManager;
});
