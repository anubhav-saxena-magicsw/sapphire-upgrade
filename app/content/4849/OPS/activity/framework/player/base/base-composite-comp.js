/*
* globals Backbone $*/
/**
 * BaseCompositeComp
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(['marionette'], function(Marionette) {
	'use strict';
	var BaseCompositeComp;

	/**
	 *This class is a collection view and item view, for rendering leaf-branch/composite model hierarchies
	 *@class BaseCompositeComp
	 *@extends Backbone.Marionette.CompositeView
	 *@access private
	 *@example
	 * var baseCompositeComp = new BaseCompositeComp();
	 */

	BaseCompositeComp = Backbone.Marionette.CompositeView.extend({
		isBaseCompositeComp : true,
		isDestroyCalled : false,
		strName : undefined,
		nStageScale : 1,
		strCompId : undefined,
		type : undefined,
		bEditor : false,
		parentDiv : null
	});

	/**
	 *This function initializes the BaseCompositeComp
	 *@memberof BaseCompositeComp#
	 *@access public
	 *@param None
	 *@returns None
	 */
	BaseCompositeComp.prototype.initBaseCompositeComp = function() {

	};

	/**
	 * This function returns the id
	 *@memberof BaseCompositeComp#
	 * @access public
	 * @param None
	 * @returns {String} assigned ID
	 */
	BaseCompositeComp.prototype.getName = function() {
		return this.strName;
	};

	/**
	 *This function sets the id
	 *@memberof BaseCompositeComp#
	 *@access public
	 *@param {String} strID ID to be assigned.
	 *@returns None
	 *
	 */
	BaseCompositeComp.prototype.setName = function(strID) {
		this.strName = strID;
	};

	/**
	 *This function sets the id
	 *@memberof BaseCompositeComp#
	 *@access public
	 *@param {String} strID ID to be assigned.
	 *@returns None
	 *
	 */
	BaseCompositeComp.prototype.setID = function(strID) {
		this.strCompId = strID;
	};
	/**
	 *This function returns the id
	 *@memberof BaseCompositeComp#
	 *@access public
	 *@param None
	 *@returns {String} assigned ID
	 */
	BaseCompositeComp.prototype.getID = function() {
		return this.strCompId;
	};
	/**
	 * This function sets the state
	 * @memberof BaseCompositeComp#
	 * @access public
	 * @param {Object} objState sets the state to be assigned
	 * @returns None
	 */
	BaseCompositeComp.prototype.setState = function(objState) {
	};

	/**
	 * Method setStageScaleValue value will be called by the activity controller to set the current
	 * stage scale value.
	 * @memberof BaseCompositeComp#
	 * @access public
	 * @param {Number} value current stage scale value.
	 * @return None
	 */
	BaseCompositeComp.prototype.setStageScaleValue = function(value) {
		this.nStageScale = value;
	};

	/**
	 * Return the current stage scale value.
	 * @memberof BaseCompositeComp#
	 * @access public
	 * @param none
	 * @return {Number} nStageScale Stage Scaled value.
	 */
	BaseCompositeComp.prototype.getStageScaleValue = function() {
		return this.nStageScale;
	};

	/**
	 * Triggers the custom event
	 * @memberof BaseCompositeComp#
	 * @access public
	 * @param {Object} strEvent contains the refernece of event
	 * @param {Object} context contains the context from where event will be dispatched
	 * @param {Object} data contains to be sent along with the event
	 * @return None
	 */
	BaseCompositeComp.prototype.customEventDispatcher = function(strEvent, context, data) {
		var objEvent = {};
		objEvent.data = context;
		objEvent.customData = data;
		objEvent.target = context;
		objEvent.type = strEvent;
		context.trigger(strEvent, objEvent);
	};

	BaseCompositeComp.prototype.show = function() {
		this.$el.show();
	};

	BaseCompositeComp.prototype.hide = function() {
		this.$el.hide();
	};

	BaseCompositeComp.prototype.compClick = function() {
		this.customEventDispatcher("compClick", this);
	};

	BaseCompositeComp.prototype.compRollover = function() {
		this.customEventDispatcher("compRollover", this);
	};

	BaseCompositeComp.prototype.compRollout = function() {
		this.customEventDispatcher("compRollout", this);
	};

	BaseCompositeComp.prototype.setStyle = function(objStyle) {
		if (objStyle !== undefined) {
			$($(this.$el).children()[0]).css(objStyle);
		}
	};

	BaseCompositeComp.prototype.selectComponent = function() {
		var objClassRef = this;
		this.parentDiv = this.$el;
		this.parentDiv.on("click", objClassRef, objClassRef.onCompClickInEditMode);
	};

	BaseCompositeComp.prototype.onCompClickInEditMode = function(objEvent) {
		var objClassRef = objEvent.data;
		objEvent.stopPropagation();
		objClassRef.customEventDispatcher(objClassRef.eventConst.SELECTOR_CLICK_EVENT, objClassRef, objClassRef.getID());
	};

	/**
	 *Invoked when ready to use.
	 */
	BaseCompositeComp.prototype.onUpdateComplete = function() {
	};

	/**
	 * This function destroys the BaseCompositeComp
	 * @memberof BaseCompositeComp#
	 * @access public
	 * @param {Boolean} bChildDestroyed flag to check if childs are destroyed.
	 * @returns {Boolean} true or false
	 */
	BaseCompositeComp.prototype.destroy = function(bChildDestroyed) {
		if (bChildDestroyed !== true) {
			throw new Error("Destroy must be implemented in child class.");
		}
		if (this.parentDiv) {
			this.parentDiv.off("click");
		}
		this.isDestroyCalled = true;
		return this.isDestroyCalled;
	};

	return BaseCompositeComp;
});
