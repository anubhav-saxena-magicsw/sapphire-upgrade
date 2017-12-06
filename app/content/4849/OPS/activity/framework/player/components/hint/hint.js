/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * HintComp
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['components/feedback/feedback'], function(Feedback) {
	'use strict';
	var HintComp;

	/**
	 * @class HintComp
	 * Class 'HintComp' is introduced to provide a Hint feature in the framework. This Class is extended from the feedback class.
	 *
	 * This Component will only accept 'Video' or 'Audio' or 'Image' or 'label' or 'Case' component as its child.
	 *
	 * This Component have two public function:-
	 * 1) showHint - Will show/play the hint according to the child present in the hint component.
	 * 2) hideHint - Will hide/stop the hint according to the child present in the hint component.
	 *
	 * When a 'Case' is inserted inside Hint Component and audio/video is the sub-child of that 'Case' then
	 * user have to write his/her own functions(showHint and hideHint) to play/stop the inside content.
	 *
	 */

	HintComp = Feedback.extend({
		objData : null,
		template : _.template(''),
		objChild : null,

		initialize : function(objData) {
			this.objData = objData;//this property is being used in componentselector for editing.
			this.componentType = "hint";
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

	/** HintShowEvent **/
	HintComp.prototype.HINT_SHOWN_EVENT = "hintShowEvent";

	/** hintHideEvent **/
	HintComp.prototype.HINT_HIDE_EVENT = "hintHideEvent";

	HintComp.prototype.HINT_LABEL = 'label';

	HintComp.prototype.HINT_VIDEO = 'video';

	HintComp.prototype.HINT_AUDIO = 'audiohotspot';

	HintComp.prototype.HINT_IMAGE = 'image';

	HintComp.prototype.HINT_CASE = 'case';

	/**
	 * This method is responsible to check that given component type
	 * can be added in its dom or not
	 * will return true if given component type (in parameter) can be added
	 * in its dom.
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof HintComp#
	 */
	HintComp.prototype.isValid = function(strCompType) {
		var bValid;
		bValid = (strCompType === "audiohotspot" || strCompType === "label" || strCompType === "videoplayer" || strCompType === "image" || strCompType === "case") ? true : false;
		return bValid;
	};

	/**
	 * Store child reference and pass child to its super class
	 *
	 * @access private
	 * @memberof HintComp#
	 */
	HintComp.prototype.addChild = function(objChild) {
		this.objChild = objChild.component;
		if (this.objChild.componentType === this.HINT_AUDIO && this.bEditor === false) {
			this.$el.hide();
		}

		this.HintCompSuper.prototype.addChild.call(this, objChild);
	};

	/**
	 * Hide the Hint element and trigger the
	 * events
	 * @param {none}
	 * @return {none}
	 * @access public
	 * @memberof HintComp#
	 */
	HintComp.prototype.hideHint = function() {
		this.$el.hide();
		if (this.objChild.componentType === this.HINT_VIDEO || this.objChild.componentType === this.HINT_AUDIO) {
			this.objChild.stop();
		}
		this.customEventDispatcher(this.HINT_HIDE_EVENT, this, this);
	};

	/**
	 * Show the Hint element and trigger the
	 * events
	 * @param {none}
	 * @return {none}
	 * @access public
	 * @memberof HintComp#
	 */
	HintComp.prototype.showHint = function() {
		var scope, timer;
		if ( typeof this.objData.time !== 'undefined') {
			if ((this.objData.time !== '' && this.objData.time !== null) && (this.objChild.componentType === this.HINT_LABEL || this.objChild.componentType === this.HINT_IMAGE || this.objChild.componentType === this.HINT_CASE)) {
				timer = parseInt(this.objData.time * 1000);
				scope = this;
				setTimeout(function() {
					scope.hideHint();
				}, timer);
			}
		}

		if (this.objChild.componentType === this.HINT_LABEL || this.objChild.componentType === this.HINT_IMAGE || this.objChild.componentType === this.HINT_CASE) {
			this.$el.show();
		} else if (this.objChild.componentType === this.HINT_VIDEO) {
			this.$el.show();
			this.objChild.play();
		} else if (this.objChild.componentType === this.HINT_AUDIO) {
			this.objChild.play();
		}
		this.customEventDispatcher(this.HINT_SHOWN_EVENT, this, this);
	};

	HintComp.prototype.HintCompSuper = Feedback;

	HintComp.prototype.destroy = function() {
		delete this.objData;
		this.hideHint();
		this.objChild = null;
		return this.HintCompSuper.prototype.destroy.call(this, true);
	};

	return HintComp;
});
