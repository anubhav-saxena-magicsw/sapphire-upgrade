/*jslint nomen: true*/
/*globals _,$,console,Backbone*/

/**
 * VideoPlayer
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */

define(['marionette', 'player/base/base-media-player', 'components/mediacontrol/mediacontrol'], function(Marionette, BaseMediaPlayer, MediaControl) {
	'use strict';

	var VideoPlayer = /** @lends VideoPlayer.prototype */
	BaseMediaPlayer.extend({
		bSeeking : undefined,
		template : _.template(''),
		video : document.createElement('video'),
		state : -1,
		bloop : false,
		bPlayAfterLoad : false,
		bStopping : false,
		videoState : null,
		objTimeOut : null,
		bShowMediaControl : false,
		objMediaPanelData : null,
		objMediaPlayer : undefined,
		objVideoData : null,
		/**
		 * This function initializes the component
		 * @access private
		 * @memberof VideoPlayer
		 * @param {Object} options Conatins the data to configure the component
		 * @returns None
		 */
		initialize : function(objData) {
			this.objData = objData;
			//this property is being used in componentselector for editing.
			this.objMediaPlayer = null;
			this.objVideoData = objData;
			this.video = document.createElement('video');
			if (this.objVideoData.mediacontroller !== undefined) {
				this.bShowMediaControl = (this.objVideoData.mediacontroller === true) ? true : false;
				if (this.bShowMediaControl === true) {
					this.objMediaPanelData = this.objVideoData.mediapaneldata;
				}
			}
			if ( typeof this.objData.state === 'object') {
				this.setState(this.objData.state);
			}
			this.initBaseMediaPlayer(this, this.PlayerConstants.VIDEO_MEDIA_PLAYER);
			this.componentType = "video";

		},
		onShow : function() {
			this.$el.append($(this.video));
			if (this.bEditor === false) {
				if (this.objVideoData !== undefined) {
					this.addEvents();
					this.setCuePoints(this.objVideoData);
					this.setSource(this.objVideoData);
					if (this.objVideoData.loop !== undefined) {
						if (this.objVideoData.loop === "true" || this.objVideoData.loop === true) {
							this.bloop = true;
						} else {
							this.bloop = false;
						}
					}
				} else {
					console.error("Please check provided data in video player constructor...");
				}
			}

			//console.log("this.objVideoData!!!!!, this.objVideoData", this.objVideoData.styleClass);
			if (this.objVideoData.styleClass) {
				$(this.$el).addClass(this.objVideoData.styleClass);
				//$(this.video).css("width", "inherit");
				//$(this.video).css("height", "inherit");
			}

			this.setLayout(this.objVideoData);
			if (this.bShowMediaControl === true) {
				this.initMediaControls();
			}
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		}
	});

	VideoPlayer.prototype.initMediaControls = function() {
		this.objMediaPlayer = new MediaControl(this.objMediaPanelData);
		this.objMediaPlayer.bEditor = this.bEditor;
		this.$el.append($(this.objMediaPlayer.$el));
		this.objMediaPlayer.render();
		this.objMediaPlayer.onShow();

		if (this.bEditor === false) {
			this.objMediaPlayer.on(MediaControl.MEDIA_PLAY_EVENT, this.onMediaControlEvent, this);
			this.objMediaPlayer.on(MediaControl.MEDIA_PAUSE_EVENT, this.onMediaControlEvent, this);
			this.objMediaPlayer.on(MediaControl.MEDIA_VOLUME_EVENT, this.onMediaControlEvent, this);
			this.objMediaPlayer.on(MediaControl.MEDIA_MUTE_EVENT, this.onMediaControlEvent, this);
			this.objMediaPlayer.on(MediaControl.MEDIA_SET_VIDEO_POSITION, this.onMediaControlEvent, this);
		}
	};

	VideoPlayer.prototype.onMediaControlEvent = function(objEvent) {
		switch(objEvent.type) {
		case MediaControl.MEDIA_PLAY_EVENT:
			this.play();
			break;
		case MediaControl.MEDIA_PAUSE_EVENT:
			this.pause();
			break;
		case MediaControl.MEDIA_VOLUME_EVENT:
			this.changeVolume(objEvent.customData);
			break;
		case MediaControl.MEDIA_MUTE_EVENT:
			break;
		case MediaControl.MEDIA_SET_VIDEO_POSITION:
			this.pause();
			this.setTime(objEvent.customData);
			this.play();
			break;
		}
	};

	VideoPlayer.prototype.getState = function() {
		var prepareData = {};
		prepareData['currentTime'] = this.video.currentTime;
		prepareData['volume'] = this.video.volume;
		prepareData['state'] = this.videoState;
		return prepareData;
	};

	VideoPlayer.prototype.setState = function(prepareData) {
		if ( typeof prepareData === 'object') {
			if ( typeof prepareData.currentTime !== undefined && typeof prepareData.volume !== undefined && typeof prepareData.state !== undefined && typeof prepareData.state !== null ) {
				this.video.currentTime = prepareData.currentTime;
				this.video.volume = prepareData.volume;
				switch(prepareData.state) {
				case 'play':
					this.play();
					break;
				case 'pause':
					this.pause();
					break;
				case 'stop':
					this.stop();
					break;
				}
			}
		}
	};

	VideoPlayer.prototype.isValid = function(strCompType) {
		return false;
	};

	VideoPlayer.prototype.setLayout = function(options) {
		if (options.hasOwnProperty('outerDiv') && options.outerDiv !== undefined) {
			this.$el.addClass(options.outerDiv);
		}
		if (options.hasOwnProperty('width')) {
			if (this.bEditor !== false) {
				options.height = 0;
			}
			$(this.video).attr("width", options.width);
		}
		if (options.hasOwnProperty('height')) {
			$(this.video).attr("height", options.height);
		}

		if (options.hasOwnProperty('poster') && options.poster.length > 0) {
			$(this.video).attr("poster", options.poster);
		}
		if (options.hasOwnProperty('controls') && options.controls !== undefined) {
			$(this.video).attr("controls", "");
		}
	};
	VideoPlayer.prototype.setCuePoints = function(options) {
		if (options.hasOwnProperty('cuePoints') && options.cuePoints.length > 0) {
			this.hasCuePoints = true;
			this.cuePoints = options.cuePoints.slice(0, options.cuePoints.length);
			this.orgCuePoints = _.extend({}, options.cuePoints);
			this.cuePoints.sort(function(a, b) {
				return a - b;
			});
		}
		if (options.hasOwnProperty('eventPrefix') && options.eventPrefix !== undefined) {
			this.eventPrefix = options.eventPrefix;
		}
	};
	VideoPlayer.prototype.setSource = function(options) {
		var i, objSrc, sourceEl;
		if (options.source.length > 0) {
			$(this.video).empty();
			this.state = -1;
			for ( i = 0; i < options.source.length; i += 1) {
				objSrc = options.source[i];
				sourceEl = document.createElement("source");
				sourceEl.setAttribute("src", objSrc.path);
				this.video.appendChild(sourceEl);
			}
		}

	};
	VideoPlayer.prototype.addEvents = function() {
		this.video.removeEventListener("loadstart", $.proxy(this.loadstart, this));
		this.video.removeEventListener("ended", $.proxy(this.ended, this));
		this.video.removeEventListener("loadedmetadata", $.proxy(this.loadedmetadata, this));
		this.video.removeEventListener("canplay", $.proxy(this.canplay, this));
		this.video.removeEventListener("timeupdate", $.proxy(this.timeupdate, this));

		this.video.addEventListener("loadstart", $.proxy(this.loadstart, this));
		this.video.addEventListener("ended", $.proxy(this.ended, this));
		this.video.addEventListener("loadedmetadata", $.proxy(this.loadedmetadata, this));
		this.video.addEventListener("canplay", $.proxy(this.canplay, this));
		this.video.addEventListener("timeupdate", $.proxy(this.timeupdate, this));

	};
	VideoPlayer.prototype.loadstart = function(e) {
		this.bSeeking = false;
		this.state = 0;
	};
	VideoPlayer.prototype.loadedmetadata = function(objEvent) {
		this.state = 1;
		if (this.objMediaPlayer) {
			this.objMediaPlayer.setTotalTime(objEvent.target.duration);
		}
	};
	VideoPlayer.prototype.canplay = function(e) {
		this.state = 2;
		if (this.bPlayAfterLoad && !this.bSeeking && !this.bStopping) {
			this.play();
		}
	};
	VideoPlayer.prototype.ended = function(e) {
		var nTime = (this.video !== null) ? this.video.currentTime : 0;
		this.customEventDispatcher(this.VIDEO_FINISH_EVENT, this, nTime);
		if (this.bShowMediaControl) {
			this.objMediaPlayer.setState("finish");
		}
		if (this.bloop) {
			this.video.currentTime = 0;
			this.video.play();
		}
	};
	VideoPlayer.prototype.timeupdate = function(e) {
		if (this.bSeeking) {
			this.customEventDispatcher("seeking", this, {
				currentTime : (this.video !== null) ? this.video.currentTime : 0
			});
			this.bSeeking = false;
			return;
		}
		this.customEventDispatcher(this.VIDEO_PROGRESS_EVENT, this, {
			//currentTime : this.video.currentTime
			currentTime : ((this.video !== null) ? this.video.currentTime : 0)
		});
		if (this.hasCuePoints && this.video !== null) {
			this.cuePointEventDispatcher(this, ((this.video !== null) ? this.video.currentTime : 0));
		}
		if (this.bShowMediaControl === true) {
			var result;
			result = (this.video.currentTime / this.video.duration) * 100;
			this.objMediaPlayer.updateSeekbarThumbPosition(result);
		}
	};
	/**
	 * Set the super to BaseMediaPlayer
	 * @access private
	 * @memberof VideoPlayer#
	 */
	VideoPlayer.prototype.__super__ = BaseMediaPlayer;
	/**
	 *@const
	 *@access public
	 *@memberof VideoPlayer#
	 */
	VideoPlayer.prototype.VIDEO_START_EVENT = 'videostart';
	/**
	 *@const
	 *@access public
	 *@memberof VideoPlayer#
	 */
	VideoPlayer.prototype.VIDEO_PAUSE_EVENT = 'videopause';
	/**
	 *@const
	 *@access public
	 *@memberof VideoPlayer#
	 */
	VideoPlayer.prototype.VIDEO_PROGRESS_EVENT = 'videoprogress';
	/**
	 *@const
	 *@access public
	 *@memberof VideoPlayer#
	 */
	VideoPlayer.prototype.VIDEO_STOP_EVENT = 'videostop';
	/**
	 *@const
	 *@access public
	 *@memberof VideoPlayer#
	 */
	VideoPlayer.prototype.VIDEO_FINISH_EVENT = 'videofinish';

	/**
	 * This function is responsible for changing video.
	 * @memberof VideoPlayer#
	 * @access public
	 * @param {object} options contain information regarding video details.
	 * @returns none
	 */

	VideoPlayer.prototype.changeVideo = function(options) {
		if (options !== undefined) {
			this.setLayout(options);
			this.setCuePoints(options);
			this.setSource(options);
			if (options.loop !== undefined) {
				if (options.loop === "true" || options.loop === true) {
					this.bloop = true;
				} else {
					this.bloop = false;
				}
			}
			this.video.load();
		}
	};

	/**
	 * This function is used to play video.
	 * @memberof VideoPlayer#
	 *@access public
	 * @param none
	 * @returns none
	 */

	VideoPlayer.prototype.play = function(options) {
		var self = this;
		this.videoState = 'play';
		if (this.bShowMediaControl) {
			this.objMediaPlayer.setState("play");

		}
		console.log(this.video.currentTime)
		clearTimeout(this.objTimeOut);
		this.objTimeOut = null;
		this.bPlayAfterLoad = false;
		this.bStopping = false;
		this.changeVideo(options);

		if (this.video !== null) {
			if (this.state < 0) {
				this.bPlayAfterLoad = true;
				this.objTimeOut = setTimeout(function() {
					if (self.state === 0) {
						self.video.load();
					} else {
						self.video.play();
					}
				}, 1000);
				//this.video.play();
			} else {
				this.video.play();
				this.customEventDispatcher(this.VIDEO_START_EVENT, this, this.video.currentTime);
			}
		}

	};
	VideoPlayer.prototype.resume = function() {
		this.videoState = 'play';
		this.play();
	};

	/**
	 * This function is used to pause video.
	 * @memberof VideoPlayer#
	 */
	VideoPlayer.prototype.pause = function() {
		if (this.bShowMediaControl) {
			this.objMediaPlayer.setState("pause");

		}
		this.videoState = 'pause';
		this.video.pause();
		console.log(this.video.currentTime)
		this.customEventDispatcher(this.VIDEO_PAUSE_EVENT, this, ((this.video !== null) ? this.video.currentTime : 0));
	};

	/**
	 * This function is used to stop video.
	 * @memberof VideoPlayer#
	 *@access public
	 * @param none
	 * @returns none
	 */

	VideoPlayer.prototype.stop = function() {
		this.videoState = 'stop';
		if (this.bShowMediaControl) {
			this.objMediaPlayer.setState("stop");

		}
		this.video.pause();
		console.log(this.video.currentTime)
		this.bStopping = true;
		try {
			this.video.currentTime = 0;
		} catch(e) {
			//
		}

		this.customEventDispatcher(this.VIDEO_STOP_EVENT, this, ((this.video !== null) ? this.video.currentTime : 0));
	};
	/**
	 * This function is used to change video volume.
	 * @memberof VideoPlayer#
	 *@access public
	 * @param Number
	 * @returns none
	 */

	VideoPlayer.prototype.changeVolume = function(vol) {
		this.video.volume = vol;
	};
	/**
	 * This function is used to videoseeking .
	 * @memberof VideoPlayer#
	 *@access public
	 * @param Number
	 * @returns none
	 */

	VideoPlayer.prototype.setTime = function(time) {
		var i;
		if (time <= this.video.duration && time >= 0) {
			this.bSeeking = true;
			this.video.currentTime = time;
			if (this.cuePoints === undefined) {
				return;
			}
			for ( i = 0; i < this.cuePoints.length; i += 1) {
				if (time * 1000 >= this.cuePoints[i]) {
					this.lastCuePoint = this.cuePoints[i];
				} else {
					break;
				}
			}
		}
	};
	/**
	 * This function is used to get video current seek value .
	 * @memberof VideoPlayer#
	 *@access public
	 * @param none
	 * @returns none
	 */
	VideoPlayer.prototype.getTime = function() {
		return this.video.currentTime;
	};
	/**
	 * This function is used to get video duration .
	 * @memberof VideoPlayer#
	 *@access public
	 * @param none
	 * @returns none
	 */
	VideoPlayer.prototype.getDuration = function() {
		return this.video.duration;
	};
	/**
	 * This function is used to destroy.
	 * @memberof VideoPlayer#
	 * @access public
	 * @param none
	 * @returns {Boolean} true or false
	 */

	VideoPlayer.prototype.destroy = function() {

		//Second parameter passed to support in firefox
		this.video.removeEventListener("loadstart", $.proxy(this.loadstart, this));
		this.video.removeEventListener("ended", $.proxy(this.ended, this));
		this.video.removeEventListener("loadedmetadata", $.proxy(this.loadedmetadata, this));
		this.video.removeEventListener("canplay", $.proxy(this.canplay, this));
		this.video.removeEventListener("timeupdate", $.proxy(this.timeupdate, this));
		//End //Second parameter passed to support in firefox
		this.unregisterMedia();
		this.video = null;
		return this.__super__.prototype.destroy(true);
	};
	return VideoPlayer;
});
