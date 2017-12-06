/*jslint nomen:true*/
/*global console,_,$*/
(function($) {

	$.widget("Template.DropDown", $.custom.BASEWIDGET, {
		options : {
			totalQuestion : 0,
			$arrInputField : null,
			answerArray : null,
			result : null,
			responseSeperator : "|",
			groups : {},
			styleIncorrect : undefined,
			styleCorrect : undefined,
			feedbackType : 1
			//textAlign:"center"
		},

		_create : function() {

		},

		_init : function() {
			var that = this;
			this._trigger("ON_INIT");
			this.options.answerArray = [];
			this.options.result = {
				totalAttempt : 0,
				totalIncorrect : 0,
				totalCorrect : 0,
				totalQuestions : 0
			};

			
			if (this.options.widgetData.caseSenstive) {
				this.options.caseSenstive = this.options.widgetData.caseSenstive;
			}
			if (this.options.widgetData.caseSenstive) {
				this.options.responseSeperator = this.options.widgetData.responseSeperator;
			}
			if (this.options.widgetData.responseSeperator) {
				this.options.styleIncorrect = this.options.widgetData.styleIncorrect;
			}
			if (this.options.widgetData.styleCorrect) {
				this.options.styleCorrect = this.options.widgetData.styleCorrect;
			}
			if (this.options.widgetData.feedbackType) {
				this.options.feedbackType = this.options.widgetData.feedbackType;
			}
			
			$arrInputField = $(".FIB");

			this.options.result.totalQuestions = $arrInputField.length;

			$.each($arrInputField, function(x) {
				var objElement, $select, inputId, arrResponse, arrOptions;
				objElement = $(this);
				inputId = "input" + x;
				$select = $("<select class='FIB'><option id='_blank'></option></select>");
				$select.attr("id", inputId);
				$select.attr("grp", objElement.attr("grp"));
				arrResponse = objElement.attr("ans").split(that.options.responseSeperator);
				arrOptions = objElement.attr("data-provider").split(that.options.responseSeperator);
				$.each(arrOptions, function(ind, val) {
					$select.append($("<option value='" + val + "'>" + val + "</option>"));
				});
				$select.prop("arrOptions", arrOptions);
				objElement.after($select);
				objElement.remove();
				$arrInputField[x] = $select;
				if (that.options.feedbackType === 1) {
					$feedback = $("<div style='position:relative; display:inline-block;'></div>");
					$feedback.prop("correct", $("<div class='" + that.options.styleCorrect + "'></div>"));
					$feedback.append($feedback.prop("correct"));
					$feedback.prop("incorrect", $("<div class='" + that.options.styleIncorrect + "'></div>"));
					$feedback.append($feedback.prop("incorrect"));
					$select.prop("feedback", $feedback);
				}
				that.options.answerArray.push(arrResponse);
				$select.on("change", function() {
					var objData = {};
					if ($(this).find('#_blank').length) {
						$(this).find('#_blank').hide();
					}
					objData.isAllfilled = that._isAllfilled();
					that._trigger("ON_CHANGE", {}, objData);
				});

			});

			$(that.element).show();

		},

		_isAllfilled : function() {
			var that = this, isAllFilled = true, select, id;

			$.each($arrInputField, function(x) {
				select = this[0];
				id = select.options[select.selectedIndex].id;
				if (id == "_blank") {
					isAllFilled = false;
				}
			});
			return isAllFilled;
		},

		checkAnswer : function(strDisable) {
			var that = this, arrAns, val, select;
			this.options.result.totalAttempt += 1;
			this.options.result.totalCorrect = 0;
			this.options.result.totalIncorrect = 0;
			if (strDisable !== undefined) {
				this.disable(true, strDisable);
			}
			this.options.groups = {};

			$.each($arrInputField, function(x, inp) {
				arrAns = that.options.answerArray[x];
				select = this[0];
				val = select.options[select.selectedIndex].text;

				if (that._checkMatch(arrAns, val) && that._checkGroupUniqueResponse($(this), val)) {
					that.options.result.totalCorrect += 1;
					that._showCorrectFeedback($(this));
				} else {
					that.options.result.totalIncorrect += 1;
					that._showIncorrectFeedback($(this));
				}
			});

			this._trigger("ON_CHECK_ANSWER");
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
			var that = this, arrAns, condition, select, val;
			if (strOpt !== undefined && strOpt !== "ALL") {
				this.options.groups = {};
			}

			$.each($arrInputField, function(x) {

				if (strOpt === "ALL" || strOpt === undefined) {
					$(this).find('#_blank').show();
					$(this).val("").removeAttr("disabled");
					that._resetFeedback($(this));
					this[0].selectedIndex = 0;
				} else {
					arrAns = that.options.answerArray[x];
					select = this[0];
					val = select.options[select.selectedIndex].text;
					condition = that._checkMatch(arrAns, val) && that._checkGroupUniqueResponse($(this), val);
					if (strOpt === "CORRECT") {
						if (condition) {
							$(this).find('#_blank').show();
							$(this).val("").removeAttr("disabled");
							that._resetFeedback($(this));
							this[0].selectedIndex = 0;
						}
					} else if (strOpt === "INCORRECT") {
						if (!condition) {
							$(this).find('#_blank').show();
							$(this).val("").removeAttr("disabled");
							that._resetFeedback($(this));
							this[0].selectedIndex = 0;
						}
					}
				}
			});

			this._trigger("ON_RESET");
		},

		_showCorrectFeedback : function(el) {

			if (this.options.feedbackType === 1) {
				$(el).prop('feedback').prop("correct").show();
				$(el).prop('feedback').prop("incorrect").hide();
				$(el).after($(el).prop('feedback'));
			} else if (this.options.feedbackType === 2) {
				$(el).removeClass(this.options.styleIncorrect);
				$(el).addClass(this.options.styleCorrect);
			}

		},

		_showIncorrectFeedback : function(el) {

			if (this.options.feedbackType === 1) {
				$(el).prop('feedback').prop("incorrect").show();
				$(el).prop('feedback').prop("correct").hide();
				$(el).after($(el).prop('feedback'));
			} else if (this.options.feedbackType === 2) {
				$(el).removeClass(this.options.styleCorrect);
				$(el).addClass(this.options.styleIncorrect);
			}

		},

		_resetFeedback : function(el) {

			if (this.options.feedbackType === 1) {
				$(el).prop('feedback').remove();
			} else if (this.options.feedbackType === 2) {
				$(el).removeClass(this.options.styleCorrect);
				$(el).removeClass(this.options.styleIncorrect);
			}

		},

		disable : function(val, strOpt) {
			var that = this, condition, arrAns, select, val;
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
					select = this[0];
					val = select.options[select.selectedIndex].text;
					condition = that._checkMatch(arrAns, val) && that._checkGroupUniqueResponse($(this), val);

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
					select = this[0];
					val = select.options[select.selectedIndex].text;
					condition = that._checkMatch(arrAns, val) && that._checkGroupUniqueResponse($(this), val);
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
			var that = this, arrInpFld, arrAnsval, select;
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
				select = this[0];
				val = select.options[select.selectedIndex].text;
				if (that._checkMatch(arrAns, val) && that._checkGroupUniqueResponse($(this), val)) {
					arrInpFld[x] = null;
				} else {
					arrInpFld[x] = select;
				}
			});

			$.each(arrInpFld, function(x) {
				var ind, val, len = 0, arrOptions;
				if (arrInpFld[x]) {
					arrAns = that.options.answerArray[x];
					len = arrAns.length;
					ind = 0;
					while (ind < len) {
						val = arrAns[ind];
						if (that._checkMatch(arrAns, val) && that._checkGroupUniqueResponse($(this), val)) {
							arrOptions = $(this).prop("arrOptions");
							this.selectedIndex = arrOptions.indexOf(val) + 1;
							break;
						}
						ind += 1;
					}
				}
			});

			this._trigger("ON_SHOW_ANSWER");
		},

		result : function() {
			return this.options.result;
		},

		destroy : function() {

		}
	});
})(jQuery);
