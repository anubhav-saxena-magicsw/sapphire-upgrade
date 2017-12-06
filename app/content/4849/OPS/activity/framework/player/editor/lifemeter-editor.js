/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * SliderEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/base-editor'], function(Marionette, BaseEditor) {'use strict';
	var LifeMeterEditor;

	/**
	 * LifeMeterEditor is responsible to load and return LifeMeter component class
	 * signature and also prepare default data which is required by an LifeMeter
	 * to initlized itself
	 *
	 */

	LifeMeterEditor = BaseEditor.extend({
		defaultCompData : {}
	});

	/**
	 * Will be invoked by Editor when an LifeMeterComponent needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof LifeMeterEditor
	 * @access private
	 */
	LifeMeterEditor.prototype.getComponent = function(compData) {
		//Asking to BaseEditor to create a component
		this.createCompData($(compData));
	};

	/**
	 * Preparing constructor data for LifeMeter component 
	 * @param {Object} compData
	 * @return none
	 * @memerof LifeMeterEditor
	 * @access private
	 */
	LifeMeterEditor.prototype.createCompData = function(compData) {
		var total = 0, iconClasses = [];
		this.defaultCompData = this.prepareDefaultData(compData);
		if (this.defaultCompData === undefined) {
			throw new Error(this.errorConst.LIFEMETER_DEFAULT_DATA_MISSING);
		}
		
		$(compData).find('div').each(function(){
			total +=1 ;
			iconClasses.push($(this).attr('class'));
			$(this).remove();
		});
		
		if(total === 0){
			throw new Error(this.errorConst.LIFEMETER_DEFAUTL_DATA_MISSING+" At least one life is required.");
		}
		this.defaultCompData.total = total;
		this.defaultCompData.iconClasses = iconClasses;
		this.createComponent(compData);
	};

	/**
	 * Overriding 'BaseEditor' method to get notifiy when LifeMeterComponent class is
	 * required successfully.
	 * This method is also resposible to append default data for LifeMeter component
	 * in objComponent (received as parameter when component created successfully)
	 *
	 * @param {Object} objComponent LifeMeter coponent class signature
	 * @return none
	 * @memberof LifeMeterEditor
	 * @access private
	 */
	LifeMeterEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};
	
	/**
	 * This method destroy the LifeMeterEditor class.
	 * @param none
	 * @return none
	 * @memberof LifeMeterEditor
	 * @access private
	 */
	LifeMeterEditor.prototype.destroy = function()
	{
		return LifeMeterEditor.__super__.destroy(true, this);
	};

	return LifeMeterEditor;
});
