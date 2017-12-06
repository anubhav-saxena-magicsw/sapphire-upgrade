/*jslint nomen: true*/
/*globals define,Backbone,_,$,console*/

/**
 * MCQCompHelper
 * @access private
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

define(function() {

	/**
	 *This class works as a helper class for MCQ component.
	 *@class MCQCompHelper
	 *@access private
	 */"use strict";
	var MCQCompHelper = {
		/**
		 * This function hides the options
		 * @access private
		 * @memberof MCQCompHelper
		 * @param {type} that Reference of MCQ Comp
		 * @param {type} bHide True or false value to show/hide options
		 * @returns None
		 */
		hideOptions : function(that, bHide) {
			that.isOptionsVisible = bHide;
			if (bHide) {
				$(that.itemViewContainer).hide();
			} else {
				$(that.itemViewContainer).show();
			}
		},
		/**
		 * This function is used to hide the question text
		 * @access private
		 * @memberof MCQCompHelper
		 * @param {Object} that Reference to the MCQ Comp
		 * @param {Boolean} bHide True or False to show/hide options
		 * @returns {undefined}
		 */
		hideQuestion : function(that, bHide) {
			that.isQuestionVisible = bHide;
			if (bHide) {
				that.$("#question_" + that.model.get('quesId')).hide();
			} else {
				that.$("#question_" + that.model.get('quesId')).show();
			}
		},
		/**
		 * This function is used to enable/disable options of MCQ Comp
		 * @access private
		 * @memberof MCQCompHelper
		 * @param {Object} that Reference to the MCQ Comp
		 * @param {Boolean} bEnable True or False to enable/disable Options
		 * @returns {undefined}
		 */
		enableOptions : function(that, bEnable) {
			that.isOptionsEnabled = bEnable;
			var optInputEls = that.$el.find("input[type='" + that.strOptType + "']");
			optInputEls.attr('disabled', 'disabled');

			if (bEnable) {
				optInputEls.removeAttr('disabled');
			} else {
				optInputEls.attr('disabled', 'disabled');
			}
		},
		/**
		 * This function does the validation of MCQ Question
		 * @access private
		 * @memberof MCQCompHelper
		 * @param {type} that Reference to the MCQ Comp
		 * @return {Boolean} True or false based on validation result
		 */
		doValidation : function(that) {
			//console.log('Validation is in progress...');
			//var isCorrect = false;

			var arrData, orgCorrectOpt, arrCorrectOpt = [];
			arrData = _.filter(that.collection.models, function(objModel) {
				return objModel.get('checked') === true;
			});

			if (arrData.length > 0) {
				_.each(arrData, function(item) {
					arrCorrectOpt.push(item.get('id'));
				});
			} else {
				console.error('User has not selected any options yet!');
			}

			// check against the correction options
			orgCorrectOpt = that.model.get('correctOptions');

			that.isCorrect = $(arrCorrectOpt).not(orgCorrectOpt).length === 0 && $(orgCorrectOpt).not(arrCorrectOpt).length === 0;

			that.objFeedbackDiv = null;
			// return true or false based on the correct/incorrect option
			if (that.isCorrect && that.model.get('correctFeedback')) {
				that.objFeedbackDiv = that.$el.find("#correctFB_" + that.model.get('quesId'));
			} else {
				that.objFeedbackDiv = that.$el.find("#incorrectFB_" + that.model.get('quesId'));
			}

			this.hideQuesFeedback(that, true);

			//feedbackDiv.show();

			return that.isCorrect;
		},
		/**
		 * This function validates the MCQ question's single option when change event gets triggered
		 * @access private
		 * @memberof MCQCompHelper
		 * @param {Object} that Reference to the MCQ Comp
		 * @param {Object} optElement Option element
		 * @param {Object} optItemView Option element's itemview object
		 * @return {Boolean} True or false based on validation result
		 */
		validateOption : function(that, optElement, optItemView) {
			var isOptCorrect, feedbackDiv, groupName, strId, strInd = -1, strFeedbackDiv;
			strId = optItemView.model.get('id');
			// check if the option is checked...
			if (optItemView.model.get('checked')) {
				// it is checked so validate if this is the correct option among other correction options if any
				strInd = that.model.get('correctOptions').indexOf(strId);
			}

			isOptCorrect = (strInd === -1) ? false : true;

			groupName = optItemView.model.get('groupName');

			if (isOptCorrect) {
				feedbackDiv = optElement.find("#correctFB_" + groupName + "_" + strId);
			} else {
				feedbackDiv = optElement.find("#incorrectFB_" + groupName + "_" + strId);
			}
			if (that.strOptType === 'radio') {
				that.arrOptFeedbackDiv = [];
				strFeedbackDiv = "feedbackDiv_" + groupName + "_" + optItemView.model.get('id');
			} else {
				strFeedbackDiv = "feedbackDiv_" + groupName + "_" + optItemView.model.get('id');
			}
			
			that.arrOptFeedbackDiv[strFeedbackDiv] = {"optionEl":optItemView, "feedbackDiv" : feedbackDiv};
			//console.log("feedback:::", that.arrOptFeedbackDiv);
			// return true or false
			return isOptCorrect;

		},
		/**
		 * This function works for review mode to select the correct options automatically
		 * @access private
		 * @memberof MCQCompHelper
		 * @param {type} that
		 * @returns {undefined}
		 */
		autoSelectOptions : function(that, bReviewMode) {
			//console.log('this.el :: ', that.children);
			// get correct options array
			var i, answerLen, correctOpt, arrOptions, index = 0, optElement, strCid, optItemView;

			if (bReviewMode === false) {
				correctOpt = that.selectedOptionsIDs;
			} else {

				correctOpt = that.model.get("correctOptions");
			}

			answerLen = correctOpt.length;
			// get option container
			arrOptions = that.$(that.itemViewContainer + " div[data-cid]");

			//console.log('hello : ', arrOptions, that.children);

			// check if correct options has data...
			if (answerLen > 0) {
				// loop through all the options
				for ( index = 0; index < arrOptions.length; index += 1) {
					// get option element
					optElement = $(arrOptions[index]);
					// get model cid stored in dom
					strCid = optElement.attr('data-cid');
					// get item view using model cid
					optItemView = that.children.findByModelCid(strCid);
					// check if option type is radio...
					if (that.strOptType === "radio") {
						// ...its single answer MCQ
						// check if id matches with the correct option
						if (optItemView.model.get('id') === correctOpt[0]) {
							this.autoSelectAndValidate(that, optElement, optItemView);
							break;
						}
					} else {
						// ...its multiple answer MCQ
						// loop through all the correct options
						for ( i = 0; i < answerLen; i += 1) {
							// check correct options against current item view's model id
							if (optItemView.model.get('id') === correctOpt[i]) {
								this.autoSelectAndValidate(that, optElement, optItemView);
								break;
							}
						}
					}
				}
			}

		},
		/**
		 * This function selects and validates the options automatically and
		 * it works only when review mode is on
		 * @access private
		 * @memberof MCQCompHelper
		 * @param {Object} that
		 * @param {Object} optElement
		 * @param {Object} optItemView
		 * @return None
		 */
		autoSelectAndValidate : function(that, optElement, optItemView) {
			// select the option
			optItemView.select(true);
			if (that.isReviewMode === true) {
				var bShowOptFeedback = false, bShowQuesFeedback = false;
				// validate it to enable feedback only if needed
				this.validateOption(that, optElement, optItemView);
				if (that.mcqData.hasOwnProperty("showOptionFeedback")) {
					bShowOptFeedback = that.mcqData.showOptionFeedback;
				}
				if (that.mcqData.hasOwnProperty("showQuestionFeedback")) {
					bShowQuesFeedback = that.mcqData.showQuestionFeedback;
				}
				//console.log('ques feedback : ', bShowQuesFeedback);
				this.showFeedback(that, "options", bShowOptFeedback);
				this.hideQuesFeedback(that, !bShowQuesFeedback);
			}
		},
		/**
		 * This function is used toshow/hide all kind of feedback supported by MCQ
		 * @access private
		 * @memberof MCQCompHelper
		 * @param {Object} that Reference to the MCQ Comp
		 * @param {String} fbType Type of feedback
		 * @param {Boolean} bShow True or false to show/hide feedback
		 * @returns {undefined}
		 */
		showFeedback : function(that, fbType, bShow) {
			switch (fbType) {
				case "global":
					if (bShow) {
						that.objFeedbackDiv.show();
					} else {
						that.objFeedbackDiv.hide();
					}
					break;
				case "all":
					if (bShow) {
						that.objFeedbackDiv.show();
					} else {
						that.objFeedbackDiv.hide();
					}
					this.showHideOptFeedback(that, bShow);
					break;
				case "options":
					this.showHideOptFeedback(that, bShow);
					break;
				default:
					if (bShow) {
						that.objFeedbackDiv.show();
					} else {
						that.objFeedbackDiv.hide();
					}
			}
		},
		/**
		 * This function is used to show/hide option feedback
		 * @access private
		 * @memberof MCQCompHelper
		 * @param {Object} Reference to the MCQ Comp
		 * @param {Boolean} bShow True or false to show/hide options
		 * @returns {undefined}
		 */
		showHideOptFeedback : function(that, bShow) {
			var key, optionEl, feedbackDiv;
			for (key in that.arrOptFeedbackDiv) {
				
				if (that.arrOptFeedbackDiv.hasOwnProperty(key)) {
					optionEl = that.arrOptFeedbackDiv[key].optionEl;
					feedbackDiv = that.arrOptFeedbackDiv[key].feedbackDiv;
					if (bShow && optionEl.model.get('checked') === true) {
						//console.log('that.arr: ', key, that.arrOptFeedbackDiv[key]);
						feedbackDiv.show();
					} else {
						feedbackDiv.hide();
					}
				}
			}
		},
		/**
		 * This function show/hide question feedback
		 * @access private
		 * @memberof MCQCompHelper
		 * @param {Object} that Reference to the MCQ Comp
		 * @param {Boolean} bHide True or false to show/hide question feedback
		 * @returns {undefined}
		 */
		hideQuesFeedback : function(that, bHide) {
			var fbCorrect, fbIncorrect;
			fbCorrect = that.$("#correctFB_" + that.model.get('quesId'));
			fbIncorrect = that.$("#incorrectFB_" + that.model.get('quesId'));
			if (bHide) {
				fbCorrect.hide();
				fbIncorrect.hide();
			} else {
				fbCorrect.show();
				fbIncorrect.show();
			}
		},
		/**
		 * This function creates and prepares model & collection for MCQ comp's question and options
		 * @access private
		 * @memberof MCQCompHelper
		 * @param {Object} that Reference of MCQ Comp
		 * @param {Object} objData Data object for model and collection
		 * @return None
		 */
		prepareData : function(that, objData) {

			if (!objData.options) {
				// no options specified
				//throw new Error('No options found to render MCQ');
				return;
			}

			var arrOptions, MCQModel, OptionModel, MCQCollection, objOptions, objModel, ind;

			// create model for MCQ
			MCQModel = Backbone.Model.extend({
				defaults : {
					quesLabel : "Sample question label"
				}
			});

			// create model for options of MCQ
			OptionModel = Backbone.Model.extend({
				defaults : {
					id : 0,
					groupName : 'radio',
					label : 'option',
					img : ''
				}
			});
			// collection object of MCQ
			MCQCollection = Backbone.Collection.extend({
				model : OptionModel
			});

			// update mcq's model
			that.model = new MCQModel();
			that.model.set('quesId', objData.id);
			that.model.set('quesType', objData.type);
			that.model.set('correctOptions', objData.correctOptions.split(','));
			that.model.set('quesLabel', objData.label);
			that.model.set('img', objData.image);
			that.model.set('theme', objData.theme);

			if (objData.hasOwnProperty('feedback')) {
				that.model.set('isFeedbackAvailable', true);
				// store feedback
				that.model.set('correctFeedback', objData.feedback.correct);
				that.model.set('incorrectFeedback', objData.feedback.incorrect);
			} else {
				that.model.set('isFeedbackAvailable', false);
			}

			arrOptions = [];

			objOptions = objData.options.option;
			if (objOptions.length === undefined) {
				// no options specified
				objModel = new OptionModel();
				objModel.set('id', objOptions.id);
				objModel.set('groupName', objData.id);
				objModel.set('label', objOptions.label);
				objModel.set('img', objOptions.image);
				if (objOptions.hasOwnProperty('theme')) {
					objModel.set('optionTheme', objOptions.theme);
				} else {
					objModel.set('optionTheme', "option_" + objData.id + "_" + objOptions.id);
				}
				if (objOptions.hasOwnProperty('feedback')) {
					objModel.set('isFeedbackAvailable', true);
					objModel.set('correctFeedback', objOptions.feedback.correct);
					objModel.set('incorrectFeedback', objOptions.feedback.incorrect);
				} else {
					objModel.set('isFeedbackAvailable', false);
				}
				//that.collection.add(objModel);
				arrOptions.push(objModel);
			} else {
				ind = 0;
				// update/create model for options
				_.each(objOptions, function(option) {
					//console.log('options : ', option);
					var objModel = new OptionModel();
					objModel.set('id', option.id);
					objModel.set('groupName', objData.id);
					objModel.set('label', option.label);
					objModel.set('img', option.image);
					if (option.hasOwnProperty('theme')) {
						objModel.set('optionTheme', option.theme);
					} else {
						objModel.set('optionTheme', "option_" + objData.id + "_" + option.id);
					}

					/*jslint plusplus: true */
					ind++;
					if (option.hasOwnProperty('feedback')) {
						objModel.set('isFeedbackAvailable', true);
						objModel.set('correctFeedback', option.feedback.correct);
						objModel.set('incorrectFeedback', option.feedback.incorrect);
					} else {
						objModel.set('isFeedbackAvailable', false);
					}
					//that.collection.add(objModel);
					arrOptions.push(objModel);
				});
			}

			if (that.randomize === true) {
				that.collection = new MCQCollection(_.shuffle(arrOptions));
				arrOptions.length = 0;
			} else {
				that.collection = new MCQCollection(arrOptions);
				arrOptions.length = 0;
			}
		},
		/**
		 * This function creates dummy model for the MCQ comp.
		 * @access private
		 * @memberof MCQCompHelper
		 * @param {Object} that
		 * @returns None
		 */
		createDummyData : function(that) {
			var MCQModel;

			// create model for MCQ
			MCQModel = Backbone.Model.extend({
				defaults : {
					quesLabel : "Sample question label"
				}
			});

			// update mcq's model
			that.model = new MCQModel();
			that.model.set('quesId', "");
			that.model.set("img", "");
			that.model.set('quesType', "");
			that.model.set('correctOptions', "");
			that.model.set('quesLabel', "");
			that.model.set('theme', "");
			that.model.set('isFeedbackAvailable', false);
		}
	};

	return MCQCompHelper;
});
