/*jslint nomen: true*/
/*globals _,console, Backbone, $*/
/**
 * MediaController
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */

define(['marionette'], function(Marionette) {"use strict";

	/**
	 * Class MediaController is single point to access/control all media objects within mPlayer.
	 * All media object must be register itself with this controller to also allow the 'MediaController'
	 * to control itself through their external AP'sI e.g. stopMedia, PlayMedia, pauseMedia.
	 *
	 * By this class anytime player can get the active media objects their status can stop any media to provide
	 * a single sfx or video in a time.
	 * @class MediaController
	 * @access private
	 */
	var MediaController, objInstance;
	objInstance = null;

	MediaController = Backbone.Marionette.Controller.extend({
		clickElementId : null,
		media_dict : {}
	});
	
	/**
	 * Holding the referece of all type of media objects [audio player/video player] in player
	 * every media object will register itself in their initlize time.
	 * this method will be invoked by every media object.
	 * @memberof MediaController#
	 * @param {Object} objMedia
	 * @return None
	 * access private
	 */
	MediaController.prototype.registerMedia = function(objMedia, strType) {
		var objMediaData = {};
		objMediaData.target = objMedia;
		objMediaData.type = strType;
		if (this.media_dict[objMedia.getID()] !== undefined) {
			throw new Error("Already registered.....", objMedia.getID());
		}
		this.media_dict[objMedia.getID()] = objMediaData;
		this.checkMedia(objMedia);
	};

	/**
	 * Unregister the referece of all type of media objects [audio player/video player] from player
	 * every media object will register itself in their initlize time.
	 * this method will be invoked by every media object.
	 * @memberof MediaController#
	 * @param {Object} objMedia
	 * @return None
	 * access private
	 */
	MediaController.prototype.unregisterMedia = function(objMedia) {
		delete this.media_dict[objMedia.getID()];
	};

	/**
	 * Unregister the referece of all type of media objects [audio player/video player] from player
	 * every media object will register itself in their initlize time.
	 * this method will be invoked by every media object.
	 * @memberof MediaController#
	 * @param {Object} objMedia
	 * @return None
	 * access private
	 */
	MediaController.prototype.checkMedia = function(objMedia) {
		if (objMedia.componentType === "audiohotspot") {
			objMedia.on(objMedia.AUDIO_START_EVENT, this.handlerEventFunction, this);
		}
		if (objMedia.componentType === "video") {
			objMedia.on(objMedia.VIDEO_START_EVENT, this.handlerEventFunction, this);
		}
		

	};

	MediaController.prototype.handlerEventFunction = function(objEvent) {
		this.clickElementId = objEvent.target.strCompId;
		console.log("*****objMedia.target.strCompId*********",objEvent.target.strCompId);
		if (objEvent.target.options.passiveaudio === 'false') {
			this.pauseAllMedia();
		}
		
		if (objEvent.target.options.passivevideo === 'false') {
			this.pauseAllMedia();
		}

	};

	/**
	 * pause all media
	 * @memberof MediaController#
	 * @param None
	 * @return None
	 * access private
	 */

	MediaController.prototype.pauseAllMedia = function() {
		var self = this;
		$.each(this.media_dict, function(key, objMedia) {
			if (key === self.clickElementId) {
			} else {
				objMedia.target.stop();
			}
		});
	};

	MediaController.prototype.resumeAllMedia = function() {
		$.each(this.media_dict, function(key, objMedia) {
			objMedia.target.resume();
		});
	};

	MediaController.prototype.stopAllMedia = function() {
		$.each(this.media_dict, function(key, objMedia) {
			objMedia.target.resume();
		});
	};

	return {
		getInstance : function() {
			if (objInstance === null) {
				objInstance = new MediaController();
			}
			return objInstance;
		}
	};
});
