/*jslint nomen: true*/
/*globals _*/
define(['marionette', 
	'player/base/base-layout-comp', 
	'text!components/option/option.html'], 
	
	function(Marionette, BaseItemComp, optionHtml) 
	{
	    "use strict";
		var Option = BaseItemComp.extend({
		template : _.template(optionHtml),
		initialize : function() {
		},
		
		onRender:function()
		{
			this.storeState();
		}
	});
	
	Option.prototype.storeState = function()
	{
		//console.log("storePostion", this.$el)	;
	};
	return Option;

});
