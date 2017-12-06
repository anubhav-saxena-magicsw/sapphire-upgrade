/*jslint nomen: true*/
/*globals Backbone,_,Data_Loader, console */

/**
 * EditorManager
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

define(['marionette', 'player/editor/editor-controller', 'player/factory/factory'], function(Marionette, EditorControllerRef, Factory) {
	"use strict";
	var EditorManager;

	/**
	 * This class is the key class of component creation. playerHelper creating an object and
	 * will always ask to create dynamic components when required by an activity in initlize time and further
	 * task related to component creation's will be managed or distrubuted by this class.
	 *
	 * A EditorController class is introduced to divide/sharing the activity initlization/component creation responsibility.
	 *
	 * @access private
	 */

	EditorManager = Backbone.Marionette.Controller.extend({

		objMPlayer : null,
		editor_dict : null,

		constructor : function(objPlayerRef) {
			this.editor_dict = {};
			this.objMPlayer = objPlayerRef;
			this.initialize();
		}
	});

	EditorManager.prototype.initialize = function() {
		//console.log("editorMangerInitialized .............",);
	};

	/**
	 * Responsible to create editor controller for each region based on the provided regionid, also
	 * each editorcontroller object will be binded with 'ACTIVITY_CREATED_SUCCESSFULLY', which will
	 * triggerd by an editorController when classes for all components of an activity will be loaded.
	 *
	 * This method also maintain a dictionary of 'editorController' objects to for future reference.
	 * e.g to destroy.
	 *
	 * @param {String} strRegionId The id of region
	 * @return none
	 * @access private
	 */
	EditorManager.prototype.createEditorController = function(strRegionId, bEditor) {
		var objClassRef = this, objEditorController = new EditorControllerRef(strRegionId, this.objMPlayer, bEditor);
		objEditorController.on(objEditorController.ACTIVITY_CREATED_SUCCESSFULLY, objClassRef.onActivityCreationSuccess, objClassRef);
		this.editor_dict[strRegionId] = objEditorController;
	};

	/**
	 * Method getEditorcontroller return the reference of editor controller object based on the provided
	 * region id.
	 * @param {String} strRegionId
	 * @return {Object} objEditorController
	 * @memberof EditorManager
	 * @access private
	 */
	EditorManager.prototype.getEditorController = function(strRegionId) {
		var objEditorController = this.editor_dict[strRegionId];
		return objEditorController;
	};
	/**
	 * Responsible to render activity html file with the help of Editor controller
	 * Also responsible to select associated editor with given region
	 */
	EditorManager.prototype.renderActivityHTML = function(strRegionId, objActivityData) {
		this.editor_dict[strRegionId].initialize(strRegionId, objActivityData);
	};

	/**
	 * Invoked when an activiyt html successfully parse. This method is responsible to pass the updated HTML
	 * content to activity manager class.
	 * @param {Object} objEvent
	 * @return none
	 */
	EditorManager.prototype.onActivityCreationSuccess = function(objEvent) {
		this.objMPlayer.getPlayerHelper().getRegionManager().OnHTMLCreationCompleteComponent(objEvent);
	};

	//TODO COMMENT
	EditorManager.prototype.flushEditor = function(strId) {
		var objEditorController = this.editor_dict[strId];
		objEditorController.flush();
		objEditorController = undefined;
	};

	/**
	 * Making sure that each controller destory its footprints and data if any.
	 * The count of editor controller is depends on the regions count.
	 *
	 * @param {Object} objData
	 * @return none
	 */
	EditorManager.prototype.destroy = function(objData) {
		var key, objEditorController, objClassRef = this;
		for (key in objClassRef.editor_dict) {
			if (this.editor_dict.hasOwnProperty(key)) {
				objEditorController = objClassRef.editor_dict[key];
				objEditorController.destroy();
				objEditorController.off(objEditorController.ACTIVITY_CREATED_SUCCESSFULLY);
				objEditorController = undefined;
			}
		}
		//removing the controller reference(s) from dictionary
		objClassRef.editor_dict = undefined;

		return true;
	};

	return EditorManager;

});
