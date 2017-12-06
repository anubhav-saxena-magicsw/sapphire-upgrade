/*jslint nomen: true*/
/*globals Data_Loader, console ,_, $  */
/**
 * WebServiceManager
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */

/*jslint newcap:true */

define(['marionette', "backbone", 'player/controllers/webservice-controller', 'player/events/eventsconst', 'player/constants/errorconst', 'player/constants/webservice-const', 'player/constants/playerconst'],
/**
 * Class "WebService" allow MPlayer to communicate to outer world.
 *
 * @class WebServiceManager
 * @example
 * Load module
 * require(['player/Manager/webservice-manager'], function(WebServiceManager) {
 *     var objWebServiceManager = new WebServiceManager();
 * });
 * @access private
 */
function(Marionette, Backbone, WebServiceController, EventConst, ErrorConst, WebServiceConst, PlayerConst) {
	'use strict';

	var WebServiceManager = Backbone.Marionette.Controller.extend({
		objPlayerRef : undefined,
		objWebConfigData : undefined,
		objServiceController : undefined,

		constructor : function(playerRef, webConfig) {
			this.objWebConfigData = webConfig;
			this.objPlayerRef = playerRef;
			this.initServiceController();
		},

		managerTask : function(objEventData) {
			this.objServiceController.manageServiceRequest(objEventData);
		},

		initServiceController : function() {
			if (this.objServiceController === undefined || this.objServiceController === null) {
				this.objServiceController = WebServiceController.getInstance();
				this.objServiceController.initWebService(this.objWebConfigData, EventConst, ErrorConst, WebServiceConst);
			}
		}
	});

	return WebServiceManager;
});
