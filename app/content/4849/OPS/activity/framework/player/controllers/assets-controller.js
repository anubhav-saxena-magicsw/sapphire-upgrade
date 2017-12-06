/*jslint nomen: true*/
/*globals Backbone,_,console,$, class */

/**
 * assetsController
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */
define(['marionette'], function (Marionette) {
    "use strict";
    var AssetsController, objInstance;
    objInstance = null;

    /**
     * Class 'assetsController' is controller class for a activity area. this class is responsible to keep up-to-date activity with
     * updated value which can be changed during run time. e.g new scaled value.
     *
     *
     *@access private
     *@class assetsController
     *@augments Backbone.Marionette.Controller.extend
     */

    AssetsController = Backbone.Marionette.Controller.extend({
        assets: null,
        constructor: function () {
        }
    });

    /**
     * Destroys the assetsController object.
     * @memberOf assetsController#
     * @param None
     * @returns None
     * @access private
     */
    AssetsController.prototype.setMedia = function (data) {
        this.assets =  data;

    };
    /**
     * Destroys the assetsController object.
     * @memberOf assetsController#
     * @param String
     * @returns {Array}
     * @access public
     */
    AssetsController.prototype.getMedia = function (type) {
        var res = [], resall = [], assets, i;
        assets = this.assets;
        for (i in  assets) {
            assets[i].Mediainfo = JSON.parse(assets[i].Mediainfo);
            if (assets[i].Assettype == type) {
                res.push(assets[i]);
            }
            resall.push(assets[i]);
        }
		
        if (type === 'image' || type === 'audio' || type === 'video') {
            return res;
        } else {
            return resall;
        }
    };


    /**
     * Destroys the assetsController object.
     * @memberOf assetsController#
     * @param None
     * @returns {Boolean} true or false
     * @access private
     */
    AssetsController.prototype.destroy = function () {
        delete this.assets;
    };
    return {
        getInstance: function () {
            if (objInstance === null) {
                objInstance = new AssetsController();
            }
            return objInstance;
        }
    };
});
