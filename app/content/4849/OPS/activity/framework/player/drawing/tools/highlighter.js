define(['marionette', 'player/drawing/tools/pen'], function(Marionette, Pen) {'use strict';

	var Highlighter;

	Highlighter = Pen.extend({
		constructor : function(objCanvas) {
			//this.strokeStyle = "rgba(255,255,0,0.5)";
			//this.lineWidth = 20;
		}
	});
	
	Highlighter.prototype.start = function(canvasRef) {
		this.lineWidth = 20;
		this.strokeStyle = "rgba(255,255,0,0.5)";
		this.objCanvas = canvasRef;
		this.initPenTool();
	};

	return Highlighter;

});
