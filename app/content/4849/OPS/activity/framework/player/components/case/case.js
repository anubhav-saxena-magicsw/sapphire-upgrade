/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * CaseBox
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['marionette', 'components/container'], function(Marionette, BaseDisplayComp) {
	'use strict';
	var CaseBox;

	CaseBox = BaseDisplayComp.extend({
		objData : null,
		template : _.template(''),

		initialize : function(objData) {
			var objThis = this;
			this.objData = objData;
			//this property is being used in componentselector for editing.
			this.componentType = "case";
		},

		onRender : function() {
			if (this.objData.styleClass !== undefined) {
				$(this.$el).addClass(this.objData.styleClass);
				$(this.el).attr('id', this.strCompId);
				//$(this.el).css('pointer-events', 'none');
			}
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
			if (strCompType === "radio" || strCompType === "answer" || strCompType === "hint") {
				validComponent = false;
			}
			return validComponent;
		},

		onShow : function() {
		}
	});

	/** Store the super class reference. */
	CaseBox.prototype.CaseBoxSuper = BaseDisplayComp;

	/**
	 * Destroy
	 */
	CaseBox.prototype.destroy = function() {
		return this.CaseBoxSuper.prototype.destroy.call(this, true);
	};

	return CaseBox;
});
