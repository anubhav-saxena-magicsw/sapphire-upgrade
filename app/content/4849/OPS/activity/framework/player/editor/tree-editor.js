/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * TreeEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/base-editor'], function(Marionette, BaseEditor) {'use strict';
	var TreeEditor;

	/**
	 * TreeEditor is responsible to load and return Tree component class
	 * signature and also prepare default data which is required to Tree comp
	 * to initlized itself
	 *
	 *@augments TreeEditor
	 *@example
	 *Load module
	 *
	 var objTreeEditor = BaseEditor.extend({

	 ImageEditor.prototype.getComponent = function(compData) {
	 //Asking to BaseEditor to create a component
	 this.createCompData($(compData));
	 };

	 };

	 return TreeEditor;
	 */

	TreeEditor = BaseEditor.extend({
		compData : {},
		defaultCompData : {}
	});

	/**
	 * Will be invoked by Editor when an Tree Component needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof TreeEditor
	 * @access private
	 */
	TreeEditor.prototype.getComponent = function(compData, isSimComp) {
		this.isSimComp = isSimComp;
		//Asking to BaseEditor to create a component
		var objData = (compData.data !== undefined) ? compData : $(compData);
		this.createCompData(objData);
	};

	/**
	 * Preparing constructor data for Tree component which will be passed to Tree
	 * comp through its constructor method.
	 * @param {Object} compData
	 * @return none
	 * @memerof TreeEditor
	 * @access private
	 */
	TreeEditor.prototype.createCompData = function(compData) {
		var objLoadData;
		this.defaultCompData = this.prepareDefaultData(compData);
		objLoadData = this.defaultCompData.loadData;
		//if json data path provided in data
		//then we need to load json file and then component will be initliazed.
		this.compData = compData;
		if (objLoadData !== undefined) {
			this.loadData(objLoadData.url, objLoadData.dataType, objLoadData.returnType);
		} else {
			this.createComponent(compData);
		}
	};
	
	/**
	 * Here we are overriding base-editor method to get the nofication
	 * when json data file successfully loaded.
	 * @param {Object} objData json data
	 * @return none
	 */
	TreeEditor.prototype.onDataLoadSuccess = function(objData) {
		this.defaultCompData.treeData = objData;
		this.createComponent(this.compData);
	};

	/**
	 * Overriding 'BaseEditor' method to get notifiy when sliderComponent class is
	 * required successfully.
	 * This method is also resposible to append default data for slider component
	 * in objComponent (received as parameter when component created successfully)
	 *
	 * @param {Object} objComponent slider coponent class signature
	 * @return none
	 * @memberof TreeEditor
	 * @access private
	 */
	TreeEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};

	/**
	 * This method destroy the ImageEditor class.
	 * @param none
	 * @return none
	 * @memberof TreeEditor
	 * @access private
	 */
	TreeEditor.prototype.destroy = function() {
		return TreeEditor.__super__.destroy(true, this);
	};

	return TreeEditor;
});
