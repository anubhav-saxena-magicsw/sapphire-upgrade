/*jslint nomen: true*/
/*globals Backbone,$,_, console*/
define(['player/base/base-item-comp', 'components/closecaption/js/close-caption-helper'], function(BaseItemComp, CCHelper) {'use strict';
	var CloseCaptionComp = BaseItemComp.extend({
		tagName : 'div',
		className : 'closeCaptionDivStyle',
		template : _.template("<div>{{ captionText }}</div>"),

		initialize : function(options) {
			//CCHelper.init(this);
			this.objData = options;//this property is being used in componentselector for editing.
			if (this.model === undefined) {
				var CaptionModel = Backbone.Model.extend({
					defaults : {
						captionText : ""
					}
				});
				this.model = new CaptionModel();
				this.model.off('change').on('change', this.render);
			}
			if (options.hasOwnProperty('data')) {
				if (options.data.hasOwnProperty('captionText')) {
					this.model.set('captionText', options.data.captionText);
				}
			}
		},

		onRender : function() {
			this.$el.parent().scrollTop(this.$el.prop('scrollHeight'));
		},
		onShow : function() {
			var self = this;
			this.$el.on("click", $.proxy(self.compClick, self));
			this.$el.on("mouseover", $.proxy(self.compRollover, self));
			this.$el.on("mouseout", $.proxy(self.compRollout, self));
		}
	});

	CloseCaptionComp.prototype.__super__ = BaseItemComp;

	/**
	 * This function is used to clear all the caption text from caption area
	 */
	CloseCaptionComp.prototype.clear = function() {
		// TODO: clear the caption text from caption block
		this.model.set('captionText', "");
		this.$el.html("");
	};

	/**
	 * This function is used to append caption text when notified by audio/video player
	 * @param {Object} strCaption caption string to be added/display in caption area
	 */
	CloseCaptionComp.prototype.append = function(strCaption, bNewLine) {

		if (strCaption && strCaption !== "") {
			if (bNewLine !== false) {
				strCaption = strCaption + "<br>";
			}
			//this.$el.append(strCaption);
			strCaption = this.model.get('captionText').concat(strCaption);
			this.model.set('captionText', strCaption);
		} else {
			console.warn('No caption text specified!');
		}

	};

	CloseCaptionComp.prototype.hookEvent = function() {
		// hook event
	};

	CloseCaptionComp.prototype.unhookEvent = function() {
		// unhook event
	};

	CloseCaptionComp.prototype.destroy = function(bDestroy) {
		this.$el.off("click");
		this.$el.off("mouseover");
		this.$el.off("mouseout");
		CCHelper.destroy(bDestroy);
		bDestroy = (bDestroy === undefined)?true:bDestroy;
		return this.__super__.prototype.destroy(bDestroy);
	};

	return CloseCaptionComp;
});
