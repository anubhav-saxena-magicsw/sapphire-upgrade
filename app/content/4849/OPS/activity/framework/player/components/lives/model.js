/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/

define(['components/commonmodel'], function(CommonModel) {
	"use strict";
	var Model = CommonModel.extend({
		defaults : {
			lives : "",
			type : "",
			remaining : "",
			losingdirection :"left_to_right"
		}
	});

	return Model;
}); 