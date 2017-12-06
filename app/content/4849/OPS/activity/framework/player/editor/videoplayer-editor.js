/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * VideoPlayerEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/base-editor'], function(Marionette, BaseEditor) {
	'use strict';
	var VideoPlayerEditor;

	/**
	 * VideoPlayerEditor is responsible to load and return slider component class
	 * signature and also prepare default data which is required by an slider
	 * to initlized itself
	 *
	 *@augments VideoPlayerEditor
	 *@example
	 *Load module
	 *
	 var objVideoPlayerEditor = BaseEditor.extend({

	 VideoPlayerEditor.prototype.getComponent = function(compData) {
	 //Asking to BaseEditor to create a component
	 this.createCompData($(compData));
	 };

	 };

	 return objVideoPlayerEditor;
	 */

	VideoPlayerEditor = BaseEditor.extend({
		defaultCompData : {}
	});

	/**
	 * Will be invoked by Editor when an SliderComponent needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof VideoPlayerEditor
	 * @access private
	 */
	VideoPlayerEditor.prototype.getComponent = function(compData, isSimComp) {
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
	 * @memerof VideoPlayerEditor
	 * @access private
	 */
	VideoPlayerEditor.prototype.createCompData = function(compData) {
		this.defaultCompData = this.prepareDefaultData(compData);
		this.checkSource(this.defaultCompData);
		if (this.defaultCompData === undefined) {
			throw new Error(this.errorConst.SLIDER_DEFAULT_DATA_MISSING);
		}
		this.createComponent(compData);
	};

	VideoPlayerEditor.prototype.checkSource = function(data) {
		var i, arrSrc = data.source;
		for ( i = 0; i < arrSrc.length; i += 1) {
			var objSrc = arrSrc[i];
			objSrc.path = this.objPathUpdater.getValidatedPath(this.regionId.classRef.editorController.regionId, objSrc.path);
		}
	};

	/**
	 * Overriding 'BaseEditor' method to get notifiy when sliderComponent class is
	 * required successfully.
	 * This method is also resposible to append default data for slider component
	 * in objComponent (received as parameter when component created successfully)
	 *
	 * @param {Object} objComponent slider coponent class signature
	 * @return none
	 * @memberof VideoPlayerEditor
	 * @access private
	 */
	VideoPlayerEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};

	/**
	 * This method destroy the VideoPlayerEditor class.
	 * @param none
	 * @return none
	 * @memberof VideoPlayerEditor
	 * @access private
	 */
	VideoPlayerEditor.prototype.destroy = function() {
		return VideoPlayerEditor.__super__.destroy(true, this);
	};

	return VideoPlayerEditor;
});
