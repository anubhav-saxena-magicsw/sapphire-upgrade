/*globals Backbone*/
/**
 * MPlayerModel
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

define(function(require, exports, module) {'use strict';
	var MPlayerModel, instance, Marionette;
	Marionette = require('marionette');
	instance = null;
	/**
	 *A module representing a mPlayerModel. This is a singleton class.
	 * @access private
	 *@class MPlayerModel
	 *@augments Backbone.Model
	 *@example
	 * var activityController = ActivityController.getInstance();
	 */
	MPlayerModel = Backbone.Model.extend({
		defaults : {
			nActivityIndex : 0,
			arrRegionList : [],
			objRegions : {},
			activityIndex : {}
		}
	});

	/**
	 *Returns value
	 * @access private
	 * @memberof MPlayerModel#
	 * @param None
	 * @return None
	 */
	MPlayerModel.prototype.getValue = function() {

	};

	return {
		/**
		 * getInstance
		 * @access public
		 * @memberOf MPlayerModel#
		 * @param None
		 * @returns {Object} MPlayerModelF
		 */
		getInstance : function() {
			if (!instance) {
				instance = new MPlayerModel();
			}
			return instance;
		}
	};
});
