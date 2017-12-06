/*jslint nomen: true*/
/*globals Backbone,_,console,$, class */

/**
 * CompTreeController
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */
define(['marionette', 'player/events/eventsconst', 'player/utils/json-manipulator'], function(Marionette, eventconst, JsonUtil) {
	"use strict";
	var CompTreeController, objInstance;
	objInstance = null;

	CompTreeController = Backbone.Marionette.Controller.extend({
		objJsonUtil : undefined,
		treeData : undefined,
		objCompTree : undefined,
		bTREE_NODE_SELECTED : false,
		constructor : function() {
			this.objJsonUtil = new JsonUtil();
		}
	});

	CompTreeController.prototype.TREE_NODE_SELECTED = "nodeselected";

	CompTreeController.prototype.treeNodeSelected = function(strId) {
		this.bTREE_NODE_SELECTED = true;
		this.trigger(this.TREE_NODE_SELECTED, strId);
	};

	CompTreeController.prototype.selectTreeNode = function(strId) {
		if (this.objCompTree && !this.bTREE_NODE_SELECTED) {
			this.objCompTree.selectTreeNode(strId);
		}
		this.bTREE_NODE_SELECTED = false;
	};

	CompTreeController.prototype.setData = function(complistdata, strJsonData) {
		//console.log(data);
		var compDict = {}, arrTemp = [], obj, self = this, jsonData;
		if ( typeof strJsonData === "string") {
			jsonData = $.parseJSON(strJsonData);
		} else {
			jsonData = strJsonData;
		}
		$.each(complistdata, function(index, objComp) {
			var id, pid, name;
			obj = {};
			obj.children = [];
			id = objComp.id;
			pid = self.objJsonUtil.getParentId(id, jsonData);
			if (pid === undefined) {
				pid = "_root_";
			}
			name = objComp.name;
			if (name === undefined || name.trim().length === 0) {
				name = id;
			}
			obj.id = id;
			obj.label = name;
			obj.pid = pid;
			obj.type = objComp.type;

			if (id !== "self" && id !== "helper" && objComp.state !== "detached") {
				arrTemp.push(obj);
				compDict[id] = obj;
			}
		});

		while (arrTemp.length > 0) {
			var obj, objT = arrTemp.splice(0, 1);
			obj = objT[0];
			if (compDict[obj.pid]) {
				compDict[obj.pid].children.push(obj);
			} else {
				compDict["_root_"] = obj;
			}
		}
		this.treeData = compDict["_root_"];
		if (this.objCompTree) {
			this.objCompTree.updateTree(this.treeData);
		}

	};

	CompTreeController.prototype.destroy = function() {
		delete this.treeData;
	};
	return {
		getInstance : function() {
			if (objInstance === null) {
				objInstance = new CompTreeController();
			}
			return objInstance;
		}
	};
});
