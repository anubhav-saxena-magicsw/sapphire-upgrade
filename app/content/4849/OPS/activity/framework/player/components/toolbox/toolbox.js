/*jslint nomen: true*/
/*globals Backbone,$, console, _, device*/

define(['marionette', 'underscore', 'text!player/components/toolbox/toolbox.html'], function(Marionette, _, toolboxHtml) {'use strict';

	var Toolbox;

	Toolbox = Backbone.Marionette.Layout.extend({

		template : _.template(toolboxHtml),

		toolboxData : undefined,
		toolDict : undefined,
		currentTool : undefined,
		currentToolId : undefined,
		currentToolCursor : undefined,
		cursorDiv : undefined,
		arrToolToBeCreated : undefined,

		initialize : function(objData) {
			this.objData = objData;//this property is being used in componentselector for editing.
			this.toolboxData = objData;
			this.toolDict = {};
			this.createToolbox();
		}
	});

	Toolbox.prototype.createToolbox = function() {
		var toolboxHeader, objToolBoxRef = $(toolboxHtml);
		$("#mPlayer").append(objToolBoxRef);
		objToolBoxRef.addClass(this.toolboxData.styleClass);
		if (this.toolboxData.float === "true") {
			this.makeDraggable(objToolBoxRef);
		}
		if (this.toolboxData.label !== undefined) {
			toolboxHeader = objToolBoxRef.find('[id=toolboxHeader]');
			toolboxHeader.empty();
			$("<p>" + this.toolboxData.label + "</p>").appendTo(toolboxHeader);
		}

		if (this.toolboxData.tool !== undefined) {
			this.addItem($(objToolBoxRef));
		}

	};

	/**
	 * Adding Drag feature in Custom Debugger popup window object.
	 * @access private
	 * @param {Object} objTarget
	 * @memberof MDebugger#
	 * @return none
	 */
	Toolbox.prototype.makeDraggable = function(objTarget) {
		$(objTarget).draggable({
			handle : "#toolboxHeader",
			containment : '#mPlayer'
		});
	};

	Toolbox.prototype.addItem = function(objToolBoxRef) {
		var objClassRef = this, i = 0, toolDiv, toolData, arrTool = [], isArray = _.isArray(this.toolboxData.tool);
		arrTool = (isArray === true) ? this.toolboxData.tool : [this.toolboxData.tool];
		this.arrToolToBeCreated = arrTool;
		toolData = arrTool[i];
		toolDiv = $('<div id="' + toolData.id + '"/>');
		toolDiv.addClass(toolData.styleClass);
		objToolBoxRef.append(toolDiv);
		require([toolData["class"]], function(ToolClass) {
			objClassRef.onToolClassLoadComplete(ToolClass, toolDiv, objToolBoxRef);
		});
	};

	Toolbox.prototype.onToolClassLoadComplete = function(ToolClass, toolDiv, objToolBoxRef) {
		var toolData, objTool, strEvent = 'click', objClassRef = this, cursor;

		toolData = this.arrToolToBeCreated[0];
		this.arrToolToBeCreated.splice(0, 1);
		if (this.toolDict[toolData.id] !== undefined) {
			throw new Error(toolData.id + " is alreay registred with the Toolbox!!!");
		}
		objTool = {};
		objTool.id = toolData.id;
		objTool.cursor = toolData.cursor;
		objTool.controller = new ToolClass();
		this.toolDict[toolData.id] = objTool;

		if (device.mobile() === true || device.tablet() === true) {
			strEvent = "tap";
		}
		toolDiv.on(strEvent, objClassRef, objClassRef.handleToolboxItemClick);
		if (this.arrToolToBeCreated.length > 0) {
			this.addItem(objToolBoxRef);
		} else {
			cursor = $('<div id="customCursor"/>');
			$("body").append(cursor);
			this.cursorDiv = cursor;
			//cursor.css("display", "none");
			cursor.css("position", "absolute");
		}
	};

	Toolbox.prototype.handleToolboxItemClick = function(objEvent, data) {
		var classRef = objEvent.data;
		if (classRef.currentTool !== undefined) {
			classRef.currentTool.stop();
		}
		classRef.canvasRef = $("#objCanvas");
		classRef.currentTool = classRef.toolDict[objEvent.target.id].controller;
		classRef.currentToolId = objEvent.target.id;
		classRef.currentToolCursor = classRef.toolDict[objEvent.target.id].cursor;
		classRef.currentTool.start(classRef.canvasRef[0]);
		if (classRef.cursorDiv !== undefined) {
			classRef.cursorDiv.removeClass();
		}
		classRef.cursorDiv.css("display", "none");
		$("#mPlayer").off("mousemove");
		$("#mPlayer").off("mouseover");
		$("#mPlayer").off("mouseout");
		$("body").css("cursor", "default");
		if (classRef.currentToolCursor !== undefined) {
			classRef.cursorDiv.addClass(classRef.currentToolCursor);
			classRef.addCursorAndMove();
		}
	};

	Toolbox.prototype.addCursorAndMove = function() {
		var objClassRef = this, objTarget;
		objTarget = objClassRef.canvasRef;
		//$("#mPlayer");
		objTarget.on("mousemove", function(objEvent) {
			$(objClassRef.cursorDiv).css("left", ((objEvent.clientX) + 5 + "px"));
			objClassRef.cursorDiv.css("top", ((objEvent.clientY) + 5 + "px"));
		});

		objTarget.on("mouseout", function(objEvent) {
			$(objClassRef.cursorDiv).css("left", ((objEvent.clientX) + 5 + "px"));
			objClassRef.cursorDiv.css("top", ((objEvent.clientY) + 5 + "px"));
			objClassRef.cursorDiv.css("display", "none");
			$("body").css("cursor", "default");
		});

		objTarget.on("mouseover", function(objEvent) {
			$(objClassRef.cursorDiv).css("display", "block");
			$(objClassRef.cursorDiv).css("left", ((objEvent.clientX) + 5 + "px"));
			objClassRef.cursorDiv.css("top", ((objEvent.clientY) + 5 + "px"));
			objClassRef.cursorDiv.css("display", "block");
			$("body").css("cursor", "none");
		});

	};

	return Toolbox;

});
