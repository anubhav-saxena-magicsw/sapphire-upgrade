/*jslint nomen: true */
/*globals MCQCompHelper,_,$,console,Backbone
 parseInt */

define(['marionette', 'player/base/base-item-comp', 'components/slider/slider', 'text!components/mediacontrol/mediacontrol.html'],

/**
 * @class MediaControl
 * @augments BaseItemComp
 * @param {Object} obj .
 */
function(Marionette, BaseItemComp, SliderComp, MediaControlHTML) {
	'use strict';
	var MediaControl = BaseItemComp.extend({
		objMediaData : null,
		template : _.template(MediaControlHTML),
		tagName : "div",
		toggle : false,
		bSelected : false,
		isEnabled : true,
		btnPlayPause : null,
		btnVolume : null,
		btnMute : null,
		objSlider : null,
		objSliderMute : null,
		objHSlider : null,
		nDuration : undefined,
		objSliderData : undefined,
		objHorizontalSliderData : undefined,

		/**
		 * Initialization begins here.
		 * @access private
		 * @memberof MediaControl
		 */
		initialize : function(obj) {
			this.objMediaData = obj;
			this.objData = obj;//this property is being used in componentselector for editing.
			this.objSliderData = {
				"sliderLength" : 90,
				"allignment" : "vertical",
				"steps" : 100,
				"sliderWrapperStyle" : "SliderVerticalWrapperStyle"
			};

			this.objHorizontalSliderData = {
				//"sliderLength" : 365,
				"allignment" : "horizontal",
				"sliderWrapperStyle" : "SliderHorizontalWrapperStyle"
			};

			this.$el.append(this.template);
			this.componentType = "mediacontrol";
		},
		onRender : function() {
		},
		onShow : function() {
			this.createControls();
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		}
	});
	MediaControl.prototype.Super = BaseItemComp;

	MediaControl.MEDIA_PLAY_EVENT = "mediaPlayEvent";

	MediaControl.MEDIA_PAUSE_EVENT = "mediaPauseEvenet";

	MediaControl.MEDIA_VOLUME_EVENT = "mediaVolumeEvent";

	MediaControl.MEDIA_MUTE_EVENT = "mediaMuteEvent";

	MediaControl.MEDIA_SET_VIDEO_POSITION = "mediaSetVideoPosEvent";

	MediaControl.prototype.setTotalTime = function(nDuration) {
		this.nDuration = nDuration;
	};
	MediaControl.prototype.updateSeekbarThumbPosition = function(displayValue) {
		this.objHSlider.updateThumbPosition(displayValue);
	};

	MediaControl.prototype.createControls = function() {
		if (this.objMediaData.showplay === true) {
			this.btnPlayPause = this.$el.find('#btnPlayPause');
			this.btnPlayPause.addClass(this.objMediaData.playbtnstyle);
		}

		if (this.objMediaData.showvolume === true) {
			this.btnVolume = this.$el.find('#btnVolume');
			this.btnVolume.addClass(this.objMediaData.volumebtnstyle);

			this.objSliderMute = new SliderComp(this.objSliderData);
			this.btnVolume.append(this.objSliderMute.render().$el);
			this.objSliderMute.onRender();
			this.objSliderMute.onShow();
		}

		this.objHSlider = new SliderComp(this.objHorizontalSliderData);
		this.$el.append(this.objHSlider.render().$el);
		this.objHSlider.onShow();

		if (this.objMediaData.showmute === true) {
			this.btnMute = this.$el.find('#btnMute');
			this.btnMute.addClass(this.objMediaData.mutebtnstyle);
		}

		if (this.bEditor === false) {
			this.initControls();
		}
	};

	MediaControl.prototype.initControls = function() {
		var objClassRef = this;

		if (this.objMediaData.showplay === true) {
			this.btnPlayPause.on('click', objClassRef, objClassRef.handleBtnClick);
		}

		if (this.objMediaData.showvolume === true) {
			this.btnVolume.on('click', objClassRef, objClassRef.handleBtnClick);
			this.objSliderMute.on('SliderStopped', objClassRef.handleVolumeSlider, objClassRef);
		}

		this.objHSlider.on('SliderStopped', objClassRef.handleSliderEvent, objClassRef);

		if (this.objMediaData.showmute === true) {
			this.btnMute.on('click', objClassRef, objClassRef.handleBtnClick);
		}
	};

	MediaControl.prototype.handleVolumeSlider = function(objEvent) {
		var nValue = parseInt(objEvent.customData);
		nValue = (nValue) / 100;
		this.customEventDispatcher(MediaControl.MEDIA_VOLUME_EVENT, this, nValue);
	};

	MediaControl.prototype.handleSliderEvent = function(objEvent) {
		var nValue, nPercent = parseInt(objEvent.customData);
		nValue = (this.nDuration * nPercent) / 100;
		this.customEventDispatcher(MediaControl.MEDIA_SET_VIDEO_POSITION, this, nValue);
	};

	MediaControl.prototype.handleBtnClick = function(objEvent) {
		var objClassRef, btnRef, strBtnName = objEvent.target.id;
		objClassRef = objEvent.data;
		btnRef = objEvent.target;
		switch(strBtnName) {
		case "btnPlayPause":
			if ($(btnRef).hasClass(objClassRef.objMediaData.playbtnstyle)) {
				objClassRef.customEventDispatcher(MediaControl.MEDIA_PLAY_EVENT, objClassRef, objClassRef);
			} else {
				objClassRef.customEventDispatcher(MediaControl.MEDIA_PAUSE_EVENT, objClassRef, objClassRef);
			}
			break;

		case "btnVolume":
			objClassRef.customEventDispatcher(MediaControl.MEDIA_VOLUME_EVENT, objClassRef, objClassRef);
			break;

		case "btnMute":
			objClassRef.customEventDispatcher(MediaControl.MEDIA_MUTE_EVENT, objClassRef, objClassRef);
			break;

		}
	};
	MediaControl.prototype.setState = function(strState) {
		switch(strState) {
		case "play":
			if (this.objMediaData.showplay === true) {
				this.btnPlayPause.addClass(this.objMediaData.pausebtnstyle);
				this.btnPlayPause.removeClass(this.objMediaData.playbtnstyle);
			}
			break;
		case "pause":
			if (this.objMediaData.showplay === true) {
				this.btnPlayPause.addClass(this.objMediaData.playbtnstyle);
				this.btnPlayPause.removeClass(this.objMediaData.pausebtnstyle);
			}
			break;
		case "finish":
		case "stop":
			if (this.objMediaData.showplay === true) {
				this.btnPlayPause.removeClass(this.objMediaData.pausebtnstyle);
				this.btnPlayPause.addClass(this.objMediaData.playbtnstyle);
			}
			this.objHSlider.updateThumbPosition(0);
			break;
		}
	};

	MediaControl.prototype.styleClass = function(arg) {
		if (arg) {
			this.model.set("styleClass", arg);
		} else {
			return this.model.get("styleClass");
		}
	};
	MediaControl.prototype.destroy = function() {

		this.btnPlayPause.off('click');
		this.btnPlayPause = null;
		return this.Super.prototype.destroy(true);

	};
	return MediaControl;
});

