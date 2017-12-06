/*jslint nomen: true*/
/*globals _,$,console*/
/**MCQComp
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */
define(['marionette', 'components/mcq/js/mcq-helper', 'player/base/base-composite-comp', 'player/components/checkbox/js/checkbox', 'player/components/radiobutton/js/radiobutton', 'text!components/mcq/mcq.html'],

/**
 * This is an MCQ component which can be used to create single and multiple answer Multiple choice question. This class represents a multiple choice question component which can be used into activites
 * to create MCQ activity.
 *
 *@class MCQComp
 *@augments BaseCompositeComp
 *@param {Object} obj Either json string of questions or an object containing properties 'questionData','selectedOptionsIDs', 'reviewMode' and 'showOptionFeedback' properties.
 *@throws {ERROR} An error if options is missing from the question data received
 *@example
 *+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * <a href="xml/MCQ.xml" target="blank">Sample for QuestionData xml</a>.
 *+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *
 * var  mcqComp, objQuestionData;
 *
 * MCQ_Activity.prototype.initActivity = function() {
 *			Data_Loader.on(Data_Loader.DATA_LOAD_SUCCESS, this.handleDataLoadSuccess);
 *			Data_Loader.on(Data_Loader.DATA_LOAD_FAILED, this.handleDataLoadFailed);
 *			Data_Loader.load({
 *			url: "activity/mcq_activity/data/mcq_activity.xml",
 *			dataType: "xml",
 *			contentType: "application/xml",
 *			returnType: "json"
 *			});
 *	}
 *
 * MCQ_Activity.prototype.handleDataLoadSuccess = function(objData) {
 *		Data_Loader.off(Data_Loader.DATA_LOAD_SUCCESS);
 *		Data_Loader.off(Data_Loader.DATA_LOAD_FAILED);
 *		this.objQuestionData = objData;
 * };
 *
 * this.getComponent(this, "MCQ", "onComponentCreated", objQuestionData);
 * <br>
 * Component can also be added directly into HTML template using following snippet:
 *
 * &lt;div id="mcq" type="mComp" compName="MCQ"&gt;&lt;/div&gt;
 *
 * Where;<br>
 * - <code>id</code> is unique identifier for the component
 * - <code>type</code> can only take "mComp" as a value and it helps in differentiating the HTML tags.
 * - <code>compName</code> take the name of the component as value (which is defined in compList.js)
 *
 * <br>Configurable properties of component:<br>
 * <table border="1" style="white-space:pre-wrap; color:"#000000";"><tr><th>Property</th><th>Type</th><th>Default Value</th><th>Description</th></tr><tr><td>objQuestionData</td><td>Json String</td><td>undefined</td><td>This property contains the Json string of MCQ question. This property is mandatory to provide during component creation.</td></tr></table>
 * _______________________________ OR _______________________________
 *
 * objQuestionData = new Object();
 * objQuestionData.questionData = objQuestionData;
 * objQuestionData.selectedOptionsIDs = ["1", "2"];
 * objQuestionData.reviewMode = true;
 * objQuestionData.showOptionFeedback = true;
 * this.getComponent(this, "MCQ", "onComponentCreated",
 * getComponent(this, "MCQ", "onComponentCreated",
 *              {
 *               questionData : objQuestionData,
 *               selectedOptionsIDs : ["1", "2"],
 *               reviewMode: true || false,
 *               showOptionFeedback: true || false
 *             });
 *
 * function onComponentCreated(objComp){
 * mcqComp = objComp;
 * }
 * <br>Configurable properties of component:<br>
 * <table border="1" style="white-space:pre-wrap; color:"#000000";"><tr><th>Property</th><th>Type</th><th>Default Value</th><th>Description</th></tr><tr><td>questionData</td><td>Json String</td><td>undefined</td><td>This property contains the Json string of MCQ question. This property is mandatory to provide during component creation.</td></tr><tr><td>selectedOptionsIDs</td><td>Array</td><td>undefined</td><td>This property can be used to display the options in selected mode by default. It is useful to display users correct option when navigating from one question to another</td></tr><tr><td>reviewMode</td><td>Boolean</td><td>false</td><td>This property defines if the review mode of the compoent is enabled or not.</td></tr><tr><td>showOptionFeedback</td><td>Boolean</td><td>false</td><td>This property will only work if review mode is set to true</td></tr></table>
 */

function(Marionette, MCQCompHelper, BaseCompositeComp, CheckBox, RadioButton, mcqTmpl) {
	'use strict';

	var MCQComp =
	/** @lends MCQComp.prototype */
	BaseCompositeComp.extend({
		template : _.template(mcqTmpl),

		/**
		 * @description It is used to know if question is visible or not
		 * @memberof MCQComp#
		 * @readonly
		 */
		isQuestionVisible : false,

		/**
		 * @description It is used to know if options are visible or not
		 * @memberof MCQComp#
		 * @readonly
		 */
		isOptionsVisible : false,

		/**
		 * @description It is used to know if options are enabled or not
		 * @memberof MCQComp#
		 * @readonly
		 */
		isOptionsEnabled : true,
		/**
		 * @description It is used to know if options are enabled or not
		 * @access private
		 * @memberof MCQComp#
		 */
		questionData : null,
		mcqData : null,

		/**
		 * @description It is used to know if the response of user is correct or not
		 * @memberof MCQComp#
		 * @readonly
		 */
		isCorrect : false,

		isAttempted : false,

		objFeedbackDiv : null,

		arrOptFeedbackDiv : [],

		strOptType : "",
		arrHookedEvent : [],
		isReviewMode : false,
		selectedOptionsIDs : [],
		randomize : false,
		bReset : false,

		/**
		 * This function initializes the mcq component which
		 * receives the question data. It parses and stores it
		 * into model and collection
		 * @access private
		 * @memberof MCQComp
		 * @param {Object} objQuesData A JSON object that contains question and options
		 * @param {Boolean} bReset Whether mcq is being initialized to reset it or not
		 * @returns None
		 */
		initialize : function(objData) {
			//console.log('INITIALIZED', objData);
			if (objData) {
				this.mcqData = objData;
				this.randomize = false;
				this.isReviewMode = false;
				// check if randomization needs to be turned on
				if ((this.mcqData.hasOwnProperty('randomize') && this.mcqData.randomize === true) || this.mcqData.randomize === "true") {
					//console.log('randomized');
					this.randomize = true;
				}

				// validate the format of input data
				if (this.mcqData.hasOwnProperty("reviewMode") && this.mcqData.reviewMode === true) {
					this.isReviewMode = true;
				}

				// check if 'questionData' property is available...
				if (this.mcqData.hasOwnProperty('questionData')) {
					// store the question data from the received object
					this.questionData = this.mcqData.questionData;
				} else {
					if (this.mcqData.hasOwnProperty('label')) {
						// the received object is the question data
						this.questionData = this.mcqData;
					} else {
						MCQCompHelper.createDummyData(this);
					}
				}
				if (this.questionData) {
					this.itemViewContainer = ("#optContainer_" + this.questionData.id);
					// set item view based on question type first
					if (this.questionData.type === "multipleAnswer") {
						this.itemView = CheckBox;
						this.strOptType = 'checkbox';
					} else {
						//console.log('this : ', this);
						this.itemView = RadioButton;
						this.strOptType = 'radio';
					}
					this.itemViewOptions = {
						parent : this
					};

					// prepare model/collection for view rendering
					MCQCompHelper.prepareData(this, this.questionData);
					if (this.bReset === false) {
						if (this.mcqData.hasOwnProperty('selectedOptionsIDs')) {
							this.selectedOptionsIDs = this.mcqData.selectedOptionsIDs;
						}
					}
				}

			} else {
				MCQCompHelper.createDummyData(this);
			}
			this.bReset = false;
		},

		/**
		 * This function adds theme class to the main element and hides
		 * the feedback divs.
		 * @access private
		 * @memberof MCQComp
		 * @param None
		 * @returns None
		 */
		onRender : function() {
			// remove existing class if any and then add new class
			this.$el.removeAttr("class").addClass(this.model.get('theme'));

			if (this.isReviewMode) {
				//console.log('..... review mode is on .....');
				// do the stuff related to review mode on
				this.disable();
				// select the correct answers
				MCQCompHelper.autoSelectOptions(this);
			} else {
				//console.log('..... review mode is off .....');
				if (this.questionData) {
					//hide feedback div
					MCQCompHelper.hideQuesFeedback(this, true);
				}

				// check for event binding
				//console.log('on render', this.arrHookedEvent);
				var key, objThis = this;
				for (key in objThis.arrHookedEvent) {
					if (objThis.arrHookedEvent.hasOwnProperty(key)) {
						objThis.hookEvent(objThis.arrHookedEvent[key].callbackRef, key, objThis.arrHookedEvent[key].callback);
					}
				}
			}
			// check if selected options are available...select the options provided
			if (this.selectedOptionsIDs.length > 0) {
				// select the options by default
				MCQCompHelper.autoSelectOptions(this, false);
			}
		},

		/**
		 * This function is used to hook call back function with particular function.
		 * This helps to process the event and prepare the data before sending it to the
		 * requested object/activity
		 * @memberof MCQComp
		 * @access private
		 * @param {Object} objRef Reference of the object who wants to hook with the event
		 * @param {String} strEventType Type of the event
		 * @param {String} strCallback callback method
		 * @returns None
		 * @example
		 * MCQCompRef.hookEvent(activityRef, MCQComp.OPTION_CHANGED, 'activityCallbackFunction');
		 */
		hookEvent : function(objRef, strEventType, strCallback) {
			var obj = {
				callbackRef : objRef,
				callback : strCallback
			};
			this.arrHookedEvent[strEventType] = obj;
			switch(strEventType) {

			case this.OPTION_CLICK:
				this.$("div[data-cid]").bind('click', $.proxy(objRef[strCallback], objRef));
				break;
			case this.OPTION_CHANGED:
				this.$("div[data-cid] input").bind('change', obj, $.proxy(this.handleOptionChange, this));
				break;
			case this.OPTION_MOUSE_OVER:
				this.$("div[data-cid]").bind('mouseover', obj, $.proxy(this.handleOptionRollOver, this));
				break;
			case this.OPTION_MOUSE_OUT:
				this.$("div[data-cid]").bind('mouseout', $.proxy(objRef[strCallback], objRef));
				break;
			case this.QUESTION_MOUSE_OVER:
				this.$('.questionText span').bind('mouseover', $.proxy(objRef[strCallback], objRef));
				break;
			case this.QUESTION_MOUSE_OUT:
				this.$(".questionText span").bind('mouseout', $.proxy(objRef[strCallback], objRef));
				break;
			}
		},

		/**
		 * This function is used to unhook the event
		 * @memberof MCQComp
		 * @access private
		 * @param {String} strEventType Type of the event
		 * @returns None
		 * @example
		 * MCQCompRef.unhookEvent(MCQComp.OPTION_CHANGED);
		 */
		unhookEvent : function(strEventType) {
			switch(strEventType) {
			case this.OPTION_CLICK:
				this.$("div[data-cid]").unbind('click');
				break;
			case this.OPTION_CHANGED:
				this.$("div[data-cid] input").unbind('change');
				break;
			case this.OPTION_MOUSE_OVER:
				this.$("div[data-cid]").unbind('mouseover');
				break;
			case this.OPTION_MOUSE_OUT:
				this.$("div[data-cid]").unbind('mouseout');
				break;
			case this.QUESTION_MOUSE_OVER:
				this.$('.questionText span').unbind('mouseover');
				break;
			case this.QUESTION_MOUSE_OUT:
				this.$(".questionText span").unbind('mouseout');
				break;
			}
		},

		/**
		 * This function can be used to get all the selected options ids
		 * @memberof MCQComp
		 * @access private
		 * @param None
		 * @returns {Array} Array of selected options IDs
		 * @example
		 * MCQCompRef.getSelectedOptionsIDs();
		 */
		getSelectedOptionsIDs : function() {
			var selectedOptions, arrSelectedOptionsIDs = [];
			selectedOptions = this.collection.filter(function(option) {
				return option.get('checked') === true;
			});
			_.each(selectedOptions, function(key) {
				arrSelectedOptionsIDs.push(key.get('id'));
			});
			return arrSelectedOptionsIDs;
		},

		/**
		 * Use this function call to show or hide the options of question
		 * @memberof MCQComp
		 * @access private
		 * @param {Boolean} bHide Boolean to show/hide options
		 * @returns None
		 */
		hideOptions : function(bHide) {
			MCQCompHelper.hideOptions(this, bHide);
		},

		/**
		 * Handle the visibility of Question text of MCQ
		 * @memberof MCQComp
		 * @access private
		 * @param {Boolean} bHide Boolean to show/hide question
		 * @returns None
		 */
		hideQuestion : function(bHide) {
			MCQCompHelper.hideQuestion(this, bHide);
		},

		/**
		 * This function can be used to enable options of MCQ
		 * @memberof MCQComp
		 * @access private
		 * @param None
		 * @returns None
		 */
		enable : function() {
			MCQCompHelper.enableOptions(this, true);
		},

		/**
		 * This function can be used to disable options of MCQ
		 * @memberof MCQComp
		 * @access private
		 * @param None
		 * @returns None
		 */
		disable : function() {
			MCQCompHelper.enableOptions(this, false);
		},
		/**
		 * This function is used to validate the answer of a question.
		 * It returns true or false based on the validation
		 * @memberof MCQComp
		 * @access private
		 * @param None
		 * @returns {Boolean} True or false based on validation result.
		 */
		checkAnswer : function() {
			return MCQCompHelper.doValidation(this);
		},

		/**
		 * This function is used to show/hide feedback of a question
		 * @memberof MCQComp
		 * @access private
		 * @param {Boolean} bShow A Boolean value to show/hide question feedback
		 * @returns None
		 */
		showFeedback : function(bShow) {
			MCQCompHelper.showFeedback(this, 'global', bShow);
		},

		/**
		 * This function is used to show/hide both question and option feedback
		 * @memberof MCQComp
		 * @access private
		 * @param {Boolean} bShow A Boolean value to show/hide both question and option feedback
		 * @returns None
		 */
		showAllFeedback : function(bShow) {
			MCQCompHelper.showFeedback(this, 'all', bShow);
		},

		/**
		 * This function is used to show/hide options of the question
		 * @memberof MCQComp
		 * @access private
		 * @param {Boolean} bShow A Boolean value to show/hide options of the question
		 * @returns None
		 */
		showOptionsFeedback : function(bShow) {
			MCQCompHelper.showFeedback(this, 'options', bShow);
		},

		/**
		 * This function is used to reset/refresh the current rendered question
		 * @memberof MCQComp
		 * @access private
		 * @param None
		 * @returns None
		 */
		reset : function() {
			if (!this.isReviewMode) {
				this.flush();
				this.bReset = true;
				this.initialize(this.mcqData);
				this.render();
			}
		},

		/**
		 * @description This is change event handler function of options. It updates the 'radiobutton' options
		 * and also triggers an event for activity to check if the option select is correct or incorrect
		 * @access private
		 * @memberof MCQComp
		 * @param {Object} event Change Event of option
		 * @returns None
		 */
		handleOptionChange : function(event) {
			var optEl, dataCid, optItemView, isOptCorrect;
			optEl = $(event.currentTarget).parent();
			dataCid = optEl.attr('data-cid');
			optItemView = this.children.findByModelCid(dataCid);
			//console.log(">>>><<<<", optEl, "|||||", optItemView);
			//console.log(this.children);
			// if instant and individual option validation is required...
			isOptCorrect = MCQCompHelper.validateOption(this, optEl, optItemView);

			if (event.data) {
				event.data.callbackRef[event.data.callback]({
					type : this.OPTION_CHANGED,
					data : {
						"optionId" : optItemView.model.get('id'),
						"isCorrect" : isOptCorrect
					}
				});
			}
		},

		/**
		 * @description This is mouse over event handler function of options.
		 * @access private
		 * @memberof MCQComp
		 * @param {Object} event Mouse Over Event of option
		 * @returns None
		 */
		handleOptionRollOver : function(event) {

			var optEl, strId, optId, nIdLen;

			optEl = $(event.currentTarget);

			strId = optEl.find("input:first-child").attr('id');
			nIdLen = strId.length;

			optId = strId.substring(strId.lastIndexOf('_') + 1, nIdLen);

			event.data.callbackRef[event.data.callback]({
				type : this.OPTION_MOUSE_OVER,
				data : {
					"optionId" : optId
				}
			});

		},

		onShow : function() {
			var self = this;
			this.$el.on("click", $.proxy(self.compClick, self));
			this.$el.on("mouseover", $.proxy(self.compRollover, self));
			this.$el.on("mouseout", $.proxy(self.compRollout, self));
		}
	});

	/**
	 * Set the base class
	 * @access private
	 * @memberof MCQComp#
	 */
	MCQComp.prototype._super = BaseCompositeComp;

	/**
	 * An event const to be used to hook event for option change
	 * @memberof MCQComp#
	 * @access public
	 * @const
	 */
	MCQComp.prototype.OPTION_CHANGED = "optionChanged";
	/**
	 * An event const to be used to hook event for option's mouse over
	 * @memberof MCQComp#
	 * @access public
	 * @const
	 */
	MCQComp.prototype.OPTION_MOUSE_OVER = "optionMouseOver";

	/**
	 * An event const to be used to hook event for option's mouse over
	 * @memberof MCQComp#
	 * @access public
	 * @const
	 */
	MCQComp.prototype.OPTION_CLICK = "optionClick";

	/**
	 * An event const to be used to hook event for question text's mouse over
	 * @memberof MCQComp#
	 * @access public
	 * @const
	 */
	MCQComp.prototype.QUESTION_MOUSE_OVER = "questionMouseOver";
	/**
	 * An event const to be used to hook event for option's mouse out
	 * @memberof MCQComp#
	 * @access public
	 * @const
	 */
	MCQComp.prototype.OPTION_MOUSE_OUT = "optionMouseOut";
	/**
	 * An event const to be used to hook event for question text's mouse out
	 * @memberof MCQComp#
	 * @access public
	 * @const
	 */
	MCQComp.prototype.QUESTION_MOUSE_OUT = "questionMouseOut";

	/**
	 * This function is used to set another question into existing MCQ Comp to
	 * replace the existing question with another one
	 * @memberof MCQComp#
	 * @access public
	 * @param {Object} objQuestionData A JSON object that contains question and options
	 * @returns None
	 */
	MCQComp.prototype.setQuestionData = function(objQuestionData) {
		this.flush();
		this.questionData = null;
		//this.questionData = objQuestionData;
		this.bReset = false;
		this.initialize(objQuestionData);
		this.render();
	};

	/**
	 * This function flushes the data to refresh the MCQ
	 * @access private
	 * @memberof MCQComp#
	 * @param None
	 * @returns None
	 */
	MCQComp.prototype.flush = function() {

		this.unhookEvent(this.OPTION_MOUSE_OVER);
		this.unhookEvent(this.OPTION_MOUSE_OUT);
		this.unhookEvent(this.QUESTION_MOUSE_OVER);
		this.unhookEvent(this.QUESTION_MOUSE_OUT);
		this.unhookEvent(this.OPTION_CHANGED);

		this.isQuestionVisible = this.isOptionsVisible = this.isOptionsEnabled = this.isCorrect = this.isAttempted = false;

		this.strOptType = "";

		var model;
		if (this.collection) {
			while (this.collection.first()) {
				model = this.collection.first();
				model.id = null;
				model.destroy();
				model = null;
			}
		}

		// destroy mcq's model
		this.model.id = null;
		this.model.destroy();
		this.model = null;

		// destroy collection and its models property.
		//console.log(this.collection.models);
		//this.collection.models = null;
		this.collection = null;

		this.objFeedbackDiv = null;
		this.arrOptFeedbackDiv = [];

		this.selectedOptionsIDs = [];

	};

	MCQComp.prototype.validateAnOption = function(objThis, optEl, optItemView) {

		var iscorrect = MCQCompHelper.validateOption(objThis, optEl, optItemView);

	};

	/**
	 * This function is used to destroy the MCQ comp
	 * @returns {Boolean} True or false
	 * @memberof MCQComp#
	 * @access public
	 * @param None
	 */
	MCQComp.prototype.destroy = function() {
		this.flush();
		var key, objThis = this;

		for (key in objThis.arrHookedEvent) {
			if (objThis.arrHookedEvent.hasOwnProperty(key)) {
				objThis.unhookEvent(key);
				delete objThis.arrHookedEvent[key];
			}
		}
		this.arrHookedEvent = [];
		this.arrHookedEvent = null;
		this.unbind();
		this.undelegateEvents();

		this.children.call('destroy');
		this.children.call('remove');

		this.questionData = null;

		this.close();
		this.$el.off("click");
		this.$el.off("mouseover");
		this.$el.off("mouseout");

		return this._super.prototype.destroy(true);
	};

	// return MCQComp
	return MCQComp;
});

