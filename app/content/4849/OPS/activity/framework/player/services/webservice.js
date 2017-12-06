/*jslint nomen: true*/
/*globals WebServiceMethod*/
/**
 * WebService
 * @fileoverview 
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

/**
 * This class represents a web service bus and initializes the method of web service. It contains all the method objects for easy and controlled access.
 * @access private
 * @class WebService
 */

var WebService = function ()
{
    'use strict';
	/**
	 * 
	 *@access private 
	 *@memberof WebService
	 * @property {String} url Contains the name of url for the web service. */
	this.url = "";
	/**
	 * @access private
	 *@memberof WebService
	 *  @property {String} _name Contains the name of method. */
	this._name = "";
	/** 
	 * @access private
	 *@memberof WebService
	 * @property {String} namespace Contains the namespace of web service. */
	this.namespace = "";

	/** This function initializes the web service method
	 * @access private
	 *@memberof WebService
	 * @param {Object} objService Object of web service information.
	 * @returns None
	 */
	this.init = function (objService)
	{
	    var i, objMethods, iLen, obj;
		if (typeof (objService) !== "object")
		{
			return false;
		}
		
		if (objService.name === undefined)
		{
			return false;
		}
		if (objService.namespace === undefined)
		{
			return false;
		}
		if (objService.endpoint === undefined)
		{
			return false;
		}
		
		this.url = objService.endpoint;
		
		this._name = objService.name;
		this.namespace = objService.namespace;
		
		objMethods = objService.methods;
		if (typeof (objMethods) === "object" && objMethods.length !== undefined)
		{
			iLen = objMethods.length;
			for (i = 0; i < iLen; i+=1)
			{
				obj = objMethods[i];
				if (typeof(obj) === "object" && obj.name !== undefined && typeof(obj.name) === "string")
				{
					this[obj.name] = new WebServiceMethod();
					this[obj.name].init(this, obj);
				}
				/*else
				{
					invalid service method
				}*/
			}
		}
	};
};
