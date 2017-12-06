/**
 * PlayerConst
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * Here is the full license text and copyright
 * notice for this file. Note that the notice can span several
 * lines and is only terminated by the closing star and slash.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(function() {
	"use strict";
	/**
	 * This contains constants.
	 * @namespace
	 * @access private
	 */
	var PlayerConst = {
		REGION_TYPE_HEADER : "header",
		REGION_TYPE_FOOTER : "footer",

		WEB_SERVICE_MANAGER : "webServiceManager",
		REGION_MANAGER : "regionManager",
		MANAGE_MANAGERS_EVENTS : "manageManagersEvents",
		REGION_CHANGE_NOTIFICATION : "regionChangeNotification",
		MANAGE_PLAYER_COMMON_REQUEST : "managePlayerCommonRequest",

		/**webservicecall */
		WEB_SERVICE_CALL : "webservicecall",
		// PORTALTITLE_MANAGE
		/** PORTAL */
		HOST : "PORTAL",
		/** restservicecall */
		REST_SERVICE_CALL : "restservicecall",
		/** jsonpcall */
		JSONP_CALL : "jsonpcall",
		/** jsoncall */
		JSON_CALL : "jsoncall",
		/** textfilecall */
		TEXT_CONTENT_CALL : "textfilecall",
		/** htmlfilecall */
		HTML_CONTENT_CALL : "htmlfilecall",
		/** soapwebservice */
		SOAP_WEB_SERVICE : "soapwebservice",
		/** restwebservice */
		REST_WEB_SERVICE : "restwebservice",

		//MEIDA RELATEDD CONSTANTS
		/**audioMediaPlayer */
		AUDIO_MEDIA_PLAYER : "audioMediaPlayer",
		/**videoMediaPlayer */
		VIDEO_MEDIA_PLAYER : "videoMediaPlayer",
		/**animationMediaPlayer */
		ANIMATION_MEDIA_PLAYER : "animationMediaPlayer"

	};

	return PlayerConst;

});
