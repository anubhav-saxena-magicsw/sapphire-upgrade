define(["marionette","player/base/base-collection-comp","components/togglebuttongroup/js/toggle-button-group-model","components/togglebuttongroup/js/toggle-button-group-collection","css!components/togglebuttongroup/css/toggle-button-group.css","components/togglebutton/toggle-button","components/togglebutton/model/toggle-button-model"],function(t,e,o,i,n,s,l){var d=e.extend({itemView:s,className:function(){var t="toggleButtonContainer";return void 0!==this.options.toggleBtnGroupContainerCSS&&(t=this.options.toggleBtnGroupContainerCSS),t},arrViewsToToggle:[],lastToggledView:void 0,initialize:function(t){var e=this;if(this.currentBtnSelectedIndex=0,this.childViews=[],this.userDefinedOrientation=t.orientation,this.model=new o,void 0!==t.buttonsCount&&this.model.set("buttonsCount",t.buttonsCount),void 0!==t.gap&&this.model.set("gap",t.gap),void 0!==t.paddingLeft&&this.model.set("paddingLeft",t.paddingLeft),void 0!==t.paddingTop&&this.model.set("paddingTop",t.paddingTop),this.initializeCollection(t),t.viewsToToggle instanceof Array){if(t.viewsToToggle.length!=this.model.get("buttonsCount"))throw new Error("ToggleButtonGroup : Views count should be equal to the count of buttons");_.each(t.viewsToToggle,function(t){e.arrViewsToToggle.push($(t)),$(t).hide()}),parseInt(t.defaultSelectedIndex)>=0&&parseInt(t.defaultSelectedIndex)<this.model.get("buttonsCount")&&(this.currentBtnSelectedIndex=parseInt(t.defaultSelectedIndex))}},onShow:function(){this.updateChildViewArray(),this.addListenerToChildViews(),this.listenTo(this.model,"change:orientation",this.setChildViewsAlignment),this.model.set("orientation",this.userDefinedOrientation,{validate:!0}),this.childViews[this.currentBtnSelectedIndex].$el.trigger("click")},addListenerToChildViews:function(){var t=this;_.each(t.childViews,function(e,o){e.on(e.EVENTS.ON_CHANGE,function(){t.clearAll(),this.model.set("state",1),t.currentBtnSelectedIndex=o+1,t.toggleView(o),t.customEventDispatcher("itemClickEvent",t,{btnIndex:t.currentBtnSelectedIndex})})})},toggleView:function(t){var e=this;e.arrViewsToToggle.length>0&&(void 0!==e.lastToggledView&&e.arrViewsToToggle[e.lastToggledView].hide(),e.lastToggledView=t>=0&&t<e.arrViewsToToggle.length?t:t>=e.arrViewsToToggle.length?e.arrViewsToToggle.length-1:0,e.arrViewsToToggle[e.lastToggledView].show())},setChildViewsAlignment:function(){var t,e,o,i,n,s,l,d,r,h,g;e=this.model.get("orientation"),o=this.model.get("gap"),i=this.model.get("paddingLeft"),n=this.model.get("paddingTop"),s=l=d=r=0,void 0!==this.childViews&&(_.each(this.childViews,function(d,r){t=d,"vertical"===e?(l=t.$el.height(),s=n+l*r+o*r,t.$el.css({position:"absolute",top:s+"px",left:i+"px"})):(l=t.$el.width(),s=i+r*l+o*r,t.$el.css({position:"absolute",left:s+"px",top:n+"px"}))},this),h=parseInt(t.$el.css("top").split("p")[0],10),r=h>n?n+h+t.$el.height():2*n+t.$el.height(),g=parseInt(t.$el.css("left").split("p")[0],10),d=g>i?i+g+t.$el.width():2*i+t.$el.width()),this.$el.css({height:r+"px",width:d+"px"}),this.customEventDispatcher("orientationChange",this)},updateChildViewArray:function(){this.childViews=[],_.each(this.collection.models,function(t){var e=this.children.findByModel(t);this.childViews.push(e)},this)},initializeCollection:function(t){var e,o,n=[];for(o=0;o<this.model.get("buttonsCount");o+=1)e=new l,void 0!==t.normalClass&&e.set("normalClass",t.normalClass),void 0!==t.buttonLabel[o]&&e.set("label",t.buttonLabel[o]),void 0!==t.state&&e.set("state",t.state),void 0!==t.shouldToggle&&e.set("shouldToggle",t.shouldToggle),n.push(e);this.collection=new i(n)}});return d.prototype.__super__=e,_.extend(d.prototype,{TOGGLE_BUTTON_GROUP_ITEM_CLICK:"itemClickEvent",TOGGLE_BUTTON_GROUP_ORIENTATION_CHANGE:"orientationChange",setSelected:function(t){this.clearAll();var e=this.collection.models[t-1];void 0!==e&&e.set("state",1),this.currentBtnSelectedIndex=t},getSelected:function(){return this.currentBtnSelectedIndex},clearAll:function(){_.each(this.collection.models,function(t){t.set("state",0)})},clearSelection:function(t){var e=this.collection.models[t-1];void 0!==e&&e.set("state",0)},setOrientation:function(t){this.model.set("orientation",t)},getToggles:function(){return this.childViews},destroy:function(){for(var t,e;this.collection.first();)t=this.collection.first(),e=this.children.findByModel(t),e.destroy(),t.destroy(),t=null;return this.collection=null,this.model.destroy(),this.model=null,this.undelegateEvents(),this.unbind(),this.remove(),this.__super__.prototype.destroy(!0)}}),d});