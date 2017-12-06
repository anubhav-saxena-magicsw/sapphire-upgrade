/*jslint nomen: true */
/*globals _,$,console,Backbone*/

define(['marionette', 'components/audioplayer/source/js/audio-player'],

/**
 * @class Button
 * @augments BaseItemComp
 * @param {Object} obj .
 */

function(Marionette, AudioPlayerComp) {
	'use strict';
	/**
	 * @class AudioHotspot
	 * Class 'AudioHotspot' extends the "audio-player" class with its features and is introduced to play an audio by
	 * calling the "play" function and replay it on the "click" event.
	 *
	 * AudioHotspot.prototype.play = function() {
	 this.stop();
	 this.AudiotHotspotSuper.prototype.play.call(this);
	 };
	 * User can provide the url of audio source file.
	 *
	 * This class has some extended features:
	 * 1) hidden:true - component is not visible and the user is not able to click on it.
	 * 2) hidden:false - audio plays, component is visible and the user is able to click on it.
	 *
	 * This class does not support any other component inside it.
	 */

	var AudioHotspot = AudioPlayerComp.extend({
		template : _.template('<div/>'),
		objData : null,
		counter : 0,
		audioState : null,

		/**
		 * This function initializes the component
		 * @access private
		 * @memberof AudioHotspot
		 * @param {Object} options Conatins the data to configure the component
		 * @returns None
		 */
		initialize : function(obj) {
			this.AudiotHotspotSuper.prototype.initialize.call(this, obj);
			this.objData = obj;//this property is being used in componentselector for editing.
			this.componentType = "audiohotspot";
			if ( typeof this.objData.state === 'object') {
				this.setState(this.objData.state);
			}
		},

		onRender : function() {
			//this.$el.addClass('glyphicon glyphicon-play');
			this.$el.addClass('');
			if (this.bEditor === false) {
				if (this.objData.hidden === false || this.objData.hidden === "false") {
					this.$el.addClass(this.objData.styleClass);
				} else {
					this.$el.css('display', 'none');
				}
			} else {
				$('.' + this.objData.styleClass).css('display', 'block');
			}
		},

		isValid : function(strCompType) {
			return false;
		},
		onShow : function() {
			this.$el.attr('id', this.getID());
			var self = this;
			if (this.bEditor === false) {
				this.$el.on("click", $.proxy(self.play, self));

			}
			if (this.objData.styleClass) {
				$(this.$el).addClass(this.objData.styleClass);
			}

			this.setLayout(this.objData);
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);

		}
	});
	
	
	AudioHotspot.prototype.getState = function() {
		var prepareData = {};
		prepareData['currentTime'] = this.getCurrentTime();
		prepareData['volume'] = this.getVolume();
		prepareData['state'] = this.audioState;
		return prepareData;
	};

	AudioHotspot.prototype.setState = function(prepareData) {
		if ( typeof prepareData === 'object') {
			if ( typeof prepareData.currentTime !== undefined && typeof prepareData.volume !== undefined && typeof prepareData.state !== undefined && typeof prepareData.state !== null ) {
				this.setCurrentTime(prepareData.currentTime);
				this.setVolume(prepareData.volume);
				switch(prepareData.state) {
				case 'play':
					this.play();
					break;
				case 'stop':
					this.stop();
					break;
				}
			}
		}
	};

	/**
	 * This function used to play the audio and replay it on the click event
	 * @access private
	 * @memberof AudioHotspot
	 * @param {Object} options Conatins the data to configure the component
	 * @returns None
	 */
	AudioHotspot.prototype.play = function() {
		
		if (this.members.isPlaying && (this.objData.hidden === false || this.objData.hidden === "false")) {
			this.stop();
		} else {
			this.stop();
			this.AudiotHotspotSuper.prototype.play.call(this);
		}
		if (this.objData.hidden === false || this.objData.hidden === "false") {
			this.setUIState();
		}
		this.audioState = 'play';
	};

	/**
	 * This function used to play the audio and replay it on the click event
	 * @access private
	 * @memberof AudioHotspot
	 * @param {Object} options Conatins the data to configure the component
	 * @returns None
	 */
	AudioHotspot.prototype.stop = function() {
		this.AudiotHotspotSuper.prototype.stop.call(this);
		if (this.objData && (this.objData.hidden === false || this.objData.hidden === "false")) {
			this.setUIState();
		}
		this.audioState = 'stop';
	};

	AudioHotspot.prototype.setUIState = function() {
		if (this.members.isPlaying) {
			this.$el.removeClass('glyphicon-play');
			this.$el.addClass('glyphicon-stop');
		} else {
			this.$el.removeClass('glyphicon-stop');
			this.$el.addClass('glyphicon-play');
		}
	};

	AudioHotspot.prototype.show = function() {
		this.$el.show();
	};
	
	AudioHotspot.prototype.disable = function() {
		this.$el.prop('disabled',true).css('pointer-events','none');
	};

	AudioHotspot.prototype.hide = function() {
		this.$el.hide();
	};

	/**
	 * This function used to set the layout of the component on the screen
	 * @access private
	 * @memberof AudioHotspot
	 * @param {Object} options Conatins the data to configure the component
	 * @returns None
	 */
	AudioHotspot.prototype.setLayout = function(options) {
		if (options.hasOwnProperty('outerDiv') && options.outerDiv !== undefined) {
			this.$el.addClass(options.outerDiv);
		} else {
			if (options.hasOwnProperty('width')) {
				this.$el.css("width", options.width);
			}
			if (options.hasOwnProperty('height')) {
				this.$el.css("height", options.height);
			}
			if (options.hasOwnProperty('margin')) {
				this.$el.css("margin", options.margin);
			}
		}

		if (options.hasOwnProperty('margin')) {
			$(this.objData).attr("margin", options.margin);
			this.$el.css("margin", options.margin);
		}
		if (options.hasOwnProperty('poster') && options.poster.length > 0) {
			$(this.objData).attr("poster", options.poster);
		}
		if (options.hasOwnProperty('controls') && options.controls !== undefined) {
			$(this.objData).attr("controls", "");
		}
	};

	AudioHotspot.prototype.AudiotHotspotSuper = AudioPlayerComp;

	/**
	 * To Destroy AudioHotspot component.
	 * @memberof AudioHotspot
	 * @param none objThis Intance of DndComp.
	 * @returns none.
	 */
	AudioHotspot.prototype.destroy = function() {
		this.stop();
		console.log(this.getCurrentTime());
		this.$el.off("click", $.proxy(this.compClick, this));
		this.objData = null;
		return this.AudiotHotspotSuper.prototype.destroy.call(this, true);
	};

	return AudioHotspot;
});

