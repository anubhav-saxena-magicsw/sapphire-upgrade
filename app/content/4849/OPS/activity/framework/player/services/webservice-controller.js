/*jslint continue: true */
/*globals WebServiceDefinitions,WebService*/
/**
 * WebServiceController
 * @fileoverview 
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */


/**
 * WebServiceController is used the load WebServiceDefinition and provide access to call the loaded web methods.
 * @namespace WebServiceController
 * @access private
 */

var WebServiceController = {

	/**
	 * This loads the service's objects from the web service definitions.
	 * @memberof WebServiceController
	 * @param None
	 * @returns {Boolean}
	 */
	init: function ()
	{
	    'use strict';
		if (WebServiceDefinitions === undefined || typeof(WebServiceDefinitions) !== "object" || WebServiceDefinitions.length === undefined)
		{
			return false;
		}
	
		var obj, i, iLen = WebServiceDefinitions.length;
		for (i = 0; i < iLen; i+=1)
		{
			obj = WebServiceDefinitions[i];
			if (obj === undefined || typeof(obj) !== "object" || obj.name === undefined)
			{
				continue;
			}

			WebServiceController[obj.name] = new WebService();
			WebServiceController[obj.name].init(obj);
		}
		return true;
	}
};
