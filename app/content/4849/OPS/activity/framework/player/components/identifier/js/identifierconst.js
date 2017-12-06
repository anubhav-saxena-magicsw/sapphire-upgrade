/**
 * IdentifierConstants
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
 *Constants/EventConstants related to Identfier can be accessed through this.
 *@namespace IdentifierConstants
 */
function() {"use strict";
	var IdentifierConstants = /** @lends IdentifierConstants */
	{

		/**
		 * @memberof IdentifierConstants
		 * @access public
		 */
		CONSTANTS : {
			/**
			 * Sets the property of Identifier to highlighter
			 * Refer to this by {@link IdentifierConstants.CONSTANTS.HORIZONTAL}.
			 * @memberof IdentifierConstants
			 * @const
			*/
			HIGHLIGHTER : "highlighter",
			/**
			 * Sets the property of Idenifier to underline
			 * Refer to this by {@link IdentifierConstants.CONSTANTS.VERTICAL}.
			 * @memberof IdentifierConstants
			 * @const
			 */
			UNDERLINE : "underline"

		},
		/**
		 * @memberof IdentifierConstants
		 * @access public
		 */
		EVENTS : {
			/**
			 * Triggers when selection is done
			 * Refer to this by {@link IdentifierConstants.EVENTS.MOUSEDOWN_ON_SPAN}.
			 * @memberof IdentifierConstants
			 * @const
			 */
			TOGGLE : "toggle",
			MOUSEDOWN_ON_SPAN : "mouseDownSpan",
			MOUSEUP_ON_SPAN : "mouseUpSpan"
			
		}
	};

	return IdentifierConstants;
});