/**
 * SliderConstants
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */

define(

/**
 *Constants/EventConstants related to Slider can be accessed through this.
 *@namespace SliderConstants
 */
function() {"use strict";
	var SliderConstants = /** @lends SliderConstants */
	{

		/**
		 * @memberof SliderConstants
		 * @access public
		 */
		CONSTANTS : {
			/**
			 * Sets the allignment of Slider to horizontal
			 * Refer to this by {@link SliderConstants.CONSTANTS.HORIZONTAL}.
			 * @memberof SliderConstants
			 * @const
			*/
			HORIZONTAL : "horizontal",
			/**
			 * Sets the allignment of Slider to vertical
			 * Refer to this by {@link SliderConstants.CONSTANTS.VERTICAL}.
			 * @memberof SliderConstants
			 * @const
			 */
			VERTICAL : "vertical"

		},
		/**
		 * @memberof SliderConstants
		 * @access public
		 */
		EVENTS : {
			/**
			 * Triggers when thumb is moved
			 * Refer to this by {@link SliderConstants.EVENTS.SLIDING_STARTED}.
			 * @memberof SliderConstants
			 * @const
			 */
			SLIDING_STARTED : "SliderStarted",
			/**
			 * Triggers when thumb is moving
			 * Refer to this by {@link SliderConstants.EVENTS.SLIDING_IN_PROGRESS}.
			 * @memberof SliderConstants
			 * @const
			 */
			SLIDING_IN_PROGRESS : "SliderInProgress",
			/**
			 * Triggers when thumb movement stops
			 * Refer to this by {@link SliderConstants.EVENTS.SLIDING_STOPPED}.
			 * @memberof SliderConstants
			 * @const
			 */
			SLIDING_STOPPED : "SliderStopped",
			/**
			 * Triggers on mouseup on thumb
			 * Refer to this by {@link SliderConstants.EVENTS.MOUSEUP_ON_THUMB}.
			 * @memberof SliderConstants
			 * @const
			 */
			MOUSEUP_ON_THUMB : "MouseupOnThumb",
			/**
			 * Triggers on mousedown on thumb
			 * Refer to this by {@link SliderConstants.EVENTS.MOUSEDOWN_ON_THUMB}.
			 * @memberof SliderConstants
			 * @const
			 */
			MOUSEDOWN_ON_THUMB : "MouseDownThumb"
		}
	};

	return SliderConstants;
});