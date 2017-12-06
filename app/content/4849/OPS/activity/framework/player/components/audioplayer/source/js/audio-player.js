/*jslint nomen: true*/
/*globals console,_,$*/
/**
 * AudioPlayer
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['marionette', 'player/base/base-media-player', 'components/audioplayer/source/js/audio-player-model'],

/**
 * A component depicts the audio player.
 * Developer can provide it the url of default source file of audio with the url of fallback audio.
 * Also if a audio is allowed to play in loop can also be configured along with its controls.
 * Component also provide some public API's e.g. play, pause, stop etc. to contorl the component during runtime.
 *
 *@class AudioPlayer
 *@augments BaseMediaPlayer
 *@param {Object} obj An object with 'path'and 'loop' properties.
 *@example
 *
 * var audioPlayerComp,audioPlayerConfig = {
 *						source:
 *						[
 *							{path: 'activity/sampleVideoPlayer/video/Ratio.mp3', type: 'mp3'},
 *						],
 *						loop: true
 *				};

 this.getComponent(this, "AudioPlayer", "onComponentCreationComplete", audioSource);
 *
 * function onComponentCreated(objComp){
 *  audioPlayerComp = objComp;
 *	audioPlayerComp.play();
 * }
 * <br>Configurable properties of component:<br>
 * <table border="1" style="white-space:pre-wrap; color:"#000000";"><tr><th>Property</th><th>Type</th><th>Default Value</th><th>Description</th></tr><tr><td>source</td><td>Object</td><td>{}</a></td><td>Contains the source for the audio file.</td></tr><tr><td>loop</td><td>Boolean</td><td>false</td><td>This property defines if the video to be played in loop.</td></tr></table>
 *
 *
 */
