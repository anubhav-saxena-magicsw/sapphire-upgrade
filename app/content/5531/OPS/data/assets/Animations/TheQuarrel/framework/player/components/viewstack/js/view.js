define(["marionette","player/base/base-item-comp"],function(e,i){var s=i.extend({template:_.template(""),tagName:"div",initialize:function(){var e=this;this.onRender(),e.listenTo(e.model,"change : isVisible",e.visibilityChange),e.listenTo(e.model,"change : isVisible",e.classChanged)},onRender:function(){var e=this;$(e.el).addClass(e.model.get("Viewclass")),$(e.el).empty(),$(e.el).append(e.model.get("viewContent")),this.model.get("isVisible")?$(e.el).css({display:"block"}):$(e.el).css({display:"none"})},visibilityChange:function(){var e=this;e.model.get("isVisible")?$(e.el).css({display:"block"}):$(e.el).css({display:"none"})},classChanged:function(){var e=this;$(e.el).addClass(e.model.get("Viewclass"))},contentChanged:function(){var e=this;$(e.el).empty(),$(e.el).append(e.model.get("viewContent"))}});return s});