/*jslint nomen: true*/
/*globals Backbone,_,Data_Loader*/

/**
 * FactoryManager
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

define(['marionette', 'player/factory/factory'], function(Marionette, Factory) {"use strict";
	var FactoryManager;

	//TODO: This class will also manage warehouse in future, which we will add in later development.//

	/**
	 * This class is the key class of component creation. playerHelper creating an object and
	 * will always ask to create dynamic components when required by an activity and further
	 * task related to component creation and will be managed or distrubuted by this class.
	 *
	 * A Factory class is introduced to divide sharing the component creation responsibility.
	 * @class FactoryManager
	 * @access private
	 */

	FactoryManager = Backbone.Marionette.Controller.extend({

		objFactory : undefined,
		objMPlayer : undefined,

		constructor : function(objPlayerRef) {
			this.objFactory = undefined;
			this.objMPlayer = objPlayerRef;
			this.initlize();
		}
	});

	/**
	 * Called on creation complete of object
	 *@access private
	 *@memberof FactoryManager#
	 *@param {Object} objData contains the event reference
	 *@returns None
	 */
	FactoryManager.prototype.onComponentCreationComplete = function(objData) {
		this.objMPlayer.getPlayerHelper().getRegionManager().onComponentCreationComplete(objData);
	};

	/**
	 * Initializes factory
	 *@access private
	 *@memberof FactoryManager#
	 *@param None
	 *@returns None
	 */
	FactoryManager.prototype.initlize = function() {
		var objClassRef = this;
		this.objFactory = new Factory();
		this.objFactory.on(this.objFactory.COMP_CREATION_COMPLETE_EVENT, this.onComponentCreationComplete, objClassRef);
	};
	/**
	 * Called on creation complete of object
	 *@access private
	 *@memberof FactoryManager#
	 *@param {Object} objData contains the event reference
	 *@returns None
	 */
	FactoryManager.prototype.createComponent = function(objData) {
		//Asking to Factory for Component.
		this.objFactory.getComponent(objData);
	};

	/**
	 * Method getComponent will be invoked when a component needs to be created
	 * by activity during runtime.
	 * This method will be called from 'ActivityManager' class.
	 * @access public
	 * @memberof FactoryManager#
	 * @param {Object} objData comonent details which needs to be ceated
	 * @return none;
	 */
	FactoryManager.prototype.getComponent = function(objData) {
		this.createComponent(objData);
	};

	/**
	 * Destroys factory object
	 * @access public
	 * @memberof FactoryManager#
	 * @param {Object} objData comonent details which needs to be ceated
	 * @return none;
	 */
	FactoryManager.prototype.destroy = function(objData) {
		this.objFactory.off(this.objFactory.COMP_CREATION_COMPLETE_EVENT);
		this.objFactory = undefined;
		
		return true;
	};

	return FactoryManager;

});
