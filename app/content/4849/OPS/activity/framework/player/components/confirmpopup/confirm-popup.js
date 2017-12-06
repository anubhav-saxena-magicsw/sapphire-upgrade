/*jslint nomen: true*/
/*globals Data_Loader,console,_,$*/

/**
 * ConfirmPopup
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['player/base/base-popup-comp'], function(BasePopupComp) {'use strict';
	var ConfirmPopup;

	ConfirmPopup = BasePopupComp.extend({
		template : _.template(""),
		objPopupData : undefined,
		btnYes : undefined,
		btnNo : undefined,
		btnCancel : undefined,

		initialize : function(objData) {
			this.objData = objData;
			//this property is being used in componentselector for editing.
			this.objPopupData = objData;
			this.template = _.template(this.objPopupData.htmlTemplate);
			this.componentType = "confirm-popup";
		},

		/**
		 * Adding buttons events, set the layout of popup and its button label
		 */
		onRender : function() {
			var objClassRef = this;
			this.$el.attr("style", "text-align: center; vertical-align: middle; display: table-cell;");
			$("#titleBar", this.$el).html(this.objPopupData.title).css('text-align', 'center');
			$("#message", this.$el).html(this.objPopupData.message);
			this.btnYes = $("#btnYes", this.$el);
			this.btnNo = $("#btnNo", this.$el);
			this.btnCancel = $("#btnCancel", this.$el);
			this.btnYes.on("click", objClassRef, objClassRef.handleButtonClick);
			this.btnNo.on("click", objClassRef, objClassRef.handleButtonClick);
			this.btnCancel.on("click", objClassRef, objClassRef.handleButtonClick);
			this.setPopupLayout();
			this.setButtonLabel();
		}
	});

	/**
	 * set the button visibility based on the poup type.
	 */
	ConfirmPopup.prototype.setPopupLayout = function() {
		switch(this.objPopupData.button) {
			case ConfirmPopup.YES_NO_CANCEL:
				this.btnYes.css("display", "inline-block");
				this.btnNo.css("display", "inline-block");
				this.btnCancel.css("display", "inline-block");
				this.btnYes.html("Yes");
				this.btnNo.html("No");
				this.btnCancel.html("Cancel");
				break;

			case ConfirmPopup.OK_CANCEL:
				this.btnYes.css("display", "inline-block");
				this.btnCancel.css("display", "inline-block");
				this.btnYes.html("OK");
				this.btnCancel.html("Cancel");
				this.btnNo.hide();
				break;

			case ConfirmPopup.OK:
			default:
				this.btnYes.html("OK");
				this.btnYes.css({
					"display" : "inline-block",
					'text-align' : 'center'
				});
				this.btnNo.hide();
				this.btnCancel.hide();
				break;
		}
	};

	/**
	 * set the button label.
	 */
	ConfirmPopup.prototype.setButtonLabel = function() {
		if (this.objPopupData.yesBtnLabel !== undefined) {
			this.btnYes.html(this.objPopupData.yesBtnLabel);
		}

		if (this.objPopupData.noBtnLabel !== undefined) {
			this.btnNo.html(this.objPopupData.noBtnLabel);
		}

		if (this.objPopupData.cancelBtnLabel !== undefined) {
			this.btnCancel.html(this.objPopupData.cancelBtnLabel);
		}

		if (this.objPopupData.styles && this.objPopupData.styles.btnYesStyle) {
			this.btnYes.css("display", "inline-block").addClass(this.objPopupData.styles.btnYesStyle);
		}
		if (this.objPopupData.styles && this.objPopupData.styles.btnNoStyle) {
			this.btnNo.css("display", "inline-block").addClass(this.objPopupData.styles.btnNoStyle);
		}
		if (this.objPopupData.styles && this.objPopupData.styles.btnCancelStyle) {
			this.btnCancel.css("display", "inline-block").addClass(this.objPopupData.styles.btnCancelStyle);
		}

	};

	/**
	 * 'handleButtonClick' method invoked when any buttons  of popup.
	 * this method dispatched only 'POPUP_CLOSE_EVENT' event with the clicked
	 * button name.
	 * @param {Object}
	 * @return {none}
	 */
	ConfirmPopup.prototype.handleButtonClick = function(objEvent) {
		var objData = {};
		objData.button = objEvent.currentTarget.id;
		objEvent.data.closePopup(objData);
	};

	ConfirmPopup.prototype.ConfirmPopupSuper = BasePopupComp;

	/** ------------------ CONSTANT DECLARATION -------------------**/
	ConfirmPopup.YES_NO_CANCEL = 3;
	ConfirmPopup.OK_CANCEL = 2;
	ConfirmPopup.OK = 1;

	ConfirmPopup.YES_BUTTON = "yesButton";
	ConfirmPopup.NO_BUTTON = "noButton";
	ConfirmPopup.CANCEL_BUTTON = "cancelButton";
	/** ------------------END CONSTANT DECLARATION ----------------**/

	ConfirmPopup.prototype.destroy = function() {
		this.btnYes.off("click");
		this.btnNo.off("click");
		this.btnCancel.off("click");

		this.btnYes = undefined;
		this.btnNo = undefined;
		this.btnCancel = undefined;

		return this.ConfirmPopupSuper.prototype.destroy.call(this, true);
	};

	return ConfirmPopup;
});
