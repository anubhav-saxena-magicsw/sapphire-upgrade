/*jslint nomen: true*/
/*globals Backbone,_,console,$, class */

/**
 * DrawingController
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */

define(['marionette', 'player/drawing/toollist'], function(Marionette, ToolList) {'use strict';

	var DrawingController;

	DrawingController = Backbone.Marionette.Controller.extend({
		activeToolId : undefined,
		activeTool : undefined,
		activeCustor : undefined,
		objCanvas : undefined,
		objToolDict : undefined,
		toolToBeLoaded : undefined,

		constructor : function() {
			this.initDrawingController();
		}
	});

	DrawingController.prototype.initDrawingController = function() {
		this.initlizeToolBox();
	};

	DrawingController.prototype.setUserCanvasData = function(objData) {
		this.objCanvas = objData.canvas;
		this.activeToolId = "Highlighter";//"Pen";
		this.activateTool(this.activeToolId);
		
	};

	DrawingController.prototype.initlizeToolBox = function() {
		this.objToolDict = {};
	};

	DrawingController.prototype.activateTool = function(strTool) {
		if(this.objToolDict[strTool] === undefined)
		{
			this.requireToolClasses(strTool);
		}
		else
		{
			this.activeTool = this.objToolDict[strTool];
			this.activeTool.start();
		}
		switch(strTool) {
			case "PEN":
				break;
		}
	};
	
	DrawingController.prototype.requireToolClasses = function(strToolName)
	{
		var toolDescription, objClassRef = this;
		toolDescription = _.filter(ToolList.toolBox.tool , function(item) {
			return (item.id === strToolName);
		});
		this.toolToBeLoaded = toolDescription[0];
		require([this.toolToBeLoaded.classpath], function(LoadedTool){
			//console.log("tool loaded....", LoadedTool);
			objClassRef.activeTool = new LoadedTool(objClassRef.objCanvas);
			objClassRef.objToolDict[strToolName] =  objClassRef.activeTool;
			//console.log(objClassRef.objCanvas);
			objClassRef.activeTool.start(objClassRef.objCanvas);
		});
		
	};

	return DrawingController;
});
