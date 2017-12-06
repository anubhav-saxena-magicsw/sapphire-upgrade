/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * AudioHotSpotEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/base-editor'], function(Marionette, BaseEditor) {
	'use strict';
	var AudioHotSpotEditor;

	/**
	 * AudioHotSpotEditor is responsible to load and return slider component class
	 * signature and also prepare default data which is required by an slider
	 * to initlized itself
	 *
	 *@augments AudioHotSpotEditor
	 *@example
	 *Load module
	 *
	 var objAudioPlayerEditor = BaseEditor.extend({

	 AudioHotSpotEditor.prototype.getComponent = function(compData) {
	 //Asking to BaseEditor to create a component
	 this.createCompData($(compData));
	 };

	 };

	 return objAudioPlayerEditor;
	 */

	AudioHotSpotEditor = BaseEditor.extend({
		defaultCompData : {}
	});

	/**
	 * Will be invoked by Editor when an SliderComponent needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof AudioHotSpotEditor
	 * @access private
	 */
	AudioHotSpotEditor.prototype.getComponent = function(compData, isSimComp) {
		this.isSimComp = isSimComp;
		//Asking to BaseEditor to create a component
		var objData = (compData.data !== undefined) ? compData : $(compData);
		if (objData.data) {
			if (objData.data.loop === "true") {
				objData.data.loop = true;
			} else if (objData.data.loop === "false") {
				objData.data.loop = false;
			}

			if (objData.data.ui === "true") {
				objData.data.ui = true;
			} else if (objData.data.ui === "false") {
				objData.data.ui = false;
			}
		}
		this.createCompData(objData);

	};

	/**
	 * Preparing constructor data for audiohotspot component which will be passed to component
	 * through its constructor method.
	 * @param {Object} compData
	 * @return none
	 * @memerof AudioHotSpotEditor
	 * @access private
	 */
	AudioHotSpotEditor.prototype.createCompData = function(compData) {
		this.defaultCompData = this.prepareDefaultData(compData);
		this.checkSource(this.defaultCompData);
		if (this.defaultCompData === undefined) {
			throw new Error(this.errorConst.SLIDER_DEFAULT_DATA_MISSING);
		}
		this.createComponent(compData);
	};

	/**
	 * Preparing check the source path of the audio
	 * @param {Object} compData
	 * @return none
	 * @memerof AudioHotSpotEditor
	 * @access private
	 */
	AudioHotSpotEditor.prototype.checkSource = function(compData) {
		var i, objSrc, arrSrc = compData.source;
		for ( i = 0; i < arrSrc.length; i += 1) {
			objSrc = arrSrc[i];
			if (this.bEditor === false) {
				objSrc.path = this.objPathUpdater.getValidatedPath(this.regionId.classRef.editorController.regionId, objSrc.path);
			}
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
	 * @memberof AudioHotSpotEditor
	 * @access private
	 */
	AudioHotSpotEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};

	/**
	 * This method destroy the AudioHotSpotEditor class.
	 * @param none
	 * @return none
	 * @memberof AudioHotSpotEditor
	 * @access private
	 */
	AudioHotSpotEditor.prototype.destroy = function() {
		return AudioHotSpotEditor.__super__.destroy(true, this);
	};

	return AudioHotSpotEditor;
});
