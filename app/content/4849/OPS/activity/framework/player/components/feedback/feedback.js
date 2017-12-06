/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * Feedback
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['components/case/case'], function(Case) {
	'use strict';
	var Feedback;

	/**
	 *Extending case component to inherit the
	 * child add capabilities
	 */
	Feedback = Case.extend({
		objData : null,
		objChildDict : {},
		template : _.template(''),

		initialize : function(objData) {
			this.objChildDict = {};
			this.objData = objData;//this property is being used in componentselector for editing.
			this.componentType = "feedback";
		},

		onRender : function() {
			if (this.objData.styleClass !== undefined) {
				$(this.$el).addClass(this.objData.styleClass);
				$(this.el).attr('id', this.strCompId);
			}
			if (this.bEditor === true) {
				this.show();
			} else {
				this.hide();
			}
		},

		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		}
	});

	/** feedbackShowEvent **/
	Feedback.prototype.FEEDBACK_SHOWN_EVENT = "feedbackShowEvent";

	/** correctFeedbackShown **/
	Feedback.prototype.CORRECT_FEEDBACK_SHOW = "correctFeedbackShown";

	/** incorrectFeedbackShown **/
	Feedback.prototype.INCORRECT_FEEDBACK_SHOW = "incorrectFeedbackShown";

	/** feedbackHideEvent **/
	Feedback.prototype.FEEDBACK_HIDE_EVENT = "feedbackHideEvent";

	/**
	 * This method is responsible to check that given component type
	 * can be added in its dom or not
	 * will return true if given component type (in parameter) can be added
	 * in its dom.
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof Feedback#
	 */
	Feedback.prototype.isValid = function(strCompType) {
		var bValid;
		bValid = (strCompType === "radio" || strCompType === "answer") ? false : true;
		return bValid;
	};

	Feedback.prototype.addChild = function(objChild) {
		var childComp = objChild.component, type;
		this.objChildDict[childComp.getID()] = childComp;
		this.Super.prototype.addChild.call(this, objChild);
	};

	/**
	 * Show the correct or incorrect feedback element and trigger the
	 * events
	 * @param {Object} bPositiveFeedback
	 * @return {none}
	 */
	Feedback.prototype.showFeedback = function(bPositiveFeedback) {
		this.$el.children().hide();
		this.customEventDispatcher(this.FEEDBACK_SHOWN_EVENT, this, this);
		if (bPositiveFeedback === true) {
			if ($(this.$el.children()[1]).attr('id') && this.objChildDict[$(this.$el.children()[0]).attr('id')].componentType === "audiohotspot") {
				this.handleFeedbackChild(this.objChildDict[$(this.$el.children()[0]).attr('id')], false);
			} else {
				this.handleFeedbackChild($(this.$el.children()[0]), true);
			}
			this.customEventDispatcher(this.CORRECT_FEEDBACK_SHOW, this, this);
		} else if (bPositiveFeedback === false) {
			if ($(this.$el.children()[1]).attr('id') && this.objChildDict[$(this.$el.children()[1]).attr('id')].componentType === "audiohotspot") {
				this.handleFeedbackChild(this.objChildDict[$(this.$el.children()[1]).attr('id')], false);
			} else {
				this.handleFeedbackChild($(this.$el.children()[1]), true);
			}
			this.customEventDispatcher(this.INCORRECT_FEEDBACK_SHOW, this, this);
		}
	};

	Feedback.prototype.handleFeedbackChild = function(objChild, bShow) {
		if (bShow === true) {
			objChild.show();
			this.show();
		} else if (objChild.componentType === "audiohotspot") {
			objChild.play();
		}

	};

	/**
	 *hiding the feedback
	 * @param {none}
	 * @return {none}
	 */
	Feedback.prototype.hideFeedback = function() {
		this.$el.children().hide();
		this.hide();
		this.customEventDispatcher(this.FEEDBACK_HIDE_EVENT, this, this);
	};

	Feedback.prototype.Super = Case;

	Feedback.prototype.destroy = function() {
		delete this.objData;
		return this.Super.prototype.destroy.call(this, true);
	};

	return Feedback;
});
