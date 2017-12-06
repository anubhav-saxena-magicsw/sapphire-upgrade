/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * Wizad
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['components/case/case'], function(Case) {
	'use strict';
	var Wizard;
	Wizard = Case.extend({
		objData : null,
		template : _.template(''),
		currentIndex : 0,
		wizardJsonData : null,

		initialize : function(objData) {
			this.objData = objData;
			//this property is being used in componentselector for editing.
			this.componentType = "wizard";
			this.currentIndex = parseInt(this.objData["default"]);
		},

		onRender : function() {
			if (this.objData.styleClass !== undefined) {
				$(this.$el).addClass(this.objData.styleClass);
				$(this.el).attr('id', this.strCompId);
			}
		},

		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		}
	});

	/**
	 * 'launchNextView' will change the next view of wizard
	 * @param {none}
	 * @return {none}
	 * @access public
	 * @memberof  Wizard#
	 */
	Wizard.prototype.launchNextView = function() {
		this.currentIndex = this.wizardJsonData.currentIndex + 1;
		if (this.currentIndex < this.wizardJsonData.components.length) {
			this.prepareChangeViewData(this.currentIndex, 'next');
		} else {
			this.currentIndex = this.wizardJsonData.length - 1;
		}
	};

	/**
	 * 'hide' will hide the view of wizard
	 * @param {none}
	 * @return {none}
	 * @access public
	 * @memberof  Wizard#
	 */
	Wizard.prototype.hide = function() {
		this.$el.hide();
		this.customEventDispatcher("hide", this, this);
	};

	/**
	 * 'show' will show the view of wizard
	 * @param {none}
	 * @return {none}
	 * @access public
	 * @memberof  Wizard#
	 */
	Wizard.prototype.show = function() {
		this.$el.show();
		this.customEventDispatcher("show", this, this);
	};

	/**
	 * 'launchPreviousView' is responsible to change the wizard view to
	 * its previous view if any.
	 * @param {none}
	 * @return {none}
	 * @access public
	 * @memberof  Wizard#
	 */
	Wizard.prototype.launchPreviousView = function() {
		this.currentIndex = this.wizardJsonData.currentIndex - 1;
		if (this.currentIndex >= 0) {
			this.prepareChangeViewData(this.currentIndex, 'back');
		} else {
			this.currentIndex = 0;
		}
	};

	/**
	 * 'prepareChangeViewData' will prepare the change view data and
	 * trigger "changeView".
	 * @param {Object} strCurrentChildIndex current child parent id.
	 * @return {none}
	 * @access private
	 * @memberof  Wizard#
	 */
	Wizard.prototype.prepareChangeViewData = function(nextChildIndex, action) {
		var objWizardEvent = {}, objWizardScreenData = {};
		objWizardEvent.jsonData = this.wizardJsonData;
		objWizardEvent.totalItems = this.wizardJsonData.components.length;
		objWizardEvent.compId = this.getID();
		objWizardEvent.nextIndex = nextChildIndex;

		objWizardScreenData.action = action;
		objWizardScreenData.currentIndex = this.currentIndex;
		objWizardScreenData.totalItems = this.wizardJsonData.components.length;
		objWizardScreenData.compId = this.wizardJsonData.components[this.wizardJsonData.currentIndex].id;

		if (action === "next") {
			objWizardScreenData.previousIndex = nextChildIndex;
		} else {
			objWizardScreenData.nextIndex = nextChildIndex;
		}
		this.customEventDispatcher(this.eventConst.CHANGE_VIEW, this, objWizardEvent);
		this.customEventDispatcher(this.eventConst.WIZARD_VIEW_CHANGE, this, objWizardScreenData);
	};

	/**
	 *This method is introuduced to removed unwanted reference and events
	 * when wizard view change.
	 */
	Wizard.prototype.flush = function() {
		delete this.wizardJsonData;
		delete this.objData;
		delete this.currentIndex;
	};

	/**
	 * This method is introduced to make user enable to change its child list
	 * in runtime.
	 * e.g user can change wizard view child list data when these data are coming
	 * from external sources(web service, xml).
	 * @param {Object} jsonObj updated child list data in json format
	 * @return {None}
	 * @access public
	 * @memberof Wizard#
	 */
	Wizard.prototype.setWizardScreenData = function(jsonObj) {
		this.wizardJsonData = jsonObj;
	};

	Wizard.prototype.wizardViewRenderComplete = function() {
		var strEvent = this.eventConst.WIZARD_VIEW_RENDER_COMPLETE + "_" + this.currentIndex.toString();
		this.customEventDispatcher(strEvent, this);
	};

	Wizard.prototype.wizardSuper = Case;

	Wizard.prototype.destroy = function() {
		this.flush();
		return this.wizardSuper.prototype.destroy.call(this, true);
	};

	return Wizard;
});
