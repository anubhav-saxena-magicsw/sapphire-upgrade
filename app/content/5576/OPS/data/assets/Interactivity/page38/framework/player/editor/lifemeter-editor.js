define(["marionette","player/editor/base-editor"],function(t,e){var o;return o=e.extend({defaultCompData:{}}),o.prototype.getComponent=function(t){this.createCompData($(t))},o.prototype.createCompData=function(t){var e=0,o=[];if(this.defaultCompData=this.prepareDefaultData(t),void 0===this.defaultCompData)throw new Error(this.errorConst.LIFEMETER_DEFAULT_DATA_MISSING);if($(t).find("div").each(function(){e+=1,o.push($(this).attr("class")),$(this).remove()}),0===e)throw new Error(this.errorConst.LIFEMETER_DEFAUTL_DATA_MISSING+" At least one life is required.");this.defaultCompData.total=e,this.defaultCompData.iconClasses=o,this.createComponent(t)},o.prototype.onComponentCreationComplete=function(t){this.objComp=t,this.objComp.defaultData=this.defaultCompData,this.componentCreated()},o.prototype.destroy=function(){return o.__super__.destroy(!0,this)},o});