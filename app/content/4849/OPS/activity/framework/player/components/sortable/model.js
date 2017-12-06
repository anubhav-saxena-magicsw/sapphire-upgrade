/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/

define(['components/commonmodel'], function(CommonModel) {
	"use strict";
	var Model = CommonModel.extend({
		defaults : {
			value:undefined
		}
	});

	return Model;
}); 