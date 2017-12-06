/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * FlipCardComp
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['components/case/case', 'css!components/flipcard/css/flipcard.css'], function(Case) {
	'use strict';
	var FlipCardComp;
	/**
	 * @class FlipCardComp
	 *
	 *
	 */

	FlipCardComp = Case.extend({
		objData : null,
		template : _.template(''),
		objChildList : undefined,
		movement : null,
		flipCardValue : null,
		comp_state_obj : null,

		initialize : function(objData) {
			this.objChildList = [];
			this.objData = objData;
			this.comp_state_obj = {
				'face' : 'front'
			};
			if ( typeof this.objData.state === 'object') {
				this.comp_state_obj = this.objData.state;
				this.setState(this.comp_state_obj);
			}
			//this property is being used in component selector for editing.
			this.componentType = "flipcard";
			this.movement = objData.movement;
			this.setValue();
		},

		onRender : function() {
			var scope = this;
			if (this.objData.styleClass !== undefined) {
				this.$el.addClass(this.objData.styleClass);
				this.$el.attr('id', this.strCompId);
			}

			if (this.bEditor === false) {
				this.$el.addClass('card');
				this.$el.on('click', function(e) {
					scope.moveCard();
				});
			}

		

		},

		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		}
	});

	/**
	 * This method is responsible to get the value of the flipCard Comp.
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 * @memberof FlipCardComp#
	 */
	FlipCardComp.prototype.getValue = function() {
		return this.flipCardValue;
	};

	/**
	 * This method is responsible to set the value of the flipCard Comp.
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 * @memberof FlipCardComp#
	 */
	FlipCardComp.prototype.setValue = function() {
		this.flipCardValue = this.objData.value;
	};

	/**
	 * This method is responsible to flip the flipCard Comp.
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 * @memberof FlipCardComp#
	 */
	FlipCardComp.prototype.moveCard = function() {
		var flipCardMovement = this.FLIP_MOVEMENT_VERTICAL_CLASS;
		if (this.movement === this.FLIP_MOVEMENT_HORIZONTAL) {
			flipCardMovement = this.FLIP_MOVEMENT_HORIZONTAL_CLASS;
		}
		if (this.$el.hasClass(flipCardMovement)) {
			this.$el.removeClass(flipCardMovement);
			this.customEventDispatcher(this.FLIPPED_BACK, this, this.getValue());
		} else {
			this.$el.addClass(flipCardMovement);
			this.customEventDispatcher(this.FLIPPED_FRONT, this, this.getValue());
		}

	};

	/**
	 * This method is responsible to get the present State flipCard Comp.
	 * @param {NULL}
	 * @return {object} comp_state_obj
	 * @access public
	 * @memberof FlipCardComp#
	 */
	FlipCardComp.prototype.getState = function() {
		this.comp_state_obj['face'] = 'front';
		if (this.$el.hasClass(this.FLIP_MOVEMENT_HORIZONTAL_CLASS) || this.$el.hasClass(this.FLIP_MOVEMENT_VERTICAL_CLASS)) {
			this.comp_state_obj['face'] = 'back';
		}
		this.customEventDispatcher(this.GET_STATE_EVENT, this, this.comp_state_obj);
		return this.comp_state_obj;
	};

	/**
	 * This method is responsible to set the  State flipCard Comp.
	 * @param {object} obj
	 * @return {NULL}
	 * @access public
	 * @memberof FlipCardComp#
	 */
	FlipCardComp.prototype.setState = function(obj) {
		if ( typeof obj === 'object') {
			if ( typeof obj['face'] !== undefined) {
				var face = obj['face'], style;
				if (face === 'back' || (face === 'front' && (this.$el.hasClass(this.FLIP_MOVEMENT_HORIZONTAL_CLASS) || this.$el.hasClass(this.FLIP_MOVEMENT_VERTICAL_CLASS)))) {
					style = this.$el.attr("style");
					if (!style) {
						style = "";
					}
					this.$el.css("-webkit-transition", "0s");
					this.moveCard();
					this.$el.attr("style", style);
				}
				this.customEventDispatcher(this.SET_STATE_EVENT, this, this);
			}
		}

	};

	/** FLIPChangeEvent **/
	FlipCardComp.prototype.FLIPPED_BACK = "flipCardBackFlippedEvent";

	/** FLIPEnableEvent **/
	FlipCardComp.prototype.FLIPPED_FRONT = "flipCardFrontFlippedEvent";

	FlipCardComp.prototype.FLIP_MOVEMENT_HORIZONTAL = "horizontal";

	FlipCardComp.prototype.FLIP_MOVEMENT_VERTICAL = "vertical";

	FlipCardComp.prototype.FLIP_MOVEMENT_HORIZONTAL_CLASS = "flippedHorizontal";

	FlipCardComp.prototype.FLIP_MOVEMENT_VERTICAL_CLASS = "flippedVertical";

	FlipCardComp.prototype.FLIP_FRONT_DUMMY = "front-face";

	FlipCardComp.prototype.FLIP_BACK_DUMMY = "back-face";

	FlipCardComp.prototype.FLIP_CARD_BACK_HORIZONTAL = "backflipcardHorizontal";

	FlipCardComp.prototype.FLIP_CARD_BACK_VERTICAL = "backflipcardVertical";

	FlipCardComp.prototype.FLIP_DISABLED_CLASS = "disableflipcard";

	FlipCardComp.prototype.FLIPCARD_ENABLED = "flipcardEnable";

	FlipCardComp.prototype.FLIPCARD_DISABLED = "flipcardDisable";

	FlipCardComp.prototype.GET_STATE_EVENT = "getStateEvent";

	FlipCardComp.prototype.SET_STATE_EVENT = "setStateEvent";

	/**
	 * This method is responsible to check that given component type
	 * can be added in its dom or not
	 * will return true if given component type (in parameter) can be added
	 * in its dom.
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof FlipCardComp#
	 */
	FlipCardComp.prototype.isValid = function(strCompType) {
		var bValid;
		bValid = (strCompType === "case") ? true : false;
		return bValid;
	};

	/**
	 * Store child reference and pass child to its super class
	 *
	 * @access private
	 * @memberof FlipCardComp#
	 */
	FlipCardComp.prototype.addChild = function(objChild) {

		var length = this.objChildList.length;
		if (length > 1) {
			return;
		}
		var addClassFlip = 'frontflipcard';
		var addClassFlipDummy = this.FLIP_FRONT_DUMMY;
		if (length === 1) {
			addClassFlip = this.FLIP_CARD_BACK_HORIZONTAL;
			if (this.movement === 'vertical') {
				addClassFlip = this.FLIP_CARD_BACK_VERTICAL;
			}

			addClassFlipDummy = this.FLIP_BACK_DUMMY;
		}

		objChild.component.index = parseInt(length + 1);
		objChild.component.$el.attr('index', parseInt(length + 1));
		this.objChildList[length] = objChild.component;

		this.FlipCardCompSuper.prototype.addChild.call(this, objChild);

		if (this.bEditor === false) {
			objChild.component.$el.addClass(addClassFlip);
		} else {
			objChild.component.$el.addClass(addClassFlipDummy);
			this.viewChange(this.objData.view);
		}

	};

	/**
	 * This function is use to change the View of the FlipCard
	 * or movement of it when it is changed from panel.
	 *
	 * @param {string} strPropertyName -
	 * @param {string} strPropertyValue -
	 *
	 * @access public
	 * @memberof FlipCardComp#
	 */
	FlipCardComp.prototype.attrChange = function(strPropertyName, strPropertyValue) {

		if (strPropertyName === 'view') {
			this.viewChange(strPropertyValue);
		} else if (strPropertyName === 'movement') {
			this.movement = strPropertyValue;
			this.$el.removeClass(this.FLIP_MOVEMENT_HORIZONTAL_CLASS).removeClass(this.FLIP_MOVEMENT_VERTICAL_CLASS);
		}

	};

	/**
	 * This function is use to Enable the FlipCard.
	 *
	 * @param {null}
	 *
	 * @access public
	 * @memberof TabComp#
	 */
	FlipCardComp.prototype.enable = function() {
		this.$el.removeClass(this.FLIP_DISABLED_CLASS);
		this.customEventDispatcher(this.FLIPCARD_ENABLED, this, this);
	};

	/**
	 * This function is use to Disable the FlipCard.
	 *
	 * @param {null}
	 *
	 * @access public
	 * @memberof TabComp#
	 */
	FlipCardComp.prototype.disable = function() {
		this.$el.addClass(this.FLIP_DISABLED_CLASS);
		this.customEventDispatcher(this.FLIPCARD_DISABLED, this, this);
	};

	/**
	 * This function is use to change the View of the FlipCard
	 * for the editor mode only.
	 *
	 * @param {string} strPropertyValue -
	 *
	 * @access public
	 * @memberof FlipCardComp#
	 */
	FlipCardComp.prototype.viewChange = function(strPropertyValue) {

		if (strPropertyValue === this.FLIP_FRONT_DUMMY) {
			this.$el.find('.' + this.FLIP_BACK_DUMMY).hide();
			this.$el.find('.' + this.FLIP_FRONT_DUMMY).show();
		} else if (strPropertyValue === this.FLIP_BACK_DUMMY) {
			this.$el.find('.' + this.FLIP_FRONT_DUMMY).hide();
			this.$el.find('.' + this.FLIP_BACK_DUMMY).show();
		}

	};

	FlipCardComp.prototype.FlipCardCompSuper = Case;

	FlipCardComp.prototype.destroy = function() {
		delete this.objData;
		this.objChildList = null;
		this.$el.off('click');
		return this.FlipCardCompSuper.prototype.destroy.call(this, true);
	};

	return FlipCardComp;
});
