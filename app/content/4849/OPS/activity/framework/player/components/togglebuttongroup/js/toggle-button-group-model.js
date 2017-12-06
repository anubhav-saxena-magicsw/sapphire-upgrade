/*jslint nomen: true*/
/*globals Backbone,_,$,console*/
/**
 * ToggleButtonGroupModel
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(['player/base/base-activity-model'],
/**
 *A module representing a ToggleButtonGroupModel.
 * @class ToggleButtonGroupModel
 * @augments Backbone.Model
 * @access private
 * @example
 *
 * require(['components/toggleButtonGroup/js/ToggleBtnGroupModel'], function(ToggleBtnGroupModel) {
 *    var toggleBtnGroupModel = new ToggleBtnGroupModel();
 * });
 */
function(BaseActivityModel) {'use strict';

	var ToggleBtnGroupModel =  /** @lends ToggleBtnGroupModel.prototype */ BaseActivityModel.extend({

		validate : function(attributes) {
			if (attributes.orientation !== 'vertical' && attributes.orientation !== 'horizontal') {
				this.set('orientation', 'horizontal');
				return "Please provide valid Orientation - Horizontal or Vertical. Rendering Group using default Horizontal orientation.";
			}

			if (attributes.gap < 0) {
				return "Please provide a positive value.";
			}

			if (attributes.buttonsCount < 0) {
				return "Please provide a positive value for buttons.";
			}
		},

		defaults : {
			buttonsCount : 2,
			orientation : '',
			gap : 5,
			paddingLeft : 10,
			paddingTop : 20
		}
	});

	/**
	 * Set the super to BaseActivityModel
	 * @access private
	 * @memberof ToggleBtnGroupModel#
	 */
	ToggleBtnGroupModel.prototype.__super__ = BaseActivityModel;

	return ToggleBtnGroupModel;
});
