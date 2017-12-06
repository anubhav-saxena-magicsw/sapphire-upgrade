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

define(['player/base/base-layout-comp'],

/**
 * This is a Container component which can be used to create such container in which other components can be added/removed
 *
 *@class ContainerComp
 *@augments marionette
 *@example
 *
 * TO BE ADDED
 */

function(BaseLayoutComp) {
	"use strict";

	var ContainerComp = BaseLayoutComp.extend({
		displayObject : true,
		ALL_CHILDREND_ADDED_IN_DOM : "allChildAddedInDom",
		PRE_SCREEN_INIT_EVENT : "screenPreInitEvent",
		childComponent : {},
		initialize : function() {
			this.childComponent = {};
		}
	});

	ContainerComp.prototype.ContainerCompSuper = BaseLayoutComp;

	/**
	 * This function is responsible for adding childs into dom
	 * @memberOf ContainerComp#
	 * @param {Array} arrChilds Array of childs to be added
	 */
	ContainerComp.prototype.addChild = function(arrChilds) {
		this.addChildComponent(arrChilds);
	};

	ContainerComp.prototype.addChildComponent = function(arrChilds) {
		var index, that = this;
		// check if data received is array...
		// validate if it is a valid children and add it.
		if (arrChilds.hasOwnProperty('index')) {
			index = arrChilds.index;
		}
		if (arrChilds.hasOwnProperty('parent') && arrChilds.hasOwnProperty('component')) {
			that.doAddChild(arrChilds.component, arrChilds.parent, index);
		} else {//TODO:
			that.doAddChild(arrChilds, this.$el);
		}
	};

	/**
	 *
	 * @memberOf ContainerComp#
	 */
	ContainerComp.prototype.removeChild = function(strCompId) {
		var that = this, objChild;
		// validate single child and remove it
		if (strCompId.hasOwnProperty('parent') && strCompId.hasOwnProperty('component')) {
			objChild = that.doRemoveChild(strCompId.component, strCompId.parent);
		} else {
			$(this.childComponent[strCompId].el).remove();
			objChild = this.childComponent[strCompId];
			delete this.childComponent[strCompId];
		}
		return objChild;
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
		if (objChild && objParent) {
			if (index && index > 0) {
				console.log('has index');
			} else {
				// just append to the last
				if (!( objParent instanceof jQuery)) {
					objParent = $(objParent,  this.$el);
				}

				objParent.append(objChild.el);
				objChild.render();

				if (objChild.onShow !== undefined) {
					objChild.onShow();
				}
				if (objChild.attach) {
					objChild.attach();
				}

			}
		} else if (objChild) {
			this.$el.append(objChild.el);
			objChild.render();
			this.childComponent[objChild.getID()] = objChild;

			if (objChild.onShow !== undefined) {
				objChild.onShow();
			}

		} else {
			throw new Error("Either child or parent is missing!");
		}

	};

	ContainerComp.prototype.doRemoveChild = function(objChild, objParent) {
		if (objChild && objParent) {
			if (!( objParent instanceof jQuery)) {
				objParent = $(objParent);
			}
			$(objChild.el).remove();
		}

		return objChild;
	};

	ContainerComp.prototype.screenInitalizationStart = function() {
		this.customEventDispatcher(this.PRE_SCREEN_INIT_EVENT, this, {});
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
		return this.ContainerCompSuper.prototype.destroy.call(this, bChildDestroyed);
	};

	return ContainerComp;
});
