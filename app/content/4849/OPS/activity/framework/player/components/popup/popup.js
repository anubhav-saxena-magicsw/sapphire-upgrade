/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * Popup
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['marionette', 'player/base/base-popup-comp', 'player/manager/popup-manager'], function(Marionette, BasePopupComp, Popupmanager) {
	'use strict';
	var Popup;

	/**
	 * Popup class is responsible to create popup type component which
	 * will be managed by PopupManager class
	 */
	Popup = BasePopupComp.extend({
		objData : null,
		template : _.template(''),
		popupParent : undefined,
		bModel : false,
		popManagerInstance : null,

		initialize : function(objData) {

			var objThis = this;
			this.objData = objData;//this property is being used in componentselector for editing.
			this.popManagerInstance = Popupmanager.getInstance();

			if (this.objData.modal === 'true' || this.objData.modal === true) {
				this.bModel = true;
			}

			this.componentType = "popup";
		},

		onRender : function() {
			if (this.objData.styleClass !== undefined) {
				$(this.$el).addClass(this.objData.styleClass);
			}

			$(this.el).attr('id', this.strCompId);
			if (this.objData.default === 'hide') {
				if (this.bEditor === false) {
					$(this.$el).hide();
				}
			}
			this.popupParent = $(this.$el).parent();
		}
	});
	Popup.prototype.isValid = function(strCompType) {
		var bValid = false;
		bValid = (strCompType === "radio" || strCompType === "answer") ? false : true;
		return bValid;
	};
	/**
	 * Getter of model value
	 * @param {Object} bModel
	 */
	Popup.prototype.isModel = function() {
		return this.bModel;
	};

	/**
	 * This method will be called from outer world and responsible
	 * to launch popup by calling popup Manager class
	 */
	Popup.prototype.launch = function() {
      var blockerParent = "screenBlocker";
        if(this.objData.parent){
            blockerParent = this.objData.parent;
        }
		this.popManagerInstance.launchPopupComponent(this, blockerParent);
	};
	/**
	 * This method will be called from outer world and responsible
	 * to remove popup by calling popup Manager class
	 */
	Popup.prototype.remove = function() {
		this.popManagerInstance.removePopupComponent(this);
	};
	/**
	 * This method will be called automatically whenever popup closed
	 */
	Popup.prototype.popupRemoved = function() {
		this.customEventDispatcher("close", this, this);

	};
	/**
	 * This method will be called automatically whenever popup launched
	 */
	Popup.prototype.popupLaunched = function() {
		this.customEventDispatcher("open", this, this);
	};
	/**
	 * Insure that popup dom element are revert to their original position when
	 * they are closed or screeen is getting unload.
	 */
	Popup.prototype.flush = function() {
		if (!this.popupParent.find(this.$el)) {
			this.popupParent.append(this.$el);
		}
	};

	Popup.prototype.__super__ = BasePopupComp;

	Popup.prototype.destroy = function() {
		this.flush();
		return this.__super__.prototype.destroy(true);
	};

	return Popup;
});
