/*globals Backbone*/
/*jslint nomen: true*/

/**
 * BaseItemComp
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
	var BaseItemComp;

	/**
	 *This class is a view that renders a single item
	 *@class BaseItemComp
	 *@access private
	 *@extends Backbone.Marionette.ItemView
	 *@example
	 * var baseItemComp = new BaseItemComp();
	 */
	BaseItemComp = /** @lends BaseItemComp.prototype */
	Backbone.Marionette.ItemView.extend({
		eventConst : evtConst,
		isBaseItemComp : true,
		isDestroyCalled : false,
		strName : undefined,
		nStageScale : 1,
		strCompId : undefined,
		isEnabled : true,
		bEditor : false,
		parentDiv : null,
		componentType : undefined
	});

	/**
	 *This function initializes the BaseItemComp
	 *@memberof BaseItemComp#
	 *@access public
	 *@param None
	 *@returns None
	 */
	BaseItemComp.prototype.initBaseItemComp = function() {

	};

	BaseItemComp.prototype.onShow = function() {
	};

	/**
	 *This function sets the id
	 *@memberof BaseItemComp#
	 *@access public
	 *@param {String} strID ID to be assigned.
	 *@returns None
	 *
	 */
	BaseItemComp.prototype.show = function() {
		this.$el.show();
	};

	BaseItemComp.prototype.hide = function() {
		this.$el.hide();
	};

	/**
	 *This function sets the id
	 *@memberof BaseItemComp#
	 *@access public
	 *@param {String} strID ID to be assigned.
	 *@returns None
	 *
	 */
	BaseItemComp.prototype.setID = function(strID) {
		this.strCompId = strID;
	};
	/**
	 * This function returns the id
	 * @memberof BaseItemComp#
	 * @access public
	 * @param None
	 * @returns {String} assigned ID
	 */
	BaseItemComp.prototype.getName = function() {
		return this.strName;
	};

	/**
	 * Method setStageScaleValue value will be called by the activity controller to set the current
	 * stage scale value.
	 * @memberof BaseItemComp#
	 * @access public
	 * @param {Number} value current stage scale value.
	 * @return none
	 */
	BaseItemComp.prototype.setStageScaleValue = function(value) {
		this.nStageScale = value;
	};

	/**
	 * Return the current stage scale value.
	 * @memberof BaseItemComp#
	 * @access public
	 * @param none
	 * @return {Number} nStageScale Stage Scaled value.
	 */
	BaseItemComp.prototype.getStageScaleValue = function() {
		return this.nStageScale;
	};

	/**
	 *This function sets the id
	 *@memberof BaseItemComp#
	 *@access public
	 *@param {String} strID ID to be assigned.
	 *@returns None
	 *
	 */
	BaseItemComp.prototype.setName = function(strID) {
		this.strName = strID;
	};
	/**
	 * This function returns the id
	 * @memberof BaseItemComp#
	 * @access public
	 * @param None
	 * @returns {String} assigned ID
	 */
	BaseItemComp.prototype.getID = function() {
		return this.strCompId;
	};

	/**
	 * This function sets the state
	 * @memberof BaseItemComp#
	 * @access public
	 * @param {Object} objState sets the state to be assigned
	 * @returns None
	 */
	BaseItemComp.prototype.setState = function(objState) {
	};

	/**
	 * This function resets the activity
	 * @memberof BaseItemComp#
	 * @access public
	 * @param None
	 * @returns None
	 */
	BaseItemComp.prototype.resetActivity = function() {
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
	BaseItemComp.prototype.customEventDispatcher = function(strEvent, context, data) {
		var objEvent = {};
		objEvent.data = context;
		objEvent.customData = data;
		objEvent.target = context;
		objEvent.type = strEvent;
		context.trigger(strEvent, objEvent);
	};

	/**
	 *Invoked everytime when player dispatch window resize event
	 * @param none
	 * @return none
	 * @access public
	 * @memberof BaseItemComp#
	 */
	BaseItemComp.prototype.onPlayerResizeEvent = function() {

	};

	/**
	 * This function makes the template visible
	 * @param none
	 * @return none
	 * @access public
	 * @memberof BaseItemComp#
	 */
	BaseItemComp.prototype.toggleMe = function() {
		$(this.el).toggle();
	};

	/**
	 * This function makes the template invisible
	 * @param none
	 * @return none
	 * @access public
	 * @memberof BaseItemComp#
	 */
	BaseItemComp.prototype.hide = function() {
		$(this.el).hide();
	};

	BaseItemComp.prototype.showElement = function() {
		$(this.el).show();
	};

	BaseItemComp.prototype.compClick = function() {
		this.customEventDispatcher("compClick", this);
	};

	BaseItemComp.prototype.compRollover = function() {
		this.customEventDispatcher("compRollover", this);
	};

	BaseItemComp.prototype.compRollout = function() {
		this.customEventDispatcher("compRollout", this);
	};
	BaseItemComp.prototype.compOnchange = function() {
		this.customEventDispatcher("compOnchange", this);
	};

	BaseItemComp.prototype.enable = function(bEnable) {
		if (bEnable === true || bEnable === "true") {
			this.isEnabled = true;
			this.$el.removeAttr('disabled');
			$(this.$el).children().removeAttr('disabled');
			this.$el.css('cursor', 'pointer');
		} else {
			this.isEnabled = false;
			this.$el.attr('disabled', 'disabled');
			$(this.$el).children().attr('disabled', 'disabled');
			this.$el.css('cursor', 'auto');
		}
	};

	BaseItemComp.prototype.setStyle = function(objStyle) {
		if (objStyle !== undefined) {
			$($(this.$el).children()[0]).css(objStyle);
		}
	};

	BaseItemComp.prototype.selectComponent = function() {
		var objClassRef = this;
		this.parentDiv = this.$el;
		this.parentDiv.on("click", objClassRef, objClassRef.onCompClickInEditMode);
	};

	BaseItemComp.prototype.onCompClickInEditMode = function(objEvent) {
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
	BaseItemComp.prototype.setHtmlAttr = function(htmlAttr) {
		var objClassRef = this;
		_.filter(htmlAttr, function(item, key) {
			if (objClassRef.componentType === "inputtext") {
				objClassRef.$el.find('input').attr(key, item)
			} else {
				objClassRef.$el.attr(key, item);
			}
		});
	};

	/**
	 *Invoked when ready to use.
	 */
	BaseItemComp.prototype.onUpdateComplete = function() {
	};

	/**
	 * This function destroys the BaseItemComp
	 * @memberof BaseCompositeComp#
	 * @access public
	 * @param {Boolean} bChildDestroyed flag to check if childs are destroyed.
	 * @returns {Boolean} true or false
	 */
	BaseItemComp.prototype.destroy = function(bChildDestroyed) {
		if (bChildDestroyed !== true) {
			throw new Error("Destroy must be implemented in child class.");
		}
		if (this.parentDiv) {
			this.parentDiv.off("click");
		}
		this.isDestroyCalled = true;
		return this.isDestroyCalled;
	};

	return BaseItemComp;
});
