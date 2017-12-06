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
define(['marionette', 'player/base/base-item-comp', 'components/radio/model'], function(Marionette, BaseItemComp, Model) {
	'use strict';
	var RadioComp;

	RadioComp = BaseItemComp.extend({
		objData : null,
		template : _.template("<input id='' name='' type='{{view}}'  />"),
		$input : null,
		tagName : "div'",

		/*
		 * Initialization begins here.
		 */
		initialize : function(objData) {
			this.objData = objData;//this property is being used in componentselector for editing.
			this.model = new Model(objData);
			this.componentType = "radio";
		},
		/*
		 * Model controls the JSON attributes and render the components
		 */
		onRender : function() {
			var self = this;
			this.$input = this.$el.find('input');
			this.$input.attr('name', this.model.get("name"));

			if (this.model.get("checked") == "true" || this.model.get("checked") === true) {
				this.$input.attr('checked', true);
			}
			if (this.model.get("disabled") == "true" || this.model.get("disabled") === true) {
				this.$input.attr('disabled', true);
			}

			if (this.bEditor === false) {
				this.$input.attr("class", this.model.get("styleClass"));
				this.$input.off("click").on("click", $.proxy(self.compClick, self));
				this.$input.off("mouseover").on("mouseover", $.proxy(self.compRollover, self));
				this.$input.off("mouseout").on("mouseout", $.proxy(self.compRollout, self));
			} else {
				if (this.model.get("styleClass") !== undefined) {
					this.$el.attr("class", this.model.get("styleClass"));
				}
				this.$input.attr("class", this.model.get("styleClass"));
				this.$input.css("left", "0px");
				this.$input.css("top", "0px");
				this.$input.css("display", "inherit");
				this.$input.css("pointer-events","none");
			}
		},
		
		getValue : function() {
			return this.model.get("value");
		},

		isSelected : function() {
			return this.$input.is(":checked");
		},

		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		}
	});
    
    RadioComp.prototype.compClick = function(e) {
	 	this.customEventDispatcher("compClick", this, this.getValue());
		this.customEventDispatcher("click", this, this.getValue());	
	};
    
    RadioComp.prototype.compRollover = function(e) {
	 	this.customEventDispatcher("compRollover", this, this.getValue());
		this.customEventDispatcher("rollover", this, this.getValue());	
	};
    
    RadioComp.prototype.compRollout = function(e) {
	 	this.customEventDispatcher("compRollout", this, this.getValue());
		this.customEventDispatcher("rollout", this, this.getValue());	
	};
    
	RadioComp.prototype.__super__ = BaseItemComp;

	/**
	 * This method is responsible to check that given component type
	 * can be added in its dom or not
	 * will return true if given component type (in parameter) can be added
	 * in its dom.
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof Feedback#
	 */
	RadioComp.prototype.isValid = function(strcomptype) {
		return false;
	};

	RadioComp.prototype.destroy = function() {
		this.$el.off("click");
		this.$el.off("mouseover");
		this.$el.off("mouseout");
		return this.__super__.prototype.destroy.call(this, true);
	};
	return RadioComp;
});