function(Marionette, BaseMediaPlayer, AudioPlayerModel) {
	'use strict';

	var AudioPlayer = /** @lends AudioPlayer.prototype */
	BaseMediaPlayer.extend({

		template : _.template(""),

		/**
		 * This function initializes the component
		 * @access private
		 * @memberof AudioPlayer
		 * @param {Object} options Conatins the data to configure the component
		 * @returns None
		 */
		initialize : function(options) {
			this.objData = options;//this property is being used in componentselector for editing.
			this.members = {
				tag : undefined,
				ui_play : undefined,
				ui_pause : undefined,
				ui_stop : undefined,
				ui_seekBar : undefined,
				ui_display : undefined,
				ui_volume : undefined,
				ui_volumeBar : undefined,
				objSeekBar : undefined,
				objVolumeBar : undefined,
				constants : undefined,

				totalDuration : 0,
				currentTime : 0,
				isPlaying : false,
				isPaused : false,
				currentVolume : 1,
				isVolumeChanging : false,
				endTime : undefined,
				bready : false

			};
			this.members.tag = null;
			this.model = new AudioPlayerModel();
			if (options !== undefined) {
				if (options.loop !== undefined) {
					this.model.set('loop', options.loop);
				}
				if (options.source !== undefined) {
					this.model.set('data', options.source);
				}

				if (options.ui !== undefined) {
					this.model.set('withUi', options.ui);
					if (options.context !== undefined) {
						this.members.base_activity = options.context;
					}
				}

				/**
				 * Check for availability of cuepoints and store it.
				 */
				this.storeCuePoints(options);

				this.members.tag = document.createElement("audio");
				this.setSource(this.model.get('data'));
				this.applyAudioEvents();
			}
			this.componentType = "audio";
			this.initBaseMediaPlayer(this, this.PlayerConstants.AUDIO_MEDIA_PLAYER);
		},
		storeCuePoints : function(options) {
			/**
			 * Check for availability of cuepoints and store it.
			 */
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
		},

		setSource : function(objSrc) {
			var i, type, tag;
			tag = this.members.tag;
			if ( objSrc instanceof Array) {
				for ( i = 0; i < objSrc.length; i += 1) {

					if (objSrc[i].type === 'mp3') {
						if (tag.canPlayType('audio/mpeg;')) {
							tag.setAttribute("src", objSrc[i].path);
							break;
						}
					} else if (objSrc[i].type === 'ogg') {
						if (tag.canPlayType('audio/ogg;')) {
							tag.setAttribute("src", objSrc[i].path);
							break;
						}
					}
				}
			} else {
				tag.setAttribute("src", objSrc);
			}
		},

		applyAudioEvents : function() {
			var m, self, tag;
			self = this;
			m = self.members;
			tag = m.tag;

			if (tag === undefined) {
				return;
			}

			tag.loadStart = function() {
				this.addEventListener('canplay', tag.canPlay);
				this.addEventListener('loadedmetadata', tag.metaLoaded);
			};

			tag.metaLoaded = function() {
				this.removeEventListener('loadedmetadata', tag.metaLoaded);
				m.totalDuration = this.duration;
				m.currentTime = 0;
				self.updatePlayerUIValues();
			};

			tag.canPlay = function() {
				this.removeEventListener('canplay', tag.canPlay);
				this.volume = m.currentVolume;
				self.customEventDispatcher("readyToPlay", self, this.duration);
				if (m.bready) {
					m.bready = false;
					self.play();
				}
			};

			tag.timeUpdate = function() {
				self.customEventDispatcher(self.AUDIO_PROGRESS_EVENT, self, this.currentTime);

				if (self.hasCuePoints) {
					self.cuePointEventDispatcher(self, this.currentTime);
				}

				m.currentTime = this.currentTime;
				self.updatePlayerUIValues();
				if (m.endTime) {
					if (m.endTime <= m.currentTime) {
						self.customEventDispatcher(self.AUDIO_FINISH_EVENT, self, this.currentTime);
						self.pause();
					}
				}
			};

			tag.audioEnded = function() {
				self.customEventDispatcher(self.AUDIO_FINISH_EVENT, self, this.currentTime);
				this.currentTime = 0;
				m.currentTime = 0;

				if (self.model.get('loop')) {
					this.volume = m.currentVolume;
					self.play();
					return;
				}

				self.stop();
			};

			tag.addEventListener("loadstart", tag.loadStart);
			tag.addEventListener("ended", tag.audioEnded);
			tag.addEventListener("timeupdate", tag.timeUpdate);
		},

		/**
		 * This function is called when component is shown in the DOM
		 * @access private
		 * @memberof AudioPlayer
		 * @param none
		 * @returns none
		 */
		onShow : function() {
			if (this.model.get("withUi")) {
				this.showUi();
			}
			//this.members.tag.load();
		},

		onPlayerResizeEvent : function() {
			var self, m;
			self = this;
			m = this.members;
			if (m.objSeekBar) {
				m.objSeekBar.setStageScaleValue(this.getStageScaleValue());
			}
			if (m.objVolumeBar) {
				m.objVolumeBar.setStageScaleValue(this.getStageScaleValue());
			}
		},

		showUi : function() {
			var self, m;
			self = this;
			m = this.members;
			m.ui_play = $("<div class='play'></div>");
			m.ui_pause = $("<div class='pause'></div>");
			m.ui_stop = $("<div class='stop'></div>");
			m.ui_display = $("<div class='display'></div>");
			m.ui_volume = $("<div class='volume'></div>");

			require(['css!components/audioplayer/source/css/audio-player.css', 'components/slider/slider', 'components/slider/js/sliderconst'], function(CSS, Slider, SliderConstant) {
				m.constants = SliderConstant;
				self.createSliders(Slider, SliderConstant);
			});
		},

		createSliders : function(Slider, SliderConstants) {
			var obj, self, m, tmpbar;
			self = this;
			m = this.members;
			obj = {};
			tmpbar = $("<div class='seekbarSlider' style='visibility:hidden;'></div>");
			this.$el.append(tmpbar);
			obj.sliderLength = parseFloat(tmpbar.css('width'));
			if (obj.sliderLength === 0) {
				obj.sliderLength = 100;
			}
			tmpbar.remove();
			obj.allignment = SliderConstants.CONSTANTS.HORIZONTAL;
			obj.sliderWrapperStyle = "seekbarSlider";

			m.objSeekBar = new Slider(obj);
			m.objSeekBar.render();
			m.ui_seekBar = m.objSeekBar.$el;

			obj = {};
			tmpbar = $("<div class='volumebarSlider' style='visibility:hidden;'></div>");
			this.$el.append(tmpbar);
			obj.sliderLength = parseFloat(tmpbar.css('height'));
			if (obj.sliderLength === 0) {
				obj.sliderLength = 100;
			}
			tmpbar.remove();
			obj.allignment = SliderConstants.CONSTANTS.VERTICAL;
			obj.sliderWrapperStyle = "volumebarSlider";

			m.objVolumeBar = new Slider(obj);
			m.objVolumeBar.render();
			m.ui_volumeBar = m.objVolumeBar.$el;

			this.$el.append(m.ui_play);
			this.$el.append(m.ui_pause);
			this.$el.append(m.ui_stop);
			this.$el.append(m.ui_seekBar);
			this.$el.append(m.ui_display);
			this.$el.append(m.ui_volume);
			m.ui_volume.append(m.ui_volumeBar);

			m.objSeekBar.configureView(m.objSeekBar);
			m.objVolumeBar.configureView(m.objVolumeBar);
			m.objSeekBar.setStageScaleValue(this.getStageScaleValue());
			m.objVolumeBar.setStageScaleValue(this.getStageScaleValue());

			self.decorateUi();
		},
		decorateUi : function() {
			var m;
			m = this.members;
			m.ui_volumeBar.css("width", "100%");
			m.ui_volumeBar.css("height", "100%");
			m.ui_seekBar.css("width", "100%");
			m.ui_seekBar.css("height", "100%");
			m.ui_volumeBar.hide();
			this.applyUiEvents();
			this.updatePlayerUIValues();
		},
		applyUiEvents : function() {
			var m, self;
			m = this.members;
			self = this;

			m.objSeekBar.on(m.constants.EVENTS.SLIDING_STARTED, function(data) {
				m.tag.pause();
			});
			m.objSeekBar.on(m.constants.EVENTS.SLIDING_IN_PROGRESS, function(data) {
				//console.log('*SeekingContinues*' + data);
			});
			m.objSeekBar.on(m.constants.EVENTS.SLIDING_STOPPED, function(data) {
				m.tag.currentTime = data * m.totalDuration / 100;
				if (self.members.isPlaying) {
					m.tag.play();
				}
			});

			m.objVolumeBar.on(m.constants.EVENTS.SLIDING_STARTED, function(data) {
				m.isVolumeChanging = true;
				m.tag.volume = data / 100;
				m.currentVolume = data / 100;
			});
			m.objVolumeBar.on(m.constants.EVENTS.SLIDING_IN_PROGRESS, function(data) {
				m.isVolumeChanging = true;
				m.tag.volume = data / 100;
				m.currentVolume = data / 100;
			});
			m.objVolumeBar.on(m.constants.EVENTS.SLIDING_STOPPED, function(data) {
				m.isVolumeChanging = false;
				m.tag.volume = data / 100;
				m.currentVolume = data / 100;
			});

			m.ui_play.on("click", this.uiPlay.bind(this));
			m.ui_pause.on("click", this.uiPause.bind(this));
			m.ui_stop.on("click", this.uiStop.bind(this));

			m.ui_volume.on("click", function() {
				m.ui_volumeBar.toggle();
			});
			m.ui_volume.on("mouseover", function() {
				m.ui_volumeBar.show();
			});
			m.ui_volume.on("mouseout", function() {
				m.ui_volumeBar.hide();
			});

		},

		uiPlay : function() {
			this.play();
		},

		uiPause : function() {
			this.pause();
		},

		uiStop : function() {
			this.stop();
		},

		updatePlayerUIValues : function() {
			var m, strTime;
			m = this.members;
			if (m.objVolumeBar && !m.isVolumeChanging) {
				m.objVolumeBar.setCurrentPosition(m.currentVolume * 100);
			}
			if (m.objSeekBar) {
				m.objSeekBar.setCurrentPosition((m.currentTime / m.totalDuration) * 100);
			}
			if (m.ui_display && m.ui_display.length) {
				strTime = (m.currentTime).toFixed(2).toString();
				if (strTime.length < 5) {
					strTime = "0" + strTime;
				}
				m.ui_display.text(strTime);
			}
			if (m.ui_play) {
				if (m.isPlaying) {
					m.ui_play.addClass('active');
				} else {
					m.ui_play.removeClass('active');
				}
			}
			if (m.ui_pause) {
				if (m.isPaused) {
					m.ui_pause.addClass('active');
				} else {
					m.ui_pause.removeClass('active');
				}
			}

		}
	});

	/**
	 * Set the super to BaseMediaPlayer
	 * @access private
	 * @memberof AudioPlayer#
	 */
	AudioPlayer.prototype.__super__ = BaseMediaPlayer;

	_.extend(AudioPlayer.prototype, /** @lends AudioPlayer.prototype */
	{

		/**
		 * Audio start Event constant.
		 * @const
		 * @type {string}
		 * @memberof AudioPlayer#
		 * @access public
		 */
		AUDIO_START_EVENT : 'audiostart',

		/**
		 * Audio pause Event constant.
		 * @const
		 * @type {string}
		 * @memberof AudioPlayer#
		 * @access public
		 */
		AUDIO_PAUSE_EVENT : 'audiopause',

		/**
		 * Audio progress Event constant.
		 * @const
		 * @type {string}
		 * @memberof AudioPlayer#
		 * @access public
		 */
		AUDIO_PROGRESS_EVENT : 'audioprogress',

		/**
		 * Audio stop Event constant.
		 * @const
		 * @type {string}
		 * @memberof AudioPlayer#
		 * @access public
		 */
		AUDIO_STOP_EVENT : 'audiostop',

		/**
		 * Audio finish Event constant.
		 * @const
		 * @type {string}
		 * @memberof AudioPlayer#
		 * @access public
		 */
		AUDIO_FINISH_EVENT : 'audiofinish',

		/**
		 * Changes the current Audio.
		 * @param {object}options The source of new audio
		 * @memberof AudioPlayer#
		 * @access public
		 * @returns None
		 */
		changeAudio : function(options) {
			this.model.set('data', options.source);
			this.model.set('loop', options.loop);
			this.stop();
			this.members.bready = false;
			if (options.playOnReady === true) {
				this.members.bready = true;
			}
			this.setSource(this.model.get('data'));
			this.storeCuePoints(options);

		},

		playAudio : function() {
			//console.log('play audio!', this.members.isPlaying);
			//if (!device.tablet()) {

			this.play();
			//}
		},

		/**
		 * Plays the audio file provided.
		 * @memberof AudioPlayer#
		 * @access public
		 * @param None
		 * @returns None
		 */
		play : function(startTime, endTime) {
			this.members.bready = false;
			this.members.endTime = undefined;
			if (startTime) {
				this.setCurrentTime(startTime);
				if (endTime) {
					if (endTime > startTime) {
						this.members.endTime = endTime;
					}
				}
			}

			this.members.isPlaying = true;
			this.members.isPaused = false;
			this.members.tag.play();
			this.customEventDispatcher(this.AUDIO_START_EVENT, this);
		},

		resume : function() {
			this.play();
		},

		/**
		 * Pauses the audio file provided.
		 * @memberof AudioPlayer#
		 * @access public
		 * @param None
		 * @returns None
		 */
		pause : function() {
			if (this.members.isPlaying) {
				this.members.isPlaying = false;
				this.members.isPaused = true;
				this.members.tag.pause();
				this.customEventDispatcher(this.AUDIO_PAUSE_EVENT, this);
			}
		},

		/**
		 * Stops the playback of audio file provided.
		 * @memberof AudioPlayer#
		 * @access public
		 * @param None
		 * @returns None
		 */
		stop : function() {
			if (this.members.isPlaying) {
				this.members.isPlaying = false;
				this.members.isPaused = false;
				try {
					this.members.tag.pause();
					this.members.tag.currentTime = 0;
				} catch(e) {

				}

				this.customEventDispatcher(this.AUDIO_STOP_EVENT, this);
			}
		},

		/**
		 * Sets the current time
		 * @param {Integer}time Sets the currentTime for the audio clip.
		 * @memberof AudioPlayer#
		 * @access public
		 * @returns None
		 */
		setCurrentTime : function(time) {
			this.members.tag.currentTime = time;
			this.members.currentTime = time;
		},

		/**
		 * Gets the current time
		 * @param None
		 * @memberof AudioPlayer#
		 * @access public
		 * @returns {int}
		 */
		getCurrentTime : function() {
			return this.members.tag.currentTime;
		},

		/**
		 * Sets the volume of the audio clip.
		 * @memberof AudioPlayer#
		 * @access public
		 * @param {Integer}nVolume Sets the volume for the audio clip.
		 * @returns {int}
		 */
		setVolume : function(nVolume) {
			this.members.tag.volume = nVolume;
			this.members.currentVolume = nVolume;
		},

		/**
		 * Gets the volume of the audio clip.
		 * @memberof AudioPlayer#
		 * @access public
		 * @param None
		 * @returns {Integer} Volume of the audio clip.
		 */
		getVolume : function() {
			return this.members.tag.volume;
		},

		/**
		 * This functions destroys the component
		 * @memberof AudioPlayer#
		 * @access public
		 * @param None
		 * @returns {Boolean} True or false
		 */
		destroy : function() {
			this.unregisterMedia();
			var m = this.members;
			this.stop();
			m.tag.removeEventListener("loadstart", m.tag.loadStart);
			m.tag.removeEventListener("ended", m.tag.audioEnded);
			m.tag.removeEventListener("timeupdate", m.tag.timeUpdate);
			m.tag.removeAttribute("src");

			if (this.model.get('withUi')) {
				m.ui_play.off("click");
				m.ui_pause.off("click");
				m.ui_stop.off("click");
				m.ui_volume.off("click");

				m.objSeekBar.off(m.constants.EVENTS.SLIDING_STARTED);
				m.objSeekBar.off(m.constants.EVENTS.SLIDING_IN_PROGRESS);
				m.objSeekBar.off(m.constants.EVENTS.SLIDING_STOPPED);
				m.objSeekBar.destroy();

				m.objVolumeBar.off(m.constants.EVENTS.SLIDING_STARTED);
				m.objVolumeBar.off(m.constants.EVENTS.SLIDING_IN_PROGRESS);
				m.objVolumeBar.off(m.constants.EVENTS.SLIDING_STOPPED);
				m.objVolumeBar.destroy();

			}
			this.model.destroy();
			m.tag = null;
			return this.__super__.prototype.destroy(true);
		}
	});

	return AudioPlayer;
});
