/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * MatchingChild
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['marionette', 'components/case/case'], function(Marionette, Case) {'use strict';
	var MatchingChild;

	MatchingChild = Case.extend({
		objData : null,
		template : _.template(''),

		initialize : function(obj) {
			this.MatchingChildSuper.prototype.initialize.call(this, obj);
			this.objData = obj;
			this.componentType = "matchingChild";
		},

		onRender : function() {
			if (this.objData.styleClass !== undefined) {
				this.$el.addClass(this.objData.styleClass);
				this.$el.attr('id', this.getID());
			}
		},

		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		},

		/**
		 * This method is responsible to check that given component type
		 * can be added in its dom or not
		 * will return true if given component type (in parameter) can be added
		 * in its dom.
		 * @param {Object} strCompType
		 * @return {Boolean}
		 * @access private
		 * @memberof Case#
		 */
		isValid : function(strCompType) {
			var validComponent = true;
			if (strCompType === "hint" || strCompType === "answer" || strCompType === "audiohotspot" || strCompType === "button" || strCompType === "label" || strCompType === "image") {
				validComponent = true;
			} else {
				validComponent = false;
			}
			return validComponent;
		}
	});

	MatchingChild.prototype.MatchingChildSuper = Case;

	MatchingChild.prototype.destroy = function() {
		this.objData = null;
		return this.MatchingChildSuper.prototype.destroy.call(this, true);
	};

	return MatchingChild;
});
