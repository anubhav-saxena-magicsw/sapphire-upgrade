/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * MultipleChoice
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['marionette', 'components/case/case', 'components/multiplechoice/model'], function(Marionette, Case, Model) {
	'use strict';
	var MultipleChoice;

	MultipleChoice = /** @lends VideoPlayer.prototype */

	Case.extend({
		objData : null,
		answer_dict : {},
		template : _.template(''),
		feedback : null,
		objHint : null,
		count : 0,
		comp_state_obj : {},
		model : null,
		clickedFlag : 0,
		clickcounter : 0,
		clickedStatus : false,
		bEditor : false,
		/**
		 * This function initializes the component
		 * @access private
		 * @memberof Multiple Choice
		 * @param {Object} options Contains the data to configure the component
		 * @returns None
		 */
		initialize : function(objData) {
			this.answer_dict = {};
			this.objData = objData;
			//this property is being used in componentselector for editing.
			this.model = new Model(objData);
			this.componentType = "multiplechoice";

		},
		onRender : function() {
			if (this.objData.styleClass !== undefined) {
				$(this.$el).addClass(this.objData.styleClass);
				$(this.el).attr('id', this.strCompId);
			}
		},
		onShow : function() {
			var self = this;
			if (this.model.get("shuffle")) {
				setTimeout(function() {
					self.shuffleOptions();
				}, 130);
			}
			setTimeout(function() {
				_.filter(self.answer_dict, function(item, key) {
					item.$el.find('[id^="button"]').parent().addClass('selectedbtntoggle').on('click', function(e) {
						self.clickcounter++;
						if (self.objData.setstate === 'scq' && self.bEditor === false) {
							$(this).parent().parent().find('span[id^="button"]').parent().removeClass('defaultbtntoggle').addClass('selectedbtntoggle');
							$(this).removeClass('selectedbtntoggle').addClass('defaultbtntoggle');

						}
						if (self.objData.setstate === 'mcq' && self.bEditor === false) {
							$(this).removeClass('selectedbtntoggle').addClass('defaultbtntoggle');
							if (self.clickcounter > 1) {
								$(this).removeClass('defaultbtntoggle').addClass('selectedbtntoggle');
								self.clickcounter = 0;
							}

						}

					});
				});
			}, 400);

		}
	});

	MultipleChoice.prototype.ANSWER_CHECK_COMPLETE_EVENT = "answerCheckCompleteEvent";
	MultipleChoice.prototype.SHOW_FEEDBACK_EVENT = "showFeedbackEvent";
	MultipleChoice.prototype.RESET_COMPLETE_EVENT = "resetCompleteEvent";
	MultipleChoice.prototype.CORRECT_ANSWER_SHOWN_EVENT = "correctAnswerShownEvent";
	MultipleChoice.prototype.DISABLE_COMPLETE_EVENT = "disabledEvent";
	MultipleChoice.prototype.ENABLE_COMPLETE_EVENT = "enabledEvent";
	MultipleChoice.prototype.ATTEMPT_OVER_EVENT = "attemptOverEvent";
	MultipleChoice.prototype.GET_STATE_EVENT = "getStateEvent";
	MultipleChoice.prototype.SET_STATE_EVENT = "setStateEvent";

	/**
	 * This function is used to add
	 * Answer Type and FeedBack Components in it.
	 *@memberof MultipleChoice#
	 *@access public
	 * @param Object
	 * @returns none
	 */

	MultipleChoice.prototype.addChild = function(objChild) {
		var childComp = objChild.component;
		if (childComp.componentType === "answer") {
			this.answer_dict[childComp.getID()] = childComp;
			if (this.bEditor === false) {
				childComp.on("answerEvent", this.handleAnswerEvent, this);
				childComp.on("btnStateChange", this.onAnswerbtnStateChange, this);
			}
			this.storeChilds(childComp);
		} else if (childComp.componentType === "hint") {
			this.objHint = childComp;
			if (this.bEditor === false) {
				//this.objHint.hide();
			}
		} else if (childComp.componentType === "feedback") {
			this.feedback = childComp;
			if (this.bEditor === false) {
				this.feedback.hide();
			}
		} else {
			console.log("invalid component");
		}
		this.MultipleChoiceSuper.prototype.addChild.call(this, objChild);

	};

	/**
	 * This method is responsible to check that given component type
	 * can be added in its dom or not
	 * will return true if given component type (in parameter) can be added
	 * in its dom.
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof MultipleChoice#
	 */
	MultipleChoice.prototype.isValid = function(strCompType) {
		var isvalid = false;
		isvalid = (strCompType === "answer" || strCompType === "feedback" || strCompType === "hint") ? true : false;
		return isvalid;
	};

	MultipleChoice.prototype.onAnswerbtnStateChange = function(e) {
		var self = this;
		if (this.objData.setstate === 'scq' && this.bEditor === false) {
			_.filter(self.answer_dict, function(item, key) {
				if (item.getID() !== e.target.getID()) {
					item.changeBtnState(e.target);
				}

			});

		}
	};

	MultipleChoice.prototype.handleAnswerEvent = function(objEvent) {
		console.log("answer event.....", objEvent);

	};
	/**
	 * This function is used to check the Answer
	 *@memberof MultipleChoice#
	 *@access public
	 * @param none
	 * @returns none
	 */
	MultipleChoice.prototype.checkAnswer = function() {
		var isCorrect = true;

		_.filter(this.answer_dict, function(item, key) {
			item.hideHint();
			if (item.checkAnswer() === false) {
				isCorrect = false;
			}
		});
		if (this.feedback !== null) {
			this.feedback.showFeedback(isCorrect);
		}
		this.attempt();
		this.customEventDispatcher(this.ANSWER_CHECK_COMPLETE_EVENT, this, isCorrect);
	};

	/**
	 * This function is used to Show the Hint of the Answer.
	 *@memberof MultipleChoice#
	 *@access public
	 * @param none
	 * @returns none
	 */
	MultipleChoice.prototype.showHint = function() {
		if (this.objHint !== null) {
			this.objHint.showHint();
		}
		_.filter(this.answer_dict, function(item, key) {
			item.showHint();
		});
	};

	/**
	 * This function is used to Hide the Hint of the Answer.
	 *@memberof MultipleChoice#
	 *@access public
	 * @param none
	 * @returns none
	 */
	MultipleChoice.prototype.hideHint = function() {
		if (this.objHint !== null) {
			this.objHint.hideHint();
		}
		_.filter(this.answer_dict, function(item, key) {
			item.hideHint();
		});
	};

	/**
	 * This function is used to check
	 * the attempts done by the user.
	 */
	MultipleChoice.prototype.attempt = function() {
		var isCorrect = false;
		if (this.count === -1 && this.count === undefined) {
		} else {++this.count;
			//console.log("attempts: ", this.model.get("attempts"));
			if (this.count === parseInt(this.model.get("attempts"), 10)) {
				isCorrect = true;
				this.customEventDispatcher(this.ATTEMPT_OVER_EVENT, this, this);
			}
		}

	};

	/**
	 * This function is used to shuffle the answer components
	 */

	MultipleChoice.prototype.shuffleOptions = function() {

		var i,
		    arr,
		    ci,
		    ri,
		    objSort,
		    tmp;

		arr = this.answerComponents();
		ci = arr.length;
		while (0 !== ci) {
			ri = Math.floor(Math.random() * ci);
			ci -= 1;
			tmp = arr[ci];
			arr[ci] = arr[ri];
			arr[ri] = tmp;
		}
		//this.model.set("compids", arr.join("|"));
		for ( i = 0; i < arr.length; i += 1) {
			objSort = this[arr[i]];
			this.$el.append(objSort.$el);
		}
	};

	MultipleChoice.prototype.answerComponents = function() {
		var arr,
		    strValue;
		strValue = this.model.get("compids");
		if (strValue.length > 0) {
			arr = strValue.split("|");
		} else {
			arr = [];
		}
		return arr;
	};

	/**
	 * This function is used to disable
	 * the component of Multiple choice
	 *@memberof MultipleChoice#
	 *@access public
	 * @param Object
	 * @returns none
	 */
	MultipleChoice.prototype.disable = function(bDisable) {
		_.filter(this.answer_dict, function(item, key) {
			item.disable(bDisable);
		});
		if (bDisable) {
			this.customEventDispatcher(this.DISABLE_COMPLETE_EVENT, this, this);
		} else {
			this.customEventDispatcher(this.ENABLE_COMPLETE_EVENT, this, this);
		}
	};

	/**
	 * This function is used to show the Feedback
	 *@memberof MultipleChoice#
	 *@access public
	 * @param none
	 * @returns none
	 */
	MultipleChoice.prototype.showFeedback = function() {
		_.filter(this.answer_dict, function(item, key) {
			item.showFeedback();
		});
		this.customEventDispatcher(this.SHOW_FEEDBACK_EVENT, this, this);
	};

	/**
	 * This function is used to show the Feedback
	 *@memberof MultipleChoice#
	 *@access public
	 * @param none
	 * @returns none
	 */
	MultipleChoice.prototype.hideFeedback = function() {
		if (this.feedback) {
			this.feedback.hideFeedback();
		}
		_.filter(this.answer_dict, function(item, key) {
			item.hideFeedback();
		});
		this.customEventDispatcher(this.SHOW_FEEDBACK_EVENT, this, this);
	};

	/**
	 * This function is used to show the answer
	 * of each added component in Multiple choice Component
	 *@memberof MultipleChoice#
	 *@access public
	 * @param none
	 * @returns none
	 */
	MultipleChoice.prototype.showAnswer = function() {
		_.filter(this.answer_dict, function(item, key) {
			item.showAnswer();
		});
		this.hideFeedback();
		this.customEventDispatcher(this.CORRECT_ANSWER_SHOWN_EVENT, this, this);
	};

	MultipleChoice.prototype.getState = function() {
		var that = this;
		_.filter(this.answer_dict, function(item, key) {
			that.comp_state_obj[item.getID()] = item.getState();
		});
		this.customEventDispatcher(this.GET_STATE_EVENT, this, this);
		return that.comp_state_obj;
	};

	MultipleChoice.prototype.setState = function(objState) {
		var that = this;
		this.reset();
		if (objState !== undefined && objState !== null) {
			that.comp_state_obj = objState;
		}
		_.filter(this.answer_dict, function(item, key) {
			item.setState(that.comp_state_obj[item.getID()]);
		});

		this.customEventDispatcher(this.SET_STATE_EVENT, this, this);
	};

	/**
	 * This function is used to reset each component
	 *@memberof MultipleChoice#
	 *@access public
	 * @param none
	 * @returns none
	 */
	MultipleChoice.prototype.reset = function() {
		_.filter(this.answer_dict, function(item, key) {
			item.reset();
		});
		if (this.feedback) {
			this.feedback.hideFeedback();
		}
		this.customEventDispatcher(this.RESET_COMPLETE_EVENT, this, this);
	};

	/**
	 * This function is used to store child
	 * components in Data Model
	 *@memberof MultipleChoice#
	 *@access public
	 * @param none
	 * @returns none
	 */
	MultipleChoice.prototype.storeChilds = function(objComp) {
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

	MultipleChoice.prototype.MultipleChoiceSuper = Case;

	MultipleChoice.prototype.destroy = function() {
		this.answer_dict = {};
		this.feedback = null;
		this.clickcounter = 0;
		return this.MultipleChoiceSuper.prototype.destroy.call(this, true);
	};

	return MultipleChoice;
});
