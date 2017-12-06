/*jslint nomen: true*/
/*globals _, console */
/**
 * BaseMediaPlayer
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(['marionette', 'player/base/base-item-comp', 'player/constants/playerconst', 'player/controllers/media-controller'], function(Marionette, BaseItemComp, objConstant, MediaController) {'use strict';
	/**
	 * Intializes mediaplayer.
	 * Sets template = _.template(ActionButtomTemp);
	 * @constructor
	 * @requires player/base/BaseItemComp
	 * @augments BaseItemComp
	 * @access private
	 */
	var BaseMediaPlayer;

	/**
	 * Class 'BaseMediaPlayer' is the base class of all types of media. e.g AudioPlayer, VideoPlayer, this class work with MediaController to create
	 * a single area where a media object play its content and register itself, By this user can stop/start any type of media even they all are belongs
	 * to different media channel.
	 *
	 *@see 'MediaController' and 'MediaManager' for more details.
	 *@augments BaseItemComp.extend
	 *@example
	 * Load module
	 *
	 require(['player/base/BaseMediaPlayer'], function(BaseMediaPlayer) {
	 var audioMediaPlayer = BaseMediaPlayer.extend({
	 });

	 audioMediaPlayer.prototype.__super__ = BaseMediaPlayer;
	 audioMediaPlayer.prototype.destroy = function() {
	 return this.__super__.prototype.destroy(true);
	 };

	 return audioMediaPlayer;

	 *});
	 *
	 */
	BaseMediaPlayer = BaseItemComp.extend({
		objMediaControllers : MediaController.getInstance(),
		PlayerConstants : objConstant,
		isMediaPlayer : true,
		mediaPlayerType : "hello",
		MediaPlayerObject : undefined,
		isDestroyCalled : false,
		hasCuePoints : false,
		cuePoints : [],
		eventPrefix : "cuepoint_",
		orgCuePoints : null,
		nStageScale : 1,
		lastCuePoint : -1,
		bEditor : false
	});

	/**
	 * Method setStageScaleValue value will be called by the activity controller to set the current
	 * stage scale value.
	 * @memberof BaseItemComp#
	 * @access public
	 * @param {Number} value current stage scale value.
	 * @return none
	 */
	BaseMediaPlayer.prototype.setStageScaleValue = function(value) {
		this.nStageScale = value;
	};

	/**
	 * Return the current stage scale value.
	 * @memberof BaseItemComp#
	 * @access public
	 * @param none
	 * @return {Number} nStageScale Stage Scaled value.
	 */
	BaseMediaPlayer.prototype.getStageScaleValue = function() {
		return this.nStageScale;
	};

	/**
	 *initBaseActivity
	 *@param None
	 *@returns None
	 *@access public
	 *@memberof BaseMediaPlayer#
	 */
	BaseMediaPlayer.prototype.initBaseMediaPlayer = function(mediaObject, strType) {
		this.mediaPlayerType = strType;
		this.MediaPlayerObject = mediaObject;
	};

	/**
	 * Triggers the custom event
	 * @memberof BaseMediaPlayer#
	 * @access public
	 * @param {Object} strEvent contains the refernece of event
	 * @param {Object} context contains the context from where event will be dispatched
	 * @param {Object} data contains to be sent along with the event
	 * @return None
	 */
	BaseMediaPlayer.prototype.customEventDispatcher = function(strEvent, context, data) {
		var objEvent = {};
		objEvent.data = context;
		objEvent.customData = data;
		objEvent.target = context;
		objEvent.type = strEvent;
		context.trigger(strEvent, objEvent);
	};

	BaseMediaPlayer.prototype.setID = function(strID) {
		this.strCompId = strID;
		this.objMediaControllers.registerMedia(this.MediaPlayerObject, this.mediaPlayerType);
	};

	BaseMediaPlayer.prototype.setEventPrefix = function(str) {
		this.eventPrefix = str;
	};
	BaseMediaPlayer.prototype.cuePointEventDispatcher = function(context, data) {
		// TODO: Need to work here to update cue point array when audio gets seeked by end user
		var i, strEvent, currentCuePoint, currentTime;

		currentTime = data * 1000;

		for ( i = 0; i < this.cuePoints.length; i += 1) {
			if (currentTime >= this.cuePoints[i]) {
				currentCuePoint = this.cuePoints[i];
			} else {
				break;
			}
		}

		if (currentCuePoint && this.lastCuePoint !== currentCuePoint) {
			strEvent = this.eventPrefix + currentCuePoint;
			this.customEventDispatcher(strEvent, context, data);
			this.lastCuePoint = currentCuePoint;
			currentCuePoint = undefined;
		}
	};

	/**
	 * Plays media
	 * @memberof BaseMediaPlayer#
	 * @access public
	 * @param None
	 * @return None
	 */
	BaseMediaPlayer.prototype.playMeida = function() {
	};

	/**
	 * Pauses media
	 * @memberof BaseMediaPlayer#
	 * @access public
	 * @param None
	 * @return None
	 */
	BaseMediaPlayer.prototype.pauseMedia = function() {
	};

	/**
	 * Stops media
	 * @memberof BaseMediaPlayer#
	 * @access public
	 * @param None
	 * @return None
	 */
	BaseMediaPlayer.prototype.stopMedia = function() {
	};

	/**
	 * Resumes media
	 * @memberof BaseMediaPlayer#
	 * @access public
	 * @param None
	 * @return None
	 */
	BaseMediaPlayer.prototype.resume = function() {
	};

	/**
	 * For calling parent class.
	 * @memberof BaseMediaPlayer#
	 * @access private
	 */
	BaseMediaPlayer.prototype.__super__ = BaseItemComp;

	BaseMediaPlayer.prototype.unregisterMedia = function() {
		this.objMediaControllers.unregisterMedia(this.MediaPlayerObject, this.mediaPlayerType);
	};
	/**
	 * Destroy BaseMediaPlayer
	 * @param {Boolean} bChildDestroyed flag to check if childs are destroyed.
	 * @memberof BaseMediaPlayer#
	 * @access public
	 * @return {Boolean} true or false
	 */
	BaseMediaPlayer.prototype.destroy = function(bChildDestroyed) {

		if (bChildDestroyed !== true) {
			throw new Error("Base Media Player child Destroy must be implemented in child class.");
		}
		this.isDestroyCalled = true;
		return this.__super__.prototype.destroy(true);
	};

	return BaseMediaPlayer;
});
