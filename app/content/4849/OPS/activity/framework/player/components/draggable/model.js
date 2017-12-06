/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/


define(['components/commonmodel'],

function(CommonModel) {
	"use strict";
	var Model = 
	CommonModel.extend({
		defaults : {
			containmentDiv : undefined,
			droppedAt : undefined,
			clone : "false",
			cloneCounter : 0,
			value : ""
		}
	});

	return Model;
});