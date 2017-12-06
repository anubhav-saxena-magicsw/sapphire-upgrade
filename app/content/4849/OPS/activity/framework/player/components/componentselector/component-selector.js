/*jslint nomen: true*/
/*globals Backbone,$,_, jQuery, console*/

/**
 * component
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2014 Magic Software Private Limited.
 * @copyright (c) 2014 Magic Software
 */

define(['marionette', 'player/base/base-display-comp', 'player/events/eventsconst'], function(marionette, BaseDisplayComp, EventConst) {
	'use strict';
	var scope,
	    str,
	    ctrlDown;
	var ComponentSelector = BaseDisplayComp.extend({
		template : _.template(''),
		selectedStyle : 'currentSelected',
		childElement : undefined,
		bSelected : false,
		bSetFocus : undefined,
		str : null,
		ctrlDown : false,
		keyBackspace : 8,
		ctrlKey : 17,
		keyMoveUp : 38,
		keyMoveDown : 40,
		keyDelete : 46,
		keyC : 67,
		keyV : 86,
		keyX : 88,
		initialize : function() {
			scope = this;
		},

		onRender : function() {
		},

		/**
		 * This function is responsible for binding the events
		 * @param none.
		 * @returns none.
		 */
		onShow : function() {
		}
	});
	/**
	 * This function returns the component selector
	 * @memberof ComponentSelector#
	 * @param none.
	 * @returns {object}.
	 */
	ComponentSelector.prototype.getComponent = function() {
		return this.childElement;
	};

	/**
	 * Store the child element reference.
	 * @param {Object} objChild
	 * @return {none}
	 */
	ComponentSelector.prototype.setChildElement = function(objChild) {
		var w,
		    h;
		this.childElement = objChild;
		if (objChild.componentType !== "screen") {
			this.makeDraggable(objChild.$el);
			this.addKeyboardClick(objChild);
		}
		if (objChild.componentType === "screen") {
			this.makeDraggable(objChild.$el);
			this.addOnScreen(objChild);
		}
	};

	/**
	 * This method is attached with the to the Component for enabling
	 * keyboard Access like Tab key, Delete Key.
	 * @param {Object} objChild
	 * @return none
	 * @memberof ComponentSelector#
	 * @access private
	 */

	ComponentSelector.prototype.addOnScreen = function(objChild) {
		var self = this;
		objChild.$el.on('keydown', function(e) {
			if (e.keyCode == self.ctrlKey)
					this.ctrlDown = true;
			}).keyup(function(e) {
				if (e.keyCode == self.ctrlKey)
					this.ctrlDown = false;
			});
			objChild.$el.on('keyup', function(e) {
				if (this.ctrlDown && e.which === self.keyV) {
					scope.str = "LAYOUT_ELEMENT_PASTE";
					scope.callCutCopyPaste(objChild, scope.str, e);
				}
			});
	};

	ComponentSelector.prototype.addKeyboardClick = function(objChild) {
		var self = this;
		objChild.$el.on('keyup', function(e) {
			if ((e.which === self.keyDelete) || (e.which === self.keyBackspace && device.windows() === false)) {
				objChild.$el.off('keyup');
				scope.str = "DELETE_COMPOPNENT";
				scope.callCutCopyPaste(objChild, scope.str);
				e.stopPropagation();
			}
		});
		objChild.$el.on('keydown', function(e) {
				if (e.keyCode == self.ctrlKey)
					self.ctrlDown = true;
			}).keyup(function(e) {
				if (e.keyCode == self.ctrlKey)
					self.ctrlDown = false;
			});
			objChild.$el.on('keyup', function(e) {
				if (self.ctrlDown && e.which == self.keyC) {
					scope.str = "LAYOUT_ELEMENT_COPY";
					console.log("copy");
					scope.callCutCopyPaste(objChild, scope.str);
					e.stopPropagation();
				} else if (self.ctrlDown && e.which == self.keyV ) {
					scope.str = "LAYOUT_ELEMENT_PASTE";
					console.log("paste");
					scope.callCutCopyPaste(objChild, scope.str);
					e.stopPropagation();
				} else if (self.ctrlDown && e.which === self.keyX) {
					scope.str = "LAYOUT_ELEMENT_CUT";
					console.log("xx");
					scope.callCutCopyPaste(objChild, scope.str);
					e.stopPropagation();
				} else if (self.ctrlDown && e.which === self.keyMoveUp) {
					e.preventDefault();
					scope.str = "LAYOUT_MOVE_UP";
					console.log("up");
					scope.callCutCopyPaste(objChild, scope.str);
					e.stopPropagation();
				} else if (self.ctrlDown && e.which === self.keyMoveDown) {
					e.preventDefault();
					scope.str = "LAYOUT_MOVE_DOWN";
					console.log("down");
					scope.callCutCopyPaste(objChild, scope.str);
					e.stopPropagation();
				}
			});
	};

	ComponentSelector.prototype.callCutCopyPaste = function(objChild, strValue) {
		var objDataToSend = {},
		    objTask = scope.prepareData();
		objTask.data.task = strValue;
		objTask.compId = objChild.getID();
		objDataToSend.task = strValue;
		objTask.regionToUpdate = "mActivity";
		objDataToSend.compData = objTask;
		scope.customEventDispatcher(EventConst.COMPONENT_DATA_PROPERTY_UPDATED, objChild, objDataToSend);

	};
	/**
	 * This method is responsible to return and set the selection state of
	 * its child component.
	 * this method alsoresponsible to select the component if  true value delivered as parameter.
	 * @param {Boolean}
	 * @return {Boolean} true/false
	 * @access private
	 * @memberof ComponentSelector#
	 */
	ComponentSelector.prototype.isSelected = function(bSelect) {
		var b;
		if (bSelect !== undefined) {
			if (bSelect === true) {
				if (this.bSelected === false && bSelect === true) {
					if (this.getComponent().setFocus !== false) {
						this.$el.parent('div').focus();
					}
					this.getComponent().setFocus = undefined;
				}
				this.$el.addClass("selectorActive");
			} else {
				this.$el.removeClass('selectorActive');
				this.childElement.customEventDispatcher(this.EventConst.COMPONENT_DESELECTED, this.childElement, this.childElement.getID());
			}
			this.bSelected = bSelect;
			return this.bSelected;
		} else {
			return this.bSelected;
		}
	};

	ComponentSelector.prototype.select = function(bSetFocus) {
		this.getComponent().setFocus = bSetFocus;
		this.getComponent().onCompClickInEditMode({
			data : this.getComponent()
		});
	};

	/**
	 *Adding drag feature to the selector component to allow user
	 * to set the component position by drag and drop.
	 * @param {Object} objTarget jquery object of component parent div
	 * @return {none}
	 */
	ComponentSelector.prototype.makeDraggable = function(objTarget) {
		var objClassref = this,
		    objPosition = {},
		    objDataToSend = {};
		objTarget.draggable({
			containment : 'parnet',
			handle : objClassref.$el,

			stop : function(objEvent, ui) {
				objDataToSend.event = objEvent;
				objDataToSend.ui = ui;
				objDataToSend.type = "stop";
				objClassref.handleChangesFromSelector(objDataToSend);
			},

			drag : function(objEvent, ui) {
				objDataToSend.event = objEvent;
				objDataToSend.ui = ui;
				objDataToSend.type = "drag";
				objClassref.handleChangesFromSelector(objDataToSend);
			}
		});
	};

	/**
	 * This method execute when user drag the selector component and
	 * dispatch the'COMPONENT_DATA_PROPERTY_UPDATED' event to
	 * notify.
	 * @param {Object} objData
	 * @return {none}
	 */
	ComponentSelector.prototype.handleChangesFromSelector = function(objData) {
		var objDataToSend = {},
		    objTask = this.prepareData();
		objTask.data.task = "UPDATE_CSS_left";
		objTask.compId = this.childElement.getID();
		objTask.data.updatedValue = objData.ui.position.left + "px";
		objTask.data.selectorText = this.childElement.objData.styleClass;
		objDataToSend.task = EventConst.COMPONENT_DATA_PROPERTY_UPDATED;
		objTask.regionToUpdate = "mActivity";
		objDataToSend.compData = objTask;
		this.customEventDispatcher(EventConst.COMPONENT_DATA_PROPERTY_UPDATED, this.childElement, objDataToSend);

		objTask.data.task = "UPDATE_CSS_top";
		objTask.compId = this.childElement.getID();
		objTask.data.updatedValue = objData.ui.position.top + "px";
		objTask.data.selectorText = this.childElement.objData.styleClass;
		objDataToSend.task = EventConst.COMPONENT_DATA_PROPERTY_UPDATED;
		objTask.regionToUpdate = "mActivity";
		objDataToSend.compData = objTask;
		this.customEventDispatcher(EventConst.COMPONENT_DATA_PROPERTY_UPDATED, this.childElement, objDataToSend);

		this.childElement.$el.attr("style", "");
		this.select(true);
	};

	ComponentSelector.prototype.prepareData = function() {
		var objData = {};
		objData.compId = this.childElement.getID();
		objData.data = {};
		return objData;
	};

	ComponentSelector.prototype.SelectorSuper = BaseDisplayComp;

	/**
	 * Destroys ComponentSelector instance.
	 * @memberof ComponentSelector#
	 * @param none.
	 * @returns none.
	 *
	 */
	ComponentSelector.prototype.destroy = function() {
		this.childElement.$el.off('keyup');
		this.childElement.$el.off('keydown');
		return this.SelectorSuper.prototype.destroy.call(this, true);
	};

	return ComponentSelector;
});
