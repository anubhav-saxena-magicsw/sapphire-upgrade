/*jslint nomen: true*/
/*globals Backbone,_,$, console*/

/**
 * MultipleChoiceEditor
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/editor/case-editor'], function(Marionette, CaseEditor) {'use strict';
	var MultipleChoiceEditor;

	/**
	 * MultipleChoiceEditor is responsible to load and return slider component class
	 * signature and also prepare default data which is required by an slider
	 * to initlized itself
	 *
	 *@augments MultipleChoiceEditor
	 *@example
	 *Load module
	 *
	 var objMultipleChoiceEditor = BaseEditor.extend({

	 MultipleChoiceEditor.prototype.getComponent = function(compData) {
	 //Asking to BaseEditor to create a component
	 this.createCompData($(compData));
	 };

	 };

	 return objMultipleChoiceEditor;
	 */

	MultipleChoiceEditor = CaseEditor.extend({
	});

	

	/**
	 * This method destroy the MultipleChoiceEditor class.
	 * @param none
	 * @return none
	 * @memberof MultipleChoiceEditor
	 * @access private
	 */
	MultipleChoiceEditor.prototype.destroy = function() {
		return MultipleChoiceEditor.__super__.destroy(true, this);
	};

	return MultipleChoiceEditor;
});
