/*globals console*/
/**
 * RouterHelper
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */
define([], function() {
    'use strict';
    /**
     *A module representing a RouterHelper.
     *@class RouterHelper
     *@example
     *RouterHelper.membername
     * @access private
     */
    
    var obj = {
        /**
         * Changes index
         * @access private
         * @param {Object}
         * @returns none.
         */
        changeIndex : function(param) {
            //add code here....
        },
        /**
         * Launches activity for given index.
         * @access private
         * @param {int} nIndex index of activity.
         * @returns none.
         */
        activityLaunchByIndex : function(nIndex) {
            var strClassPath;
            this.launchActivity(strClassPath);
        },

        /**
         * Launches activity for given name.
         * @access private
         * @param {String} name of activity.
         * @returns none.
         */
        activityLaunchByName : function(strName) {
            var strClassPath;
            this.launchActivity(strClassPath);
        },

        /**
         * Launches activity for given activity classpath.
         * @access private
         * @param {String} classpath of activity.
         * @returns none.
         */
        launchActivity : function(strActivityClassPath) {

        },
        /**
         * Appends activity
         * @access private
         * @param none.
         * @returns none.
         */
        appendActivity : function() {

        }
    };
    return obj;
}); 