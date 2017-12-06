/*jslint nomen: true*/
/*globals Backbone,_,$,console*/
/**
 * DataLoader
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */

define(['marionette', 'json2xml', 'xml2json', 'player/constants/errorconst'], function(Marionette, JSON2XML, XML2JSON, errorConst) {
	'use strict';
	/**
	 *This class will load the data in JSON/XML format
	 *@class DataLoader
	 *@example
	 * var dataLoader = new DataLoader();
	 */
	var DataLoader, getDataInJsonFormat, requireData, onRequireDataLoadSuccess;
	DataLoader = function() {
		return _.extend(this, Backbone.Events);
	};
	/**
	 * @memberof DataLoader#
	 * @access public
	 */
	DataLoader.prototype = {
		/** @constant
		 @memberof DataLoader
		 @access public
		 @type {string}
		 @default
		 */
		DATA_LOAD_SUCCESS : 'dataLoadSuccess',

		/** @constant
		 @memberof DataLoader
		 @access public
		 @type {string}
		 @default
		 */
		DATA_LOAD_FAILED : 'dataLoadFailed',

		SCOPE : "",

		/**
		 * Function to load the data as per the url sent using ajax call
		 * @memberof DataLoader
		 * @access public
		 * @param {Object} options contains the info of the resource to be loaded
		 * @return None
		 */
		load : function(options, bIgnoreRquire) {

			this.SCOPE = options.scope;

			//bIgnoreRquire = true;
			if (bIgnoreRquire === true) {

				// check for the presence of the url
				if (options && options.hasOwnProperty('url') && options.url !== "" && options.url !== undefined) {
					var dataType, contentType, objThis, reqType, isHeaders, reqData, reqHeaders, ajaxObj;

					objThis = this;
					reqHeaders = (options.hasOwnProperty('headers')) ? options.headers : {};
					reqData = (options.hasOwnProperty('data')) ? options.data : {};
					reqType = (options.hasOwnProperty('type')) ? options.type : 'GET';
					dataType = (options.hasOwnProperty('dataType')) ? options.dataType : 'json';
					contentType = (options.hasOwnProperty('contentType')) ? options.contentType : 'application/json';

					//console.log(reqData);
					// do the ajax call
					ajaxObj = {
						url : options.url,
						data : reqData,
						type : reqType,
						headers : reqHeaders,
						dataType : dataType,
						async : false,
						success : function(data, textStatus, jqXHR) {
							if (textStatus === "success") {
								var obj = null;

								switch (options.returnType) {
								case "json":
									obj = getDataInJsonFormat(dataType, data);
									break;
								case "xml":
									obj = data;
									break;
								default:
									obj = data;
									break;
								}
								//console.log(obj);
								objThis.trigger(objThis.DATA_LOAD_SUCCESS, obj, objThis.SCOPE);
								//objThis.SCOPE = undefined;

							} else {
								alert(errorConst.UNKNOW_ERROR);
							}
						},
						error : function(jqXHR, textStatus, errorThrown) {
							if (options.hasOwnProperty('errorEvent')) {
								objThis.trigger(objThis.DATA_LOAD_FAILED, jqXHR, textStatus, errorThrown, objThis.SCOPE);
							}
							console.log(errorConst.ERROR_WHILE_LOADING_FILE + " ::: " + options.url, jqXHR, textStatus, errorThrown);
						}
					};
					if (options && options.async.toString() === "true") {
						ajaxObj.async = true;
					}
					if (options && options.url === 'saveActivity') {
						ajaxObj.async = false;

					}
					if (options.url === 'uploadAsset') {
						ajaxObj.cache = false;
						ajaxObj.contentType = false;
						ajaxObj.processData = false;
					}
					$.ajax(ajaxObj);
				} else {
					throw new Error(errorConst.NO_URL);
				}
			} else {
				requireData(options, this);
			}
		}
	};

	/**
	 * This function converts the data into json format
	 * @memberof DataLoader
	 * @access private
	 * @param {Object} dataType
	 * @param {Object} data
	 * @returns None
	 */
	getDataInJsonFormat = function(dataType, data) {
		var obj = null;
		switch (dataType) {
		case "xml":
			obj = $.xml2json(data);
			break;
		case "text":
			obj = $.parseJSON(data);
			break;
		case "json":
			obj = data;
			break;
		default:
			alert(errorConst.UNKNOW_ERROR_WHILE_CONVERTING_DATA);
			break;
		}
		return obj;
	};

	requireData = function(dataToLoad, classref) {
		var objClassref = this;
		require(["text!" + dataToLoad.url], function(loadedData) {
			try {
				onRequireDataLoadSuccess(dataToLoad, loadedData, classref);
			} catch(e) {
				console.log("Error while loading......", dataToLoad.url, " Error ", e);
			}
		});
	};

	onRequireDataLoadSuccess = function(dataToLoad, loadedData, classref) {
		var xmlData, dataToReturn, objThis = this;
		if (dataToLoad.returnType === "txt" || dataToLoad.returnType === "text") {
			dataToReturn = loadedData;
		} else if (dataToLoad.dataType === "xml" && dataToLoad.returnType === "json") {
			xmlData = $.parseXML(loadedData).documentElement;
			dataToReturn = $.xml2json(xmlData);
		} else if (dataToLoad.returnType === "json") {
			dataToReturn = $.parseJSON(loadedData);
		} else if (dataToLoad.returnType === "xml") {
			dataToReturn = $.parseXML(loadedData).documentElement;
		}
		classref.trigger(classref.DATA_LOAD_SUCCESS, dataToReturn, classref.SCOPE);
	};
	// return the data loader object
	return DataLoader;

});
