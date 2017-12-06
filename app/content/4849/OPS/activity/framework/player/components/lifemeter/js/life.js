/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/
/**
 * Life
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * Here is the full license text and copyright
 * notice for this file. Note that the notice can span several
 * lines and is only terminated by the closing star and slash.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

define(['marionette', 'player/base/base-item-comp', 'text!components/lifemeter/template/life.html'],
/**
 *A module representing a Life.
 *@class Life
 * @augments BaseItemComp
 *@access private
 */
function(Marionette, BaseItemComp, htmlLife) {'use strict';

	var Life = /** @lends Life.prototype */
	BaseItemComp.extend({
		template : _.template(htmlLife),
		tagName : "div",
		initialize : function() {
			var objThis = this;

			this.model.on("change", function() {
				objThis.changeState(objThis);
			});
			this.componentType = "life";
		},
		onRender : function() {

			var objThis = this;
			$(objThis.el).addClass(objThis.model.get('lifeclass'));
			$(objThis.el).addClass('active');
		}
	});

	/**
	 * To Change the state of life.
	 * @memberof Life
	 * @param {Life} objThis Intance of Life.
	 * @returns none.
	 * @access private
	 */
	Life.prototype.changeState = function(objThis) {

		var state = objThis.model.get('state');

		if (state === 0) {
			$(objThis.el).removeClass('active');
		} else {
			$(objThis.el).addClass('active');
		}

	};

	return Life;
});

