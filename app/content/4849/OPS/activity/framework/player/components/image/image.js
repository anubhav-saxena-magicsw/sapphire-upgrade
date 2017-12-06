/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * Image
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['marionette', 'player/base/base-item-comp', 'components/image/model'], function(Marionette, BaseItemComp, Model) {
	'use strict';
	var ImageComp;

	ImageComp = BaseItemComp.extend({
		objData : null,
		template : _.template('<img src="{{src}}" alt="{{alttext}}"/>'),
		tagName : "div",
		initialize : function(objData) {
			var objThis = this;
			this.objData = objData;
			//this property is being used in componentselector for editing.
			this.model = new Model(objData);
			this.componentType = "image";
		},
		onRender : function() {
			var objImageTag = this.$el.children()[0];
			if (this.objData.styleClass !== undefined) {
				this.$el.attr("class", this.objData.styleClass);
				$(objImageTag).css("width", "inherit");
				$(objImageTag).css("height", "inherit");
				$(objImageTag).css("border-raidus", "inherit");
				$(objImageTag).css("opacity", "inherit");
			}
		},
		onShow : function() {
			var self = this;
			if (this.bEditor === false) {
				this.$el.on("click", $.proxy(self.compClick, self));
				this.$el.on("mouseover", $.proxy(self.compRollover, self));
				this.$el.on("mouseout", $.proxy(self.compRollout, self));
			}
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		}
	});

	ImageComp.prototype.isValid = function(strcomptype) {
		return false;
	};

	ImageComp.prototype.changeSrc = function(newSrc) {
		this.model.set("src", newSrc);
		this.render();
	};

	ImageComp.prototype._changeSource = function(strPath) {
		var $img;
		$img = this.$el.find("img");
		$img.attr("src", strPath);
	};

	ImageComp.prototype.__super__ = BaseItemComp;

	ImageComp.prototype.destroy = function() {
		this.$el.off("click");
		this.$el.off("mouseover");
		this.$el.off("mouseout");
		return this.__super__.prototype.destroy.call(this, true);
	};
	return ImageComp;
});
