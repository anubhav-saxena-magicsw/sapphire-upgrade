/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/

define(['marionette', 'player/base/base-item-comp', 'player/components/label/model'],

/**

 */

function(Marionette, BaseItemComp, Model) {
	'use strict';
	var Label = BaseItemComp.extend({
		template : _.template('<span>{{text}}</span>'),
		tagName : 'span',
		/**
		 * Initialization begins here.
		 * @access private
		 * @memberof Button
		 */
		initialize : function(obj) {
			this.objData = obj;
			//this property is being used in componentselector for editing.
			this.model = new Model(obj);
			this.componentType = "label";
		},
		onRender : function() {

		},

		onShow : function() {
			var self = this;
			if (this.bEditor === false) {
				this.$el.on("click", $.proxy(self.compClick, self));
				this.$el.on("mouseover", $.proxy(self.compRollover, self));
				this.$el.on("mouseout", $.proxy(self.compRollout, self));
			}
			this.$el.addClass(this.styleClass());
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		}
	});

	/**
	 * This method is bind with the 'Click' Event of button
	 * Method is responsible to dispatch 'compClick' Event.
	 * @param {none}
	 * @return none
	 * @memberof Button#
	 * @access private
	 */
	Label.prototype.compClick = function(e) {
		if (this.isEnabled === true) {
			this.customEventDispatcher("click", this, this.data());
		}
	};

	/**
	 * This method is bind with the 'rollover' Event
	 * Method is responsible to dispatch 'compRollover' Event.
	 * @param {Boolean} bSelect The state of button.
	 * @return none
	 * @memberof Button#
	 * @access private
	 */
	Label.prototype.compRollover = function(bSelect) {
		if (this.isEnabled === true) {
			var styleOver = this.getClassForState("over");
			if (styleOver.length > 0) {
				this.$el.addClass(styleOver);
			}
			this.customEventDispatcher("rollover", this, this.data());
		}
	};
	/**
	 * This method is bind with the 'rollout' Event of button
	 * Method is responsible to dispatch 'compRollout' Event.
	 * @param {none}
	 * @return none
	 * @memberof Button#
	 * @access private
	 */
	Label.prototype.compRollout = function(bSelect) {
		if (this.isEnabled === true) {
			var styleOver = this.getClassForState("over");
			if (styleOver.length > 0) {
				this.$el.removeClass(styleOver);
			}
			this.customEventDispatcher("rollout", this, this.data());
		}
	};

	Label.prototype.getClassForState = function(strState) {
		var objStylelist = this.model.get("stylelist");
		if (objStylelist) {
			if (objStylelist[strState]) {
				return objStylelist[strState];
			}
		}
		return "";
	};

	Label.prototype.isValid = function(strcomptype) {
		return false;
	};

	Label.prototype.data = function(arg) {
		if (arg) {
			this.model.set("data", arg);
		} else {
			return this.model.get("data");
		}
	};

	Label.prototype.setScreenText = function(strText) {
		this.text(strText);
	};

	Label.prototype.text = function(arg) {
		if (arg) {
			this.model.set("text", arg);
			this.render();
		} else {
			return this.model.get("text");
		}
	};

	Label.prototype.styleClass = function(arg) {
		if (arg) {
			this.model.set("styleClass", arg);
		} else {
			return this.model.get("styleClass");
		}
	};

	Label.prototype.LabelSuper = BaseItemComp;

	Label.prototype._changeText = function(strText) {
		var $span;
		$span = this.$el.find("span");
		$span.html(strText);
	};

	/**
	 * Destroys Button instance.
	 * @memberof Button
	 * @param none.
	 * @returns none.
	 *
	 */
	Label.prototype.destroy = function() {
		var objThis;
		objThis = this;
		this.$el.off("click");
		this.$el.off("mouseover");
		this.$el.off("mouseout");

		return this.LabelSuper.prototype.destroy.call(this, true);
	};

	return Label;
});

