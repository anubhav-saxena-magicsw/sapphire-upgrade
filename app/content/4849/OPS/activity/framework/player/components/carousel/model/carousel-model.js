/*globals console,Backbone*/
/**
 * CarouselModel
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(['components/carousel/js/carousel-constants'],
/**
 *A class containinjg data for carousel component
 *@class CarouselModel
 *@augments Backbone.Model
 *@access private
 *@example
 * 
 *require(['components/carousel/model/CarouselModel'], function(CarouselModel) {
 *    var carouselModel = new CarouselModel();
 *});
 */		
function(CarouselConstants){"use strict";
	var CarouselModel = /** @lends CarouselModel.prototype */ Backbone.Model.extend({
		
		defaults:
		{
			allignment : CarouselConstants.CONSTANTS.HORIZONTAL,
			scroll: 1,//Defines number of image to be steped on click of next/previous button
			wrap: CarouselConstants.CONSTANTS.CIRCULAR,
			imageCollection: {},
			isSwapRequired : false,
			selectorIndex : 0,
			selectedItems : [],
			playerIds: [],
			carouselWrapperStyle : 'CarouselWrapperStyle'
		}
	});
	
	return CarouselModel;
});
