/*jslint nomen: true*/
/*globals Backbone*/

/**
 * ReadAloudPlayerModel
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

define(
/**
 *A class representing a ReadAloudPlayerModel.
 *Intializes ReadAloudPlayerModel 
 *@class ReadAloudPlayerModel
 *@augments Backbone.Model
 *@access private 
 *@example
 * 
 *require(['components/readAloudPlayer/model/ReadAloudPlayerModel'], function(ReadAloudPlayerModel) {
 *    var readAloudPlayerModel = new ReadAloudPlayerModel();
 *}); 
 */		
function(){
	'use strict';
	
	var ReadAloudPlayerModel = Backbone.Model.extend({
		defaults : {
			audioPlayerRef:null,
			audioSource:undefined,
			xmlPath:"framework/player/components/readAloudPlayer/template/xml/roads.xml",
			strHotSpots:"",
			map:[],
			highlightClass:"DefaultHotSpotHighlight"
		}
	});
	
	
	
	return ReadAloudPlayerModel;
});
