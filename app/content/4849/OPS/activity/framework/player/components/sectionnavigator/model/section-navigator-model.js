/*globals console,Backbone*/
/**
 * SectionNavigatorModel
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(['backbone'],
/**
 *A class containinjg data for carousel component
 *@class SectionNavigatorModel
 *@augments Backbone.Model
 *@access private
 *@example
 * 
 *require(['components/sectionNavigator/model/SectionNavigatorModel'], function(SectionNavigatorModel) {
 *    var sectionNavigatorModel = new SectionNavigatorModel();
 *});         
 */		
function(Backbone)
{"use strict";
	var SectionNavigatorModel = /** @lends SectionNavigatorModel.prototype */ Backbone.Model.extend({
		
		defaults:
		{
			compLength: 200,//in pixels
			sectionData: {},
			sectionNavigatorWrapperStyle : "SectionNavigatorWrapperStyle",
			defaultSelectedSection: 0 //index starts from zero
		}
	});
	
	return SectionNavigatorModel;
});
