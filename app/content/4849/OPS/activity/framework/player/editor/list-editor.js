/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * ListEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/base-editor'], function(Marionette, BaseEditor) {
    'use strict';
    var ListcompEditor;

    /**
     * ImageEditor is responsible to load and return slider component class
     * signature and also prepare default data which is required by an slider
     * to initlized itself
     *
     *@augments ListEditor
     *@example
     *Load module
     *
     var ListEditor = BaseEditor.extend({

	 ImageEditor.prototype.getComponent = function(compData) {
	 //Asking to BaseEditor to create a component
	 this.createCompData($(compData));
	 };

	 };

     return objImageEditor;
     */

    ListcompEditor = BaseEditor.extend({
        defaultCompData : {}
    });

    /**
     * Will be invoked by Editor when an SliderComponent needed.
     * @param {Object} compData
     * @return none
     * @memberof ListEditor
     * @access private
     */
    ListcompEditor.prototype.getComponent = function(compData, isSimComp) {
        this.isSimComp = isSimComp;
        //Asking to BaseEditor to create a component
        var objData = (compData.data !== undefined) ? compData : $(compData);
        this.createCompData(objData);
    };

    /**
     * Preparing constructor data for Slider component which will be passed to slider
     * through its constructor method.
     * @param {Object} compData
     * @return none
     * @memerof ListEditor
     * @access private
     */
    ListcompEditor.prototype.createCompData = function(compData) {
        this.defaultCompData = this.prepareDefaultData(compData);
        if (this.defaultCompData === undefined) {
            throw new Error(this.errorConst.BUTTON_DEFAULT_DATA_MISSING);
        }
        this.createComponent(compData);
    };

    /**
     * Overriding 'ListEditor' method to get notifiy when sliderComponent class is
     * required successfully.
     * This method is also resposible to append default data for slider component
     * in objComponent (received as parameter when component created successfully)
     *
     * @param {Object} objComponent slider coponent class signature
     * @return none
     * @memberof ListEditor
     * @access private
     */
    ListcompEditor.prototype.onComponentCreationComplete = function(objComponent) {
        this.objComp = objComponent;
        this.objComp.defaultData = this.defaultCompData;
        this.componentCreated();
    };

    ListcompEditor.prototype.updateComponent = function(objComponent, objData) {
        var strPropertyName = objData.actionKeys[2].toLowerCase();
        objComponent.model.set(strPropertyName, objData.data[strPropertyName]);
        objComponent.render();
    };

    ListcompEditor.prototype.replaceClassProp = function(cl, prop, val) {
        if (!cl || !prop || !val) {
            console.error('Wrong function arguments');
            return false;
        }


        // Select style tag value

        var tag = document.getElementsByTagName('head')[0];//'style';

        var style = $(tag).text();
        var str = style;
        console.log("data found....",  style);
        /*
         // Find the class you want to change
         var n = str.indexOf('.' + cl);
         str = str.substr(n, str.length);
         n = str.indexOf('}');
         str = str.substr(0, n + 1);

         var before = str;

         // Find specific property

         n = str.indexOf(prop);
         str = str.substr(n, str.length);
         n = str.indexOf(';');
         str = str.substr(0, n + 1);

         // Replace the property with values you selected

         var after = before.replace(str, prop + ':' + val + ';');
         style = style.replace(before, after);

         // Submit changes

         $(tag).text(style);
         */

    };


    /**
     * This method destroy the ListEditor class.
     * @param none
     * @return none
     * @memberof ListEditor
     * @access private
     */
    ListcompEditor.prototype.destroy = function() {
        return ListcompEditor.__super__.destroy(true, this);
    };

    return ListcompEditor;
});
