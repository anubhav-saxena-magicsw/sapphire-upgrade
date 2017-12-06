/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/
/**
 * View
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

define(['marionette',
	'player/base/base-item-comp'],

/**
 *A module representing a Life.
 *@class View
 *@augments BaseItemComp
 *@access private
 */

function (Marionette, BaseItemComp) {
	
	'use strict';
	var View = BaseItemComp.extend({
		template : _.template(""),
		tagName : "div",
		
		/**
         * This initializes the View.
         * @memberof View
         * @param {type} objViewData
         * @returns {undefined}
         * @access private
         */
		
		initialize : function () {
			var objThis = this;
			this.onRender();
			objThis.listenTo(objThis.model, 'change : isVisible', objThis.visibilityChange);
			//objThis.listenTo(objThis.model, 'change : viewContent', objThis.contentChanged);
			objThis.listenTo(objThis.model, 'change : isVisible', objThis.classChanged);									
		},
		
		/**
         * This render the View.
         * @memberof View
         * @param None         
         * @returns {undefined}
         * @access private
         */
				
		onRender : function () {
									
			var objThis = this;
			$(objThis.el).addClass(objThis.model.get('Viewclass'));						
			$(objThis.el).empty();
			$(objThis.el).append(objThis.model.get('viewContent'));
			
			if (!this.model.get('isVisible')) {
				$(objThis.el).css({
					visibility : 'hidden'
				});
			}
			else {
				$(objThis.el).css({
					visibility : 'visible'
				});
			}								
		},
		
		/**
		 * To Change the visibility of view.
		 * @memberof View
		 * @param none.
		 * @returns none.
		 * @access private
		 */
		
		visibilityChange : function () {
			var objThis = this;
			if (!objThis.model.get('isVisible')) {
				$(objThis.el).css({
					visibility : 'hidden'
				});
			}
			else {
				$(objThis.el).css({
					visibility : 'visible'
				});
			}
		},
		
		/**
		 * To Change the class of view.
		 * @memberof View
		 * @param none.
		 * @returns none.
		 * @access private
		 */
		
		classChanged : function () {
			var objThis = this;
			$(objThis.el).addClass(objThis.model.get('Viewclass'));	
		},
		
		/**
		 * To Change the class of view.
		 * @memberof View
		 * @param none.
		 * @returns none.
		 * @access private
		 */
		
		contentChanged : function () {
			var objThis = this;
			$(objThis.el).empty();
			$(objThis.el).append(objThis.model.get('viewContent'));
		}

	}); 
	

	return View;
});
