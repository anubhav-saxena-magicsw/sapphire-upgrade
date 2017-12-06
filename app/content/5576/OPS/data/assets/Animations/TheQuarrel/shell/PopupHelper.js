/*jslint nomen: true*/
/*globals Backbone,_,console,$, class */

define(['player/widgets/hypertextwidget/hypertext-widget'], function() {'use strict';
	var PopupHelper, mySelf, arrPopups, mainJs, bBlocker, $blocker, objHT;

	PopupHelper = function(ref, template, parent, blocker, hyperTextOptions) {
		mySelf = this;
		mySelf.objActivity = ref;
		mySelf.init(template, parent, blocker, hyperTextOptions);
	};

	PopupHelper.prototype.init = function(template, parent, blocker, hyperTextOptions) {
		arrPopups = [];
		mySelf.initiatePopups(template, parent, blocker, hyperTextOptions);
	};

	PopupHelper.prototype.initiatePopups = function(template, parent, blocker, hyperTextOptions) {
		var i, j, $popup, arrMsgs, $next, $back;
		bBlocker = blocker;
		mySelf.objActivity.launchAsPopup(template, parent, blocker);
		$popup = $("#popup");
		arrPopups = $popup.find(".popup-msg-cont");
		for ( i = 0; i < arrPopups.length; i += 1) {
			var $popUpCont = $(arrPopups[i]);
			arrPopups[i] = $popUpCont;
			$popUpCont.hide();
			arrMsgs = $popUpCont.find('.messageCont');
			for ( j = 0; j < arrMsgs.length; j += 1) {
				var $msg = $(arrMsgs[j]);
				arrMsgs[j] = $msg;
				$msg.hide();
				$msg.find(".zoom-btn").each(function() {
					$(this).prop("htm", $(this).html());
					$(this).html('');
				});
				$msg.find(".zoom-btn").off("click").on("click", function(e) {
					console.log("in zoom btn text")
					var $overLayDiv, $btnClose, targetClass, closeClass;
					targetClass = $(this).attr("target-class");
					closeClass = $(this).attr("close-class");

					mySelf.closeHyperText();

					if (targetClass !== undefined && targetClass.length > 0) {
						$overLayDiv = $("<div class='" + targetClass + "'></div>");
						$overLayDiv.html($(this).prop("htm"));
					}
					if (closeClass !== undefined && closeClass.length > 0) {
						$btnClose = $("<div class='" + closeClass + "'></div>");
					}
					if ($overLayDiv.length && $btnClose.length) {
						$overLayDiv.append($btnClose);
						$popup.append($overLayDiv);
						$overLayDiv.HyperTextWidget(hyperTextOptions);
						$btnClose.off("click").on("click", function() {
							$(this).off("click");
							$($(this).parent()).remove();
						});
					}

				});
			}
			$popUpCont.prop("arrMsg", arrMsgs);
			$popUpCont.prop("msgTotal", arrMsgs.length);
			$popUpCont.prop("msgIndex", 0);
			$next = $popUpCont.find(".btnNext");
			$back = $popUpCont.find(".btnBack");

			if ($next.length && $back.length) {

				$popUpCont.prop("next", $next);
				$popUpCont.prop("back", $back);
				mySelf.enablePopupNextBack($popUpCont);
				$next.prop("popup-index", i);
				$back.prop("popup-index", i);

				$next.on("click", function() {
					if ($(this).attr("isEnable") === "false") {
						return;
					}
					mySelf.onNextBackClick($(this), true);
					mySelf.closeHyperText();
				});

				$back.on("click", function() {
					if ($(this).attr("isEnable") === "false") {
						return;
					}
					mySelf.onNextBackClick($(this), false);
					mySelf.closeHyperText();

				});

			}

		}

		$blocker = $(".ScreenPopupBlocker");
		if (blocker) {
			$blocker.hide();
		}
		$popup.hide();

		$popup.find("#btnClose").on("click", function() {
			mySelf.closeHyperText();
			if (blocker) {
				$blocker.hide();
			}
			$popup.hide();
			$.each(arrPopups, function() {
				$(this).prop("msgIndex", 0);
				if ($(this).prop("next") !== undefined && $(this).prop("back") !== undefined) {
					mySelf.enablePopupNextBack($(this));
				}

			});
		});

		objHT = $popup.HyperTextWidget(hyperTextOptions);
	};

	PopupHelper.prototype.closeHyperText = function() {
		if (objHT !== undefined) {
			objHT.HyperTextWidget('close');
		}
	};

	PopupHelper.prototype.showPopUp = function(index) {

		$.each(arrPopups, function(ind, popUpCont) {
			var $popup;
			$(popUpCont).hide();
			if (ind === index) {
				$(popUpCont).show();
				$popup = $($(popUpCont).parent());
				$popup.show();
				if (bBlocker) {
					$blocker.show();
				}
				mySelf.showPopUpMsg($(popUpCont));
			}
		});

	};

	PopupHelper.prototype.showPopUpMsg = function($popUpCont) {
		var index, arrMsg;
		index = $popUpCont.prop("msgIndex");
		arrMsg = $popUpCont.prop("arrMsg");
		$.each(arrMsg, function(ind, msg) {

			if (ind === index) {
				$(msg).show();
			} else {
				$(msg).hide();
			}
		});
	};

	PopupHelper.prototype.onNextBackClick = function($btn, bIncr) {
		var index, $popUpCont;
		$popUpCont = arrPopups[$btn.prop("popup-index")];
		mySelf.enableBtn($btn, false);
		index = $popUpCont.prop("msgIndex");
		if (bIncr) {
			index += 1;
		} else {
			index -= 1;
		}
		$popUpCont.prop("msgIndex", index);
		mySelf.showPopUpMsg($popUpCont);
		mySelf.enablePopupNextBack($popUpCont);
	};

	PopupHelper.prototype.enablePopupNextBack = function($popUpCont) {
		var $next, $back, total, index;

		$next = $popUpCont.prop("next");
		$back = $popUpCont.prop("back");
		total = $popUpCont.prop("msgTotal");
		index = $popUpCont.prop("msgIndex");
		if (total > 0) {
			mySelf.enableBtn($next, true);
			mySelf.enableBtn($back, true);
		} else {
			mySelf.enableBtn($next, false);
			mySelf.enableBtn($back, false);
			return;
		}
		if (total - index === 1) {
			mySelf.enableBtn($next, false);
		} else if (total - index === total) {
			mySelf.enableBtn($back, false);
		}
	};

	PopupHelper.prototype.enableBtn = function($btn, bVal) {
		var strVal = "false";
		if (bVal === "true" || bVal === true) {
			strVal = "true";
			$btn.removeClass("disabled");
		} else if (bVal === "false" || bVal === false) {
			strVal = "false";
			$btn.addClass("disabled");
		}
		$btn.attr("isEnable", strVal);
	};

	// PopupHelper.prototype.launchPopup = function(e) {
		// switch(e.customData) {
			// case 1:
				// mySelf.showPopUp(0);
				// break;
			// case 2:
				// mySelf.showPopUp(1);
				// break;
			// case 3:
				// mySelf.showPopUp(2);
				// break;
			// case 4:
				// mySelf.showPopUp(3);
				// break;
			// case 5:
				// mySelf.showPopUp(4);
				// break;
			// case 6:
				// mySelf.showPopUp(5);
				// break;
			// case 7:
				// mySelf.showPopUp(6);
				// break;
		// }
// 
	// };

	PopupHelper.prototype.destroy = function() {

	};

	return PopupHelper;
});
