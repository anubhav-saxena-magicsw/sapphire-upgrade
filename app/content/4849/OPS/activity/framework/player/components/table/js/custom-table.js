/*jslint nomen: true*/
/*globals define,console,_,$*/
/**
 * CustomTable
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['marionette', 'player/base/base-composite-comp', 'components/table/js/custom-table-helper', 'text!components/table/template/custom-table-tmpl.html'],

    /**
 * This class represents a table component for Activity Framework.
 * It has the functionality to create table based on the provided item renderer and
 * it also provides functionalities to add/delete/update rows into table.
 *
 *@class CustomTable
 *@augments BaseCompositeComp
 *@param {Object} obj  An object with 'tableData', 'className', 'itemRenderer', 'selectionMode' and 'itemRendererClassName' properties.
 *@example
 *
 * var  tableComp;
 *
 * TableActivity.prototype.initActivity = function() {
 *		var objClassRef = this;
 *		Data_Loader.on(Data_Loader.DATA_LOAD_SUCCESS, $.proxy(objClassRef.successHandler, objClassRef));
 *		Data_Loader.on(Data_Loader.DATA_LOAD_FAILED, $.proxy(objClassRef.errorHandler, objClassRef));
 *		Data_Loader.load({
 *		url : "activity/sampleTableCompActivity/data/table.xml",
 *		dataType : 'xml',
 *		contentType : 'application/xml',
 *		returnType : 'json',
 *		scope : objClassRef
 *		});
 *	};
 *
 * TableActivity.prototype.successHandler = function(data){
 *		var objThis = this;
 *		this.tableData = data;
 *		// require the item renderer
 *		require(['activity/sampleTableCompActivity/js/StandardItemRenderer',
 *					'activity/sampleTableCompActivity/js/AdvItemRenderer'
 *						], function(StndItemRenderer, AdvItemRenderer){
 *		var tblData = {};
 *		tblData.tableData = data.table[2];
 *		tblData.className = "table table-bordered customTable3";
 *		tblData.itemRenderer = StndItemRenderer;
 *		tblData.selectionMode = "multiple";
 *		tblData.itemRendererClassName = "itemRenderer";
 *
 *		objThis.getComponent(objThis, "Table", "onComponentCreated", tblData);
 *				}
 *			);
 *	};

 * function onComponentCreated(objComp){
 *  tableComp = objComp;
 * }
 * <br>Configurable properties of component:<br>
 * <table border="1" style="white-space:pre-wrap; color:"#000000";"><tr><th>Property</th><th>Type</th><th>Default Value</th><th>Description</th></tr><tr><td>tableData</td><td>Json String</td><td>undefined</a></td><td>This is the xml data containing the data for table, this property is mandatory and data is required to be in a <a href="xml/table.xml" target="_blank">predifined</a> format.</td></tr><tr><td>className</td><td>CSS Class</td><td>undefined</td><td>Any style clss defined in activity css.</td></tr><tr><td>itemRenderer</td><td>Object</td><td>undefined</td><td>Item renderer object to be used for a row in table.</td></tr><tr><td>selectionMode</td><td>String</td><td>single</td><td>This property defines the selection mode of table's cell. Other value which this property can take is "multiple".</td></tr><tr><td>itemRendererClassName</td><td>Object</td><td>itemRenderer</td><td>Any css class defined in activity CSS.</td></tr></table>
 *
 *
 */
    function (Marionette, BaseCompositeComp, TableHelper, TableTemp) {
        'use strict';

        var CustomTable = /** @lends CustomTable.prototype */
            BaseCompositeComp.extend({
                /**
                 * template of CustomTable
                 * @access private
                 * @memberOf CustomTable
                 */
                template: _.template(TableTemp),
                /**
                 * tag name to be created when the CustomTable view gets created
                 * @type {String}
                 * @access private
                 * @memberOf CustomTable
                 */
                tagName: 'table',

                /**
                 * Use it to trigger this event from item render. While doing so,
                 * it is important to provide task to be performed by table.
                 * @memberOf CustomTable
                 * @access private
                 * @type {String}
                 * @const
                 * @example
                 * var obj = {};
                 * obj.task = this.parentRef.DELETE_ROW;
                 * obj.data = dataObjectIfAny;
                 * this.parentRef.trigger(this.parentRef.TABLE_TASK, obj);
                 */
                TABLE_TASK: 'tableTask',
                /**
                 * Delete row task constant
                 * @memberOf CustomTable
                 * @access private
                 * @type {String}
                 * @const
                 */
                DELETE_ROW: 'deleteRow',
                /**
                 * Add row task constant
                 * @memberOf CustomTable
                 * @access private
                 * @type {String}
                 * @const
                 */
                ADD_ROW: '',
                /**
                 * Update row task constant
                 * @memberOf CustomTable
                 * @access private
                 * @type {String}
                 * @const
                 */
                UPDATE_ROW: 'updateRow',

                /**
                 * Use this const to add row selection feature into table
                 * @memberOf CustomTable
                 * @access private
                 * @type {String}
                 * @const
                 */
                SELECT_ROW: 'selectRow',

                /**
                 * Postfix for selected class of item renderer
                 * @memberOf CustomTable
                 * @access private
                 * @type {String}
                 */
                clsPostfix: '-selected',

                /**
                 * This array stores the event hooked with table component
                 * @type {Array}
                 * @memberOf CustomTable
                 * @access private
                 */
                arrHookedEvent: [],
                /**
                 * Data provider of table component
                 * @type {Object}
                 * @access private
                 * @memberOf CustomTable
                 */
                dataProvider: null,
                /**
                 * collection of item renderer's model
                 * @type {Object}
                 * @access private
                 * @memberOf CustomTable
                 */
                customTableCollection: null,
                /**
                 * Model of custom table component
                 * @type {Object}
                 * @access private
                 * @memberOf CustomTable
                 */
                customTableModel: null,
                /**
                 * Boolean to check if item renderer is available or not
                 * @type {Boolean}
                 * @access private
                 * @memberOf CustomTable
                 */
                hasItemRenderer: false,

                /**
                 * This function initializes the component
                 * @access private
                 * @memberOf CustomTable
                 * @param {Object} objCompData Conatins the data to configure the component
                 * @returns None
                 */
                initialize: function (objCompData) {
                    if (objCompData && objCompData.hasOwnProperty('model')) {
                        return;
                    }

                    this.isDataProviderSet = false;
                    TableHelper.doConfiguration(this, objCompData);
                    if (objCompData) {
                        if (objCompData.hasOwnProperty(TableHelper.CONST_TABLE_DATA)) {
                            TableHelper.init(this, objCompData);
                        }

                        if (objCompData.hasOwnProperty(TableHelper.CONST_ITEM_RENDERER)) {
                            this.hasItemRenderer = true;
                            TableHelper.setItemRenderer(this, objCompData.itemRenderer);
                        } else {
                            this.hasItemRenderer = false;
                            TableHelper.setItemRenderer(this);
                        }
                        // add listeners
                        this.on(this.TABLE_TASK, TableHelper.handleTablesTask, this);
                    }
                },

                /**
                 * This function is being overridden here to fix the insertion of <tr>
                 * at correct position.
                 * @access private
                 * @memberOf CustomTable
                 * @param { Object } collectionView Collection view reference
                 * @param { Object } itemView Item view which gets repeated i.e. tr
                 * @param { Number } index Index number of the itemView
                 * @returns None
                 */
                appendHtml: function (collectionView, itemView, index) {
                    var elLen, itemViewCntr = collectionView.$(this.itemViewContainer);
                    elLen = itemViewCntr.children().length;
                    if (this.irClassName) {
                        itemView.$el.removeAttr('class').addClass(this.irClassName);
                    }
                    itemView.$el.attr('data-cid', itemView.model.cid);
                    if (elLen <= 0) {
                        itemViewCntr.append(itemView.el);
                    } else {

                        if (index <= 0) {
                            itemViewCntr.prepend(itemView.el);
                        } else {
                            //itemViewCntr.find("tr").eq((index-1)).after(itemView.el);
                            $(itemViewCntr.children()[index - 1]).after(itemView.el);
                        }

                    }
                },

                /**
                 * on render event handler of table component
                 * @access private
                 * @memberOf CustomTable#
                 * @param None
                 * @returns None
                 */
                onRender: function () {
                    // set className
                    if (this.customTableModel) {
                        this.$el.removeAttr('class').addClass(this.customTableModel.get('className'));
                    }

                }
            });

        /**
         * Inheriting the BaseCompositeComp
         * @access private
         * @memberOf CustomTable#
         * @param None
         * @returns None
         */
        CustomTable.prototype.Super = BaseCompositeComp;

        /**
         * This function can be used to set the class name for table.
         * @memberOf CustomTable#
         * @access public
         * @param {String} strClassName Class name for the table
         * @returns None
         */
        CustomTable.prototype.setClassName = function (strClassName) {
            //console.log('coll : ', this.model, this.collectionTableModel);
            if (strClassName !== undefined && strClassName !== '') {
                this.collectionTableModel.set('className', strClassName);
                this.$el.removeAttr('class').addClass(strClassName);
            }
        };

        /**
         * This function can be used to set the class name for item renderer
         * @memberOf CustomTable#
         * @access public
         * @param {String} strClassName Class name for item renderer
         * @returns None
         */
        CustomTable.prototype.setItemRendererClassName = function (strClassName) {
            if (strClassName && strClassName !== '') {
                this.irClassName = strClassName;
                // update class
                this.$(this.itemViewContainer + ' tr').removeAttr('class').addClass(strClassName);

            }
        };

        /**
         * @description This function can be used to set the data provide at later time i.e.
         * it works as to set the data provider after creating the table component or
         * to change the data provide of existing table component.
         * @access public
         * @memberOf CustomTable#
         * @param {Object} objData Table Data to be rendered
         * @returns None
         */
        CustomTable.prototype.setDataProvider = function (objData) {
            if (objData) {
                TableHelper.changeDataProvider(this, objData);
            } else {
                console.warn('Please provide data for table!');
            }
        };

        /**
         * @description This function returns table data in current state
         * @memberOf CustomTable#
         * @access public
         * @param None
         * @returns {Object} table's data provider
         */
        CustomTable.prototype.getDataProvider = function () {
            // TODO : Secure the collection and model by returning data by value.
            return TableHelper.customTableCollection.toJSON();
        };

        /**
         * @description This function is used to hook event to table component
         * so that any activity can listen for the task performed.
         * @param {Object} objRef Reference of the activity which wants to hook the event
         * @param {String} strEventType Event type to be hooked
         * @param {String} strCallback The callback function for event listener
         * @memberOf CustomTable#
         * @access public
         * @return None
         */
        CustomTable.prototype.hookEvent = function (objRef, strEventType, strCallback) {
            var obj = {
                callbackRef: objRef,
                callback: strCallback
            };
            this.arrHookedEvent[strEventType] = obj;
            switch (strEventType) {
            case this.ADD_ROW:
                this.on(this.ADD_ROW, $.proxy(objRef[strCallback], objRef));
                break;
            case this.DELETE_ROW:
                this.on(this.DELETE_ROW, $.proxy(objRef[strCallback], objRef));
                break;
            case this.UPDATE_ROW:
                this.on(this.UPDATE_ROW, $.proxy(objRef[strCallback], objRef));
                break;
            case this.SELECT_ROW:
                //this.$(this.itemViewContainer).on("click", "tr", $.proxy(objRef[strCallback], objRef));
                //console.log('obj : ', obj);
                this.$(this.itemViewContainer).on('click', 'tr', obj, $.proxy(this.handleRowClick, this));
                break;
            }
        };

        /**
         * @description This function handles the row click event.
         * It works only if the "SELECT_ROW" event is hooked with table component
         * @access private
         * @memberOf CustomTable#
         * @param {Object} objEvent Event object
         * @return None
         */
        CustomTable.prototype.handleRowClick = function (objEvent) {
            //console.log("_____________________ handleRowClick ________________________");
            var strId, itemIndex, trEl, selectionMode, selectedEl = $(objEvent.currentTarget);
            selectionMode = this.customTableModel.get('selectionMode');

            // get item view's model
            strId = selectedEl.attr('data-cid');
            itemIndex = this.children.findByModelCid(strId).model.get('index');

            if (selectedEl.hasClass(this.irClassName + this.clsPostfix)) {
                selectedEl.removeClass(this.irClassName + this.clsPostfix).addClass(this.irClassName);
                if (selectionMode === TableHelper.CONST_SINGLE) {
                    this.customTableModel.set('selectedIndex', this.customTableModel.defaults.selectedIndex);
                } else {
                    this.customTableModel.removeFromIndices(itemIndex);
                }
            } else {
                // reset others...
                if (selectionMode === TableHelper.CONST_SINGLE) {
                    trEl = this.$(this.itemViewContainer + " tr[class $='" + this.clsPostfix + "']");
                    if (trEl !== undefined) {
                        trEl.removeClass(this.irClassName + this.clsPostfix).addClass(this.irClassName);
                    }
                    selectedEl.removeClass(this.irClassName).addClass(this.irClassName + this.clsPostfix);

                    this.customTableModel.set('selectedIndex', itemIndex);
                } else {
                    selectedEl.removeClass(this.irClassName).addClass(this.irClassName + this.clsPostfix);

                    this.customTableModel.updateSelectedIndices(itemIndex);
                    //console.log('selectedINdi : ', this.customTableModel.getSelectedIndices());
                }
            }

            // now trigger the event
            objEvent.data.callbackRef[objEvent.data.callback]({
                type: this.SELECT_ROW
            });

        };

        /**
         * @description This function is used to unhook event from table component
         * @memberOf CustomTable#
         * @access public
         * @param {String} strEventType Event type to be unhooked
         * @return None
         */
        CustomTable.prototype.unhookEvent = function (strEventType) {
            switch (strEventType) {
            case this.ADD_ROW:
                this.off(this.ADD_ROW);
                break;
            case this.DELETE_ROW:
                this.off(this.DELETE_ROW);
                break;
            case this.UPDATE_ROW:
                this.off(this.UPDATE_ROW);
                break;
            case this.SELECT_ROW:
                this.$(this.itemViewContainer).off('click', "tr");
                break;
            }
        };

        /**
         * This function adds provided data into Table as a row.
         * It is important to provide the proper format of data.
         * A row can be added at specified index by passing the second parameter.
         * @memberOf CustomTable#
         * @access public
         * @param {Object} data Data object for item renderer
         * @param {Number} index Index where the row needs to be inserted
         * @return None
         * @example
         * TableComp.addRow(rowData, 1); // row will be added at second position from top
         * ____________ OR _____________
         * TableComp.addRow(rowData); // row will be added at the last position
         */
        CustomTable.prototype.addRow = function (data, index) {
            TableHelper.addRow(this, data, index);
        };

        /**
         * This function deletes a row of table from specified index
         * @memberOf CustomTable#
         * @access public
         * @param {Number} index Index from where the row needs to be deleted
         * @return None
         * @example
         * TableComp.deleteRow(2); // The row having second index will be deleted
         */
        CustomTable.prototype.deleteRow = function (index) {
            TableHelper.deleteRow(this, index);
        };

        /**
         * This function updates an existing row that will be identified by second
         * parameter provided as index.
         * @memberOf CustomTable#
         * @access public
         * @param {Object} data Data object for item renderer that needs to be updated
         * @param {Number} index Index of row for which data needs to be updated
         * @return None
         * @example
         * TableComp.updateRow(updatedData, 1); // row will be update at second position from top
         */
        CustomTable.prototype.updateRow = function (data, index) {
            TableHelper.updateRow(this, data, index);
        };

        /**
         * This function returns the selected index i.e. index of selected row.
         * It only works if selection mode is set to 'single'
         * @memberOf CustomTable#
         * @access public
         * @param None
         * @return {Number} Selected index gets returned
         */
        CustomTable.prototype.getSelectedIndex = function () {
            return this.customTableModel.get("selectedIndex");
        };

        /**
         * This function returns the index of all the selected row
         * @memberOf CustomTable#
         * @access public
         * @param None
         * @return {Array} all selected index
         */
        CustomTable.prototype.getSelectedIndices = function () {
            var arr;
            // check if selection mode is single, return selected index as an array
            if (this.customTableModel.get('selectionMode') === TableHelper.CONST_SINGLE) {
                arr = [this.customTableModel.get('selectedIndex')];
            } else {
                arr = this.customTableModel.get("selectedIndices");
            }
            return arr;
        };

        /**
         * This function returns the data of the row specified using index parameter
         * @memberOf CustomTable#
         * @access public
         * @param {Number} nIndex row index of table
         * @return {Object} the row data at specified index
         */
        CustomTable.prototype.getRowDataAt = function (nIndex) {
            return this.customTableCollection.getModelByIndex(nIndex).toJSON();    
        };

        /**
         * This function returns array of the data for all of the selected row
         * @memberOf CustomTable#
         * @access public
         * @return {Array} array of selected row data
         */
        CustomTable.prototype.getSelectedRowsData = function () {
            var i, arrSelectedIndices, arrRowData = [];
            arrSelectedIndices = this.getSelectedIndices();
            if(arrSelectedIndices.length > 0){
                for(i = 0; i<arrSelectedIndices.length; i+=1){
                    arrRowData.push(this.customTableCollection.getModelByIndex(arrSelectedIndices[i]).toJSON());
                }    
            }
            return arrRowData;
        };

        /**
         * This function is used to destroy the Table component
         * @memberOf CustomTable#
         * @access public
         * @param None
         * @returns {Boolean} True or false
         */
        CustomTable.prototype.destroy = function () {
            this.off(this.TABLE_TASK, TableHelper.handleCommonTask);
            this.unhookEvent(this.ADD_ROW);
            this.unhookEvent(this.DELETE_ROW);
            this.unhookEvent(this.UPDATE_ROW);
            this.unhookEvent(this.SELECT_ROW);

            TableHelper.flush(this);
            TableHelper.destroy(this);

            //TableHelper = null;

            this.close();

            return this.Super.prototype.destroy(true);
        };

        return CustomTable;

    });