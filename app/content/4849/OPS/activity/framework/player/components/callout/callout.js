/*jslint nomen: true*/
/*globals console,_*/
/*globals console,$*/

/**
 * Callout
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access public
 */

define(["marionette", "player/base/base-item-comp"], function(Marionette, BaseItemComp) {'use strict';
	var Callout;

	Callout = BaseItemComp.extend({
		objButton : undefined,
		objPopupRef : undefined,
		strStyleName : undefined,
		objData : undefined,

		template : _.template(""),

		/**
		 * Overriding initalize method to get the data which
		 * can be passed when this comp is construct.
		 * This method is also responsible to call 'startInitialization' method to
		 * start the callout comp.
		 * @param {Object} objData
		 * @return none
		 */
		initialize : function(objData) {
			this.objData = objData;//this property is being used in componentselector for editing.
			this.startInitialization(objData);
		},

		/**
		 * Invoked when this comp successfully added in DOM element, and will invoke
		 * 'setScreenElement' method, which is responsible to set the style and data.
		 * @param none
		 * @return none
		 */
		onShow : function() {
			this.setScreenElement();
		},

		setCalloutContent : function(strContentId) {

		},

		removeCallout : function() {

		},

		setScreenElement : function() {
			var popupBtn, objData = this.objData, objClassRef = this;

			if (objData.templateId !== undefined) {
				this.objPopupRef = objData.templateId
			}
			popupBtn = $("<div/>");
			popupBtn.css("width", this.$el.css("width"));
			popupBtn.css("height", this.$el.css("height"));
			popupBtn.css("left", "0px");
			popupBtn.css("top", "0px");
			this.$el.append(popupBtn);
			popupBtn.attr("popupId", objData.popupId);
			popupBtn.attr("popupShown", "false");
			//popupBtn.addClass(this.$el.attr("class"));
			popupBtn.on("click", objClassRef, objClassRef.handleCallBack);
		},

		handleCallBack : function(objEvent) {
			var bShowPopup = ($(objEvent.target).attr("popupShown") === "false") ? true : false;
			$(objEvent.target).attr("popupShown", String(bShowPopup));
			objEvent.data.showPopup(bShowPopup);
		},

		showPopup : function(bShowPopup) {
			var objData = this.objData, btnDiv;
			if (bShowPopup === true) {
				this.objPopupRef = $(objData.templateId);
				this.objPopupRef.addClass(objData.calloutPopupStyle);
				this.$el.append(this.objPopupRef);
				btnDiv = this.$el.children()[0];
				this.$el.children()[0].remove();
				this.$el.append(btnDiv);
				this.customEventDispatcher(Callout.CONTENT_ADDED, this, this.$el);
			} else {
				this.objPopupRef.remove();
				this.customEventDispatcher(Callout.CONTENT_REMVOVED, this, this.$el);
				this.objPopupRef = undefined;
			}
		},

		startInitialization : function(objData) {
			var btnStyle, popupTmpl;
			btnStyle = "defaultBtnStyle";
			if (objData.btnStyle !== undefined || objData.btnStyle !== null) {
				btnStyle = objData.btnStyle;
			}
			this.$el.addClass(btnStyle);
			this.objData = objData;

		}
	});

	Callout.CONTENT_ADDED = "contentAdded";
	Callout.CONTENT_REMVOVED = "contentRemoved";

	Callout.prototype.__super__ = BaseItemComp;
	Callout.prototype.destroy = function() {
		return this.__super__.prototype.destroy(true);
	};
	return Callout;
});
