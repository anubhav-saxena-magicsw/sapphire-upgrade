/*jslint nomen:true*/
/*global console,_,$, jQuery*/
(function($) {

	$.widget("Template.FIB", $.custom.BASEWIDGET, {
		options : {
			totalQuestion : 0,
			$arrInputField : null,
			answerArray : null,
			result : null,
			caseSenstive : true,
			responseSeperator : "|",
			groups : {},
			styleIncorrect : undefined,
			styleCorrect : undefined,
			feedbackType : 1,
			functionList : ["checkAnswer", "reset", "disable", "hideFeedback", "showAnswer"]
			//textAlign:"center"
		},

		_create : function() {

		},

		_init : function() {
			this.dispatchEvent("ON_INIT");
			this.options.answerArray = [];
			this.options.result = {
				totalAttempt : 0,
				totalIncorrect : 0,
				totalCorrect : 0,
				totalQuestions : 0
			};

			this._trigger("testEvent");

			var that = this;

			if (this.options.widgetData.caseSenstive) {
				this.options.caseSenstive = this.options.widgetData.caseSenstive;
			}
			if (this.options.widgetData.responseSeperator) {
				this.options.responseSeperator = this.options.widgetData.responseSeperator;
			}
			if (this.options.widgetData.styleIncorrect) {
				this.options.styleIncorrect = this.options.widgetData.styleIncorrect;
			}
			if (this.options.widgetData.styleCorrect) {
				this.options.styleCorrect = this.options.widgetData.styleCorrect;
			}
			if (this.options.widgetData.feedbackType) {
				this.options.feedbackType = this.options.widgetData.feedbackType;
			}

			$arrInputField = this.options.parentDiv.find("[type = inputInteraction]");
			this.options.result.totalQuestions = $arrInputField.length;

			$.each($arrInputField, function(x) {
				var objElement, inputId, arrResponse, $feedback;
				objElement = $(this);
				inputId = "input" + x;
				objElement.attr("id", inputId);
				arrResponse = objElement.attr("ans").split(that.options.responseSeperator);
				that.options.answerArray.push(arrResponse);
				objElement.removeAttr("ans");
				if (that.options.feedbackType === 1) {
					$feedback = $("<div style='position:relative; display:inline-block;'></div>");
					$feedback.prop("correct", $("<div class='" + that.options.styleCorrect + "'></div>"));
					$feedback.append($feedback.prop("correct"));
					$feedback.prop("incorrect", $("<div class='" + that.options.styleIncorrect + "'></div>"));
					$feedback.append($feedback.prop("incorrect"));
					objElement.prop("feedback", $feedback);
				} else if (that.options.feedbackType === 2) {
					$(this).prop("styleAtr", $(this).attr("style"));
				}

				objElement.keyup(function() {
					var objData = {};
					objData.isAllfilled = that._isAllfilled();
					that._trigger("ON_CHANGE", {}, objData);
					that.dispatchEvent("ON_CHANGE", {}, objData);
				});

				objElement.focus(function() {
					var objData = {};
					objData.element = objElement;
					that._trigger("ON_FOCUS", {}, objData);
					that.dispatchEvent("ON_FOCUS", {}, objData);
				});
			});
			$(that.element).show();
		},

		_isAllfilled : function() {
			var that = this;
			var isAllFilled = true;
			$.each($arrInputField, function(x) {
				if ($(this).val() == "") {
					isAllFilled = false;
				}
			});
			return isAllFilled;
		},

		checkAnswer : function(strDisable) {
			var that = this, arrAns;
			this.options.result.totalAttempt += 1;
			this.options.result.totalCorrect = 0;
			this.options.result.totalIncorrect = 0;
			if (strDisable !== undefined) {
				this.disable(true, strDisable);
			}
			this.options.groups = {};

			$.each($arrInputField, function(x, inp) {
				arrAns = that.options.answerArray[x];
				if (that._checkMatch(arrAns, $(this).val()) && that._checkGroupUniqueResponse($(this), $(this).val())) {
					that.options.result.totalCorrect += 1;
					that._showCorrectFeedback($(this));
				} else {
					that.options.result.totalIncorrect += 1;
					that._showIncorrectFeedback($(this));
				}
			});

			this._trigger("ON_CHECK_ANSWER");
			this.dispatchEvent("ON_CHECK_ANSWER",this,that.options.result);
		},

		_checkMatch : function(arrAns, response) {
			var that = this, arrTemp = [];
			if (!that.options.caseSenstive) {
				$.each(arrAns, function(ind, val) {
					arrTemp.push(val.toLowerCase());
				});
				response = response.toLowerCase();
			} else {
				arrTemp = null;
				arrTemp = arrAns;
			}

			if (arrTemp.indexOf(response) == -1) {
				return false;
			}

			return true;

		},

		_checkGroupUniqueResponse : function($el, response) {
			var group = $el.attr("grp"), arrResponse;
			if (!this.options.caseSenstive) {
				response = response.toLowerCase();
			}
			if (group !== undefined && group.length !== 0) {
				if (this.options.groups[group] === undefined) {
					this.options.groups[group] = [response];
					return true;
				} else {
					arrResponse = this.options.groups[group];
					if (arrResponse.indexOf(response) === -1) {
						arrResponse.push(response);
						return true;
					}
					return false;
				}
			}
			return true;
		},

		reset : function(strOpt) {
			var that = this, arrAns, condition;
			if (strOpt !== undefined && strOpt !== "ALL") {
				this.options.groups = {};
			}

			$.each($arrInputField, function(x) {

				if (strOpt === "ALL" || strOpt === undefined) {
					$(this).val("").removeAttr("disabled");
					that._resetFeedback($(this));
				} else {
					arrAns = that.options.answerArray[x];
					condition = that._checkMatch(arrAns, $(this).val()) && that._checkGroupUniqueResponse($(this), $(this).val());
					if (strOpt === "CORRECT") {
						if (condition) {
							$(this).val("").removeAttr("disabled");
							that._resetFeedback($(this));
						}
					} else if (strOpt === "INCORRECT") {
						if (!condition) {
							$(this).val("").removeAttr("disabled");
							that._resetFeedback($(this));
						}
					}
				}

			});

			this._trigger("ON_RESET");
			this.dispatchEvent("ON_RESET");
		},
		_showCorrectFeedback : function(el) {

			if (this.options.feedbackType === 1) {
				$(el).prop('feedback').prop("correct").show();
				$(el).prop('feedback').prop("incorrect").hide();
				$(el).after($(el).prop('feedback'));
			} else if (this.options.feedbackType === 2) {

				if (this.options.styleIncorrect !== undefined) {
					$(el).removeClass(this.options.styleIncorrect);
				} else {
					$(el).attr("style", $(el).prop("styleAtr"));
				}

				if (this.options.styleCorrect !== undefined) {
					$(el).addClass(this.options.styleCorrect);
				} else {
					$(el).css("border", "1px solid green");
				}

			}

		},

		_showIncorrectFeedback : function(el) {

			if (this.options.feedbackType === 1) {
				$(el).prop('feedback').prop("incorrect").show();
				$(el).prop('feedback').prop("correct").hide();
				$(el).after($(el).prop('feedback'));
			} else if (this.options.feedbackType === 2) {
				if (this.options.styleCorrect !== undefined) {
					$(el).removeClass(this.options.styleCorrect);
				} else {
					$(el).attr("style", $(el).prop("styleAtr"));
				}

				if (this.options.styleIncorrect !== undefined) {
					$(el).addClass(this.options.styleIncorrect);
				} else {
					$(el).css("border", "1px solid red");
				}
			}

		},

		_resetFeedback : function(el) {

			if (this.options.feedbackType === 1) {
				$(el).prop('feedback').remove();
			} else if (this.options.feedbackType === 2) {
				if (this.options.styleCorrect !== undefined) {
					$(el).removeClass(this.options.styleCorrect);
				} else {
					$(el).attr("style", $(el).prop("styleAtr"));
					$(el).css("border", "");
				}
				if (this.options.styleIncorrect !== undefined) {
					$(el).removeClass(this.options.styleIncorrect);
				} else {
					$(el).attr("style", $(el).prop("styleAtr"));
					$(el).css("border", "");
				}

			}

		},

		disable : function(val, strOpt) {
			var that = this, condition, arrAns;
			this.options.groups = {};
			$.each($arrInputField, function(x) {
				if (strOpt === "ALL" || strOpt === undefined) {
					if (val) {
						$(this).attr("disabled", "true");
					} else {
						$(this).removeAttr("disabled");
					}
				} else {
					arrAns = that.options.answerArray[x];
					condition = that._checkMatch(arrAns, $(this).val()) && that._checkGroupUniqueResponse($(this), $(this).val());
					if (strOpt === "CORRECT") {
						if (condition) {
							if (val) {
								$(this).attr("disabled", "true");
							} else {
								$(this).removeAttr("disabled");
							}
						}
					} else if (strOpt === "INCORRECT") {
						if (!condition) {
							if (val) {
								$(this).attr("disabled", "true");
							} else {
								$(this).removeAttr("disabled");
							}
						}
					}
				}
			});

		},

		hideFeedback : function(strOpt) {
			var that = this, condition, arrAns;
			this.options.groups = {};
			$.each($arrInputField, function(x) {
				if (strOpt === "ALL" || strOpt === undefined) {
					that._resetFeedback(this);
				} else {
					arrAns = that.options.answerArray[x];
					condition = that._checkMatch(arrAns, $(this).val()) && that._checkGroupUniqueResponse($(this), $(this).val());
					if (strOpt === "CORRECT") {
						if (condition) {
							that._resetFeedback(this);
						}
					} else if (strOpt === "INCORRECT") {
						if (!condition) {
							that._resetFeedback(this);
						}
					}
				}
			});

		},

		showAnswer : function(strDisable, strFeedback) {
			var that = this, arrInpFld, arrAns;
			if (strDisable !== undefined) {
				this.disable(true, strDisable);
			}
			if (strFeedback !== undefined) {
				this.hideFeedback(strFeedback);
			}

			answerArray = that.options.answerArray.slice(0);
			arrInpFld = [];
			this.options.groups = {};
			$.each($arrInputField, function(x) {
				arrAns = that.options.answerArray[x];
				if (that._checkMatch(arrAns, $(this).val()) && that._checkGroupUniqueResponse($(this), $(this).val())) {
					arrInpFld[x] = null;
				} else {
					arrInpFld[x] = this;
				}
			});

			$.each(arrInpFld, function(x) {
				var ind, val, len = 0;
				if (arrInpFld[x]) {
					arrAns = that.options.answerArray[x];
					len = arrAns.length;
					ind = 0;
					while (ind < len) {
						val = arrAns[ind];
						if (that._checkMatch(arrAns, val) && that._checkGroupUniqueResponse($(this), val)) {
							$(this).val(val);
							break;
						}
						ind += 1;
					}
				}
			});
			this._trigger("ON_SHOW_ANSWER");
			this.dispatchEvent("ON_SHOW_ANSWER");
		},

		result : function() {
			return this.options.result;
		},

		destroy : function() {
			console.log("destory!!!!!");
		}
	});
})(jQuery);
