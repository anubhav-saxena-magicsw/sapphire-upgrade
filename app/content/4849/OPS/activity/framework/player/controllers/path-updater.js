/*jslint nomen: true*/
/*globals Backbone,_,console,$, class */

/**
 * PathUpdater
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(['marionette', 'player/events/eventsconst', 'player/constants/errorconst'], function(Marionette, eventconst, errorConst) {
	"use strict";
	var PathUpdater, objInstance = null;
	/**
	 * Class 'PathUpdater' is a singleton class which is responsible to
	 * handle path related task.
	 * This class will store the base url path and create and return the path based on the
	 * user data.
	 *
	 *@access private
	 *@class PathUpdater
	 *@augments Backbone.Marionette.Controller.extend
	 */

	PathUpdater = Backbone.Marionette.Controller.extend({
		rootPathDict : {},

		/**
		 * getValidatedPath
		 */
		getValidatedPath : function(strRegionId, path) {
			var rootPath, index, validPath = "";
			if (strRegionId !== undefined && this.rootPathDict[strRegionId] !== undefined) {
				rootPath = this.rootPathDict[strRegionId];
				if (path !== undefined && path.length > 0) {
					index = path.indexOf(rootPath);
				}
				if (index === -1) {
					validPath = rootPath + "/" + path;
				} else {
					validPath = path;
				}
			}
			return validPath;
		},

		/**
		 * Return the template path
		 */
		getTemplatePath : function() {
			return "authoring/wrapper/" + this.strTemplatePath;
		},
		
		getTemplateImagePath:function(){
			return "authoring/wrapper/selectedTemplates/templateImages/";
		},

		/**
		 * setter for the root path
		 */

		setRootPath : function(strRegionId, strPath) {
			var arrTemp, path;
			if (strRegionId !== undefined && strRegionId.length > 0) {
				if (!this.rootPathDict) {
					this.rootPathDict = {};
				}
				if (strPath !== undefined && strPath.length > 0) {
					arrTemp = strPath.split("/");
					arrTemp.pop();
					path = arrTemp.join("/");
					this.rootPathDict[strRegionId] = path;
				}
			}
		},
	});

	return {
		/**
		 * Forceing to return single object reference everytime.
		 */
		getInstance : function() {
			if (objInstance === null) {
				objInstance = new PathUpdater();
			}
			return objInstance;
		}
	};

});
