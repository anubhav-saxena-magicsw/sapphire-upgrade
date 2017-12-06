/*jslint nomen: true*/
/*globals Backbone,_,$*/

/**
 * JsonUtil
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2014 Magic Software
 */

define(['marionette', 'json2xml', 'xml2json', 'player/constants/errorconst'], function(Marionette, JSON2XML, XML2JSON, errorConst) {
	'use strict';

	var JsonUtil;

	/**
	 * @class JsonUtil
	 * Class 'JsonUtil' is introduced to manage json related task, eg search, delete in json node
	 * or user can use this class when new json node needs to be added.
	 *
	 * This class have many external API to support JSON data manipulation  few of them are as below:
	 * <i>getChildrenList, getComponentJSONDataById, getCloneObject, cleanJSONData, appendChildComponent,
	 * moveElementPosition, removeJSONNode, getJSONDataNode</i>
	 *
	 *@augments Backbone.Events
	 *@example
	 *Load module
	 *
	 require(['player/utils/json-manipulator'], function(JsonManipulator) {
	 var objJsonUtil = new JsonManipulator()
	 });
	 */

	JsonUtil = function() {
		return _.extend(this, Backbone.Events);
	};

	JsonUtil.prototype.arrStyleClassList = [];

	/**
	 * method 'getChildrenList' will return the json data and its children json node
	 * in array format.
	 * @param {Object} compData jsondata parent node
	 * @param {Number} index set this value 0 when calling
	 *
	 * below parametes are used when this method call itself recursively
	 * @param {Array} arrList no need to send
	 * @param {Stirng} parentId
	 * @param {Boolean} bClear
	 *
	 * @return {Array}
	 * @access public
	 * @memberof jsonUtil#
	 */
	JsonUtil.prototype.getChildrenList = function(compData, index, arrList, parentId, bClear) {
		var dataObject = compData[index], arrUpdatedData, defaultIndex = 0;
		arrUpdatedData = arrList;
		if (arrUpdatedData === undefined) {
			arrUpdatedData = [];
		}
		if (bClear === true && dataObject) {
			dataObject.id = "";
			this.arrStyleClassList.push(dataObject.data.styleClass);
			dataObject.data.styleClass = "";
			//delete dataObject.parentObject;
		}

		dataObject.parentObject = {
			"parentId" : parentId
		};
		arrUpdatedData.push(dataObject);
		/*
		 if (dataObject.type === "wizard") {
		 if (0 <= parseInt(dataObject.data.default) && parseInt(dataObject.data.default) < dataObject.components.length) {
		 defaultIndex = parseInt(dataObject.data.default);
		 }
		 return this.getChildrenList([dataObject.components[defaultIndex]], 0, arrUpdatedData, dataObject.id, bClear);
		 } else if (dataObject.components !== undefined && dataObject.components.length > 0) {
		 this.getChildrenList(dataObject.components, 0, arrUpdatedData, dataObject.id, bClear);
		 }
		 */
		if (dataObject.components !== undefined && dataObject.components.length > 0) {
			this.getChildrenList(dataObject.components, 0, arrUpdatedData, dataObject.id, bClear);
		}
		index = index + 1;
		if (compData.length > index) {
			return this.getChildrenList(compData, index, arrUpdatedData, parentId, bClear);
		}
		return arrUpdatedData;
	};

	JsonUtil.prototype.getScreenCreationCompList = function(compData, index, arrList, parentId, bClear) {
		var dataObject = compData[index], arrUpdatedData;
		arrUpdatedData = arrList;
		if (arrUpdatedData === undefined) {
			arrUpdatedData = [];
		}
		if (bClear === true && dataObject) {
			dataObject.id = "";
			this.arrStyleClassList.push(dataObject.data.styleClass);
			dataObject.data.styleClass = "";
			//delete dataObject.parentObject;
		}
		dataObject.parentObject = {
			"parentId" : parentId
		};

		arrUpdatedData.push(dataObject);
		if (dataObject.components !== undefined && dataObject.components.length > 0) {
			this.getScreenCreationCompList(dataObject.components, 0, arrUpdatedData, dataObject.id, bClear);
		}
		index = index + 1;
		if (compData.length > index) {
			return this.getScreenCreationCompList(compData, index, arrUpdatedData, parentId, bClear);
		}
		return arrUpdatedData;
	};

	/**
	 * will return the json data node by id
	 * @param {String} strCompId this string will be searched
	 * @param {Object} jsonData search will be performed within this data
	 * @return {Object} json node data
	 * @access public
	 * @memberof JsonUtil#
	 */
	JsonUtil.prototype.getComponentJSONDataById = function(strCompId, jsonData) {
		return this.searchInJSON(strCompId, jsonData);
	};

	/**
	 * compare object id and return true/false based on the result
	 * introduce to manage internal requirement while searhing
	 * @param {String}
	 * @param {Object}
	 * @return {Boolean}
	 * @access private
	 * @memberof JsonUtil#
	 */
	JsonUtil.prototype.compareById = function(strCompId, json) {
		return (strCompId === json.id);
	};

	/**
	 * Searching in json data
	 * @access private
	 * @memberof JsonUtil#
	 */
	JsonUtil.prototype.searchInJSON = function(strCompId, json, parentJson) {
		var arrChildComponents, i, objClassref = this, bFound, objData;
		if (json.id === strCompId) {
			//objData = json;
			objData = {};
			objData.index = 0;
			objData.node = json;
			if (parentJson) {
				objData.parent = parentJson.id;
			}

		} else if (json.components !== undefined) {
			objData = this.searchInJSON(strCompId, json.components, json);
		} else {

			for ( i = 0; i < json.length; i = i + 1) {
				arrChildComponents = json[i];
				if (objData !== undefined) {
					break;
				}
				bFound = objClassref.compareById(strCompId, arrChildComponents);
				if (bFound === false && arrChildComponents.components) {
					objData = this.searchInJSON(strCompId, arrChildComponents.components, arrChildComponents);
				} else if (bFound === true) {
					objData = {};
					objData.index = i;
					objData.node = arrChildComponents;
					objData.parent = json;
					objData.parentId = parentJson.id;
					break;
				}
			}
		}
		return objData;
	};

	/**
	 * method 'getCloneObject' is responsible to create a copy of given
	 * json element and return in object format.
	 * @param {Object} json data
	 * @return {Object} objElement cloned object of parameter
	 * @access public
	 * @memberof JsonUtil#
	 */
	JsonUtil.prototype.getCloneObject = function(objElement) {
		objElement = JSON.stringify(objElement);
		objElement = $.parseJSON(objElement);
		return objElement;
	};

	/**
	 * method 'cleanJSONData' is responsible clean the given json data
	 * this method is created for assembler use.
	 * @param {Object} json data
	 * @return {Object} objElement cloned object of parameter
	 * @access private
	 * @memberof JsonUtil#
	 */
	JsonUtil.prototype.cleanJSONData = function(objElement) {
		var objData = {};
		this.arrStyleClassList = [];
		objData.arrJsonList = this.getChildrenList([objElement], 0, undefined, undefined, true);
		objData.jsonElement = objElement;
		objData.styleList = this.arrStyleClassList.slice(0);
		return objData;
	};

	/**
	 * will add given child element in its parent object
	 * @param {Object} parnetObject
	 * @param {Object} childElement
	 * @return {none} no need to return for refernce object
	 * @access public
	 * @memberof JsonUtil#
	 */
	JsonUtil.prototype.appendChildComponent = function(parnetObject, childElement) {
		if (parnetObject.components === undefined) {
			parnetObject.components = [];
		}
		parnetObject.components.push(childElement);
	};

	/**
	 * Move element positon to its new index
	 * @param {Array} arrayElement
	 * @param {Number} index current index value
	 * @param {Number} updatedIndex element will be moved to this position
	 * @return {Array} arrayElement updated array object
	 * @access publice
	 * @memberof JsonUtil#
	 */
	JsonUtil.prototype.moveElementPosition = function(arrayElement, index, updatedIndex) {
		arrayElement.splice(updatedIndex, 0, arrayElement.splice(index, 1)[0]);
		return arrayElement;
	};

	/**
	 * Will remvoe the json node and return true if success
	 * @param {String} strId
	 * @param {Object} jsonData
	 * @return {Boolean}
	 * @access public
	 * @memberof JsonUtil#
	 */
	JsonUtil.prototype.removeJSONNode = function(strId, objJSONData) {
		var objNodeData = this.getComponentJSONDataById(strId, objJSONData);

		if (objNodeData !== undefined) {
			objNodeData.parent.splice(objNodeData.index, 1);
			return true;
		}
		return false;
	};

	/**
	 * Search and return json node
	 */
	JsonUtil.prototype.getJSONDataNode = function(arrKey, objData) {
		var i = 2, tempArray = [], filterData = objData;
		for ( i = 2; i < arrKey.length - 1; i = i + 1) {
			filterData = filterData[arrKey[i]];
		}
		return filterData;
	};

	/**
	 * Return the parnet node id of given json object
	 * @param {String} strId json node which will be serached
	 * @param {Object} objJSONData search perofrm within this data
	 * @return {String} parentId
	 * @access public
	 * @memberof JsonUtil#
	 */
	JsonUtil.prototype.getParentId = function(strId, objJSONData) {
		var objNodeData = this.getComponentJSONDataById(strId, objJSONData);
		if (objNodeData !== undefined) {
			return this.searchInJSON(strId, objJSONData).parentId;
		}
	};
	
	
	/**
	 * Return the parnet node id of given json object
	 * @param {String} strId json node which will be serached
	 * @param {Object} objJSONData search perofrm within this data
	 * @return {String} parentId
	 * @access public
	 * @memberof JsonUtil#
	 */
	JsonUtil.prototype.getParentObject = function(strId, objJSONData) {
		var objNodeData = this.getComponentJSONDataById(strId, objJSONData);
		if (objNodeData !== undefined) {
			return this.searchInJSON(strId, objJSONData);
		}
	};
	

	/**
	 * change the comonent json node attach state
	 * @param {Array} compData jsonData in array format
	 * @param {Number} index
	 * @param {Array} arrList component list
	 * @param {String} parentId
	 * @param {String} state possible value attached/detached
	 * @access private
	 * @memberof JsonUtil#
	 */
	JsonUtil.prototype.updateAttachState = function(compData, index, arrList, parentId, state) {
		var dataObject = compData[index], arrUpdatedData, defaultIndex = 0;
		arrUpdatedData = arrList;
		if (arrUpdatedData === undefined) {
			arrUpdatedData = [];
		}
		dataObject.state = state;
		arrUpdatedData.push(dataObject);
		if (dataObject.components !== undefined && dataObject.components.length > 0) {
			this.updateAttachState(dataObject.components, 0, arrUpdatedData, dataObject.id, state);
		}
		index = index + 1;
		if (index < compData.length) {
			return this.updateAttachState(compData, index, arrUpdatedData, parentId, state);
		}
		return arrUpdatedData;
	};

	/**
	 * Remove unwanted node e.g ParentObject
	 * @param {Object} jsonDataToClean
	 * @param {Object} index
	 * @access public
	 * @memberof JsonUtil#
	 */
	JsonUtil.prototype.cleanJsonData = function(jsonDataToClean, index, strNodeToRemove) {
		var dataObject = jsonDataToClean[index], defaultIndex = 0;
		delete dataObject[strNodeToRemove];
		if (dataObject.components !== undefined && dataObject.components.length > 0) {
			this.cleanJsonData(dataObject.components, 0, strNodeToRemove);
		}
		index = index + 1;
		if (jsonDataToClean.length > index) {
			return this.cleanJsonData(jsonDataToClean, index, strNodeToRemove);
		}
		return "done";
	};

	return JsonUtil;
});
