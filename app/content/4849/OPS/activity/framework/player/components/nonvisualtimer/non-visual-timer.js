/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/

define(['marionette', 'player/base/base-item-comp'], function(Marionette, BaseItemComp) {'use strict';
	var Timer = BaseItemComp.extend({
		initialize : function() {
			this.Timers = {};
			this.count = 0;
		}
	});

	Timer.prototype.start = function(obj) {
		var self, ref, callback, time, id="default";
		self = this;
		
		if(obj.id !== undefined && obj.id.length > 0){
			id = obj.id;
		}
		
		if(self.Timers[id]){
			clearInterval(self.Timers[id]);
		}
		
		ref = obj.reference;
		time = parseInt(obj.time, 10);
		console.log(time, isNaN(time));
		if(isNaN(time)){
			console.error("invalid time interval....");
			return;
		}
		callback = obj.callback;
		
		this.count = obj.iteration;
		if (this.count !== undefined) {
			this.count = 0;
		}
		this.count = parseInt(obj.iteration, 10);

		self.Timers[id] = setInterval(function() {
			if (typeof callback === "function") {
				callback.apply(ref);
			}
			self.customEventDispatcher("tick", self, id);		
			self.count -= 1;
			if (self.count === 0) {
				clearInterval(self.Timers[id]);
			}
		}, time);
		
	};

	Timer.prototype.kill = function(id) {
		if(id === undefined || id.length === 0){
			id ="default";
		}
		if (this.Timers[id]) {
			clearInterval(this.Timers[id]);
			delete this.Timers[id];
		}
	};
	
	Timer.prototype.killAll = function() {
		var self = this;
		$.each(self.Timers,function(id,obj){
			self.kill(id);
		});
	};
	
	Timer.prototype.Super = BaseItemComp;

	Timer.prototype.destroy = function() {
		var self = this;
		$.each(self.Timers,function(id,obj){
			if(self.Timers[id]){
				delete self.Timers[id];
			}
		});
		return this.Super.prototype.destroy(true);
	};

	return Timer;
});

