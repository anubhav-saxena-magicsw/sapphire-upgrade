/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/


define(['components/commonmodel'],

function(CommonModel) {
	"use strict";
	var Model = 
	CommonModel.extend({
		defaults : {
			datasource : [],
			itemclass : "",
			filter:"video_image_audio"
		}
	});

	return Model;
});