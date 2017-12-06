/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/
/**
 * SliderModel
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(['components/slider/js/sliderconst'],
/**
 *A class containing data for slider component
 *@class SliderModel
 *@access private
 *@augments Backbone.Model
 *@example
 *
 *require(['components/slider/model/SliderModel'], function(SliderModel) {
 *    var sliderModel = new SliderModel();
 *});
 */
function(SliderConstants) {"use strict";
	var SliderModel = /** @lends SliderModel.prototype */
	Backbone.Model.extend({

		defaults : {
			defalutPosition : 0, // this value will be in percentage but if slider has to thumbs then its will be an array of two integers
			currentPosition : {
								thumbMin: 0,
								thumbMax: 0
			}, // this will be updated as per the default position by the component internally
			currentPercentage : {
								thumbMin: 0,
								thumbMax: 0
			}, // this will be updated as per the default position by the component internally
			sliderLength : 100, // in pixel
			steps : 2,
			allignment : SliderConstants.CONSTANTS.HORIZONTAL,
			stepsPosition : [],
			sliderWrapperStyle : "SliderHorizontalWrapperStyle",
			minSlidingPostion : 0, //in percentage
			maxSlidingPostion : 0//in percentage
		}
	});

	return SliderModel;
});
