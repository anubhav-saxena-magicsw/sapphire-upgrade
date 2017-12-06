/*jslint nomen: true */
/*globals MCQCompHelper,_,$,console,Backbone*/

define(['marionette', 'player/base/base-item-comp', 'player/components/button/model'],

/**
 * @class Button
 * @augments BaseItemComp
 * @param {Object} obj .
 */

function(Marionette, BaseItemComp, Model) {
	'use strict';
	var Button = BaseItemComp.extend({
		template : _.template('<span style="pointer-events:none" textAlign="center">{{label}}</span>'),
		tagName : "div",
		toggle : false,
		bSelected : false,
		isEnabled : true,
		/**
		 * Initialization begins here.
		 * @access private
		 * @memberof Button
		 */
		initialize : function(obj) {
			this.objData = obj;
			//this property is being used in componentselector for editing.
			this.toggle = (obj.toggle === "true") ? true : false;
			this.model = new Model(obj);
			this.componentType = "button";
		},

		onRender : function() {
			this.$el.attr("class", this.styleClass());
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

	Button.prototype.BUTTON_STATE_CHANGE = "btnStateChange";

	Button.prototype.isValid = function(strCompType) {
		return false;
	};

	Button.prototype.ButtonSuper = BaseItemComp;

	/**
	 * This method is bind with the 'Click' Event of button
	 * Method is responsible to dispatch 'compClick' Event.
	 * @param {none}
	 * @return none
	 * @memberof Button#
	 * @access private
	 */
	Button.prototype.compClick = function(e) {
		if (this.isEnabled === true) {
			this.customEventDispatcher("compClick", this, this.data());
			this.customEventDispatcher("click", this, this.data());
			if (this.toggle === true) {
				this.setSelected(!this.bSelected);
			}
		}
		//e.stopPropagation();
	};

	/**
	 * This method is bind with the 'rollover' Event
	 * Method is responsible to dispatch 'compRollover' Event.
	 * @param {Boolean} bSelect The state of button.
	 * @return none
	 * @memberof Button#
	 * @access private
	 */
	Button.prototype.compRollover = function(bSelect) {
		if (this.isEnabled === true) {
			var styleOver = this.getClassForState("over");
			if (styleOver.length > 0) {
				this.$el.addClass(styleOver);
			}
			this.customEventDispatcher("mouseover", this, this.data());
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
	Button.prototype.compRollout = function(bSelect) {
		if (this.isEnabled === true) {
			var styleOver = this.getClassForState("over");
			if (styleOver.length > 0) {
				this.$el.removeClass(styleOver);
			}
			this.customEventDispatcher("mouseout", this, this.data());
			this.customEventDispatcher("rollout", this, this.data());
		}
	};

	Button.prototype.getClassForState = function(strState) {
		var objStylelist = this.model.get("stylelist");
		if (objStylelist) {
			if (objStylelist[strState]) {
				return objStylelist[strState];
			}
		}
		return "";
	};

	/**
	 * Selected style class will be applied with this method.Also the state is set to be selected
	 * @memberof Button
	 * @param {Boolean} The state of button.
	 * @returns {none}
	 *
	 */
	Button.prototype.setSelected = function(bSelect) {
		console.log(this.model.get("label")," : ",bSelect);
		var styleSelected = this.getClassForState("selected");
		bSelect = (bSelect === "true" || bSelect === true) ? true : false;
		
		if (bSelect === true && styleSelected.length > 0) {
			this.$el.addClass(styleSelected);
		} else {
			this.$el.removeClass(styleSelected);
		}
		this.bSelected = bSelect;
		//this.customEventDispatcher(this.BUTTON_STATE_CHANGE, this, this.bSelected);
	};

	Button.prototype.enable = function() {
		this.isEnabled = true;
		this.$el.attr("class", this.styleClass());
	};

	Button.prototype.disable = function() {
		var styleDisabled = this.getClassForState("disabled");
		this.isEnabled = false;
		if (styleDisabled.length > 0) {
			this.$el.addClass(styleDisabled);
		} else {
			this.$el.removeClass(styleDisabled);
		}

	};

	/**
	 * Custom data can be associated or retrived with button by this method.
	 * @memberof Button
	 * @param {Object} The data is to be associate with button. If nothing is passed then it would return the data assciated.
	 * @returns {Object} If argument is not provided.
	 *
	 */
	Button.prototype.data = function(arg) {
		if (arg) {
			this.model.set("data", arg);
		} else {
			return this.model.get("data");
		}
	};

	Button.prototype.setScreenText = function(strText) {
		this.label(strText);
	};

	Button.prototype.label = function(arg) {
		if (arg) {
			this.model.set("label", arg);
			this.render();
		} else {
			return this.model.get("label");
		}
	};

	Button.prototype.styleClass = function(arg) {
		if (arg) {
			this.model.set("styleClass", arg);
		} else {
			return this.model.get("styleClass");
		}
	};

	Button.prototype.show = function() {
		this.$el.show();
	};

	Button.prototype.hide = function() {
		this.$el.hide();
	};

	Button.prototype._changeLabel = function(strLable) {
		var $span;
		$span = this.$el.find("span");
		$span.html(strLable);
	};

	/**
	 * Destroys Button instance.
	 * @memberof Button
	 * @param none.
	 * @returns none.
	 *
	 */
	Button.prototype.destroy = function() {
		this.$el.off("click");
		this.$el.off("mouseover");
		this.$el.off("mouseout");
		return this.ButtonSuper.prototype.destroy.call(this, true);
	};

	return Button;
});

