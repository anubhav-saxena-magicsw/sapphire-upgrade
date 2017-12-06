/*jslint nomen: true*/
/*globals console,_*/
/*globals console,$*/
/**
 * CarouselItem
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(['marionette', 'player/base/base-item-comp', 'text!components/carousel/template/carousel-item.html', 'components/carousel/js/carousel-constants'],

/**
 *This class is used to display the items of carousel
 *@class CarouselItem
 *@augments BaseItemComp
 *@access private
 *@example
 *Class Initialize
 *require(['player/components/carousel/js/CarouselItem'], function(CarouselItem) {
 *    var carouselItem = new CarouselItem();
 *});
 */
function(Marionette, BaseItemComp, CarouselItemTemp, CarouselConstants) {'use strict';

	var CarouselItem = /** @lends CountDownTimer.prototype */
	BaseItemComp.extend({

		template : _.template(CarouselItemTemp),
		tagName : "div",
		
		/**
		 * This function initializes the component
		 * @memberof CarouselItem
		 * @access private
		 * @param None
		 * @returns None
		 */
		initialize : function() {

			// console.log("state:"+this.model.get("selected"));
			this.model.on("change:selected", $.proxy(this.onModelChange, this));

		},
		
		/**
		 * This function is called when rendering of component is completed
		 * @memberof CarouselItem
		 * @access private
		 * @param None
		 * @returns None
		 */
		onRender : function() {
			
			var strURL, itemStyleName;
			this.$el.attr('data-cid', this.model.cid);
			strURL = this.model.get("imgSource");
			$(this.el).css("background-image","url('"+strURL+ "')");
			$(this.el).css("background-position","0px 0px");
			// console.log("Inside item>>", $(this.el));
			$(this.el).css("left", "auto !important");
			$(this.el).css("top", "auto !important");
			itemStyleName = ((this.model.get("styleName") === undefined) || (this.model.get("styleName") === "")) ? "CarouselItemStyle" : this.model.get("styleName");
			$(this.el).addClass(itemStyleName);
			
			if(this.model.get("allignment") === CarouselConstants.CONSTANTS.HORIZONTAL)
			{
				$(this.el).css("display", "inline-block");
			}
			
			$(this.el).css("overflow", "hidden");
		},

		/**
		 * This function updates the view of carousel item
		 * @memberof CarouselItem
		 * @access private
		 * @param none
		 * @returns None
		 */
		onModelChange : function() {

			var xPos, item = $(this.el).find("div");

			if (this.model.get("selected")) {
				
				xPos = $(this.el).width();
				$(this.el).css("background-position",(-xPos)+"px "+ "0px");
			} else {
				$(this.el).css("background-position","0px 0px");
			}

		}
	});

	return CarouselItem;
});
