/*jslint nomen: true */
/*globals MCQCompHelper,_,$,console,Backbone*/

define(['marionette', 'player/base/base-item-comp', 'css!components/TxtImageRenderer/template/css/TxtImageRenderer.css'],

/**
 * @class TxtImageRenderer
 * @augments BaseItemComp
 * @param {Object} obj .
 */

function(Marionette, BaseItemComp, cssTxtImageRenderer) {'use strict';
	var TxtImageRenderer = BaseItemComp.extend({
		template : _.template('<div id="" class="compStyle"><div id="titleBar" class="titleBar">Title Area</div><div id="contentArea" class="compContentArea">contentArea</div><div id="footerArea" class="compFooterArea">contentArea</div></div>'),
		tagName : 'div',
		toggle : false,
		bSelected : false,
		selectedStyle : undefined,
		normalStyle : undefined,
		/**
		 * Initialization begins here.
		 * @access private
		 * @memberof TxtImageRenderer
		 */
		initialize : function(obj) {
			this.toggle = (obj.toggle === "true") ? true : false;

			if (obj.selectedStyleClass !== undefined) {
				this.selectedStyle = obj.selectedStyleClass;
			}

			if (obj.label) {
				this.text = obj.label;
			}

			if (obj.styleClass) {
				this.extClass = obj.styleClass;
				this.normalStyle = obj.styleClass;
			} else {
				this.extClass = "TxtImageRendererLayout";
			}

			if (obj.data) {
				this.customData = obj.data;
			}

		},
		onRender : function() {
			var objThis = this;
			this.$el.prop('data', this.customData);
			this.$el.addClass(this.extClass);

			if (this.text) {
				$(this.$el.find("span")).text(this.text);
			}
		},
		onShow : function() {
			var self = this;
			this.$el.on("click", $.proxy(self.compClick, self));
			this.$el.on("mouseover", $.proxy(self.compRollover, self));
			this.$el.on("mouseout", $.proxy(self.compRollout, self));
		}
	});

	TxtImageRenderer.prototype.compClick = function() {
		if (this.isEnabled) {
			this.customEventDispatcher("compClick", this, this.$el.prop('data'));
			if (this.toggle === true) {
				this.setSelected(!this.bSelected);
			}
		}
	};
	TxtImageRenderer.prototype.compRollover = function(bSelect) {
		if (this.isEnabled) {
			this.customEventDispatcher("compRollover", this, this.$el.prop('data'));
		}
	};
	TxtImageRenderer.prototype.compRollout = function(bSelect) {
		if (this.isEnabled) {
			this.customEventDispatcher("compRollout", this, this.$el.prop('data'));
		}
	};

	/**
	 * Selected style class will be applied with this method.Also the state is set to be selected
	 * @memberof TxtImageRenderer
	 * @param {Boolean} The state of TxtImageRenderer.
	 * @returns {none}
	 *
	 */
	TxtImageRenderer.prototype.setSelected = function(bSelect) {
		var styleName = ((bSelect === true) ? this.selectedStyle : this.normalStyle);
		this.bSelected = bSelect;
		this.$el.removeClass(this.selectedStyle);
		this.$el.removeClass(this.normalStyle);
		this.styleClass(styleName);
	};

	/**
	 * Custom class can be applied with this method.
	 * @memberof TxtImageRenderer
	 * @param {String} The name of the class.
	 * @returns {String} If argument is not provided, current class attribute value is returned.
	 *
	 */
	TxtImageRenderer.prototype.styleClass = function(arg) {
		if (arg) {
			this.$el.addClass(arg);
		} else {
			return this.$el.attr('class');
		}
	};

	/**
	 * Custom data can be associated or retrived with TxtImageRenderer by this method.
	 * @memberof TxtImageRenderer
	 * @param {Object} The data is to be associate with TxtImageRenderer. If nothing is passed then it would return the data assciated.
	 * @returns {Object} If argument is not provided.
	 *
	 */
	TxtImageRenderer.prototype.data = function(arg) {
		if (arg) {
			this.$el.prop("data", arg);
		} else {
			return this.$el.prop('data');
		}
	};

	TxtImageRenderer.prototype.Super = BaseItemComp;

	/**
	 * Destroys TxtImageRenderer instance.
	 * @memberof TxtImageRenderer
	 * @param none.
	 * @returns none.
	 *
	 */
	TxtImageRenderer.prototype.destroy = function() {
		var objThis;
		objThis = this;
		this.$el.off("click");
		this.$el.off("mouseover");
		this.$el.off("mouseout");
		delete this.customData;
		delete this.extClass;
		delete this.text;
		return this.Super.prototype.destroy(true);
	};

	return TxtImageRenderer;
});

