/*jslint nomen: true*/
/*globals Backbone,_,console,$, class */

/**
 * ActivityController
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */
define(['marionette', 'player/events/eventsconst', 'player/utils/data-loader', 'player/constants/errorconst', 'player/components/toolbox/toolbox'], function(Marionette, eventconst, DataLoader, errorConst, Toolbox) {"use strict";
	var ToolboxController;

	/**
	 * Class 'ToolboxController' is controller class for a activity area. this class is responsible to keep up-to-date activity with
	 * updated value which can be changed during run time. e.g new scaled value.
	 *
	 *
	 *@access private
	 *@class ToolboxController
	 *@augments Backbone.Marionette.Controller.extend
	 */

	ToolboxController = Backbone.Marionette.Controller.extend({
		
		toolboxData : undefined,
		objToolbox : undefined,

		constructor : function(toolData) {
			this.toolboxData = toolData;
			this.objToolbox = new Toolbox(toolData);
		}

	});

	
	/**
	 * Destroys the ToolboxController object.
	 * @memberOf ToolboxController#
	 * @param None
	 * @returns {Boolean} true or false
	 * @access private
	 */
	ToolboxController.prototype.destroy = function() {
		//this.destroyActivity();
	};

	return ToolboxController;
});
