/*jslint nomen: true*/
/*globals Backbone,_,$,console*/

/** PropertyUpdater
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2014 Magic Software Private Limited.
 * @copyright (c) 2014 Magic Software
 *
 */

define(['marionette', 'simPictor/pictor-const', 'player/constants/errorconst', 'player/events/eventsconst',
/** component default data and style **/
'player/constants/default-comp-data', 'player/constants/default-comp-style', 'player/utils/json-manipulator'],
/**
 *
 */
function(Marionette, PictorConst, ErrorConst, EventConst, DefaultCompData, DefaultCompStyle, JsonUtil) {
	'use strict';
	var PropertyUpdater;

	/**
	 * @class PropertyUpdater
	 *
	 * This class will be responsible to manage update component data
	 * both css and json and store in its memory.
	 *
	 * Also this class will provide the data when engine want to write json and css data physically.
	 *
	 *@augments Backbone.Marionette.Controller
	 *@example
	 *Load module
	 */
	PropertyUpdater = Backbone.Marionette.Controller.extend({
		//variables
		objJsonUtil : undefined,
		arrStyleClasses : null,
		objDefaultCompData : {},
		objDefaultStyleClass : {},
		compCounter : 100,
		objStyleSheet : null,
		objJSONData : null,
		arrAssetsToSave : [],
		arrMediaSource : [],
		arrMediaSourceList : ["src", "path", "source"],
		memoryObjRef : undefined,
		canUpdateLayout : true,
		objCompTreeController : undefined,
		worker : undefined,
		constructor : function(objData, objCompTreeController) {
			var self = this;
			this.objJsonUtil = new JsonUtil();
			this.arrMediaSource = [];
			this.arrAssetsToSave = [];
			this.objJSONData = {};
			this.objJSONData = $.parseJSON(objData.jsonData);
			this.compCounter = 0;
			this.objDefaultCompData = new DefaultCompData();
			this.objDefaultStyleClass = new DefaultCompStyle();
			this.arrStyleClasses = [];
			this.memoryObjRef = undefined;
			this.objCompTreeController = objCompTreeController;
			this.initializeWorkerObject();
		}
	});

	PropertyUpdater.prototype.initializeWorkerObject = function() {
		this.worker = new Worker("framework/player/web-workers/property-updator-worker.js");
		this.worker.addEventListener('message', this.handleWorkerEvent.bind(this), false);
	};

	PropertyUpdater.prototype.handleWorkerEvent = function(e) {
		var action, data;
		action = e.data.action;
		data = e.data.data;
		switch(action) {
		case "createNewComponent":
			this.eventDispatcher(PropertyUpdater.CREATE_NEW_COMPONENT, data);
			break;
		}

	};

	PropertyUpdater.prototype.pingWorkerForNextObject = function() {
		var req;
		req = {};
		req.action = "getNextDataFromQue";
		req.data = null;
		this.worker.postMessage(req);
	};

	PropertyUpdater.prototype.addDataToWorker = function(data) {
		var req;
		req = {};
		req.action = "addDataInQue";
		req.data = data;
		this.worker.postMessage(req);
	};

	PropertyUpdater.prototype.removeDataFromWorker = function() {
		var req;
		req = {};
		req.action = "removeDataFromQue";
		req.data = null;
		this.worker.postMessage(req);
	};

	PropertyUpdater.prototype.onComponentCreationCompleteInEditMode = function() {
		this.removeDataFromWorker();
		this.pingWorkerForNextObject();
	};

	PropertyUpdater.prototype.setComponentCounter = function(nCount) {
		this.compCounter = nCount;
	};

	/** compPropertyUpdated */
	PropertyUpdater.COMP_PROPERTY_UPDATED = "compPropertyUpdated";

	/** cssProperty */
	PropertyUpdater.CSS_PROPERTY = "cssProperty";

	/** jsonProperty */
	PropertyUpdater.JSON_PROPERTY = "jsonProperty";

	/** createNewComponent **/
	PropertyUpdater.CREATE_NEW_COMPONENT = "createNewComponent";

	/** createNewComponent **/
	PropertyUpdater.INVALID_COMPONENT_CREATION = "invalidComponentCreation";

	/** removeSelectedComponent **/
	PropertyUpdater.REMOVE_SELECTED_COMPONENT = "removeSelectedComponent";

	/** domLayoutUpdateEvent **/
	PropertyUpdater.DOM_LAYOUT_UPDATE_EVENT = "domLayoutUpdateEvent";

	/** domLayoutUpdateEvent **/
	PropertyUpdater.DOM_CHANGE_VIEW_EVENT = "domChangeViewEvent";

	/** deselectComponent **/
	PropertyUpdater.DESELECT_COMPONENT = "deselectComponent";

	/** selectComponent **/
	PropertyUpdater.SELECT_COMPONENT = "selectComponent";

	/**
	 * Invoked by sim-pictor class to prepare the json data node for each events dispatched
	 * from the property panel editor window.
	 * this method is responsible to update component and its data based on the
	 * given action from property panel.
	 * @param {Object} oldData current json data of selected component
	 * @param {Object} newData updated data
	 * @param {Object} parentComp selected component reference.
	 * @return {none}
	 * @access private
	 * @memberof PropertyUpdater#
	 */
	PropertyUpdater.prototype.updateComponentData = function(oldData, newData, parentComp) {
		var arrActionKeys, strTask, updatedValue;
		strTask = newData.data.task;
		updatedValue = newData.data.updatedValue;
		arrActionKeys = strTask.split("_");
		switch(arrActionKeys[0]) {

		//this section will execute when existing component data updated(css or json)
		case EventConst.EDIT_ACTION_UPDATE:
			this.updatedExistingComponent(arrActionKeys, oldData, newData);
			break;

		//will delete the selected component and its children
		case EventConst.EDIT_ACTION_DELETE:
			this.removeSelectedComponent(oldData);
			break;

		//will add new component in dom and update screen json data
		case EventConst.EDIT_ACTION_ADD:
			this.getNewComponentData(arrActionKeys[2], oldData.id, parentComp);
			break;

		//this section is related to move up/down and cut copy paste functionality
		case EventConst.EDIT_DOM_LAYOUT:
			if (this.canUpdateLayout === true) {
				this.updateDomLayout(arrActionKeys, oldData, parentComp);
			} else {
				this.eventDispatcher(PropertyUpdater.INVALID_COMPONENT_CREATION, {
					"message" : ErrorConst.IN_PROCESS_PLEASE_WAIT
				});
				this.canUpdateLayout = true;
				return;
			}
			break;
		case EventConst.EDIT_ACTION_CHANGE:
			this.eventDispatcher(PropertyUpdater.DOM_CHANGE_VIEW_EVENT, newData);
			break;
		}
	};

	/**
	 * Set the node index position in its parent
	 */
	PropertyUpdater.prototype.updateJsonNodePosition = function(objEventData) {
		var objNodeData = objEventData.data.compData;
		if ((objNodeData !== undefined) && (objNodeData.task === EventConst.EDIT_DOM_LAYOUT_MOVE_UP || objNodeData.task === EventConst.EDIT_DOM_LAYOUT_MOVE_DOWN)) {
			this.objJsonUtil.moveElementPosition(objNodeData.parent, objNodeData.newIndex, objNodeData.index);
		}
		this.canUpdateLayout = true;
	};
	/**
	 * This method is responsible to handle move up, move down, cut,copy and paste related feature
	 * @param {Array} arrActionKeys
	 * @param {Object} oldData selected dom element's json data
	 * @param {Object} newData updated data
	 * @return {none}
	 * @access private
	 * @memberof PropertyUpdater#
	 */
	PropertyUpdater.prototype.updateDomLayout = function(arrActionKeys, oldData, newData) {
		var i, strCompId = oldData.id, objNodeData, filteredData, objData = {};
		objNodeData = this.objJsonUtil.getComponentJSONDataById(strCompId, this.objJSONData);
		objNodeData.task = arrActionKeys[2];
		switch(arrActionKeys[2]) {

		//move selected component a level up in layout and json
		case EventConst.EDIT_DOM_LAYOUT_MOVE_UP:
			if (objNodeData.index > 0) {
				this.canUpdateLayout = false;
				objNodeData.newIndex = objNodeData.index - 1;
				this.eventDispatcher(PropertyUpdater.DOM_LAYOUT_UPDATE_EVENT, objNodeData);
			}
			break;

		//move selected component a level donw in layout and json
		case EventConst.EDIT_DOM_LAYOUT_MOVE_DOWN:
			if (objNodeData.index < objNodeData.parent.length - 1) {
				this.canUpdateLayout = false;
				objNodeData.newIndex = objNodeData.index + 1;
				this.eventDispatcher(PropertyUpdater.DOM_LAYOUT_UPDATE_EVENT, objNodeData);
			}
			break;

		//cut the selected component and its children from dom and json
		case EventConst.EDIT_DOM_LAYOUT_CUT:

			this.eventDispatcher(PropertyUpdater.DOM_LAYOUT_UPDATE_EVENT, objNodeData);
			this.memoryObjRef = {};
			this.memoryObjRef.type = EventConst.EDIT_DOM_LAYOUT_CUT;
			this.memoryObjRef.node = objNodeData.node;
			break;

		//will create a copy of selected component its child and style classes
		case EventConst.EDIT_DOM_LAYOUT_COPY:
			this.eventDispatcher(PropertyUpdater.DOM_LAYOUT_UPDATE_EVENT, objNodeData);
			this.memoryObjRef = {};
			this.memoryObjRef.type = EventConst.EDIT_DOM_LAYOUT_COPY;
			this.memoryObjRef.node = this.objJsonUtil.getCloneObject(objNodeData.node);
			filteredData = this.objJsonUtil.cleanJSONData(this.memoryObjRef.node);
			this.memoryObjRef.filteredData = filteredData;
			for ( i = 0; i < filteredData.styleList.length; i = i + 1) {
				filteredData.styleList[i] = this.getStyleClass(filteredData.styleList[i]).cssText;
				filteredData.styleList[i] = filteredData.styleList[i].substr(filteredData.styleList[i].indexOf('{') + 1, filteredData.styleList[i].length);
				filteredData.styleList[i] = filteredData.styleList[i].substr(0, filteredData.styleList[i].lastIndexOf('}'));
			}
			break;

		//will create a fresh copy of json and style class
		case EventConst.EDIT_DOM_LAYOUT_PASTE:
			// making sure that memoryObjRef is not blank
			this.canUpdateLayout = false;
			if (this.memoryObjRef !== undefined) {
				//if memory object created with the cut feature then add element to its new
				//position and memory reference will be deleted.
				if (this.memoryObjRef.type === EventConst.EDIT_DOM_LAYOUT_CUT) {

					objData.compJSON = $.parseJSON(JSON.stringify(this.memoryObjRef.node));
					objData.parentId = newData.strCompId;
					this.addDataToWorker(objData);
					//this.eventDispatcher(PropertyUpdater.CREATE_NEW_COMPONENT, objData);
					this.memoryObjRef = undefined;
					this.canUpdateLayout = true;
				} else {
					this.prepareCopiedJsonData(this.memoryObjRef, newData, oldData.id);
				}
			}
			break;
		}
	};
	/**
	 * Preparing copied json data and assign them new id by calling 'prepareExistingData' method.
	 * @param {Object} objMemoryObject
	 * @param {Object} objParentComp
	 * @param {String} strCompId
	 * @return {none}
	 * @access private
	 * @memberof PropertyUpdater#
	 */
	PropertyUpdater.prototype.prepareCopiedJsonData = function(objMemoryObject, parentComp, strCompId) {
		var strCompType, objCompDefualtData;
		//this.compCounter = this.compCounter + 1;
		objCompDefualtData = this.objDefaultCompData.prepareExistingData(objMemoryObject);
		this.createAndAddNewComponent(objCompDefualtData.compJSON, this.memoryObjRef.filteredData.styleList, parentComp, strCompId, objCompDefualtData);
		this.canUpdateLayout = true;
	};

	/**
	 * method 'createAndAddNewComponent' is responsible to add new component and its style
	 * classes in browser
	 * @param {Object} objCompJson component json data
	 * @param {Array/Object}  objStyleClass could be object or array reference
	 * @param {Object} parentComp new component will be added in this element
	 * @param {String} strCompId parent component id
	 * @param {Object} objCompDefualtData
	 * @return {none}
	 * @access private
	 * @memberof PropertyUpdater#
	 *
	 */
	PropertyUpdater.prototype.createAndAddNewComponent = function(objCompJSON, objStyleClass, parentComp, strCompId, objCompDefualtData) {
		var strParentId, objData = {}, i;
		strParentId = parentComp.getID();
		if (parentComp.isValid !== undefined && parentComp.isValid(objCompJSON.type) === true) {
			this.appendComponentJSONData(objCompJSON, strParentId);

			//sending new copy to assembler.
			objData.compJSON = $.parseJSON(JSON.stringify(objCompJSON));
			objData.parentId = strParentId;

			if ( objStyleClass instanceof Array) {
				//adding each style class when data provided in array format
				for ( i = 0; i < objStyleClass.length; i = i + 1) {
					this.updateStyleSheet(objStyleClass[i], objCompDefualtData.arrayComp[i].id);
				}
			} else {
				//add given style class in head section
				this.updateStyleSheet(objStyleClass, strCompId);
			}
			this.compCounter = this.compCounter + objCompDefualtData.arrayComp.length;
			//this.eventDispatcher(PropertyUpdater.CREATE_NEW_COMPONENT, objData);
			this.addDataToWorker(objData);
		} else {
			this.compCounter = this.compCounter - 1;
			this.eventDispatcher(PropertyUpdater.INVALID_COMPONENT_CREATION, {
				"message" : ErrorConst.COMPONENT_NOT_ALLOWED_AS_CHILD_COMPONENT
			});

			this.canUpdateLayout = true;
		}
	};

	PropertyUpdater.prototype.updatedExistingComponent = function(arrActionKeys, oldData, newData) {
		var filterData = undefined, dataToSave, objStyleClass;
		switch(arrActionKeys[1]) {

		//updating css data of selected component
		case EventConst.EDIT_CSS_DATA:
			if (newData.data.selectorText) {
				objStyleClass = this.getStyleClass(newData.data.selectorText, " : ", arrActionKeys[2]);
				if (objStyleClass) {
					if (arrActionKeys[2] === "cssText") {
						this.updateStyleClass(objStyleClass.selectorText, newData.data.updatedValue);
					} else {
						objStyleClass.style[arrActionKeys[2]] = newData.data.updatedValue;
					}
				} else {
					// When a new state is applied
					this.addStyleClass("." + newData.data.selectorText, newData.data.updatedValue);
				}
			}

			break;

		//updating html property in component json data
		case EventConst.EDIT_HTML_DATA:
			//getting data from save json.
			dataToSave = this.objJsonUtil.getComponentJSONDataById(oldData.id, this.objJSONData);
			filterData = this.objJsonUtil.getJSONDataNode(arrActionKeys, dataToSave.node);
			if (filterData[arrActionKeys[arrActionKeys.length - 2].toLowerCase()] === undefined) {
				filterData[arrActionKeys[arrActionKeys.length - 2].toLowerCase()] = {};
			}
			filterData = filterData[arrActionKeys[arrActionKeys.length - 2].toLowerCase()];
			if (filterData) {
				filterData[arrActionKeys[arrActionKeys.length - 1].toLowerCase()] = newData.data.updatedValue;
				//getting data from screen json.
				filterData = this.objJsonUtil.getJSONDataNode(arrActionKeys, oldData);
				if (filterData[arrActionKeys[arrActionKeys.length - 2].toLowerCase()] === undefined) {
					filterData[arrActionKeys[arrActionKeys.length - 2].toLowerCase()] = {};
				}
				filterData = filterData[arrActionKeys[arrActionKeys.length - 2].toLowerCase()];
				filterData[arrActionKeys[arrActionKeys.length - 1].toLowerCase()] = newData.data.updatedValue;
				this.eventDispatcher(PropertyUpdater.COMP_PROPERTY_UPDATED, {
					"compId" : oldData.id,
					"data" : oldData.html,
					"actionKeys" : arrActionKeys,
					"type" : "html"
				});
			}
			break;

		//updating json data property
		case EventConst.EDIT_JSON_DATA:
			dataToSave = this.objJsonUtil.getComponentJSONDataById(oldData.id, this.objJSONData);
			filterData = this.objJsonUtil.getJSONDataNode(arrActionKeys, dataToSave.node);
			filterData[arrActionKeys[arrActionKeys.length - 1]] = newData.data.updatedValue;
			filterData = this.objJsonUtil.getJSONDataNode(arrActionKeys, oldData);
			filterData[arrActionKeys[arrActionKeys.length - 1]] = newData.data.updatedValue;

			if (this.arrMediaSourceList.indexOf(arrActionKeys[arrActionKeys.length - 1].toLowerCase()) !== -1) {
				if ( typeof newData.data.updatedValue === "string") {
					this.arrMediaSource.push(newData.data.updatedValue);
				} else {
					var self = this;
					//console.log(newData.data.updatedValue);
					$.each(newData.data.updatedValue, function(index, obj) {
						if (obj.path.length > 0) {
							self.arrMediaSource.push(obj.path);
						}
					});
					//this.arrMediaSource.push(newData.data.updatedValue);
				}
			}

			this.eventDispatcher(PropertyUpdater.COMP_PROPERTY_UPDATED, {
				"compId" : oldData.id,
				"data" : oldData.data,
				"actionKeys" : arrActionKeys
			});
			break;
		}
	};

	PropertyUpdater.prototype.collectStyles = function(strCssPath) {
		var i, objSheet, styleSheets;
		this.arrStyleClasses = [];
		styleSheets = document.styleSheets;
		for ( i = styleSheets.length - 1; i >= 0; i -= 1) {
			objSheet = styleSheets[i];
			if (objSheet.href.indexOf(strCssPath) !== -1) {
				break;
			}
			objSheet = undefined;
		}

		if (objSheet) {
			this.objStyleSheet = objSheet;
			this.arrStyleClasses = (objSheet.cssRules !== null) ? objSheet.cssRules : objSheet.rules;
		}
	};

	/**
	 * Return the CSS style class object based on the given parameter.
	 * @param {String} strClass
	 * @return {Object} style class object
	 * @access private
	 * @memberof PropertyUpdater#
	 */
	PropertyUpdater.prototype.getStyleClass = function(strClass) {
		var i, objClass;
		for ( i = 0; i < this.arrStyleClasses.length; i += 1) {
			objClass = this.arrStyleClasses[i];
			if (objClass.selectorText === "." + strClass) {
				return objClass;
			}
		}
		return null;
	};

	PropertyUpdater.prototype.updateStyleClass = function(strSelector, strDec) {
		var i, objClass;
		for ( i = 0; i < this.arrStyleClasses.length; i += 1) {
			objClass = this.arrStyleClasses[i];
			if (objClass.selectorText === strSelector) {
				this.objStyleSheet.deleteRule(i);
				this.objStyleSheet.insertRule(strSelector + strDec, i);
				this.arrStyleClasses = (this.objStyleSheet.cssRules !== null) ? this.objStyleSheet.cssRules : this.objStyleSheet.rules;
			}
		}
	};

	PropertyUpdater.prototype.addStyleClass = function(strSelector, strDec) {
		var i = 0, objClass, arrTemp;
		arrTemp = strSelector.split("_");
		$.each(this.arrStyleClasses, function(index, obj) {
			if (obj.selectorText.indexOf(arrTemp[0]) !== -1) {
				i = index;
			}
		});
		this.objStyleSheet.insertRule(strSelector + strDec, i + 1);
		this.arrStyleClasses = (this.objStyleSheet.cssRules !== null) ? this.objStyleSheet.cssRules : this.objStyleSheet.rules;
	};

	/**
	 * Preparing css data for save and will return prepared data in string format, this
	 * method also remove unwanted string from url property.
	 * @param {none}
	 * @return {String} txtToSend
	 * @access private
	 * @memberof PropertyUpdater#
	 */
	PropertyUpdater.prototype.getCssText = function() {
		var i, txtToSend = "", trimText, tempText, t1, t2;
		this.arrAssetsToSave = [];
		if (!this.arrStyleClasses) {
			return txtToSend;
		}

		for ( i = 0; i < this.arrStyleClasses.length; i += 1) {
			trimText = this.arrStyleClasses[i].cssText;
			//console.log("css text.......", trimText);
			if (trimText.indexOf("http") !== -1) {
				trimText = trimText.substr(0, trimText.indexOf("http")) + "assets/media" + trimText.substr(trimText.lastIndexOf("/"));
				tempText = trimText.split("url(").pop();
				tempText = tempText.split(")")[0].split("/");
				this.arrAssetsToSave.push(tempText.pop());
			}
			txtToSend = txtToSend + trimText;
		}
		return txtToSend;
	};

	/**
	 * This method will be invoked from pictor class object when
	 * data is ready to save,  will return the css media list
	 * (e.g. background images)
	 * @param {none}
	 * @return {Array} arrAssetsToSave
	 * @access private
	 * @memberof PropertyUpdater#
	 */
	PropertyUpdater.prototype.getAssetsToSaveList = function() {
		return this.arrAssetsToSave;
	};

	/**
	 * This method will be invoked from pictor class's object when
	 * data is ready to save, will return the json media list
	 * (e.g. image source, video source)
	 * @param {none}
	 * @return {Array} arrMediaSource
	 */
	PropertyUpdater.prototype.getJSONMediaList = function() {
		return this.arrMediaSource;
	};
	/**
	 * Help 'PropertyUpdater' class to dispatch a event
	 * @param {Object} strEvent "event name"
	 * @param {Object} data 'data/value if require to pass with event'
	 * @access private
	 * @memberof PropertyUpdater#
	 */
	PropertyUpdater.prototype.eventDispatcher = function(strEvent, data) {
		var objEventData = {};
		objEventData.type = strEvent;
		objEventData.compData = data;
		this.trigger(objEventData.type, objEventData);
	};

	/**
	 * will return the screen json data in string format
	 * @param {none}
	 * @return {String} strData;
	 */
	PropertyUpdater.prototype.getScreenJSONData = function() {
		var d, strData, prefix = '{"screens": [', suffix = ']}';
		//removing unwanted node before to save.
		d = this.objJsonUtil.cleanJsonData([this.objJSONData], 0, "parentObject");
		strData = prefix + JSON.stringify(this.objJSONData) + suffix;
		return strData;
	};

	/**
	 * Responsible to remove selected component
	 * @param {Object} objComp component data which needs to be removed.
	 * @return {none}
	 * @access private#
	 * @memberof PropertyUpdater#
	 */
	PropertyUpdater.prototype.removeSelectedComponent = function(objComp) {
		var objData, strParentId = this.objJsonUtil.getParentId(objComp.id, this.objJSONData);
		if (this.objJsonUtil.removeJSONNode(objComp.id, this.objJSONData) === true) {
			objData = {};
			objData.componentId = objComp.id;
			if (objComp.parentObject === undefined) {
				objComp.parentObject = {};
			}
			objData.parentId = objComp.parentObject.parentId;
			objComp.jsonData = "";
			if (objData.parentId === undefined) {
				objComp.parentObject.parentId = strParentId;
				objData.parentId = strParentId;
			}
			this.eventDispatcher(PropertyUpdater.REMOVE_SELECTED_COMPONENT, objData);

		}
	};

	/**
	 * This method is responsible to update JSON Data, will return true
	 * when data updated successfully.
	 * @param {String} strCompId - component id
	 * @param {Object} objCompData - updated component data with property type
	 * @return {Boolean} true/false
	 * @access private
	 * @memberof PropertyUpdater#
	 */
	PropertyUpdater.prototype.appendComponentJSONData = function(json, strParentId) {
		var objNodeData = this.objJsonUtil.getComponentJSONDataById(strParentId, this.objJSONData);
		if (objNodeData.node !== undefined) {
			objNodeData.node.components = (objNodeData.node.components !== undefined) ? objNodeData.node.components : [];
			objNodeData.node.components.push(json);
			return true;
		}
		return false;
	};

	/**
	 * Responsible to get new component json data based on provided comp type
	 * as parameter.
	 * @param {String} strCompType
	 * @param {String} strParentId
	 * @param {Object} parentComp
	 * @return {none}
	 * @access private
	 * @memberof PropertyUpdater#
	 */
	PropertyUpdater.prototype.getNewComponentData = function(strCompType, strParentId, parentComp) {
		var strCompId, objCompJSON, objData = {}, objStyleClass, i, objCompDefualtData;

		this.compCounter = this.compCounter + 1;
		strCompId = strCompType + "_" + this.compCounter;
		objCompDefualtData = this.objDefaultCompData.getDefaultData(strCompType, strCompId, strCompId);
		objCompJSON = objCompDefualtData.JsonData;
		if (parentComp.isValid !== undefined && parentComp.isValid(objCompJSON.type) === true) {
			objStyleClass = this.objDefaultStyleClass.getDefaultStyleClass(strCompType);
			this.appendComponentJSONData(objCompJSON, strParentId);
			objData.compJSON = $.parseJSON(JSON.stringify(objCompJSON));
			//sending new copy to assembler
			objData.parentId = strParentId;

			if ( objStyleClass instanceof Array) {
				this.compCounter = this.compCounter + objCompDefualtData.compCount;
				for ( i = 0; i < objStyleClass.length; i = i + 1) {
					this.updateStyleSheet(objStyleClass[i], objCompDefualtData.arrayComp[i].id);
				}
			} else {
				this.updateStyleSheet(objStyleClass, objCompJSON.id);
			}
			//this.eventDispatcher(PropertyUpdater.CREATE_NEW_COMPONENT, objData);
			this.addDataToWorker(objData);
		} else {
			this.compCounter = this.compCounter - 1;
			this.eventDispatcher(PropertyUpdater.INVALID_COMPONENT_CREATION);
		}
	};

	PropertyUpdater.prototype.updateStyleSheet = function(strStyleSheet, strCompId) {
		if ("insertRule" in this.objStyleSheet) {
			this.objStyleSheet.insertRule("." + strCompId + "{" + strStyleSheet + "}", 1);
		} else if ("addRule" in this.objStyleSheet) {
			this.objStyleSheet.addRule("." + strCompId, strStyleSheet, 1);
		}
	};

	//--end dataUpdater class
	/**
	 * Destroy PropertyUpdater, associated events and components.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof PropertyUpdater#
	 */
	PropertyUpdater.prototype.destroy = function() {
		var bSuccess = true;
		this.objJsonUtil = undefined;
		this.arrMediaSource = undefined;
		this.arrAssetsToSave = undefined;
		this.objJSONData = undefined;
		this.objJSONData = undefined;
		this.compCounter = undefined;
		this.objDefaultCompData = undefined;
		this.objDefaultStyleClass = undefined;
		this.arrStyleClasses = undefined;
		this.memoryObjRef = undefined;
		return bSuccess;

	};
	return PropertyUpdater;

});
