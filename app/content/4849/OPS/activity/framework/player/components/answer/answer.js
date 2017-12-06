/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * AnswerBox
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['marionette', 'components/case/case', 'components/answer/model'], function(Marionette, Case, Model) {
	'use strict';
	var AnswerBox;

	AnswerBox = Case.extend({
		objData : null,
		comp_dict : [],
		template : _.template(''),
		feedback : null,
		optionButton : null,
		ans_list : [],
		feed_list : {},
		checkAnswerOptionClicked : null,
		objHintRef : undefined,

		initialize : function(objData) {
			this.comp_dict = [];
			this.feed_list = {};
			this.objData = objData;
			//this property is being used in componentselector for editing.
			this.model = new Model(objData);
			this.componentType = "answer";
		},
		onRender : function() {
			if (this.objData.styleClass !== undefined) {
				$(this.$el).addClass(this.objData.styleClass);
				$(this.el).attr('id', this.strCompId);
			}

		},
		onShow : function() {
			var self = this;
		}
	});

	AnswerBox.prototype.isValid = function(strCompType) {
		var bValid = false;
		bValid = (strCompType === "radio" || strCompType === "inputtext" || strCompType === "image" || strCompType === "label" || strCompType === "feedback" || strCompType === "hint" || strCompType === "button" || strCompType === "audiohotspot" ) ? true : false;
		return bValid;
	};

	AnswerBox.prototype.addChild = function(objChild) {
		var childComp = objChild.component,
		    type,
		    self = this;
		if (childComp.componentType === "radio" || childComp.componentType === "inputtext") {
			this.comp_dict.push(childComp);
			this.storeChilds(childComp);
		} else if (childComp.componentType === "hint") {
			this.objHintRef = childComp;
		} else if (childComp.componentType === "feedback") {
			this.feedback = childComp;
		} else if (childComp.componentType === "button") {
			this.optionButton = childComp;
			this.optionButton.on(this.optionButton.BUTTON_STATE_CHANGE, this.buttonStateChange, this);
			this.storeChilds(childComp);
		}

		this.AnswerSuper.prototype.addChild.call(this, objChild);
	};

	AnswerBox.prototype.checkAnswer = function(bReturnIgnore) {
		if (this.optionButton !== null) {
			return this.verifyToggleButton(bReturnIgnore);
		}
		var strAnswer,
		    isCorrect = false,
		    objClassRef = this,
		    count = 0,
		    answerStr,
		    arrAnswer,
		    i,
		    tmpCheck = true;
		if (this.objData.answer === undefined || this.objData.answer.length < 1 || this.objData.answer === "") {
			if (bReturnIgnore === true) {
				return "ignore";
			}
			for ( i = 0; i < objClassRef.comp_dict.length; i = i + 1) {
				if (objClassRef.comp_dict[i].componentType === "inputtext") {
					if (objClassRef.comp_dict[i].getValue().length === 0) {
						isCorrect = true;
					}
				} else {
					if (!objClassRef.comp_dict[i].isSelected()) {
						isCorrect = true;
					}
				}
			}
			return isCorrect;
		} else {
			var compType,ans,arrAns = [];
			strAnswer = this.objData.answer;
			if (objClassRef.comp_dict.length > 1) {
				for ( i = 0; i < objClassRef.comp_dict.length; i = i + 1) {
					compType = objClassRef.comp_dict[i].componentType;
					if (compType === "inputtext") {
						ans = objClassRef.comp_dict[i].getValue();
						arrAns = (arrAns == '' ? ans : arrAns + "|" + ans);
					}
				}
				(strAnswer === arrAns ? isCorrect = true : isCorrect = false);
			} else {
				if (strAnswer === objClassRef.comp_dict[0].getValue()) {
					if (objClassRef.comp_dict[0].componentType === "inputtext") {
						isCorrect = true;
					} else {
						isCorrect = objClassRef.comp_dict[0].isSelected();
					}
				}
			}
		}

		if (this.feedback !== null) {
			this.feedback.showFeedback(isCorrect);
		}

		return isCorrect;
	};

	AnswerBox.prototype.isRetrnIgnore = function(bReturnIgnore) {
		if (this.objData.answer === undefined || this.objData.answer.length < 1 || this.objData.answer === "") {
			if (bReturnIgnore === true) {
				return "ignore";
			}
		}
		return false;
	};

	AnswerBox.prototype.verifyToggleButton = function(bReturnIgnore) {
		var strAnswer,
		    isCorrect = false,
		    objClassRef = this,
		    count = 0,
		    answerStr,
		    arrAnswer,
		    i,
		    tmpCheck = true;
		var bReturnIgnore = this.isRetrnIgnore(bReturnIgnore);
		if (bReturnIgnore !== false) {
			return bReturnIgnore;
		}
		if (this.objData.answer === undefined || this.objData.answer.length < 1 || this.objData.answer === "") {
			isCorrect = (this.optionButton.bSelected === false);
		} else {

			isCorrect = (this.optionButton.bSelected === true);
		}

		if (this.feedback !== null) {
			this.feedback.showFeedback(isCorrect);
		}

		return isCorrect;
	};

	AnswerBox.prototype.setState = function(bState) {
		var i,
		    that = this;
		if (this.comp_dict.length >= 1) {
			for ( i = 0; i < this.comp_dict.length; i = i + 1) {
				if (this.comp_dict[i].$el.find('input').attr('type') === "text") {
					this.comp_dict[i].$el.find('input').val(that.feed_list[this.comp_dict[i].getID()]);
				} else if (bState) {
					this.comp_dict[i].$el.find('input').get(0).checked = true;
				}
			}
		}
	};

	AnswerBox.prototype.buttonStateChange = function(objEvent) {
		if (objEvent.customData === true) {
			this.customEventDispatcher(objEvent.type, this, objEvent.customData);
		}
	};

	AnswerBox.prototype.changeBtnState = function(objEvent) {
		this.checkAnswerOptionClicked = objEvent.options.answer;
		this.optionButton.setSelected(false);
	};

	AnswerBox.prototype.getState = function() {
		var i,
		    that = this;
		if (this.comp_dict.length >= 1) {
			for ( i = 0; i < this.comp_dict.length; i = i + 1) {
				if (this.comp_dict[i].$el.find('input').attr('type') === "text") {
					that.feed_list[this.comp_dict[i].getID()] = this.comp_dict[i].$el.find('input').val();
				} else {
					return this.comp_dict[i].$el.find('input').is(':checked');
				}
			}
		}
	};

	AnswerBox.prototype.disable = function(disable) {
		var str,
		    strValue,
		    objComp,
		    x;
		strValue = this.model.get("compids");
		str = strValue.split("|");
		for ( x = 0; x < str.length; x = x + 1) {
			$('#' + str[x]).attr('disabled', true);
		}
	};

	AnswerBox.prototype.showAnswer = function() {
		var i,objClassRef = this,arr = this.objData.answer.split("|");
		if (this.comp_dict.length == 1) {
			if (this.comp_dict[0].componentType === "inputtext") {
				this.comp_dict[0].setText(this.objData.answer);
				if (this.feedback) {
					this.feedback.hideFeedback();
				}
			} else {
				if (this.checkAnswer(true) === false) {
					this.comp_dict[0].$input[0].checked = true;
				} else if (this.checkAnswer(true) === "ignore") {
					this.comp_dict[0].$input[0].checked = false;
				}
			}
		} else if(this.comp_dict.length > 1) { 
			if (this.comp_dict[0].componentType === "inputtext") {
				for ( i = 0; i < objClassRef.comp_dict.length; i = i + 1) {
					this.comp_dict[i].setText(arr[i]);
				}
				if (this.feedback) {
					this.feedback.hideFeedback();
				}
			}
		}
		//objClassRef.customEventDispatcher("answerEvent", objClassRef, isCorrect);
	};

	AnswerBox.prototype.reset = function() {
		var str,
		    strValue,
		    objComp,
		    x;
		strValue = this.model.get("compids");
		str = strValue.split("|");

		for ( x = 0; x < str.length; x = x + 1) {
			objComp = this[str[x]];
			if (this.comp_dict[0].componentType === "inputtext") {
				objComp.setText('');
			} else {
				objComp.$input.removeAttr("checked");
			}
		}
		if (this.feedback) {
			//this.feedback.hideFeedback();
		}

		this.hideHint();
		this.hideFeedback();
	};

	AnswerBox.prototype.showFeedback = function() {
		this.checkAnswer(true);
	};

	AnswerBox.prototype.hideFeedback = function() {
		if (this.feedback) {
			this.feedback.hide();
		}
	};

	AnswerBox.prototype.showHint = function() {
		if (this.objHintRef) {
			this.objHintRef.showHint();
		}
	};

	AnswerBox.prototype.hideHint = function() {
		if (this.objHintRef) {
			this.objHintRef.hideHint();
		}
	};

	AnswerBox.prototype.selectedState = function() {
		if (!this.optionButton.bSelected) {
			this.customEventDispatcher("click", this, this);
			this.customEventDispatcher("compClick", this, this);
		} else {
		}
	};

	AnswerBox.prototype.storeChilds = function(objComp) {
		var arr,
		    ind,
		    strValue;
		strValue = this.model.get("compids");
		if (strValue.length > 0) {
			arr = strValue.split("|");
		} else {
			arr = [];
		}
		ind = arr.indexOf(objComp.getID());
		if (ind < 0) {
			arr.push(objComp.getID());
			this.model.set("compids", arr.join("|"));
			return true;
		}
		return false;
	};

	AnswerBox.prototype.AnswerSuper = Case;

	AnswerBox.prototype.destroy = function() {
		this.comp_dict = [];
		this.feedback = null;
		return this.AnswerSuper.prototype.destroy.call(this, true);
	};

	return AnswerBox;
});
