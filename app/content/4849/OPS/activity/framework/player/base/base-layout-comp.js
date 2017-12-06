/*jslint nomen: true*/
/*globals Backbone,_,$,console*/
/**
 * BaseLayoutComp
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(['marionette', 'player/events/eventsconst'], function(Marionette, evtConst) {
	'use strict';
	var BaseLayoutComp;

	/**
	 *This class is a view that renders a layout and creates region managers to manage areas within it
	 *@class BaseLayoutComp
	 *@access private
	 *@extends Backbone.Marionette.Layout
	 *@example
	 * var baseLayoutComp = new BaseLayoutComp();
	 */

	BaseLayoutComp = Backbone.Marionette.Layout.extend({/** @lends BaseLayoutComp.prototype */
		eventConst : evtConst,
		isBaseLayoutComp : true,
		isDestroyCalled : false,
		nStageScale : 1,
		strCompId : undefined,
		bEditor : false,
		parentDiv : null,
		componentType : undefined
	});

	/**
	 *This function initializes the BaseLayoutComp
	 *@memberof BaseLayoutComp#
	 *@access public
	 *@param None
	 *@returns None
	 */
	BaseLayoutComp.prototype.initBaseLayoutComp = function() {
	};

	/**
	 * This function returns the id
	 * @memberof BaseLayoutComp#
	 * @access public
	 * @param None
	 * @returns {String} assigned ID
	 */
	BaseLayoutComp.prototype.getName = function() {
		return this.strName;
	};

	/**
	 *This function sets the id
	 *@memberof BaseLayoutComp#
	 *@access public
	 *@param {String} strID ID to be assigned.
	 *@returns None
	 *
	 */
	BaseLayoutComp.prototype.setName = function(strID) {
		this.strName = strID;
	};

	/**
	 *This function sets the Id
	 *@memberof BaseLayoutComp#
	 *@access public
	 *@param {String} strID ID to be assigned.
	 *@returns None
	 *
	 */
	BaseLayoutComp.prototype.setID = function(strID) {
		this.strCompId = strID;
	};
	/**
	 * This function returns th Id
	 *@memberof BaseLayoutComp#
	 * @access public
	 * @param None
	 * @returns {String} assigned ID
	 */
	BaseLayoutComp.prototype.getID = function() {
		return this.strCompId;
	};
	/**
	 * This function sets the state
	 * @memberof BaseLayoutComp#
	 * @access public
	 * @param {Object} objState sets the state to be assigned
	 * @returns None
	 */
	BaseLayoutComp.prototype.setState = function(objState) {
	};

	/**
	 * Method setStageScaleValue value will be called by the activity controller to set the current
	 * stage scale value.
	 *@memberof BaseLayoutComp#
	 * @access public
	 * @param {Number} value current stage scale value.
	 * @return none
	 */
	BaseLayoutComp.prototype.setStageScaleValue = function(value) {
		this.nStageScale = value;
	};

	/**
	 * Return the current stage scale value.
	 *@memberof BaseLayoutComp#
	 * @access public
	 * @param none
	 * @return {Number} nStageScale Stage Scaled value.
	 */
	BaseLayoutComp.prototype.getStageScaleValue = function() {
		return this.nStageScale;
	};

	/**
	 * This function destroys BaseLayoutComp
	 * @memberof BaseLayoutComp#
	 * @access public
	 * @param {Boolean} bChildDestroyed flag to check if childs are destroyed.
	 * @returns None
	 */
	BaseLayoutComp.prototype.destroy = function(bChildDestroyed) {
		if (bChildDestroyed !== true) {
			throw new Error("Destroy must be implemented in child class.");
		}
		this.isDestroyCalled = true;
		return this.isDestroyCalled;
	};

	/**
	 * This function sets the state
	 * @memberof BaseLayoutComp#
	 * @access public
	 * @param {Object} objState sets the state to be assigned
	 * @returns None
	 */
	BaseLayoutComp.prototype.setState = function(objState) {
	};

	/**
	 * This function resets the activity
	 * @memberof BaseLayoutComp#
	 * @access public
	 * @param None
	 * @returns None
	 */
	BaseLayoutComp.prototype.resetActivity = function() {
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
	BaseLayoutComp.prototype.customEventDispatcher = function(strEvent, context, data) {
		//	console.log("customEventDispatcher!!!!!!!!!!!!!!!", strEvent);
		var objEvent = {};
		objEvent.data = context;
		objEvent.customData = data;
		objEvent.target = context;
		objEvent.type = strEvent;
		context.trigger(strEvent, objEvent);

	};

	BaseLayoutComp.prototype.onPlayerResizeEvent = function(objEvent) {
		//console.log("onPlayerResizeEvent........");
	};

	BaseLayoutComp.prototype.show = function() {
		this.$el.show();
	};

	BaseLayoutComp.prototype.hide = function() {
		this.$el.hide();
	};

	BaseLayoutComp.prototype.compClick = function() {
		this.customEventDispatcher("compClick", this);
	};

	BaseLayoutComp.prototype.compRollover = function() {
		this.customEventDispatcher("compRollover", this);
	};

	BaseLayoutComp.prototype.compRollout = function() {
		this.customEventDispatcher("compRollout", this);
	};

	BaseLayoutComp.prototype.setStyle = function(objStyle) {
		if (objStyle !== undefined) {
			$($(this.$el).children()[0]).css(objStyle);
		}
	};

	BaseLayoutComp.prototype.selectComponent = function() {
		var objClassRef = this;
		this.parentDiv = this.$el;
		this.parentDiv.on("click", objClassRef, objClassRef.onCompClickInEditMode);
	};

	BaseLayoutComp.prototype.onCompClickInEditMode = function(objEvent) {
		var objClassRef = objEvent.data;
		if (objEvent.stopPropagation) {
			objEvent.stopPropagation();
		}
		objClassRef.customEventDispatcher(objClassRef.eventConst.SELECTOR_CLICK_EVENT, objClassRef, objClassRef.getID());
	};

	/**
	 *This method set the html attribute in run time
	 * if attribute exist then update otherwise create and update.
	 * @param {Object}
	 * @return none
	 * @memberof BaseLayoutComp#
	 * @access private
	 */
	BaseLayoutComp.prototype.setHtmlAttr = function(htmlAttr) {
		var objClassRef = this;
		_.filter(htmlAttr, function(item, key) {
			objClassRef.$el.attr(key, item);
		});
	};

	/**
	 *Invoked when ready to use.
	 */
	BaseLayoutComp.prototype.onUpdateComplete = function() {
	};

	/**
	 * This function destroys BaseLayoutComp
	 * @memberof BaseLayoutComp#
	 * @access public
	 * @param {Boolean} bChildDestroyed flag to check if childs are destroyed.
	 * @returns {Boolean} true or false
	 */
	BaseLayoutComp.prototype.destroy = function(bChildDestroyed) {
		if (bChildDestroyed !== true) {
			throw new Error("Destroy must be implemented in child class.");
		}

		if (this.parentDiv) {
			this.parentDiv.off("click");
		}
		this.isDestroyCalled = true;

		return this.isDestroyCalled;
	};

	return BaseLayoutComp;
});
