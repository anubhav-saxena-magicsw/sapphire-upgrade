/*jslint nomen: true*/
/*globals console,_,$,Backbone*/
/**
 * PopupManager
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */

define(['marionette'], function(Marionette) {
	'use strict';
	var instance, PopupManager;
	instance = null;
	/**
	 *A class representing a PopupManager. This is a singleton class.
	 *@class PopupManager
	 *@example
	 *Load module
	 *@example
	 * var popupManager = PopupManager.getInstance();
	 */
	PopupManager = Backbone.View.extend({

		/**
		 * This is default member.
		 * @access private
		 */
		popupObjectDict : {},
		rootPopupDiv : undefined,

		blockerDivRef : undefined,
		popupTemplDict : {},
		popupRefDict : {},
		popupAnimationsRef : {},

		LAUNCH_ANIMATION : 'launchAnimation',
		CLOSE_ANIMATION : "closeAnimation",

		members : {
			objPopup : null,
			strPopupParent : null,
			popupContent : $("#popupContent"),
			popupHolder : $("#popupHolder"),
			objScreenBlocker : $("#screenBlocker")
		},
		intialize : function() {
		},

		/**
		 * Given Div reference shown as model popup
		 * @memberof PopupManager#
		 * @access public
		 * @param {object} popupContainer Jquery object which is going to display as popup.
		 * @return None
		 */
		showPopup : function(popupContainer) {
			this.members.objPopup = popupContainer;
			this.members.objPopupParent = $(this.members.objPopup.parent());
			this.members.popupContent.append(this.members.objPopup);
			this.members.popupHolder.show();
			this.setScreenInCenter();
			this.members.objPopup.show();
			this.members.objScreenBlocker.show();

		},

		/**
		 * Responsbile to set popup window in center of broswer window
		 * @memberof PopupManager#
		 * @access private
		 * @param {object} objScreenRef Reference of popup div
		 * @return None
		 */
		setScreenInCenter : function() {

			var objScreenRef, objParent, updatedXPos, updatedYPos;
			objScreenRef = this.members.objPopup;
			if (this.isPopupOpen() === false) {
				return;
			}
			objParent = $(objScreenRef.parent());
			updatedXPos = (this.members.popupHolder.width() - objScreenRef.width()) / 2;
			updatedYPos = (this.members.popupHolder.height() - objScreenRef.height()) / 2;
			objScreenRef.css({
				"left" : updatedXPos + "px",
				"top" : updatedYPos + "px"
			});

		},
		/**
		 * Show/hide screen blocker div to block/unblock all clickable object(s)
		 * @memberof PopupManager#
		 * @access private
		 * @param {Object} bDisable
		 * @return None
		 */
		disabledScreen : function(bDisable) {
			if (bDisable) {
				this.members.objScreenBlocker.show();
			} else {
				this.members.objScreenBlocker.hide();
			}
		},

		/**
		 * Check popup status.
		 * @memberof PopupManager#
		 * @param None
		 * @return {boolean} popup status.
		 */
		isPopupOpen : function() {
			return (this.members.objPopup !== null);
		},

		setBlockerDivRef : function(blockerDiv) {
			this.blockerDivRef = blockerDiv;
		},

		setPopupTemplateRef : function(popupTmpl) {
			this.popupTemplDict = popupTmpl;
		},

		setAnimationObjects : function(objAnimations) {
			this.popupAnimationsRef = objAnimations;
		},

		launchPopup : function(objPopupClass, parentDiv) {
			var objClassref = this, popupParent;
			this.rootPopupDiv = (this.rootPopupDiv === undefined) ? $("#popupHolder") : this.rootPopupDiv;
			popupParent = this.rootPopupDiv;
			if (parentDiv !== undefined) {
				popupParent = parentDiv;
			}
			popupParent.css("display", "table");
			this.rootPopupDiv.append(objPopupClass.$el);
			objPopupClass.render();
			objPopupClass.show();
			this.popupObjectDict[objPopupClass.cid] = objPopupClass;
			objPopupClass.on(objPopupClass.POPUP_CLOSE_EVENT, objClassref.handleConfirmPopupEvent, objClassref);
			return objPopupClass;

		},

		/**
		 * This method is attached with Confirm popup close event.
		 * Responsible to remove the popup div and its references.
		 * @param {Object}
		 * @return none
		 */
		handleConfirmPopupEvent : function(objEvent) {
			var objPopup = this.popupObjectDict[objEvent.target.cid];
			objPopup.off(objPopup.POPUP_CLOSE_EVENT);
			objPopup.destroy();
			objPopup.$el.remove();
			delete this.popupObjectDict[objEvent.target.cid];
			this.rootPopupDiv.css("display", "none");
			objPopup = null;
		},

		launchPopupComponent : function(objPopRef, blockerParent) {
			var objPopup, blocker;
			this.popupObjectDict[objPopRef.$el.attr('id')] = objPopRef.$el;
			objPopup = this.popupObjectDict[objPopRef.$el.attr('id')];
			objPopup.show();
			if (objPopRef.isModel()) {
				blocker = $(this.blockerDivRef);
				if (objPopRef.objData.blockerStyleBG) {
					blocker.css('background-color', objPopRef.objData.blockerStyleBG);
				}
				objPopup.before(blocker);
				objPopRef.blocker = blocker;
			}
			objPopRef.popupLaunched();
		},
		removePopupComponent : function(objPopRef) {
			var blocker, objPopup = this.popupObjectDict[objPopRef.$el.attr('id')];
			if (objPopup) {
				objPopup.hide();
				delete this.popupObjectDict[objPopRef.$el.attr('id')];
				if (objPopRef.isModel()) {
					objPopRef.blocker.remove();
				}
			}
			objPopRef.popupRemoved();

		},
		launchAsPopup : function(strPopupId, parentId, isModel, context, strCallback, launchAnimation, closeAnimation) {
			var objData = {}, objPopupData, target = $('body').find("#" + parentId), objLaunchAnim;
			if (target.length < 1) {
				target = $('body');
			}
			objPopupData = {};

			if (isModel === true) {
				objPopupData.blocker = $(this.blockerDivRef);
				target.append(objPopupData.blocker);
			}

			objPopupData.id = strPopupId;

			objPopupData.parentId = parentId;
			objPopupData.popup = $(this.popupTemplDict[strPopupId]);
			objPopupData.context = context;
			objPopupData.strCallback = strCallback;
			objPopupData.launchAnimation = launchAnimation;
			objPopupData.closeAnimation = closeAnimation;

			if (objPopupData.popup.attr(this.LAUNCH_ANIMATION) !== undefined) {
				objLaunchAnim = this.popupAnimationsRef.animations[objPopupData.popup.attr(this.LAUNCH_ANIMATION)];
			}

			if (objLaunchAnim === undefined) {
				objPopupData.popup.appendTo(target).show();
			} else {

				objPopupData.popup.hide().appendTo(target).show();
				objPopupData.popup.animate(objLaunchAnim, parseInt(objLaunchAnim.duration));
			}

			if (objPopupData.strCallback !== undefined && objPopupData.context !== undefined) {
				objData.state = "popupOpen";
				objData.popupId = strPopupId;
				objData.popupRef = objPopupData.popup;
				objPopupData.context[objPopupData.strCallback].apply(objPopupData.context, [objData]);
			}

			objPopupData.closeBtn = $.find("#btnClose", objPopupData.popup[0]);
			objPopupData.OkBtn = $.find("#btnOk", objPopupData.popup[0]);

			this.popupRefDict[objPopupData.id] = objPopupData;
			this.addCloseButtonEvent(objPopupData);
		},

		addCloseButtonEvent : function(objPopupData) {
			var btnClose = $(objPopupData.closeBtn), objClassRef = this, btnOk = $(objPopupData.OkBtn);

			if (btnClose !== undefined) {
				btnClose.attr("popupId", objPopupData.id);
				btnClose.bind("click", objClassRef, objClassRef.handleCloseBtnClick);
			}
			if (btnOk !== undefined) {
				btnOk.attr("popupId", objPopupData.id);
				btnOk.bind("click", objClassRef, objClassRef.handleCloseBtnClick);
			}
		},

		handleCloseBtnClick : function(objEvent) {
			var objClassRef = objEvent.data, objPopupData, strPopupId = $(objEvent.target).attr("popupId"), objCloseAnim;
			objPopupData = objClassRef.popupRefDict[strPopupId];

			objCloseAnim = $(objClassRef.popupRefDict[strPopupId].popup).attr(objClassRef.CLOSE_ANIMATION);
			if (objCloseAnim !== undefined) {
				objCloseAnim = objClassRef.popupAnimationsRef.animations[objCloseAnim];

			}
			if (objCloseAnim !== undefined)//apply close animation;;;;;
			{
				$(objClassRef.popupRefDict[strPopupId].popup).animate(objCloseAnim, parseInt(objCloseAnim.duration), function() {
					objClassRef.removePopup(strPopupId);
				});
			} else {
				objClassRef.removePopup(strPopupId);
			}
		},

		/**
		 * Removing popup from screen and append popup to its actual parent
		 * @memberof PopupManager#
		 * @access public
		 * @param None
		 * @return None
		 */
		removePopup : function(strPopupId) {
			var objData = {}, objPopupData = this.popupRefDict[strPopupId];
			objPopupData.popup.remove();

			if (objPopupData.blocker !== undefined) {
				objPopupData.blocker.remove();
			}

			if (objPopupData.strCallback !== undefined && objPopupData.context !== undefined) {
				objData.state = "popupClose";
				objData.popupId = objPopupData.id;
				objData.Id = $(objPopupData.closeBtn).attr('id');
				objPopupData.context[objPopupData.strCallback].apply(objPopupData.context, [objData]);
			}
			if (objPopupData.strCallback !== undefined && objPopupData.context !== undefined) {
				objData.state = "popupClose";
				objData.popupId = objPopupData.id;
				objData.Id = $(objPopupData.OkBtn).attr('id');
				objPopupData.context[objPopupData.strCallback].apply(objPopupData.context, [objData]);
			}

			if ($(objPopupData.closeBtn) !== undefined) {
				$(objPopupData.closeBtn).unbind("click");
			}
			if ($(objPopupData.OkBtn) !== undefined) {
				$(objPopupData.OkBtn).unbind("click");
			}
			delete this.popupRefDict[strPopupId];
		}
	});

	return {
		/**
		 * getInstance
		 * @memberof PopupManager#
		 * @param none
		 * @returns {PopupManager} objInsance.
		 */
		getInstance : function() {
			if (!instance) {
				instance = new PopupManager();
			}
			return instance;
		}
	};
});
