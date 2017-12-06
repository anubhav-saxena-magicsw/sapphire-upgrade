/*jslint nomen: true*/
/*global define,_,$*/

/**
 * TableHelper
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

define(["marionette", "components/table/model/custom-table-item-model", "components/table/model/custom-table-model", "components/table/model/custom-table-collection"], function(Marionette, CustomTableItemModel, CustomTableModel, CustomTableCollection) {"use strict";

/**
 *This class works as a helper class for Table component.
 *@class TableHelper
 *@access private
 */

    var TableHelper = {
        /** consts **/
        CONST_TABLE_DATA : "tableData",
        CONST_ITEM_RENDERER : "itemRenderer",
        CONST_ITEM_CONTAINER : "tbody",
        CONST_SINGLE:"single",
        CONST_MULTIPLE:"multiple",

        /**
         * This function configures the table
         * @access private
         * @memberof TableHelper
         * @param {Object} that Reference of MCQ Comp
         * @param {Object} objCompData data to configure the component
         * @returns None
         */
        doConfiguration : function(that, objCompData){
            //console.log('do config : ', that.customTableCollection, that.collection);
            if(that.customTableCollection === null){
                that.customTableCollection = new CustomTableCollection();
                that.collection = that.customTableCollection;
            }
            
            if(that.customTableModel === null){
                that.customTableModel = new CustomTableModel();
                that.model = that.customTableModel;
            }
            // CONFIGURATION
            //that.irClassName = that.customTableModel.get("irClassName");
            if(objCompData){
                // set table's class name...if not available, the default is stored into the model
                if (objCompData.hasOwnProperty("className")) {
                    that.customTableModel.set("className", objCompData.className);
                }

                // set item renderer class name...if not available, default will be set from model
                if (objCompData.hasOwnProperty("itemRendererClassName")) {
                    that.irClassName = objCompData.itemRendererClassName;
                }
                // set selection mode if provided...default is 'single'
                if(objCompData.hasOwnProperty("selectionMode")){
                    if(!that.customTableModel.validate({"selectionMode":objCompData.selectionMode})){
                        that.customTableModel.set("selectionMode", objCompData.selectionMode);
                    }
                }
            }
        },
		
		/**
         * Initialize
         * @access private
         * @memberof TableHelper
         * @param {Object} that Reference of MCQ Comp
         * @param {Object} objCompData data to configure the component
         * @returns None
         */
        init : function(that, objData) {
            that.dataProvider = objData.tableData;
            that.isDataProviderSet = true;
            this.parseData(that, that.dataProvider);
        },
		
		/**
         * This function changes the data provider during runtime
         * @access private
         * @memberof TableHelper
         * @param {Object} that Reference of MCQ Comp
         * @param {Object} objCompData data to configure the component
         * @returns None
         */
        changeDataProvider : function(that, objData){
            if(!objData.hasOwnProperty(this.CONST_TABLE_DATA)){
                objData = {tableData:objData};
            }
            //console.log('set data provider');
            if(that.isDataProviderSet === false){
                // first time the data provider is being set
                // set the default item renderer here...
                this.init(that, objData);
                if(!that.hasItemRenderer){
                    this.setItemRenderer(that);
                }
                that.isDataProviderSet = true;
                that.render();
            }else{
                this.flush(that);
                this.init(that, objData);
                that.isDataProviderSet = true;
                //that.render();
            }
        },
        
        /**
         * This function sets itemrenderer for the table
         * @access private
         * @memberof TableHelper
         * @param {Object} that Reference of MCQ Comp
         * @param {Object} itemRenderer refernece of itemrenderer
         * @returns None
         */
        setItemRenderer : function(that, itemRenderer){
            //that.hasItemRenderer = true;
            that.itemViewContainer = this.CONST_ITEM_CONTAINER;
            that.itemViewOptions = {
                parentRef : that
            };
            //that.itemView = itemRenderer;
            
            if (itemRenderer) {
                // set item renderer view
                that.itemView = itemRenderer;
            } else {
                // default item renderer
                that.itemView = this.getDefaultItemRenderer(that);
            }
        },
        
        /**
         * This function creates and returns an item renderer view for table.
         * This should only be used in case no item renderer has been specified
         * @access private
         * @memberof TableHelper
         * @param {Object} that Reference of MCQ Comp
         * @returns {Object} Item renderer view
         */
        getDefaultItemRenderer : function(that) {
            var itemRenderer, objItemModel, key, itemRendererTmpl = "";
            //console.log('that dia :', that.dataProvider);
            if (that.customTableCollection.models.length > 0) {
                // prepare item renderer from one item model
                objItemModel = that.customTableCollection.models[0];

                for (key in objItemModel.attributes) {
                    if (objItemModel.attributes.hasOwnProperty(key) && key.substring(0, 2) !== "__" && key !== "index") {
                        itemRendererTmpl += "<td>{{ " + key + " }}</td>";
                    }
                }
            }
            
            //console.log('default item renderer template : ', itemRendererTmpl);

            // create an itemview for default item renderer
            itemRenderer = Marionette.ItemView.extend({
                tagName : 'tr',
                template : _.template(itemRendererTmpl)
            });

            return itemRenderer;
        },
		
		/**
         * This function handles tasks for table
         * @access private
         * @memberof TableHelper
         * @param {Object} objEvent Reference of event object
         * @returns None
         */
        handleTablesTask : function(objEvent) {
            //console.log('task : ', objEvent);
            if (objEvent.hasOwnProperty('task')) {
                switch(objEvent.task) {
                    case this.ADD_ROW:
                        this.addRow();
                        break;
                    case this.DELETE_ROW:
                        if (objEvent.hasOwnProperty("index")) {
                            this.deleteRow(objEvent.index);
                        } else {
                            throw new Error('No index defined!');
                        }
                        break;
                    case this.UPDATE_ROW:
                        this.updateRow();
                        break;
                }
            } else {
                throw new Error("### Table ### : No task has is defined");
            }
        },
        
        /**
         * This function adds row in table
         * @access private
         * @memberof TableHelper
         * @param {Object} that Reference of MCQ Comp
         * @param {Object} data Data for the new row
         * @param {integer} index index at which new row to be inserted
         * @returns None
         */
        addRow : function(that, data, index){
            //console.log('add row ::: ', data, index);

            var itemModel = TableHelper.prepareItemModel(data);
            
            if (data && data !== undefined) {
                if(index > that.customTableCollection.length || index < 0){
                    throw new Error('Index is out of bound!');
                }
                
                if (index === undefined) {
                    //add at the last position
                    index = that.customTableCollection.length;
                }
                that.customTableCollection.addModelAt(itemModel, index);
                // reset selection
                this.resetRowSelection(that);
                that.trigger(that.ADD_ROW);
                //console.log('that coll : ', that.customTableCollection);
            } else {
                throw new Error('Please provide row data to be added');
            }
        },

		/**
         * This function deletes row in table
         * @access private
         * @memberof TableHelper
         * @param {Object} that Reference of MCQ Comp
         * @param {integer} index index of row to be deleted
         * @returns None
         */
        deleteRow : function(that, index) {
            if(index === undefined){
                throw new Error("Please provide an index to delete a row!");
            }
            that.customTableCollection.removeModelByIndex(index);
            this.resetRowSelection(that);
            that.trigger(that.DELETE_ROW);
        },
		
		/**
         * This function updates row in table
         * @access private
         * @memberof TableHelper
         * @param {Object} that Reference of MCQ Comp
         * @param {Object} model Model of the row to be updated
         * @param {integer} index index at which new row to be inserted
         * @returns None
         */
        updateRow : function(that, model, index) {
            if(index === undefined){
                throw new Error("Please provide an index to update row data!");
            }
            var objModel = that.customTableCollection.updateModelAt(model, index);
            // update the view
            that.children.findByModelCid(objModel.cid).render();
            this.resetRowSelection(that);
            that.trigger(that.UPDATE_ROW);
        },
		
		/**
         * This function resets the row selection
         * @access private
         * @memberof TableHelper
         * @param {Object} that Reference of MCQ Comp
         * @returns None
         */
        resetRowSelection : function(that){
            var trEl = that.$(that.itemViewContainer+" tr[class $='" + that.clsPostfix + "']");
            trEl.removeClass(that.irClassName + that.clsPostfix).addClass(that.irClassName);
            // reset selected indices
            that.customTableModel.resetSelectedIndices();
        },

        prepareItemModel : function(data) {
            return new CustomTableItemModel(data);
        },

        /**
         * This function parse the data and set it to the model of component
         * @access private
         * @param {Object} that Reference of MCQ Comp
         * @param {Object} objTableData Conatins the data to configure the component
         * @returns None
         */
        parseData : function(that, objTableData) {
            var itemModel;
            if(objTableData.headers.hasOwnProperty('header')){
                if($.isArray(objTableData.headers.header) === false){
                    that.customTableModel.set('headers', {header:[objTableData.headers.header]});
                }else{
                    that.customTableModel.set('headers', objTableData.headers);
                }
            }else{
                throw new Error('Please define at least one header to create table!');
            }
            // set default
            that.customTableModel.set('selectedIndex', -1);
            that.customTableModel.set('selectedIndices', []);
            
            if (objTableData.rows.item.length) {
                _.each(objTableData.rows.item, function(value, index) {
                    //console.log('***value : ', value);
                    itemModel = new CustomTableItemModel(value);
                    itemModel.set('index', index);
                    //console.log('item : ', itemModel);
                    that.customTableCollection.add(itemModel);
                });
            } else {
                itemModel = new CustomTableItemModel(objTableData.rows.item);
                itemModel.set('index', 0);
                that.customTableCollection.add(itemModel);
            }

            //that.customTableCollection.set("model", arrItemModels);
        },
        
        /**
         * This function flushes the member functiona and variables
         * @access private
         * @param {Object} that Reference of MCQ Comp
         * @returns None
         */
        flush : function(that){
            that.isDataProviderSet = false;
            that.children.call('destroy');
            //that.children.call('remove');
            
            // destroy collection
            var model;
            if (that.customTableCollection) {
                while (that.customTableCollection.first()) {
                    model = that.customTableCollection.first();
                    model.id = null;
                    model.destroy();
                    model = null;
                }
            }

            // destroy table's model
            //that.customTableModel.id = null;
            that.customTableModel.destroy();
            //that.customTableModel = null;

            //that.customTableCollection = null;
            that.arrHookedEvent.length = 0;
        },
        
        /**
         * This function removes the member function and variables from memmory
         * @access private
         * @param {Object} that Reference of MCQ Comp
         * @returns None
         */
        destroy : function(that){
            // destroy collection
            var model;
            if (that.collection) {
                while (that.collection.first()) {
                    model = that.collection.first();
                    model.id = null;
                    model.destroy();
                    model = null;
                }
            }
            
            that.model.id = that.customTableModel.id = null;
            that.customTableModel.destroy();
            that.model.destroy();
            that.model = that.customTableModel = null;

            that.collection = that.customTableCollection = null;
        }
    };

    return TableHelper;

});
