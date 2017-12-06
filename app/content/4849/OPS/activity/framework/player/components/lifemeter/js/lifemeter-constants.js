/**
 * LifeMeterConstants
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * Here is the full license text and copyright
 * notice for this file. Note that the notice can span several
 * lines and is only terminated by the closing star and slash.
 * @copyright (c) 2013 Magic Software
 *
 */

define(

/**
 *Constants/EventConstants related to LifeMeter can be accessed through this.
 *@namespace LifeMeterConstants
 */
function() {"use strict";
	var LifeMeterConstants = /** @lends LifeMeterConstants */
	{

		/**
		 * @memberof LifeMeterConstants
		 */
		CONSTANTS : {
			/**
			 * Sets the life increment/decrement order to ascending order.
			 * Refer to this by {@link SliderConstants.CONSTANTS.CHANGE_ORDER_ASCENDING}.
			 * @const
			 * @memberof LifeMeterConstants
			 */
			CHANGE_ORDER_ASCENDING : "CHANGE_ORDER_ASCENDING",
			/**
			 * Sets the life increment/decrement order to decending order.
			 * Refer to this by {@link SliderConstants.CONSTANTS.CHANGE_ORDER_DESCENDING}.
			 * @const
			 * @memberof LifeMeterConstants
			 */
			CHANGE_ORDER_DESCENDING : "CHANGE_ORDER_DESCENDING",
			/*
			 * Sets the life meter layout to horizontal to arrange life icons horizontally.
			 * Refer to this by {@link SliderConstants.CONSTANTS.LAYOUT_HORIZONTAL}.
			 * @const
			 * @memberof LifeMeterConstants
			 */
			LAYOUT_HORIZONTAL : "LAYOUT_HORIZONTAL",
			/*
			 * Sets the life meter layout to vertical to arrange life icons vertically.
			 * Refer to this by {@link SliderConstants.CONSTANTS.LAYOUT_VERTICAL}.
			 * @const
			 * @memberof LifeMeterConstants
			 */
			LAYOUT_VERTICAL : "LAYOUT_VERTICAL"
		},
		/**
		 * @memberof LifeMeterConstants
		 */
		EVENTS : {
			/**
			 * Triggered when remaining life reaches to 0 while losing life.
			 * Refer to this by {@link SliderConstants.EVENTS.LIFE_ENDED}.
			 * @const
			 * @memberof LifeMeterConstants
			 */
			LIFE_ENDED : "LIFE_ENDED",
			/**
			 * Triggered when remaining life reaches to MAX while gaining life.
			 * Refer to this by {@link SliderConstants.EVENTS.LIFE_AT_MAX}.
			 * @const
			 * @memberof LifeMeterConstants
			 */
			LIFE_AT_MAX : "LIFE_AT_MAX"
		}
	};

	return LifeMeterConstants;
});

