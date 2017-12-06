/**
 * Router
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

define(['marionette'], function(Marionette) {'use strict';

	/**
	 *DESCRIPTION OF MODULE TO GOI HERE
	 *@class Router
	 * @access private
	 *@extends Marionette.AppRouter
	 *@example
	 * var router = new Router();
	 */

	var router = /** @lends router.prototype */
	Marionette.AppRouter.extend({
		appRoutes : {

			//'launchActivityByIndex':'activityLaunchByIndex',
			//	'launchActivityByName':'activityLaunchByName'
		}

		//'launchActivityByIndex':'activityLaunchByIndex',

	});
	return router;
});
