/**
 * Created by brajendra.kumar on 8/18/14.
 */
$.widget("custom.BASEWIDGET", {
	// default options
	options : {
		parentObject : null,
		widgetData : null,
		functionList : [],
		updatedScale : 1
	},
	_create : function() {

	},
	_init : function() {

	},

	dispatchEvent : function(strEventName, obj, data) {
		var customData = {};
		customData.strEventName = strEventName;
		customData.parent = this.options.parentObject;
		customData.data = data;
		this._trigger("WIDGET_EVENT", obj, customData);
	},
	getFunctionList : function() {
		return this.options.functionList;
	},

	handleWidgetWrapperCall : function(strFunction, arguments) {
		this[strFunction].apply(this, arguments);
	},

	setStageScaleValue : function(value) {
		this.options.updatedScale = Number(value);
	},

	destroy : function() {

	}
});
