/*jslint nomen: true*/
/*globals console,_,initAnimationPlayer,checkOptionsPropertyDetails,initializePlayerValue,_nMilPerSec,_nYpos, $*/

/**
 * AnimationPlayer
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/base/base-media-player', 'player/controllers/audio-controller', 'components/animationplayer/model'], function(Marionette, BaseMediaPlayer, AudioController, Model) {
	'use strict';

	/**
	 * A class representing an AnimationPlayer.
	 * An Animation player plays a sprite at the speed of 12 frames/second to make it look like an animation. Animation player can also play audio files in synch with the provided sprite.
	 * Developer can play, pause, resume, stop the animation and audio during runtime with the provided public APIs. For the complete listing of public APi's please refer API documentation below.
	 *
	 *@class AnimationPlayer
	 *@augments BaseItemComp
	 *@param {Object} objParams An object specifying the div for animation and width of sprite.
	 *@example
	 *
	 * Html:
	 * &#60;div id="animContainer1" class="animationStyle"&#62;&#60;/div&#62;
	 *
	 * CSS:
	 * .animationStyle{
	 * width: 120px;
	 * height: 164px;
	 * position: absolute;
	 * background-image: url("../mole.png");
	 * }
	 *
	 * Javascript:
	 * var objAnimationPlayer, objData;
	 * objData = new Object();
	 * objData.animationDiv = $("#animContainer1");
	 * objData.spriteWidth = "1200";
	 * objData.audioFilePath = "activity/sampleAnimationAudioPlayer/data/audio/Audio.mp3";
	 * objData.audioLoop = true;
	 *
	 * this.getComponent(this, "animationPlayer", "onComponentCreated", objData);
	 *
	 * function onComponentCreated(objComp){
	 * var bLoop = false;
	 * objAnimationPlayer = objComp;
	 * objAnimationPlayer.play(bLoop);
	 * }
	 *
	 * <br>Configurable properties of component:<br>
	 * <table border="1" style="white-space:pre-wrap; color:"#000000";"><tr><th>Property</th><th>Type</th><th>Default Value</th><th>Description</th></tr><tr><td>animationDiv</td><td>Jqeury Object</td><td>undefined</td><td>This property contains the reference of div or region which will contain the animation player.<br><br>This property is mandatory and should be provided during component creation.</td></tr><tr><td>spriteWidth</td><td>Number</td><td>0</td><td>This property defines the width of the sprite which will be shown by the the component </td></tr><tr><td>audioFilePath</td><td>String</td><td>undefined</td><td>This property defines the url of the audio to played by the component.<br><br>This property is optional and developer can skip it. If no value is provided to the property then component will assume that it need not to play the audio.</td></tr><tr><td>audioLoop</td><td>Boolean</td><td>false</td><td>This property is used to define if audio to be played in loop or not.</td></tr></table>
	 */
	var AnimationPlayer = /** @lends AnimationPlayer.prototype */
	BaseMediaPlayer.extend({
		/**
		 * Initialize values.
		 * @access private
		 * @memberof AnimationPlayer
		 * @param {object} objParams This object has jqeury object and sprite width
		 * @returns None
		 */
		animationState : null,
		template : _.template('<div/>'),
		initialize : function(objParams) {
			this.initData();
			this.objData = objParams;
			//this property is being used in componentselector for editing.
			this._objParams = objParams;
			this.model = new Model(objParams);
			this.initBaseMediaPlayer(this, this.PlayerConstants.ANIMATION_MEDIA_PLAYER);
			this.componentType = "animation-player";
			if ( typeof this.objData.state === 'object') {
				this.setState(this.objData.state);
			}
		},
		onRender : function() {
			if (this._objParams.animationDiv) {
				this._animationContainer = $(this._animationContainer);
			} else {
				this._animationContainer = this.$el;
			}
			this._animationContainer.attr("class", this.model.get("styleClass"));
			if (this._objParams.bReverse !== undefined) {
				this._bReverse = (this._objParams.bReverse === "true" || this._objParams.bReverse === true) ? true : false;
			}
			if (this._objParams.spriteWidth) {
				this._spriteWidth = this._objParams.spriteWidth;
			} else {
				throw new Error("spriteWidth must be defined.....");
			}
			if (this._objParams.bLoop) {
				this._bLoop = (this._objParams.bLoop === "true" || this._objParams.bLoop === true) ? true : false;
			}

			this.setFps(this._objParams.fps);
			this.initAnimationPlayer(this._objParams);
			this.initAudioPlayer(this._objParams);
		},

		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		}
	});

	AnimationPlayer.prototype.initData = function() {

		this._nCurrentFrame = 1;
		this._nCurrentRow = 1;
		this._nStartRow = 1;
		this._nEndRow = 1;
		this._idTimeOut = 0;
		this._objParams = null;
		this._bLoop = false;
		this._nTotalFrame = 0;
		this._animationContainer = undefined;
		this._framePerSecond = 12;
		this._width = 0;
		this._height = 0;
		this._startFrame = 1;
		this._endFrame = 1;
		this._spriteWidth = 0;
		this._nInterval = 0;
		this._nYpos = 0;
		this._nMilPerSec = 1000;
		this._bReverse = false;
		this._bAudioLoaded = false;
		this._bAudioRequired = false;
		this._bAnimationPlayingInitiated = false;
		this._objAudioData = {};

	};

	AnimationPlayer.prototype.initAnimationPlayer = function(objParams) {
		this._width = this._animationContainer.width();
		this._height = this._animationContainer.height();
		this._nTotalFrame = Math.round(this._spriteWidth / this._width);

		if (this._bReverse) {
			this._endFrame = 1;
			this._nCurrentFrame = this._nTotalFrame;
			this._startFrame = this._nTotalFrame;
		} else {
			this._startFrame = 1;
			this._nCurrentFrame = 1;
			this._endFrame = this._nTotalFrame;
		}

		if (this.bEditor === false) {
			$(this._animationContainer).off("click").on("click", $.proxy(this.compClick, this));
			$(this._animationContainer).off("mouseover").on("mouseover", $.proxy(this.compRollover, this));
			$(this._animationContainer).off("mouseout").on("mouseout", $.proxy(this.compRollout, this));
		}
	};

	AnimationPlayer.prototype.initAudioPlayer = function(objParams) {
		var objThis = this;
		if (objParams.audioFilePath !== undefined) {
			this._bAudioRequired = true;
			this._objAudioData.strPath = objParams.audioFilePath;
			this._objAudioData.bLoop = this._bLoop;
			this._objAudioData.strTrack = this.cid;
			this._objAudioData.onStart = function() {
				objThis.onAudioStart();
			};
			this._objAudioData.onFinish = function() {
				objThis.onAudioFinish();
			};
		} else {
			this._bAudioRequired = false;
		}
	};

	AnimationPlayer.prototype.loadAudioFile = function() {
		AudioController.getInstance().playAudio(this._objAudioData);
	};

	AnimationPlayer.prototype.onAudioStart = function() {
		this._bAudioLoaded = true;
		this.play();
	};

	AnimationPlayer.prototype.onAudioFinish = function() {
		console.log("audio finish callback");
	};

	AnimationPlayer.prototype.playAnimation = function() {
		var spritePosition, bAnimationFinish, objThis = this;
		bAnimationFinish = false;
		clearTimeout(objThis._idTimeOut);

		spritePosition = objThis._width * (objThis._nCurrentFrame - 1);
		if (objThis._nCurrentRow > 0) {
			this._nYpos = (objThis._nCurrentRow - 1) * this._height;
		}
		spritePosition = String(("-" + spritePosition + "px") + (" -" + this._nYpos + "px"));

		objThis.customEventDispatcher("animationProgress", objThis, objThis._nCurrentFrame);
		objThis.customEventDispatcher("animationProgress_", objThis, objThis._nCurrentFrame);
		objThis.trigger(objThis.ANIMATION_PROGRESS, objThis._nCurrentFrame);
		objThis._animationContainer.css("background-position", spritePosition);

		if (objThis._nCurrentFrame === objThis._endFrame) {

			bAnimationFinish = true;
			objThis._nCurrentFrame = objThis._startFrame - 1;
			/*jslint plusplus: true*/
			if (objThis._nCurrentRow !== objThis._nEndRow) {
				if (this._bReverse) {
					objThis._nCurrentRow--;
				} else {
					objThis._nCurrentRow++;
				}
				bAnimationFinish = false;
			}

		}
		if (bAnimationFinish) {
			objThis._nCurrentRow = objThis._nStartRow;
			objThis.customEventDispatcher("animationFinished", objThis, objThis._nCurrentFrame);
			objThis.customEventDispatcher("animationFinished_", objThis, objThis._nCurrentFrame);
			//objThis.trigger(objThis.ANIMATION_FINISHED, objThis._nCurrentFrame);
			if (!objThis._bLoop) {
				if (objThis._bAudioRequired) {
					AudioController.getInstance().stopAudio(this._objAudioData.strTrack);
				}
				clearTimeout(objThis._idTimeOut);
				return;
			}
		}
		/*jslint plusplus: true*/
		if (this._bReverse) {
			objThis._nCurrentFrame--;
		} else {
			objThis._nCurrentFrame++;
		}
		objThis.playNextFrame();
	};

	AnimationPlayer.prototype.playNextFrame = function() {
		var objThis = this;
		objThis._idTimeOut = setTimeout(function() {
			objThis.playAnimation(objThis);
		}, objThis._nInterval);
	};

	AnimationPlayer.prototype.compClick = function() {
		this.customEventDispatcher("compClick", this);
		this.customEventDispatcher("click", this);
	};
	AnimationPlayer.prototype.compRollover = function(bSelect) {
		this.customEventDispatcher("compRollover", this);
		this.customEventDispatcher("mouseover", this);
	};
	AnimationPlayer.prototype.compRollout = function(bSelect) {
		this.customEventDispatcher("compRollout", this);
		this.customEventDispatcher("mouseout", this);
	};

	/**
	 * This is progress event, which will be  triggered on each frame.
	 * @memberof AnimationPlayer#
	 * @access private
	 * @const ANIMATION_PROGRESS
	 */
	AnimationPlayer.prototype.ANIMATION_PROGRESS = 'animationProgress';

	/**
	 * This event will be triggered on animation complete.
	 * @memberof AnimationPlayer#
	 * @access private
	 * @const ANIMATION_FINISHED
	 */

	AnimationPlayer.prototype.ANIMATION_FINISHED = 'animationFinished';

	/**
	 * For calling parent class.
	 * @memberof AnimationPlayer#
	 * @access private
	 */

	AnimationPlayer.prototype.__super__ = BaseMediaPlayer;

	AnimationPlayer.prototype.hide = function() {
		if (this._animationContainer) {
			$(this._animationContainer).hide();
		}
	};

	AnimationPlayer.prototype.show = function() {
		if (this._animationContainer) {
			$(this._animationContainer).show();
		}
	};

	AnimationPlayer.prototype.toggle = function() {
		if (this._animationContainer) {
			$(this._animationContainer).toggle();
		}
	};

	/**
	 * This function is responsible for playing anaimation
	 * @memberof AnimationPlayer#
	 * @access public
	 * @param {boolean} bLoop check looping.
	 * @param {number} startFrame start frame number.
	 * @param {number} endFrame end frame number.
	 * @returns None
	 */

	AnimationPlayer.prototype.play = function(bLoop, startFrame, endFrame, startRow, endRow) {
		if (this.bEditor === true) {
			return;
		}
		if (startFrame) {
			if ((startFrame > this._nTotalFrame) || (this.startFrame < 1)) {
				console.error("Start frame should not be less than 1 or greater than total frames...");
			}
			this._startFrame = startFrame;
			this._nCurrentFrame = startFrame;
		}

		if (endFrame) {
			if ((this._endFrame > this._nTotalFrame) || (this._endFrame < 1)) {
				console.error("End frame should not be less than 1 or greater than total frames...");
			}
			this._endFrame = endFrame;
		}

		if (startFrame && endFrame) {
			if (this._startFrame > this._endFrame) {
				this._bReverse = true;
			} else {
				this._bReverse = false;
			}
		}

		if (startRow !== undefined) {
			this._nStartRow = startRow;
			this._nCurrentRow = startRow;
		}

		if (endRow !== undefined) {
			this._nEndRow = endRow;
		}

		if (startRow && endRow) {
			if (this._nStartRow > this._nEndRow) {
				this._bReverse = true;
				if (this._startFrame < this._endFrame) {
					this._nCurrentFrame = this._endFrame;
					this._endFrame = this._startFrame;
					this._startFrame = this._nCurrentFrame;
				}
				//alert("---");
			} else {
				this._bReverse = false;
				if (this._startFrame > this._endFrame) {
					this._nCurrentFrame = this._endFrame;
					this._endFrame = this._startFrame;
					this._startFrame = this._nCurrentFrame;
				}
				//alert("+++");
			}
		}

		if (bLoop !== undefined) {
			this._bLoop = (bLoop === "true" || bLoop === true) ? true : false;
		}

		if (this._bAudioRequired && !this._bAudioLoaded) {
			this._bAnimationPlayingInitiated = true;
			this.loadAudioFile();
		} else {

			if (this._bAudioRequired && this._bAudioLoaded) {
				this.resume();
				return;
			}
			clearTimeout(this._idTimeOut);
			this.playNextFrame();

		}
		this.animationState = 'play';

	};

	AnimationPlayer.prototype.getState = function() {
		var prepareData = {};
		prepareData['currentFrame'] = this._nCurrentFrame;
		prepareData['state'] = this.animationState;
		return prepareData;
	};

	AnimationPlayer.prototype.setState = function(prepareData) {
		if ( typeof prepareData === 'object') {
			if ( typeof prepareData.currentTime !== undefined  && typeof prepareData.state !== undefined && typeof prepareData.state !== null) {
				this._nCurrentFrame = prepareData.currentFrame;
				switch(prepareData.state) {
				case 'play':
					this.play();
					break;
				case 'stop':
					this.gotoAndStop(this._nCurrentFrame);
					break;
				}
			}
		}
	};

	/**
	 * This function is responsible for pausing anaimation
	 * @memberof AnimationPlayer#
	 * @access public
	 * @param None
	 * @returns None
	 */

	AnimationPlayer.prototype.pause = function() {
		clearTimeout(this._idTimeOut);
		if (this._bAudioRequired && this._bAudioLoaded) {
			AudioController.getInstance().pauseAudio(this._objAudioData.strTrack);
		}
		this.animationState = 'stop';

	};

	/**
	 * This function is responsible for pausing anaimation
	 * @memberof AnimationPlayer#
	 * @access public
	 * @param None
	 * @returns None
	 */

	AnimationPlayer.prototype.resume = function() {

		this.playAnimation(this);
		this.animationState = 'play';
		if (this._bAudioRequired && this._bAudioLoaded) {
			AudioController.getInstance().resumeAudio(this._objAudioData.strTrack);
		}

	};

	/**
	 * This function is responsible to stop anaimation
	 * @memberof AnimationPlayer#
	 * @access public
	 * @param None
	 * @returns None
	 */

	AnimationPlayer.prototype.stop = function() {
		clearTimeout(this._idTimeOut);
		if (this._bAudioRequired && this._bAudioLoaded) {
			AudioController.getInstance().stopAudio(this._objAudioData.strTrack);
		}
		this.animationState = 'stop';
		this._nCurrentFrame = 1;
		//this._bLoop = false;
		this._startFrame = 1;

		if (this._bReverse) {
			this._nCurrentFrame = this._nTotalFrame;
			this._startFrame = 1;
		}
	};

	/**
	 * This function is used to provide frame rate per second.
	 * @memberof AnimationPlayer#
	 * @access public
	 * @param {object} nFPS to provide frame rate per second.
	 * @returns None
	 */

	AnimationPlayer.prototype.setFps = function(nFPS) {
		if (nFPS !== undefined) {
			this._framePerSecond = parseInt(nFPS);
		}
		this._nInterval = Math.round(this._nMilPerSec / this._framePerSecond);
	};

	AnimationPlayer.prototype.getFps = function() {
		return this._framePerSecond;
	};

	/**
	 * For getting current frame
	 * @memberof AnimationPlayer#
	 * @access public
	 * @param None
	 * @returns {number} Get current frame number.
	 */

	AnimationPlayer.prototype.getCurrentFrame = function() {
		return this._nCurrentFrame;
	};

	/**
	 * For getting current row
	 * @memberof AnimationPlayer#
	 * @access public
	 * @param None
	 * @returns {number} Get current row number.
	 */

	AnimationPlayer.prototype.getCurrentRow = function() {
		return this._nCurrentRow;
	};

	/**
	 * This function is responsible to stop Animation at particular frame
	 * @memberof AnimationPlayer#
	 * @access public
	 * @param {number} nFrame provide frame number.
	 * @returns None
	 */

	AnimationPlayer.prototype.gotoAndStop = function(nFrame, row) {

		clearTimeout(this._idTimeOut);
		this._nCurrentFrame = nFrame;

		var spritePosition = this._width * (this._nCurrentFrame - 1);

		if (row !== undefined) {
			this._nYpos = this._width * row;
		}

		spritePosition = String(("-" + spritePosition + "px") + (" -" + this._nYpos + "px"));

		this._animationContainer.css("background-position", spritePosition);
	};

	/**
	 * For getting total frames
	 * @memberof AnimationPlayer#
	 * @access public
	 * @param None
	 * @returns {number} Get total frames number.
	 */

	AnimationPlayer.prototype.getTotalFrames = function() {
		return this._nTotalFrame;
	};

	AnimationPlayer.prototype.changeSprite = function(objParams) {
		_.extend(this._objParams, objParams);
		this.model = new Model(this._objParams);
		this.render();
	};

	/**
	 * This function is responsible to destroy data.
	 * @memberof AnimationPlayer#
	 * @access public
	 * @param None
	 * @returns {Boolean} True or false
	 */

	AnimationPlayer.prototype.destroy = function() {
		this.unregisterMedia();
		clearTimeout(this._idTimeOut);
		if (this._bAudioRequired && this._bAudioLoaded) {
			AudioController.getInstance().stopAudio(this._objAudioData.strTrack, true);
		}

		return this.__super__.prototype.destroy(true);
	};

	return AnimationPlayer;
});
