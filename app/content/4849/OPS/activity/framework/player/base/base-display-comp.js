/*jslint nomen: true*/
/*globals Backbone,$,_, jQuery, console*/

/**
 * ContainerComp
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2014 Magic Software Private Limited.
 * @copyright (c) 2014 Magic Software
 */

define(['player/base/base-layout-comp', 'player/events/eventsconst'],

/**
 * This is a Container component which can be used to create such container in which other components can be added/removed
 *
 *@class ContainerComp
 *@augments marionette
 *@example
 *
 * TO BE ADDED
 */

function(BaseLayoutComp, EvtConst) {
	"use strict";

	var ContainerComp = BaseLayoutComp.extend({
		ALL_CHILDREND_ADDED_IN_DOM : "allChildAddedInDom",
		displayObject : true,
		EventConst : EvtConst,
		
		initialize : function() {
			this.componentType = "ContainerComp";
		}
	});

	ContainerComp.prototype.__super__ = BaseLayoutComp;

	/**
	 * This function is responsible for adding childs into dom
	 * @memberOf ContainerComp#
	 * @param {Array} arrChilds Array of childs to be added
	 */
	ContainerComp.prototype.addChild = function(arrChilds) {
		var index, that = this;

		// check if data received is array...
		if ($.isArray(arrChilds) && arrChilds.length > 0) {

			// traverse all the items inside array and add it as per the specified parent selector

			_.each(arrChilds, function(objChild) {
				if (objChild.hasOwnProperty('index')) {
					index = objChild.index;
				}
				if (objChild.hasOwnProperty('parent') && objChild.hasOwnProperty('component')) {
					that.doAddChild(objChild.component, objChild.parent, index);
				}
			});
		} else {
			// validate if it is a valid children and add it.
			if (arrChilds.hasOwnProperty('index')) {
				index = arrChilds.index;
			}
			if (arrChilds.hasOwnProperty('parent') && arrChilds.hasOwnProperty('component')) {
				that.doAddChild(arrChilds.component, arrChilds.parent, index);
			} else {//TODO:
				that.doAddChild(arrChilds, this.$el);
			}
		}
	};

	/**
	 *
	 * @memberOf ContainerComp#
	 */
	ContainerComp.prototype.removeChild = function(arrChilds) {
		var that = this;
		if ($.isArray(arrChilds)) {
			//console.log("will be removed later.");
			// remove childs given in array
			_.each(arrChilds, function(objChild) {
				if (objChild.hasOwnProperty('parent') && objChild.hasOwnProperty('component')) {
					that.doRemoveChild(objChild.component, objChild.parent);
				}
			});
		} else {
			//console.log("will be removed later. object");
			// validate single child and remove it
			if (arrChilds.hasOwnProperty('parent') && arrChilds.hasOwnProperty('component')) {
				that.doRemoveChild(arrChilds.component, arrChilds.parent);
			}
		}
	};
	/*
	 * @memberOf ContainerComp#
	 */
	ContainerComp.prototype.addChildAt = function(objChild, index) {
		// validate the object and index...add it to the container
	};

	/*
	 * @memberOf ContainerComp#
	 */
	ContainerComp.prototype.removeChildAt = function(objChild, index) {
		// validate the object and index...remove from the container
	};

	/**
	 * This function is responsible to add the child into the specified parent object.
	 * If index is available, the child should be added by index
	 * @access private
	 * @param {Object} objChild Child object reference
	 * @param {Object} objParent parent object reference
	 * @param {Number} index index for child where it needs to be added
	 */
	ContainerComp.prototype.doAddChild = function(objChild, objParent, index) {
		//	console.log("adding adding adding...");
		this.$el.append(objChild.el);
		//objParent.append(objChild.el);
		objChild.render();

		if (objChild.onShow !== undefined) {
			objChild.onShow();
		}
	};

	ContainerComp.prototype.doRemoveChild = function(objChild, objParent) {
		if (objChild && objParent) {
			if (!( objParent instanceof jQuery)) {
				objParent = $(objParent);
			}
			$(objChild.el).remove();
		}
	};

	ContainerComp.prototype.childCreationComplete = function() {
		this.customEventDispatcher(this.ALL_CHILDREND_ADDED_IN_DOM, this, {});
	};

	ContainerComp.prototype.dispatchScreenEvent = function(strEvent, objData) {
		this.customEventDispatcher(strEvent, this, objData);
	};
	
	/**
	 * This function destroys the ContainerComp
	 * @memberof ContainerComp#
	 * @access public
	 * @param {Boolean} bChildDestroyed flag to check if childs are destroyed.
	 * @returns {Boolean} true or false
	 */
	ContainerComp.prototype.destroy = function(bChildDestroyed) {
		return this.__super__.prototype.destroy(bChildDestroyed);
	};

	return ContainerComp;
});
