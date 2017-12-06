/*jslint nomen: true*/
/*globals WebServiceManager*/
/**
 * ServiceManagerFactory
 * @fileoverview 
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

/**
 * ServiceManagerFactory is used to provide the context by which web service will be executed.
 * @namespace ServiceManagerFactory
 * @access private
 */

var ServiceManagerFactory = {		
		
	/** @property {Object} _objContenxt Contains the refernce of the context. 
	 * @memberof ServiceManagerFactory
	 * @access private
	 * */ 
	_objContenxt: null,
	
	/**
	 * This returns the context which will execute the web service call
	 * @memberof ServiceManagerFactory
	 * @access private
	 * @function 
	 * @param None
	 * @returns {Object}
	 */
	getContext: function ()
	{
	    'use strict';
		if (this._objContenxt === null)
		{
			var strUserAgent = String(navigator.userAgent).toLowerCase();
			
			if (strUserAgent.indexOf("macintosh") > -1 || strUserAgent.indexOf("ipad") > -1 || strUserAgent.indexOf("android") > -1 || strUserAgent.indexOf("windows") > -1 || strUserAgent.indexOf("linux") > -1)
			{
				this._objContenxt = new WebServiceManager();
			}
			else
			{
				alert("Unable to detect device");
				return;
			}
		}	
		return this._objContenxt;
	}
	
};
