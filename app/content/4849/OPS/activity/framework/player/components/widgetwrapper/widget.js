/*jslint nomen: true */ 
 /* console */
/*globals _*/

define(['marionette', 'player/base/base-layout-comp','player/widgets/base-widget', 'player/widgets/dndonetoone', 'player/widgets/dndonetomany'], function(Marionette, BaseCompositeComp) {'use strict';

	var WidgetWrapper;

	WidgetWrapper = BaseCompositeComp.extend({

		widgetObject : undefined,
		PATH_PREFIX : "player/widgets/",
		widgetData : null,
		template : _.template('<div></div>'),

		initialize : function(objData) {
			var strWidgetFilePath = this.PATH_PREFIX + objData.type, objClassRef = this;
			this.type = "widget";
			this.widgetData = objData;
			require([strWidgetFilePath], function(WidgetClass) {
				objClassRef.$el.append(objClassRef.widgetData.templateId);
				objClassRef.initliazeWidget();
			});
			this.objData = objData;//this property is being used in componentselector for editing.
		},

        onShow:function(){
        // console.log('widget wrapper',this.bEditor);
         this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);

        }
	});
	WidgetWrapper.prototype.initliazeWidget = function() {
		var objClassRef = this, htmlWidget = this.$el.find("[type=" + this.widgetData.widgetName + "]");
		this.widgetObject = htmlWidget[this.widgetData.widgetName]({
			WIDGET_EVENT : objClassRef.handleWidgetEvent,
			feedbackType : 1,
			widgetData : objClassRef.widgetData.widgetData,
			parentDiv : htmlWidget,
			parentObject : objClassRef,
			updatedScale : objClassRef.widgetData.updatedScale
		});

		this.initWidgetMethod(this.widgetObject[this.widgetData.widgetName]("getFunctionList"));
	};

	WidgetWrapper.prototype.initWidgetMethod = function(arrList) {
		var i = 0, strFunctionName;
		for ( i = 0; i < arrList.length; i++) {
			strFunctionName = arrList[i];
			WidgetWrapper.prototype[strFunctionName] = this.createFunction(strFunctionName);
		}
	};

	WidgetWrapper.prototype.createFunction = function(strFunctionName) {
		var objClassRef = this, objWidgetRef;
		return function() {
			objWidgetRef = objClassRef.getWidgetRef();
			objWidgetRef.widget[objWidgetRef.name]("handleWidgetWrapperCall", strFunctionName, arguments);
		};
	};

	WidgetWrapper.prototype.setStageScaleValue = function(value) {
		var objWidgetRef;
		this.nStageScale = value;
		objWidgetRef = this.getWidgetRef();
		objWidgetRef.widget[objWidgetRef.name]("setStageScaleValue", value);
	};

	WidgetWrapper.prototype.getWidgetRef = function() {
		var objData = {};
		objData.widget = this.widgetObject;
		objData.name = this.widgetData.widgetName;
		return objData;
	};

	WidgetWrapper.prototype.WidgetWrapperSuper = BaseCompositeComp;

	WidgetWrapper.prototype.handleWidgetEvent = function(objEvent) {
		var parent, strEventName = arguments[1].strEventName;
		parent = arguments[1].parent;
		parent.customEventDispatcher(strEventName, parent, arguments[1].data);
	};

	WidgetWrapper.prototype.destroy = function() {
		return this.WidgetWrapperSuper.prototype.destroy.call(this, true);
	};

	return WidgetWrapper;
});
