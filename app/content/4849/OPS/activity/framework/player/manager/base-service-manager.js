/**
 * BaseServiceManager
 * @fileoverview 
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

/**
 * BaseServiceManager is used as a base class for web service context
 * @class WebServiceManager
 * @access private
 */
BaseServiceManager = function () {
	'use strict';
};

/**
*This function executes the web service call depending upon the type of service
* @access private
* @memberof BaseServiceManager#
* @param {Object} objData data to send.
* @returns None
*/
BaseServiceManager.prototype.send = function (objData)
{
    'use strict';
};

/**
*This is the sucsess handler function
* @memberof BaseServiceManager#
* @access private
* @param None
* @returns None
*/
BaseServiceManager.prototype.success = function ()
{
	'use strict';
};

/**
*This is the error handler function
* @memberof BaseServiceManager#
* @access private
* @param None
* @returns None
*/ 
BaseServiceManager.prototype.error = function ()
{
	'use strict';
};
/**
* This is the complete handler function
* @memberof BaseServiceManager#
* @access private
* @param None
* @returns None
*/
BaseServiceManager.prototype.complete = function ()
{
	'use strict';
};
	
