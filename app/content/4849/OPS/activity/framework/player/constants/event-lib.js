/*jslint nomen: true*/
/*globals Backbone,_,$,console*/

/**
 * ComponentEvents
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
 *
 */
define(function() {
	"use strict";
	var ComponentEvents;

	ComponentEvents = {
		eventDict : {
			"animation-player" : ["animationProgress", "animationFinished", "click", "mouseover", "mouseout"],
			"audiohotspot" : ["readyToPlay", "audiostart", "audiopause", "audioprogress", "audiostop", "audiofinish"],
			"audio-player" : ["readyToPlay", "audiostart", "audiopause", "audioprogress", "audiostop", "audiofinish"],
			"answer" : ["click"],
			"button" : ["click", "mouseover", "mouseout"],
			"countdown-timer" : ["timerHeartbeat", "timerFinished", "timerStarted", "timerWarning", "timerPaused"],
			"dnd" : ["onDragStart", "onDragMove", "onDragStop", "onOver", "onDrop", "onAllPlaced", "onAllNotPlaced", "allCorrect", "allNotCorrect"],
			"draggable" : ["start", "drag", "stop", "revertComplete", "revertProgress"],
			"droppable" : ["drop", "over"],
			"feedback" : ["feedbackShowEvent", "correctFeedbackShown", "incorrectFeedbackShown", "feedbackHideEvent"],
			"fib" : [],
			"fibinput" : [],
			"hint" : ["hintShowEvent", "hintHideEvent"],
			"image" : ["click", "mouseover", "mouseout"],
			"inputtext" : ["keyup"],
			"label" : ["click", "mouseover", "mouseout"],
			"lives" : ["onloselife", "ongainlife"],
			"list" : ["click", "mouseover", "mouseout", "change"],
			"lifemeter" : ["click", "mouseover", "mouseout"],
			"mediacontrol" : ["mediaPlayEvent", "mediaPauseEvenet", "mediaVolumeEvent", "mediaMuteEvent", "mediaSetVideoPosEvent"],
			"multiplechoice" : ["answerCheckCompleteEvent", "showFeedbackEvent", "resetCompleteEvent", "correctAnswerShownEvent", "disabledEvent", "enabledEvent", "attemptOverEvent", "getStateEvent", "setStateEvent", "selectEvent"],
			"popup" : ["open", "close"],
			"radio" : ["click", "mouseover", "mouseout"],
			"pencil" : ["click", "mouseover", "mouseout"],
			"eraser" : ["click", "mouseover", "mouseout"],
			"radiobutton" : ["change"],
			"tab" : ["tabChange"],
			"screen" : ["allChildAddedInDom", "screenPreInitEvent"],
			"self" : [],
			"canvas" : ["getStateEvent","setStateEvent"],
			"slider" : ["SliderStarted", "SliderInProgress", "SliderStopped", "MouseupOnThumb", "MouseDownThumb"],
			"sortable" : [],
			"flipcard" : ["flipCardBackFlippedEvent", "flipCardFrontFlippedEvent","flipcardEnable","flipcardDisable","getStateEvent","setStateEvent"],
			"sorting" : ["start", "update", "sort", "stop", "onCheckAnswer"],
			"videoplayer" : ["videostart", "videopause", "videoprogress", "videostop", "videofinish"],
			"wizard" : ["wizardViewChange", "changeWizardView"],
			"matching" : ["disableState","enableState","getStateEvent","setStateEvent","resetStateEvent","checkAnswerEvent","showAnswerEvent"],
			"animation" : ["onAnimationStart","onAnimationComplete"]
		},

		methodDict : {
			"animation-player" : ["hide", "show", "play", "pause", "resume", "stop", "changeSprite", "setFps", "getFps", "getCurrentFrame", "getTotalFrames", "gotoAndStop", "getCurrentRow"],
			"audiohotspot" : ["disable", "show", "hide", "play", "pause", "resume", "stop", "changeAudio", "setCurrentTime", "getCurrentTime", "setVolume", "getVolume"],
			"audio-player" : ["changeAudio", "play", "resume", "pause", "stop", "setCurrentTime", "getCurrentTime", "setVolume", "getVolume"],
			"answer" : [],
			"button" : ["show", "hide", "enable", "disable"],
			"case" : ["show", "hide"],
			"countdown-timer" : ["show", "hide", "deductPenalty", "addBonus", "startTimer", "stopTimer", "restartTimer", "pauseTimer", "resumeTimer"],
			"dnd" : ["show", "hide", "randomizePositions", "checkAnswer","getState","setState", "resetDraggable", "reset", "enable", "disable", "showFeedback", "showDraggablesFeedback", "hideFeedback", "hideDraggablesFeedback", "showHint", "showDraggablesHint", "showDroppablesHint", "hideHint", "hideDraggablesHint", "hideDroppablesHint", "resetIncorrect", "resetCorrect","showAnswer"],
			"draggable" : ["show", "hide", "revertBack", "setOriginalPosition", "enable", "disable"],
			"droppable" : ["show", "hide", "enable", "disable"],
			"feedback" : ["showFeedback", "hideFeedback"],
			"fib" : ["show", "hide", "reset", "checkAnswer", "enable", "disable"],
			"fibinput" : ["show", "hide"],
			"hint" : ["showHint", "hideHint"],
			"image" : ["show", "hide", "changeSrc"],
			"inputtext" : ["show", "hide", "setText"],
			"label" : ["text","hide","show"],
			"life" : ["show", "hide", "enable", "disable"],
			"lifemeter" : ["show", "hide", "loseLife", "gainLife", "reset"],
			"lives" : ["loselife", "gainlife", "show", "hide"],
			"list" : ["enable", "disable", "setText"],
			"mcq" : ["getSelectedOptionsIDs", "setQuestionData", "reset", "showOptionsFeedback", "showAllFeedback", "showFeedback", "checkAnswer", "enable", "disable", "hideQuestion", "hideOptions"],
			"multiplechoice" : ["show", "hide", "checkAnswer", "showHint", "hideHint", "attempt", "shuffleOptions", "disable", "showFeedback", "showAnswer", "getState", "setState", "reset"],
			"popup" : ["launch", "remove"],
			"radio" : ["show", "hide"],
			"radiobutton" : ["show", "hide", "updateOptionStatus", "select"],
			"tab" : ["show", "hide", "changeIndex", "defaultIndex", "buttonToggle", "enable", "disable"],
			"screen" : [],
			"canvas" : ["clearCanvas","getState","setState"],
			"flipcard" : ["moveCard", "enable", "disable","getValue","getState","setState"],
			"self" : ["jumpToActivityByIndex", "jumpToActivityByID", "launchNextActivity", "launchPreviousActivity", "showHideRegionById", "getScreenText", "playAudio", "isWebApiEnable", "initWebApi", "playWebAudio", "stopAllAudio", "pauseAudio", "resumeAudio", "showPreloader", "hidePreloader", "launchActivityInRegion", "startRegion", "stopAllRegion"],
			"sortable" : ["show", "hide", "enable", "disable", "value"],
			"sorting" : ["show", "hide", "shuffleSortables", "checkAnswer", "reset", "disable", "enable"],
			"videoplayer" : ["play", "pause", "resume", "stop", "changeVideo", "changeVolume", "setTime", "getTime", "getDuration"],
			"video" : ["play", "pause", "resume", "stop", "changeVideo", "changeVolume", "setTime", "getTime", "getDuration", "getState", "setState"],
			"wizard" : ["launchNextView", "launchPreviousView", "hide", "show"],
			"pencil" : ["startDraw"],
			"eraser" : ["erase"],
			"animation" : ["startAnimation", "stopAnimation", "resetAnimation"],
			"matching" : ["checkAnswer","getState","setState","reset","disable","enable","showAnswer"]
		}
	};

	return {
		getEventList : function(strCompType) {
			var objDataArray = ComponentEvents.eventDict[strCompType];
			return (objDataArray) ? objDataArray.slice() : [];
		},
		getMethodList : function(strCompType) {
			var objDataArray = ComponentEvents.methodDict[strCompType];
			return (objDataArray) ? objDataArray.slice() : [];
		}
	};
});

