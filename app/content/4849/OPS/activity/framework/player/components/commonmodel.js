/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/


define(['backbone'],

function(Backbone) {
	"use strict";
	var CommonModel = 
	Backbone.Model.extend({
		defaults : {
			styleClass : "",
			selectedStyleClass : "",
			data : {}
		}
	});

	return CommonModel;
});