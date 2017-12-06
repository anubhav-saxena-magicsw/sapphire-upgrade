
/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * text box
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['components/inputtext/inputtext'], function(InputText) {
    'use strict';
    var Fibinput;

    Fibinput = InputText.extend({
        objData : null,
        answer: null,
        initialize : function (objData) {
            var objThis = this;
            this.objData = objData;//this property is being used in componentselector for editing.
            this.answer =  this.objData.answer;
        }
    });
    Fibinput.prototype.getValue = function () {
       return this.$el.find('input').val().trim();
    };
    Fibinput.prototype.__super__ = InputText;

    Fibinput.prototype.destroy = function () {
        this.objData = null;
        this.answer = null;
        return this.__super__.prototype.destroy(true);
    };

    return Fibinput;
});
