/*jslint nomen: true */
/*globals MCQCompHelper,_,$,console,Backbone*/

/**
 * @author sanjeev.baurai
 */
define(['marionette', 'components/case/case'],

/**
 * @class Button
 * @augments BaseItemComp
 * @param {Object} obj .
 */

function(Marionette, Case) {
	'use strict';
	var Life = Case.extend({
	});

	Life.prototype.enable = function() {
		this.isEnabled = true;
		this.$el.removeClass('disabled');
	};

	Life.prototype.disable = function() {
		this.isEnabled = false;
		this.$el.addClass('disabled');
	};

	Life.prototype.LifeSuper = Case;

	/**
	 * Destroys Button instance.
	 * @memberof Button
	 * @param none.
	 * @returns none.
	 *
	 */
	Life.prototype.destroy = function() {
		return this.LifeSuper.prototype.destroy.call(this, true);
	};

	return Life;
});

