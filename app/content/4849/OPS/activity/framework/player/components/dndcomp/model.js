/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/

define(['components/commonmodel'], function(CommonModel) {
	"use strict";
	var Model = CommonModel.extend({
		defaults : {
			draggables : "",
			droppables : "",
			ondropalignment : "",
			shuffle : "false",
			lastzindex : 0,
			type : "ONE_TO_ONE",
			ondropreplace : false,
			cloning : false
		}
	});

	return Model;
}); 