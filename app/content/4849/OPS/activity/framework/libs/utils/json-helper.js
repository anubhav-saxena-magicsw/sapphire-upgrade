/*jslint nomen: true*/
/*globals Backbone,_,$, console*/
/**
 * JsonHelper
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['marionette'], function(Marionette) {
	'use strict';
	/**
	 *This class introduce to help in  JSON data manipulation
	 *@class JsonHelper
	 *@example
	 * var JsonHelper = new JsonHelper();
	 */
	var JsonHelper;
	JsonHelper = function() {
		return _.extend(this, Backbone.Events);
	};

	JsonHelper.prototype.searchByProperty = function(jsonData, strPropertyName) {
		this.searchByKey(strPropertyName, jsonData, this);
	};

	JsonHelper.prototype.searchCompJsonFilePath = function(objJson, strKey) {
		var i, arrObjects = [], componentsNode = objJson.screens[0].components;
		if (componentsNode) {
			for ( i = 0; i < componentsNode.length; i = i + 1) {
				if (componentsNode[i][strKey] !== undefined) {
					arrObjects.push({
						"index" : i,
						"path" : componentsNode[i][strKey]
					});
				}
			}
		}
		return arrObjects;
	};

	JsonHelper.prototype.searchInJSON = function(json, strCompId) {
		var arrChildComponents, i, objClassref = this, bFound, objData;
		if (json.id === strCompId) {
			objData = {};
			objData.index = 0;
			objData.node = json;
		} else if (json.components !== undefined) {
			objData = this.searchInJSON(strCompId, json.components);
		} else {

			for ( i = 0; i < json.length; i = i + 1) {
				arrChildComponents = json[i];
				if (objData !== undefined) {
					break;
				}
				bFound = objClassref.compareById(strCompId, arrChildComponents);
				if (bFound === false && arrChildComponents.components) {
					objData = this.searchInJSON(strCompId, arrChildComponents.components);
				} else if (bFound === true) {
					objData = {};
					objData.index = i;
					objData.node = arrChildComponents;
					objData.parent = json;
					break;
				}
			}
		}
		return objData;
	};

	return JsonHelper;
});
