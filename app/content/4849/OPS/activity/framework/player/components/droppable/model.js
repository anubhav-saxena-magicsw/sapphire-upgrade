/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/


define(['components/commonmodel'],

function(CommonModel) {
	"use strict";
	var Model = 
	CommonModel.extend({
		defaults : {
			filledWith : "",
			activeClass : "",
			hoverClass : "",
			value:"",
			checkOrder:false
		}
	});

	return Model;
});