/*global console,$*/

define([
		"marionette",
		"player/base/base-layout-comp",
		"components/reordering/js/reordering-helper"],
		
function(Marionette, BaseLayoutComp, helper){
	
	"use strict";
	
	var reorderingComp;
	
	reorderingComp = BaseLayoutComp.extend({
		
		initialize : function(options){
			this.objData = options;//this property is being used in componentselector for editing.
			if(options.hasOwnProperty('reorderingEl')){
				$(options.reorderingEl).sortable({containment:options.reorderingEl});
				$(options.reorderingEl).disableSelection();
			}else{
				throw new Error("No reordering element provided!");
			}
			
			console.log(" Reordering component initialization!! ");
			//helper.init();
			
		}
		
	});
	
	return reorderingComp;
	
});
