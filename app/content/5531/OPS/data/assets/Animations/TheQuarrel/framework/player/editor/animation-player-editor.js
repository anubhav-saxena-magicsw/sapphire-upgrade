define(["marionette","player/editor/base-editor"],function(t,e){var o;return o=e.extend({defaultCompData:{}}),o.prototype.getComponent=function(t,e){this.isSimComp=e;var o=void 0!==t.data?t:$(t);this.createCompData(o)},o.prototype.createCompData=function(t){if(this.defaultCompData=this.prepareDefaultData(t),void 0===this.defaultCompData)throw new Error(this.errorConst.ANIMATION_PLAYER_DEFAUTL_DATA_MISSING);this.createComponent(t)},o.prototype.onComponentCreationComplete=function(t){this.objComp=t,this.objComp.defaultData=this.defaultCompData,this.componentCreated()},o.prototype.appendChild=function(t,e){var o;return o=$(t).find("[id="+e.id+"]"),o.removeAttr("type"),o.removeAttr("defaultData"),o.removeAttr("compname"),o=void 0,!1},o.prototype.destroy=function(){return o.__super__.destroy(!0,this)},o});