/*jslint nomen: true*/
/*globals Backbone,_,$, console, Data_Loader*/

/**
 * TableEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/base-editor'], function(Marionette, BaseEditor) {'use strict';
	var TableEditor;

	/**
	 * TableEditor is responsible to load and return slider component class
	 * signature and also prepare default data which is required by an slider
	 * to initlized itself
	 *
	 *@augments TableEditor
	 *@example
	 *Load module
	 *
	 var objTableEditor = BaseEditor.extend({

	 TableEditor.prototype.getComponent = function(compData) {
	 //Asking to BaseEditor to create a component
	 this.createCompData($(compData));
	 };

	 };

	 return objTableEditor;
	 */

	TableEditor = BaseEditor.extend({
		defaultCompData : {},
		componentHTMLDiv : undefined
	});

	/**
	 * Will be invoked by Editor when an TableComponent needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof TableEditor#
	 * @access private
	 */
	TableEditor.prototype.getComponent = function(compData) {
		this.componentHTMLDiv = $(compData);
		//Asking BaseEditor to create a component
		this.createCompData($(compData));
	};

	/**
	 * Preparing constructor data for Slider component which will be passed to slider
	 * through its constructor method.
	 * @param {Object} compData
	 * @return none
	 * @memerof TableEditor#
	 * @access private
	 */
	TableEditor.prototype.createCompData = function(compData) {
		this.prepareDefaultData(compData, this.onDefaultDataCreationComplete, this);
	};

	TableEditor.prototype.onDefaultDataCreationComplete = function(context, defaultData) {
		context.defaultCompData = defaultData;
		//if table data is provided in html, then we will load before table comp initlization.
		if (context.defaultCompData.tableData !== undefined) {
			context.getTableData();
		} else if (context.componentHTMLDiv.find("itemRenderer").length === 1) {
			//if table data not provided but renderer object found in html entry.
			context.loadRenderer();
		}
	};

	/**
	 * Method 'getTableData' is responsible to load table data xml with the help of
	 * DATA_LOADER object and pass the controll to 'successHandler' method for
	 * further initlization.
	 * @param none
	 * @return none
	 * @memberof TableEditor#
	 * @access private
	 */
	TableEditor.prototype.getTableData = function() {

		var objClassRef = this;
		Data_Loader.on(Data_Loader.DATA_LOAD_SUCCESS, $.proxy(objClassRef.successHandler, objClassRef));
		Data_Loader.on(Data_Loader.DATA_LOAD_FAILED, $.proxy(objClassRef.errorHandler, objClassRef));
		Data_Loader.load({
			url : objClassRef.defaultCompData.tableData,
			dataType : 'xml',
			contentType : 'application/xml',
			returnType : 'json',
			scope : objClassRef
		});
	};

	/**
	 * Method 'successHandler' will invoked when data xml loaded successfully with the help of
	 * data loader object.
	 * assign the loaded data in component default data in required format. 
	 * 
	 * If no item renderer required then this method pass the controll to 'createComponent'
	 * to initlizate component.
	 * 
	 * @param {Obejct} data loaded table xml data.
	 * @return none
	 * @memberof TableEditor#
	 * @access private
	 */
	TableEditor.prototype.successHandler = function(data) {
		Data_Loader.off(Data_Loader.DATA_LOAD_SUCCESS);
		Data_Loader.off(Data_Loader.DATA_LOAD_FAILED);

		this.defaultCompData.tableData = data;
		
		if (this.componentHTMLDiv.find("itemRenderer").length === 1) {
			this.loadRenderer();
		} else {
			this.prepareDataForTable(this.defaultCompData);
		}
	};
	/**
	 * Invoked when table xml data failed to load.
	 * @param none
	 * @return none
	 * @access private
	 * @memberof TableEditor#
	 */
	TableEditor.prototype.errorHandler = function() {
		Data_Loader.off(Data_Loader.DATA_LOAD_SUCCESS);
		Data_Loader.off(Data_Loader.DATA_LOAD_FAILED);
	};
	
	/**
	 * Here we are requiring the Renderer class file based on the provided
	 * path in html file. when item class loaded successfully the 'prepareDataForTable' invoked.
	 * 
	 * @param none
	 * @return none
	 * @access private
	 * @memberof TableEditor# 
	 */
	TableEditor.prototype.loadRenderer = function() {
		var strItemRenderPath, objItemData, itemDiv = $(this.componentHTMLDiv.find("itemRenderer")[0]), objClassRef = this;
		objItemData = this.prepareDefaultData(itemDiv);
		strItemRenderPath = itemDiv.text();
		require([strItemRenderPath], function(objItemRendererRef) {
			objClassRef.prepareDataForTable(objItemRendererRef, objItemData);
		});
	};
	
	/**
	 * Preparing data for table component.
	 * @param {Object} itemRenderer Class definition of Item Renderer object
	 * @param {Object} itemData Default data of renderer object.
	 * @return none
	 * @memberof TableEditor#
	 * @access private
	 */
	TableEditor.prototype.prepareDataForTable = function(itemRenderer, itemData) {
		if (itemRenderer !== undefined && itemData !== undefined) {
			this.defaultCompData.itemRendererClassName = itemData.className;
			this.defaultCompData.itemRenderer = itemRenderer;
		}
		this.createComponent(this.componentHTMLDiv);
	};

	/**
	 * Overriding 'BaseEditor' method to get notifiy when TableComponent class is
	 * required successfully.
	 * This method is also resposible to append default data for Table component
	 * in objComponent (received as parameter when component created successfully)
	 *
	 * @param {Object} objComponent slider coponent class signature
	 * @return none
	 * @memberof TableEditor#
	 * @access private
	 */
	TableEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};

	/**
	 * This method destroy the TableEditor class.
	 * @param none
	 * @return none
	 * @memberof TableEditor#
	 * @access private
	 */
	TableEditor.prototype.destroy = function() {
		return TableEditor.__super__.destroy(true, this);
	};

	return TableEditor;
});
