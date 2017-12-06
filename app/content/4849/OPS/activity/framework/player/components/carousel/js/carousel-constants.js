/**
 * CarouselConstants
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access public
 */

define(

/**
 *Constants/EventConstants related to Carousel can be accessed through this.
 *@namespace CarouselConstants
 * @access public
 */
function() {"use strict";
	var CarouselConstants = /** @lends CarouselConstants */
	{

		/**
		 * @memberof CarouselConstants
		 */
		CONSTANTS : {
			/**
			 * Sets the allignment of Carousel to horizontal
			 * Refer to this by {@link CarouselConstants.CONSTANTS.HORIZONTAL}.
			 * @memberof CarouselConstants
			 * @access private
			 * @const
			*/
			HORIZONTAL : "horizontal",
			/**
			 * Sets the allignment of Carousel to vertical
			 * Refer to this by {@link CarouselConstants.CONSTANTS.VERTICAL}.
			 * @memberof CarouselConstants
			 * @access private
			 * @const
			 */
			VERTICAL : "vertical",
			/**
			 * Sets the allignment of Carousel to vertical
			 * Refer to this by {@link CarouselConstants.CONSTANTS.CIRCULAR}.
			 * @memberof CarouselConstants
			 * @access private
			 * @const
			 */
			CIRCULAR : "circular",
			/**
			 * Sets the allignment of Carousel to vertical
			 * Refer to this by {@link CarouselConstants.CONSTANTS.LINEAR}.
			 * @memberof CarouselConstants
			 * @access private
			 * @const
			 */
			LINEAR : "linear"

		},
		/**
		 * @memberof CarouselConstants
		 */
		EVENTS : {
			/**
			 * Triggers when next or back button is pressed
			 * Refer to this by {@link CarouselConstants.EVENTS.INDEX_CHANGED}.
			 * @memberof CarouselConstants
			 * @access public
			 * @const
			 */
			INDEX_CHANGED : "indexChanged",
			
			/**
			 * Triggers when an image is selected
			 * Refer to this by {@link CarouselConstants.EVENTS.COMPONENT_INITIALIZED}.
			 * @memberof CarouselConstants
			 * @access public
			 * @const
			 */
			COMPONENT_INITIALIZED : "componentInitialized"
		}
	};

	return CarouselConstants;
});