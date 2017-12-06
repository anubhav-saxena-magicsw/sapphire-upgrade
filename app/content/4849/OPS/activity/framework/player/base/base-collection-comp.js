/*
globals Backbone $*/
/**
 * BaseCollectionComp
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(['marionette', "player/constants/errorconst"], function(Marionette, errorConst) {
	'use strict';
	var BaseCollectionComp;

	/**
	 *This class will loop through all of the models in the specified collection, render each of them using a specified itemView.
	 *@class BaseCollectionComp
	 *@access private
	 *@param Marionette An instance of marionette
	 *@extends Backbone.Marionette.CollectionView
	 *@example
	 * var baseCollectionComp = new BaseCollectionComp();
	 */

	BaseCollectionComp = /** @lends BaseCollectionComp.prototype */
	Backbone.Marionette.CollectionView.extend({
		isBaseCollectionComp : true,
		isDestroyCalled : false,
		strName : undefined,
		nStageScale : 1,
		strCompId : undefined
	});

	/**
	 *This function initializes the BaseCollectionComp
	 *@memberof BaseCollectionComp#
	 *@access public
	 *@param None
	 *@returns None
	 */
	BaseCollectionComp.prototype.initBaseCollectionComp = function() {

	};

	/**
	 *This function sets the id
	 *@memberof BaseCollectionComp#
	 *@access public
	 *@param {String} strID ID to be assigned.
	 *@returns None
	 */
	BaseCollectionComp.prototype.setID = function(strID) {
		this.strCompId = strID;
	};
	/**
	 * This function returns the id
	 * @memberof BaseCollectionComp#
	 * @access public
	 * @param None
	 * @returns {String} assigned ID
	 */
	BaseCollectionComp.prototype.getID = function() {
		return this.strCompId;
	};

	/**
	 * This function returns the id
	 * @memberof BaseCollectionComp#
	 * @access public
	 * @param None
	 * @returns {String} assigned ID
	 */
	BaseCollectionComp.prototype.getName = function() {
		return this.strName;
	};

	/**
	 * This function sets the id
	 * @memberof BaseCollectionComp#
	 * @access public
	 * @param {String} strID ID to be assigned.
	 * @returns None
	 *
	 */
	BaseCollectionComp.prototype.setName = function(strID) {
		this.strName = strID;
	};

	/**
	 * This function sets the state
	 * @memberof BaseCollectionComp#
	 * @access public
	 * @param {Object} objState sets the state to be assigned
	 * @returns None
	 */
	BaseCollectionComp.prototype.setState = function(objState) {
	};

	/**
	 * Method setStageScaleValue value will be called by the activity controller to set the current
	 * stage scale value.
	 * @memberof BaseCollectionComp#
	 * @access public
	 * @param {Number} value current stage scale value.
	 * @return None
	 */
	BaseCollectionComp.prototype.setStageScaleValue = function(value) {
		this.nStageScale = value;
	};

	/**
	 * Return the current stage scale value.
	 * @memberof BaseCollectionComp#
	 * @access public
	 * @param None
	 * @return {Number} nStageScale Stage Scaled value.
	 */
	BaseCollectionComp.prototype.getStageScaleValue = function() {
		return this.nStageScale;
	};

	/**
	 * Triggers the custom event
	 * @memberof BaseCollectionComp#
	 * @access public
	 * @param {Object} strEvent contains the refernece of event
	 * @param {Object} context contains the context from where event will be dispatched
	 * @param {Object} data contains to be sent along with the event
	 * @return None
	 */
	BaseCollectionComp.prototype.customEventDispatcher = function(strEvent, context, data) {
		var objEvent = {};
		objEvent.data = context;
		objEvent.customData = data;
		objEvent.target = context;
		objEvent.type = strEvent;
		context.trigger(strEvent, objEvent);
	};

	BaseCollectionComp.prototype.show = function() {
		this.$el.show();
	};

	BaseCollectionComp.prototype.hide = function() {
		this.$el.hide();
	};

	BaseCollectionComp.prototype.onCompClick = function() {
		this.customEventDispatcher("onCompClick", this);
	};

	BaseCollectionComp.prototype.compRollover = function() {
		this.customEventDispatcher("compRollover", this);
	};

	BaseCollectionComp.prototype.compRollout = function() {
		this.customEventDispatcher("compRollout", this);
	};

	BaseCollectionComp.prototype.setStyle = function(objStyle) {
		if (objStyle !== undefined) {
			$($(this.$el).children()[0]).css(objStyle);
		}
	};

	BaseCollectionComp.prototype.selectComponent = function() {
		var objClassRef = this;
		this.parentDiv = this.$el;
		this.parentDiv.on("click", objClassRef, objClassRef.onCompClickInEditMode);
	};

	BaseCollectionComp.prototype.onCompClickInEditMode = function(objEvent) {
		var objClassRef = objEvent.data;
		objEvent.stopPropagation();
		objClassRef.customEventDispatcher(objClassRef.eventConst.SELECTOR_CLICK_EVENT, objClassRef, objClassRef.getID());

	};

	/**
	 *Invoked when ready to use.
	 */
	BaseCollectionComp.prototype.onUpdateComplete = function() {
	};

	/**
	 * This function destroys the BaseCollectionComp
	 * @memberof BaseCollectionComp#
	 * @access public
	 * @param {Boolean} bChildDestroyed flag to check if childs are destroyed.
	 * @returns {Boolean} true or false
	 */
	BaseCollectionComp.prototype.destroy = function(bChildDestroyed) {
		if (bChildDestroyed !== true) {
			throw new Error(errorConst.DESTROY_NOT_IMPLMENENTED_IN_CHILD_CLASS);
		}
		if (this.parentDiv) {
			this.parentDiv.off("click");
		}
		this.isDestroyCalled = true;
		return this.isDestroyCalled;
	};

	return BaseCollectionComp;
});
