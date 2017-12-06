/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * AnswerEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/case-editor'], function(Marionette, CaseEditor) {'use strict';
	var AnswerEditor;

	/**
	 * AnswerEditor is responsible to load and return slider component class
	 * signature and also prepare default data which is required by an slider
	 * to initlized itself
	 *
	 *@augments AnswerEditor
	 *@example
	 *Load module
	 *
	 var objAnswerEditor = BaseEditor.extend({

	 AnswerEditor.prototype.getComponent = function(compData) {
	 //Asking to BaseEditor to create a component
	 this.createCompData($(compData));
	 };

	 };

	 return objAnswerEditor;
	 */

	AnswerEditor = CaseEditor.extend({
	});

	

	/**
	 * This method destroy the AnswerEditor class.
	 * @param none
	 * @return none
	 * @memberof AnswerEditor
	 * @access private
	 */
	AnswerEditor.prototype.destroy = function() {
		return AnswerEditor.__super__.destroy(true, this);
	};

	return AnswerEditor;
});
