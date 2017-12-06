/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/
/**
 * IdentifierModel
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
 *A class containing data for identifier component
 *@class IdentifierModel
 *@access private
 *@augments Backbone.Model
 *@example
 *
 *require(['components/identifier/model/IdentifierModel'], function(IdentifierModel) {
 *    var IdentifierModel = new IdentifierModel();
 *});
 */
function(SliderConstants) {"use strict";
	var IdentifierModel = /** @lends IdentifierModel.prototype */
	Backbone.Model.extend({

		defaults : {
			content:null,
			property:null,
			color:null
		}
	});

	return IdentifierModel;
});
