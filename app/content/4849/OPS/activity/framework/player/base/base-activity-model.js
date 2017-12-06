/*globals Backbone*/
/**
 * BaseActivityModel 
 * @fileoverview 
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */

define(
	/** 
    *A class representing a baseactivitymodel.
    *@augments Backbone.Model
    *@example
    *Load module
    *require(['player/base/BaseActivityModel'], function(BaseActivityModel) {
    *    var baseactivitymodel = new BaseActivityModel();
    *});  
    * @class BaseActivityModel
    * @access private      
    */
	    
	function (require, exports, module) {
        "use strict";
        /** 
        @constructor
        @requires Backbone
        @augments Backbone.Model
        */
        var BaseActivityModel = /** @lends BaseActivityModel.prototype */Backbone.Model.extend({
            defaults : {
                "appetizer" : "caesar salad",
                "entree" : "ravioli",
                "dessert" : "cheesecake"
            }
        });
        return BaseActivityModel;
    });
