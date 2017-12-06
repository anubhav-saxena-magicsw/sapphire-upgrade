/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * AnimationPlayerEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/base-editor'], function(Marionette, BaseEditor) {'use strict';
	var AnimationPlayerEditor;

	/**
	 * AnimationPlayerEditor is responsible to load and return 'AnimationPlayer' component class
	 * signature and also prepare default data which is required by an AnimationPlayer component
	 * to initlized itself
	 *
	 *@augments AnimationPlayerEditor
	 *@example
	 *Load module
	 *
	 var AnimationPlayerEditor = BaseEditor.extend({

	 AnimationPlayerEditor.prototype.getComponent = function(compData) {
		 //Asking to BaseEditor to create a component
		 this.createCompData($(compData));
		 };

	 };

	 return objSliderEditor;
	 */

	AnimationPlayerEditor = BaseEditor.extend({
		defaultCompData : {}
	});

	/**
	 * Will be invoked by Editor when an AnimationPlayerComponent needed.
	 * @param {Object} compData
	 * @return none
	 * @memberof AnimationPlayerEditor
	 */
	AnimationPlayerEditor.prototype.getComponent = function(compData, isSimComp) {
        this.isSimComp = isSimComp;
		//Asking to BaseEditor to create a component
        var objData = (compData.data !== undefined) ? compData : $(compData);
		this.createCompData(objData);
	};

	/**
	 * Preparing constructor data for component which will be passed to component
	 * through its constructor method.
	 * @param {Object} compData
	 * @return none
	 * @memerof AnimationPlayerEditor
	 */
	AnimationPlayerEditor.prototype.createCompData = function(compData) {
		this.defaultCompData = this.prepareDefaultData(compData);
		if (this.defaultCompData === undefined) {
			throw new Error(this.errorConst.ANIMATION_PLAYER_DEFAUTL_DATA_MISSING);
		}
		this.createComponent(compData);
	};

	/**
	 * Overriding 'BaseEditor' method to get notifiy when component class is
	 * required successfully.
	 * This method is also resposible to append default data for slider component
	 * in objComponent (received as parameter when component created successfully)
	 *
	 * @param {Object} objComponent slider coponent class signature
	 * @return none
	 * @memberof AnimationPlayerEditor
	 */
	AnimationPlayerEditor.prototype.onComponentCreationComplete = function(objComponent) {
		this.objComp = objComponent;
		this.objComp.defaultData = this.defaultCompData;
		this.componentCreated();
	};
	
	/**
	 * By overriding 'appendChild' method of BaseClass, the 'AnimationPlayer' component
	 * return the false to avoid add element in dom, and this class will work as a controller
	 * class.
	 * 
	 * true or false will return by this mehtod as boolean. true means engine will call
	 * objComp.show() method to add component in DOM element, false means this class 
	 * have to performe as a controller object.
	 * 
	 * @param {Object} htmlData DOM element reference
	 * @param {Object} objCompData loaded component data
	 * @param {Object} objComp component reference
	 * @return {Boolean} true/false 
	 * @memberof AnimationPlayerEditor
	 * 
	 */
	AnimationPlayerEditor.prototype.appendChild = function(htmlData, objCompData, objComp) {
		var objCompDiv, objCompDivParent, regionDiv;
		objCompDiv = $(htmlData).find('[id=' + objCompData.id + ']');
		objCompDiv.removeAttr("type");
		objCompDiv.removeAttr("defaultData");
		objCompDiv.removeAttr("compname");
		objCompDiv = undefined;
		return false;
	};

	/**
	 * This method destroy the sliderEditor class.
	 * @param none
	 * @return none
	 * @memberof AnimationPlayerEditor
	 * @access private
	 */
	AnimationPlayerEditor.prototype.destroy = function()
	{
		return AnimationPlayerEditor.__super__.destroy(true, this);
	};

	return AnimationPlayerEditor;
});
