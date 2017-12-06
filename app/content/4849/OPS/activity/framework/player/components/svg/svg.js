/*jslint nomen: true */
/*globals MCQCompHelper,_,$,console,Backbone*/

define(['marionette', 'player/base/base-item-comp', 'text!components/svg/template/svg.html', 'css!components/svg/template/css/svg.css'],

/**
 * @class SVG
 * @augments BaseItemComp
 * @param {Object} obj .
 */

function(Marionette, BaseItemComp, htmSvg, cssSvg) {'use strict';
	var SVG = BaseItemComp.extend({
		template : _.template(htmSvg),
		tagName : 'div',
		/**
		 * Initialization begins here.
		 * @access private
		 * @memberof SVG
		 */
		initialize : function(obj) {
		},
		onRender : function() {
		}
	});

	SVG.prototype.bindClick = function(arrIds) {
		var i, objThis, svg, object;
		objThis = this;
		svg = $(this.$el.find('svg'));
		for ( i = 0; i < arrIds.length; i += 1) {
			if (arrIds[i]) {
				object = $(svg.find('#' + arrIds[i]));
				object.off('click').on('click', function(e) {
					var id = $(this).attr('id');
					objThis.customEventDispatcher(id, objThis);
				});
			}
		}
	
	};
	
	SVG.prototype.unBindClick = function(arrIds) {
		var i, objThis, svg, object;
		objThis = this;
		svg = $(this.$el.find('svg'));
		for ( i = 0; i < arrIds.length; i += 1) {
			if (arrIds[i]) {
				object = $(svg.find('#' + arrIds[i]));
				object.off('click');
			}
		}
	
	};

	SVG.prototype.removeObject = function(arrIds) {
		var i,svg,object;
		svg = $(this.$el.find('svg'));
		for ( i = 0; i < arrIds.length; i += 1) {
			if (arrIds[i]) {
				object = $(svg.find('#' + arrIds[i]));
				object.off('click');
				object.remove();
			}
		}
	};

	SVG.prototype.Super = BaseItemComp;

	/**
	 * Destroys SVG instance.
	 * @memberof SVG
	 * @param none.
	 * @returns none.
	 *
	 */
	SVG.prototype.destroy = function() {
		return this.Super.prototype.destroy(true);
	};

	return SVG;
});

