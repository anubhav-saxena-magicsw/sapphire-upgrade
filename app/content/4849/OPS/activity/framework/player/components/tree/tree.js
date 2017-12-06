/*jslint nomen: true*/
/*globals Backbone,$,_, jQuery, console*/

/**
 * TreeComp
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2014 Magic Software Private Limited.
 * @copyright (c) 2014 Magic Software
 */

define(['marionette', 'components/tree/tree.jquery', 'player/base/base-item-comp', 'css!components/tree/jqtree.css'], function(Marionette, Tree, BaseItemComp, TreeStyleClass) {
	'use strict';

	var TreeComp;

	/**
	 * @class TreeComp
	 * Class 'TreeComp' is mainly responsible to create a tree component based on provided data
	 * in json format.
	 *
	 * This tree comp support n number of nesting.
	 *
	 *
	 * By Using  this component class an user can create tree component with its default structure.
	 * user is also allowed to changed the view of this component with the help of its css file.
	 *
	 *
	 *@augments 'player/base/base-item-comp
	 *@example
	 *Load module
	 *
	 *
	 * this.getComponent("tree", this, "onCompCreationComplete");
	 */

	TreeComp = BaseItemComp.extend({
		template : _.template(""),
		objTree : null,
		objTreeData : null,
		state : undefined,
		onShow : function() {
			if (this.objTreeData) {
				this.initTree();
			}
		},
		initialize : function(objData) {
			this.objData = objData;//this property is being used in componentselector for editing.
			this.objTreeData = objData.treeData;
		}
	});

	/**
	 * This event will triggred every time when a tree leaf is clicked.
	 * treeParentCollasp
	 */
	TreeComp.prototype.TREE_NODE_SELECT = "treenodeselect";

	/**
	 * method 'initTree' is the method which is responsible to start the process of creating data.
	 * This method accept two parameter first one is 'domElement' reference where tree will be added in DOM, and
	 * the other parameter is jsonData of which store all the information that how many leafs and root parents are there
	 *
	 * @param {HTML Element in Jquery object format} domElement
	 * @param {JSON} jsonData
	 */
	TreeComp.prototype.initTree = function(objData) {
		var setting, objClassRef = this;
		if (objData) {
			this.objTreeData = objData;
		}
		if (this.objTreeData) {
			this.objTree = this.$el.tree({
				data : [this.objTreeData],
				onCanSelectNode : function(node) {
					if (!objClassRef.$el.tree("isNodeSelected", node)) {
						objClassRef.onTreeNodeSelect(node);
						return true;
					}
					return false;
				}
			});
			this.state = this.$el.tree('getState');
			this.$el.tree('loadData', [this.objTreeData]);
			this.$el.tree('setState', this.state);
		}
	};

	TreeComp.prototype.updateTree = function(treeData) {
		this.initTree(treeData);
	};

	TreeComp.prototype.selectTreeNode = function(strId) {
		var node = this.$el.tree('getNodeById', strId);
		this.$el.tree('selectNode', node);
	};

	/**
	 * This method is bind with the tree component event which will invoke every when any change occured in
	 * tree component.
	 * This method is also responsible to redispatch event to get notify the outer world.
	 *
	 * @param {Object} treeId
	 * @param {Object} treeNode
	 */
	TreeComp.prototype.onTreeNodeSelect = function(treeNode) {
		this.customEventDispatcher(this.TREE_NODE_SELECT, this, treeNode);
	};

	TreeComp.prototype.__super__ = BaseItemComp;
	TreeComp.prototype.destroy = function() {
		return this.__super__.prototype.destroy(true);
	};

	return TreeComp;

});
