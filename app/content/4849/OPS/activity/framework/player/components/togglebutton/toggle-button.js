/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console*/

/**
 * ToggleButton
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/base/base-item-comp', 'text!components/togglebutton/template/toggle-button.html', 'css!components/togglebutton/template/css/toggle-button.css', 'components/togglebutton/model/toggle-button-model'],
/**
 *A class representing ToggleButton.
 *ToggleButton is a component which provides an div with capability of listening click and toggle its state.
 *There are methods provided to get and set current states.
 *
 *@class ToggleButton
 *@augments ToggleButton
 *@param {Object} obj An object with 'normalClass', 'label' and 'state' properties.
 *@example
 *
 * var toggleButtonComp, objConfig;
 * objConfig = {
 * normalClass : "className", // The class defined for off state.
 * label :	"I am toggle button" // The label for button.
 * state : 0	// Initial state. This could be 1 or 0.
 * };
 *
 * //Note: The on state for button div would be className.active . So in css you have to define active state as well.
 *
 * this.getComponent(this, "ToggleButton", "onComponentCreated", objConfig );
 *
 * function onComponentCreated(objComp){
 *  toggleButtonComp = objComp;
 * }
 * <br>Configurable properties of component:<br>
 * <table border="1" style="white-space:pre-wrap; color:"#000000";"><tr><th>Property</th><th>Type</th><th>Default Value</th><th>Description</th></tr><tr><td>normalClass</td><td>CSS Class</td><td>DefaultbtnNormal</a></td><td>Contains the css class name definig the off state for the button.</td></tr><tr><td>label</td><td>String</td><td>ToggleButton</td><td>This property defines the label text for the toggle button.</td></tr><tr><td>state</td><td>integer</td><td>0</td><td>This property defines the state of component. The other value it can take is 1(selected).</td></tr></table>
 */

function(Marionette, BaseItemComp, toggleButtonHtm, toggleButtoncss, ToggleButtonModel) {'use strict';

	var ToggleButton = BaseItemComp.extend({
		template : _.template(toggleButtonHtm),
		tagName : 'div',
		/**
		 * Intializes ToggelButton
		 * @memberof ToggelButton
		 * @access private
		 * @param {Object} obj conatins the data to configure the component
		 * returns None
		 */
		initialize : function(obj) {
			var objThis = this;
			this.objData = obj;//this property is being used in componentselector for editing.
			if (objThis.model === undefined) {
				objThis.setModel(obj);
			}
			if (objThis.model instanceof ToggleButtonModel) {
				objThis.model.on("change", function() {
					objThis.onMyModelChange();
				});
			}

			$(objThis.el).addClass(objThis.model.get('normalClass'));
			//$(objThis.el).on('click', this, this.onClick);
		},

		/**
		 * This function is called when component is shown in the DOM
		 * @access private
		 * @memberof ToggelButton
		 * @param None
		 * @returns None
		 */
		onRender : function() {
			var self = this;
			this.$el.off('click').on("click", $.proxy(self.compClick, self));
			this.$el.off('mouseover').on("mouseover", $.proxy(self.compRollover, self));
			this.$el.off('mouseout').on("mouseout", $.proxy(self.compRollout, self));
		},
		/**
		 * Handler function for model change.
		 * @memberof ToggelButton
		 * @access private
		 * @param None
		 * @returns None
		 */
		onMyModelChange : function() {

			var objThis = this;
			$(objThis.el).addClass(objThis.model.get('normalClass'));

			if (objThis.model.get('state') === 1) {
				$(objThis.el).addClass('active');
			} else if (objThis.model.get("state") === 0) {
				$(objThis.el).removeClass('active');
			}

			objThis.render();

		}
	});

	/**
	 * Sets model for Toggle Button instance.
	 * @memberof ToggleButton
	 * @param {Object} obj Object containing key value pairs for model.
	 * @access private
	 * @returns None
	 */
	ToggleButton.prototype.setModel = function(obj) {
		var objThis = this;

		objThis.model = new ToggleButtonModel();

		if (obj.normalClass !== undefined) {
			objThis.model.set("normalClass", obj.normalClass);
		}

		if (obj.label !== undefined) {
			objThis.model.set("label", obj.label);
		}
		if (obj.state !== undefined) {
			objThis.model.set("state", obj.state);
		} else {
			objThis.model.set("state", 0);
		}
	};
	/**
	 * Click event handler function for Toggle Button instance.
	 * @memberof ToggleButton
	 * @param {Event} e Object of click event.
	 * @access private
	 * @returns None
	 */
	ToggleButton.prototype.compClick = function() {
		if (this.model.get("shouldToggle")) {
			if (this.isSelected()) {
				this.setSelected(false);
			} else {
				this.setSelected(true);
			}

			//this.trigger(this.EVENTS.ON_CHANGE, this.model.get("state"));
			this.customEventDispatcher(this.EVENTS.ON_CHANGE, this, this.model.get("state"));
			//this.customEventDispatcher("compClick", this);
		}

	};

	/**
	 * Set the super to BaseItemComp
	 * @access private
	 * @memberof ToggleButton#
	 */
	ToggleButton.prototype.__super__ = BaseItemComp;

	/**
	 * An object containing string constants for the events names.
	 * @memberof ToggleButton#
	 * @access private
	 * @property {String} ON_CHANGE Fired when state changes.
	 */
	ToggleButton.prototype.EVENTS = {
		ON_CHANGE : "CHANGED"
	};

	/**
	 * To check if the button is in on state or not.
	 * @memberof ToggleButton#
	 * @access public
	 * @param None
	 * @returns {Boolean} true if btton is in on state, false otherwise.
	 */
	ToggleButton.prototype.isSelected = function() {
		if (this.model.get("state") === 0) {
			return false;
		}
		return true;
	};

	/**
	 * To set the button state mannually on.
	 * @memberof ToggleButton#
	 * @access public
	 * @param {Boolean} bVal true to select / false to deselect.
	 * @returns None
	 */
	ToggleButton.prototype.setSelected = function(bVal) {
		var nState = this.model.get("state");
		if (nState === 0 && bVal === true) {
			this.model.set("state", 1);
		} else if (nState === 1 && bVal === false) {
			this.model.set("state", 0);
		}

	};

	/**
	 * To set the button label.
	 * @memberof ToggleButton#
	 * @access public
	 * @param {String} strLabel String to be shown as label for button.
	 * @returns None
	 */
	ToggleButton.prototype.setLabel = function(strLabel) {
		this.model.set("label", strLabel);
	};

	/**
	 * To get the button label.
	 * @memberof ToggleButton#
	 * @access public
	 * @param None
	 * @returns {String} String representing label for button.
	 */
	ToggleButton.prototype.getLabel = function() {
		return this.model.get("label");
	};

	/**
	 * To set the button toggle mode on or off.
	 * @memberof ToggleButton#
	 * @access public
	 * @param {Boolean} bshouldToggle Value for toggling on.
	 * @returns None
	 */
	ToggleButton.prototype.shouldToggle = function(bshouldToggle) {
		this.model.set("shouldToggle", bshouldToggle);
	};

	/**
	 * This destroys the ToggleButton object.
	 * @memberof ToggleButton#
	 * @access public
	 * @param None
	 * @returns {Boolean} True or false
	 */

	ToggleButton.prototype.destroy = function() {
		this.model.off('change');
		this.model.destroy();
		this.model = null;
		this.$el.off("click");
		this.$el.off("mouseover");
		this.$el.off("mouseout");

		return this.__super__.prototype.destroy(true);
	};

	return ToggleButton;
});

