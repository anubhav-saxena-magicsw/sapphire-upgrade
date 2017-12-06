/*jslint nomen: true*/
/*globals Backbone,_,console,$, class */
define(['player/screen/screen-helper',
		'image!screens/screen1/assets/images/Play.jpg'
		], function(ScreenHelper) {'use strict';
	var Helper, mySelf, bg ,videoProgressFlag = true;
	Helper = ScreenHelper.extend({
	});
	
    Helper.prototype.members = function() {
		videoProgressFlag = true
	};
	Helper.prototype.init = function() {
	    mySelf = this;
		$("#bgPoster").show();
		$("#screenHolder").removeClass("screenHolderH").addClass("screenHolderI");
		mySelf.objActivity.broadcastEventReceiver("shellCommonEvent", this, "manageShellCommonEvent");
		if($('html').hasClass('desktop')){
			mySelf.comp_video1.play();
			$(".first_frame_screen").css("display","none");
            
		}else{
			$(".first_frame_screen").css("display","block");
			
		}
	};
    Helper.prototype.hidePreloader = function() {
		
	
			if(videoProgressFlag) {
			videoProgressFlag = false;
			$("#bgPoster").hide();
			$("#preloader").hide();
		}
	
		
	};
	Helper.prototype.manageShellCommonEvent = function(objEvent) {
		var strTaskName = objEvent.data.taskName;
		switch(strTaskName) {
			case "onCreditPopupOpen":
				mySelf.screen.comp_video1.pause();
				mySelf.screen.btnPlay.show();
				mySelf.screen.btnPause.hide();
			break;
		}
	};

	Helper.prototype.showHideCaption = function(evt) {
        mySelf.caption.$el.toggle();
	};

	Helper.prototype.showHideVolumeBar = function(evt) {
		$("#volumeBar").toggle();
	};
	Helper.prototype.ChangeVideoPlayBtnState = function() {
		if (device.mobile() === true || device.tablet() === true) {
			this.objScreen.btnPlay.show();
			$("#bgPoster").show();
			$("#preloader").hide();
		} else {
			this.objScreen.btnPlay.hide();
		}
	};
	Helper.prototype.showResetBtn = function() {
		if (device.mobile() === true || device.tablet() === true) {
			this.objScreen.btnReset.show();
		}
	};

	Helper.prototype.showVolumeBtn = function() {
			if (device.mobile() === true || device.tablet() === true) {
				this.objScreen.btnVolume.hide();
			}
			else{
				this.objScreen.btnVolume.show();
			}
		};


	Helper.prototype.hideResetBtn = function() {
		if (device.mobile() === true || device.tablet() === true) {
			this.objScreen.btnReset.hide();
		} else {
			this.objScreen.btnReset.show();
		}
	};

	Helper.prototype.volumeChange = function(evt) {
		var currentPosition, duration, result;
		currentPosition = evt.customData;
		result = currentPosition / 100;
		mySelf.comp_video1.changeVolume(result);
	};
   
	Helper.prototype.destroy = function() {
		mySelf.objActivity.stopBroadcastEventReceiver("shellCommonEvent", this, "manageShellCommonEvent");
	};

	return Helper;
});
