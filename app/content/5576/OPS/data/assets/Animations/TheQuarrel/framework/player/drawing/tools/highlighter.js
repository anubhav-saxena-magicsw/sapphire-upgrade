define(["marionette","player/drawing/tools/pen"],function(t,n){var e;return e=n.extend({constructor:function(){}}),e.prototype.start=function(t){this.lineWidth=20,this.strokeStyle="rgba(255,255,0,0.5)",this.objCanvas=t,this.initPenTool()},e});