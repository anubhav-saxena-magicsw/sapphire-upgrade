/**
 * EventsConst
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(function(require, exports, module) {
	'use strict';
	/**
	 * This contains constants.
	 * @namespace
	 */
	var EventsConst = {
		/** dataLoaded */
		DATA_LOADED : "dataLoaded",

		/** activityEndEvent */
		ACTIVITY_END_EVENT : "activityEndEvent",

		/** activiytyGoToNextActivityEvent */
		ACTIVITY_GO_TO_NEXT_ACTIVITY_EVENT : "activiytyGoToNextActivityEvent",

		/** executeUserLastActionFromOtherRegion */
		EXECUTE_USER_LAST_ACTION_FROM_ANOTHER_REGION : "executeUserLastActionFromOtherRegion",

		/** userlastactiontrigger */
		USER_LAST_ACTION : "useractiontrigger",

		/** activiytyGoToPreviousActivityEvent */
		ACTIVITY_GO_TO_PREVIOUS_ACTIVITY_EVENT : "activiytyGoToPreviousActivityEvent",

		/** jumpToActivityByIndexEvent */
		JUMP_TO_ACTIVITY_BY_INDEX_EVENT : "jumpToActivityByIndexEvent",

		/** jumpToActivityByIDEvent */
		JUMP_TO_ACTIVITY_BY_ID_EVENT : "jumpToActivityByIDEvent",

		/** createComponentEvent */
		CREATE_COMPONENT_EVENT : "createComponentEvent",

		/** onActivitySuccessfullyAddedInRegion */
		ON_ACTIVITY_SUCCESSFULLY_ADDED_IN_REGION : "onActivitySuccessfullyAddedInRegion",

		/** createAndInitActivity */
		CREATE_AND_INIT_ACTIVITY_HTML : "createAndInitActivityHtml",

		//Drawing canvas
		/** setDrawingCanvas */
		SET_DRAWING_CANVAS : "setDrawingCanvas",

		/** drawingCommonTask */
		DRAWING_COMMON_TASK : "drawingCommonTask",

		/** regionInitlizeAndUpdateEvent **/
		REGION_INITLIZE_UPATE_EVENT : "regionInitlizeAndUpdateEvent",

		/** playerInitlizeCompleteEvent */
		PLAYER_INITLIZE_COMPLETE_EVENT : "playerInitlizeCompleteEvent",

		/** activityInitlizeCompleteEvent */
		REGION_INITLIZE_COMPLETE_EVENT : "regionInitlizeCompleteEvent",

		/** regionInitlizeStartEvent */
		REGION_INITLIZE_START_EVENT : "regionInitlizeStartEvent",

		/** updatePlayerSizeEvent **/
		UPDATE_PLAYER_SIZE_EVENT : "updatePlayerSizeEvent",

		//ACTIVITY CONTROLLER EVENTS
		/** launchNextActivity */
		LAUNCH_NEXT_ACTVITY : "launchNextActivity",

		/** launchPreviousActivity */
		LAUNCH_PREVIOUS_ACTIVITY : "launchPreviousActivity",

		/** activityPreinitTask */
		ACTIVITY_PREINIT_TASK : "activityPreinitTask",

		/** prepareInlineTemplateDataTask */
		PREPARE_INLINE_TEMPLATE_DATA : "prepareInlineTemplateDataTask",

		/** updateCompleteEvent */
		UPDATE_COMPLETE_EVENT : "updateCompleteEvent",

		PLAY_AUDIO : "initAndPlayAudio",
		RESTART_AUDIO : "restartAudio",
		STOP_AUDIO : "stopAudio",
		PAUSE_AUDIO : "pauseAudio",
		RESUME_AUDIO : "resumeAudio",
		VOLUME_CHANGE : "volumeChange",
		DEFAULT_VOLUME_CHANGE : "defaultVolumeChange",

		PLAY_WEB_API_AUDIO : "playWebApiAudio",
		INIT_WEB_API_AUDIO : "initWebApiAudio",
		UNLOAD_WEB_API_BUFFERS_AUDIO : "unloadWebApiBuffersAudio",

		PAUSE_ALL_MEDIA : "pauseAllMedia",
		RESUME_ALL_MEDIA : "resumeAllMedia",

		/** executeWebServiceCall */
		EXECUTE_WEB_SERVICE_CALL : "executeWebServiceCall",
		/** playerCommonTaskEvent */
		PLAYER_COMMON_TASK_EVENT : "playerCommonTaskEvent",
		/** broadcastEvent */
		BROADCAST_EVENT : "broadcastEvent",
		/** broadcastEventReceiver */
		BROADCAST_EVENT_RECEIVER : "broadcastEventReceiver",
		/** stopBroadcastEventReceiver */
		STOP_BROADCAST_EVENT_RECEIVER : "stopBroadcastEventReceiver",
		/** showHideRegion */
		SHOW_HIDE_REGION : "showHideRegion",
		/** launchActivityInRegion */
		LAUNCH_ACTIVITY_IN_REGION : "launchActivityInRegion",
		/** startRegionEvent */
		START_REGION_FROM_OTHER_REGION : "startRegionFromOtherRegionEvent",
		/** startRegionEvent */
		UPDATE_REGION_ACTIVITY_LIST : "updateRegionActivityList",
		/** removeComponentEditorFootprints */
		REMOVE_COMPONENT_EDITORS : "removeComponentEditorFootprints",
		/** appendActiivityInRegion */
		APPEND_ACTIVITY_IN_REGION : "appendActiivityInRegion",
		/** appendActiivityInRegion */
		CHANGE_VIEW : "changeWizardView",
		/** wizard screen changed **/
		WIZARD_VIEW_CHANGE : "wizardViewChange",
		/** wizard view render complete **/
		WIZARD_VIEW_RENDER_COMPLETE : "wizardViewRenderComplete",
		/** preloader event const */
		SHOW_PRELOADER : "showPreloader",
		HIDE_PRELOADER : "hidePreloader",

		/** removeCSSReference */
		REMVOE_REFERENCE : "removeScriptAndCSSReference",

		/** css */
		TYPE_CSS : 'css',

		/** js */
		TYPE_JS : "js",

		/** href */
		HREF : 'href',

		/** none */
		NONE : 'none',

		/** link */
		LINK : 'link',

		/** script */
		SCRIPT : 'script',

		/** src */
		SRC : 'src',

		/** manageCommonBroadcastEvent */
		STOP_ALL_REGIONS : "stopAllRegions",

		/** startRegion **/
		START_STOP_REGION : "startStopRegion",

		/** hideAllRegions */
		HIDE_ALL_REGION : "hideAllRegions",

		/** manageCommonBroadcastEvent */
		MANAGE_COMMON_BROADCAST_EVENT : "manageCommonBroadcastEvent",

		/** callAndUpdateComponent */
		CALL_AND_UPDATE_COMPONENT : "callAndUpdateComponent",

		/** firstScreenLoadEvent */
		FIRST_SCREEN_LOAD_EVENT : "firstScreenLoadEvent",

		/** lastScreenLoadEvent */
		LAST_SCREEN_LOAD_EVENT : "lastScreenLoadEvent",

		/** middleScreenLoadEvent */
		MIDDLE_SCREEN_LOAD_EVENT : "middleScreenLoadEvent",

		/** manageNextBackNevigationButton */
		MANAGE_NEXT_BACK_NEVIGATION_BUTTON : "manageNextBackNevigationButton",

		/** compEventRegisterComplete **/
		COMP_EVENT_REGISTER_COMPLETE : "compEventRegisterComplete",

		/** creationComplete **/
		CREATION_COMPLETE : "creationComplete",

		/** updateComplete **/
		UPDATE_COMPLETE : "updateComplete",

		/** onSelectorClicked **/
		SELECTOR_CLICK_EVENT : "onSelectorClicked",

		/** editorComponentTabClicked **/
		EDITOR_TAB_BTN_CLICK : "editorComponentTabClicked",

		/** componentSelected **/
		COMPONENT_SELECTED : "componentSelected",

		/** componentDeselected **/
		COMPONENT_DESELECTED : "componentDeselected",

		/** componentDataPropertyUpdated */
		COMPONENT_DATA_PROPERTY_UPDATED : "componentDataPropertyUpdated",

		/** playerEditComponentEvent **/
		PLAYER_EDIT_COMPONENT_EVENT : "playerEditComponentEvent",

		/** updatePropertyPanel **/

		/** UPDATE **/
		EDIT_ACTION_UPDATE : "UPDATE",

		/** UPDATE **/
		EDIT_ACTION_CHANGE : "CHANGE",

		/** ADD **/
		EDIT_ACTION_ADD : "ADD",

		/** DELETE **/
		EDIT_ACTION_DELETE : "DELETE",

		/** CSS **/
		EDIT_CSS_DATA : "CSS",

		/** JSON **/
		EDIT_JSON_DATA : "JSON",

		/** HTML **/
		EDIT_HTML_DATA : "HTML",

		/** DATA **/
		EDIT_JSON_DATA_DATA : "DATA",

		/** ANSWER **/
		EDIT_JSON_DATA_ANSWER : "answer",

		/** SOURCE **/
		EDIT_JSON_DATA_SOURCE : "SOURCE",

		/** MP4 **/
		EDIT_JSON_DATA_SOURCE_MP4 : "MP4",

		/** OGG **/
		EDIT_JSON_DATA_SOURCE_OGG : "OGG",

		/** EVENT **/
		EDIT_EVENT_DATA : "EVENTS",

		/*editDomLayoutUpdated */
		EDIT_DOM_LAYOUT_UPDATED : "editDomLayoutUpdated",

		/** MOVE **/
		EDIT_DOM_LAYOUT_MOVE : "MOVE",

		/** UP **/
		EDIT_DOM_LAYOUT_MOVE_UP : "UP",

		/** DOWN **/
		EDIT_DOM_LAYOUT_MOVE_DOWN : "DOWN",

		/** CUT **/
		EDIT_DOM_LAYOUT_CUT : "CUT",

		/** COPY **/
		EDIT_DOM_LAYOUT_COPY : "COPY",

		/** PASTE **/
		EDIT_DOM_LAYOUT_PASTE : "PASTE",

		/** LAYOUT **/
		EDIT_DOM_LAYOUT : "LAYOUT",

		/** LAYOUT **/
		PLAYER_BUBBLE_EVENT : "playerBubbleEvent",

		/** playerInitFromControllerEvent **/
		PLAYER_INIT_FROM_CONTROLLER_EVENT : "playerInitFromControllerEvent"

	};
	return EventsConst;
});

