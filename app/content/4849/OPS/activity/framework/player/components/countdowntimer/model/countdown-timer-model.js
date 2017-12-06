/*globals console,Backbone*/
/**
 * CountDownTimerModel
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(
/**
 *A module containinjg data for timer component
 *@class CountDownTimerModel
 *@augments Backbone.Model
 *@access private
 *@example
 * 
 *require(['components/countDownTimer/model/countDownTimerModel'], function(CountDownTimerModel) {
 *    var countDownTimerModel = new CountDownTimerModel();
 *});
 */
function() {"use strict";
	var CountDownTimerModel = /** @lends CountDownTimerModel.prototype */
	Backbone.Model.extend({
		defaults : {
			decrementalCountDown : true,
			totalSeconds : 10,
			remainingSeconds : 0,
			elapsedSeconds : 0,
			warningAfter : 5,
			timeFormat : 1, //0 for HH:MM:SS | 1 for MM:SS | 2 for SS
			timerSeperator : ":",
			timerData : "00:00",
			tickrate : 1000,
			timerReference : null,
			isTimerPaused : false,
			secondsCounter : 0,
			dispatchHeartbeat : false,
			heratbeatTimeInterval : 5,
			countDownTimerWrapperStyle : 'CountDownTimerWrapperStyle',
			clockmode : false
		}
	});

	return CountDownTimerModel;
});
