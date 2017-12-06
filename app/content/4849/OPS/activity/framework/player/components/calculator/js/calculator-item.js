/*jslint nomen: true*/
/*globals console,_*/
/*globals console,$*/
/**
 * CalculatorItem
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(['marionette', 'player/base/base-item-comp', 'text!components/calculator/template/calculator-item.html'],

/**
 *This class is used to display the items of Calculator
 *@class CalculatorItem
 *@access private
 *@augments BaseItemComp
 *@example
 *Class Initialize
 *require(['player/components/calculator/js/CalculatorItem'], function(CalculatorItem) {
 *    var calculatorItem = new CalculatorItem();
 *});
 */
function(Marionette, BaseItemComp, CalculatorItemTemp) {'use strict';

	var CalculatorItem = /** @lends CalculatorItem.prototype */
	BaseItemComp.extend({

		template : _.template(CalculatorItemTemp),
		tagName : "div",
		parentContext: null,
		
		/**
		 * This function initializes the component
		 * @memberof CalculatorItem
		 * @access private
		 * @param None
		 * @returns None
		 */
		initialize : function(data) {
			var objSelf = this;
			// console.log("Context:",data);
			this.parentContext = data.context;
			// console.log("state:"+this.model.get("selected"));
			this.model.on("change:selected", $.proxy(this.onModelChange, this));
			// console.log("this.parentContext>>>>>",this.parentContext);
			$(this.el).on("click", function() {
				// console.log("item clicked");
				objSelf.parentContext.trigger(this.BUTTON_CLICKED,objSelf.model);
			});

		},
		
		/**
		 * This function is called when rendering of component is completed
		 * @memberof CalculatorItem
		 * @access private
		 * @param None
		 * @returns None
		 */
		onRender : function() {
			var strURL, itemStyleName;
			itemStyleName = ((this.model.get("styleName") === undefined) || (this.model.get("styleName") === "")) ? "CalculatorItemStyle" : this.model.get("styleName");
			$(this.el).addClass(itemStyleName);
			
			if(this.model.get("label"))
			{
				$(this.el).text(this.model.get("label"));
			}
			
		},
		

		/**
		 * This function updates the view of carousel item
		 * @memberof CalculatorItem
		 * @access private
		 * @param none
		 * @returns None
		 */
		onModelChange : function() {

			// var xPos, item = $(this.el).find("div");
// 
			// if (this.model.get("selected")) {
//				
				// xPos = $(this.el).width();
				// $(this.el).css("background-position",(-xPos)+"px "+ "0px");
			// } else {
				// $(this.el).css("background-position","0px 0px");
			// }

		}
	});
	
	/**@constant
     * @memberof CountDownTimer#
     * @access public
     * @type {string}
     * @default
     */
    CalculatorItem.prototype.BUTTON_CLICKED = 'buttonClicked';

	return CalculatorItem;
});
