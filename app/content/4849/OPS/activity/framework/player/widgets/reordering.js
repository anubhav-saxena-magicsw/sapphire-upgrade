/*jslint nomen:true*/
/*global console,_,$*/
(function($) {

	$.widget("Template.REORDERING", $.custom.BASEWIDGET, {
		options : {
			arrQuestion : [],
			totalQuestion : 0,
			answerArray : null,
			result : null,
			startX : 0,
			startY : 0,
			functionList : ["checkAnswer", "reset", "disable", "hideFeedback", "showAnswer"]
		},

		_create : function() {

		},

		_init : function() {
			this.options.answerArray = [];
			this.options.result = {
				totalAttempt : 0,
				totalIncorrect : 0,
				totalCorrect : 0,
				totalQuestions : 0
			};
			if (!this.options.widgetData.feedbackType) {
				this.options.widgetData.feedbackType = 1;
			}

			$(this.element).show();

			this.options.arrQuestion = $(this.element).find('[type = REORDER]');
			this.options.totalQuestion = this.options.arrQuestion.length;
			this._createSortablesDiv();
			this._applySortableFeature();
			this.dispatchEvent("ON_INIT");
		},

		_createSortablesDiv : function() {
			var i, self = this;
			$.each(this.options.arrQuestion, function(index, qus) {

				var ans, arrWords = $(qus).html().split(" ");
				$(this).prop("ans", arrWords.slice(0));
				self._shuffle(arrWords);
				if (arrWords.join("") == $(qus).html().replace(/\s/g, '')) {
					self._shuffle(arrWords);
				}
				ans = $(qus).text().replace(/\s/g, '');
				self.options.answerArray.push(ans);
				$(qus).html("");
				if ($(qus).attr("serial")) {
					$("<div class='" + self.options.widgetData.styleSerial + "'> " + $(qus).attr("serial") + "</div>").insertBefore($(qus));
				}

				self._processWordsArray(qus, arrWords);
				self._applySortableFeature(qus);

				if (self.options.widgetData.feedbackType === 1) {
					$feedback = $("<div style='position:relative; display:inline-block;'></div>");
					$feedback.prop("correct", $("<div class='" + self.options.widgetData.styleCorrect + "'></div>"));
					$feedback.append($feedback.prop("correct"));
					$feedback.prop("incorrect", $("<div class='" + self.options.widgetData.styleIncorrect + "'></div>"));
					$feedback.append($feedback.prop("incorrect"));
					$(this).prop("feedback", $feedback);
				}
			});
		},

		_processWordsArray : function(qus, arrWords) {
			var i, self = this;
			$.each(arrWords, function(ind, htm) {
				var objCss, $sortable;
				$sortable = $("<div class='" + self.options.widgetData.styleClass + "'>" + htm + " </div>");
				$(qus).append($sortable);
			});
		},

		_applySortableFeature : function(qus) {
			var i, self = this;

			$(qus).sortable({
				start : function(event, ui) {
					self.options.startX = event.clientX;
					self.options.startY = event.clientY;
					//$(".ui-sortable-placeholder").css("margin","1px");
					//$(".ui-sortable-placeholder").css("padding","1px");
					//$(".ui-sortable-placeholder").css("width","1px");
					//$(".ui-sortable-placeholder").css("height","0px");

					if (self.options.widgetData.stylePlaceHolder) {
						$(".ui-sortable-placeholder").css("visibility", "visible");
						$(".ui-sortable-placeholder").addClass(self.options.widgetData.stylePlaceHolder);
					}

				},
				update : function(event, ui) {
					$(this).append(ui.helper);
				},
				sort : function(event, ui) {
					var nUpdatedX, nUpdatedY, scale;
					scale = self._getScale();
					if (scale === 1) {
						return;
					}
					nUpdatedX = (event.clientX - self.options.startX) / scale;
					nUpdatedY = (event.clientY - self.options.startY) / scale;

					ui.helper.css("position", "relative");
					ui.helper.css("left", nUpdatedX + "px");
					ui.helper.css("top", nUpdatedY + "px");

				},
				change : function(event, ui) {
					$(this).sortable("refreshPositions");
				}
			});
		},

		_getScale : function(arr) {
			var scale, matches, matrixRegex = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/;
			if ($('#mPlayer').css('-webkit-transform')) {
				matches = $('#mPlayer').css('-webkit-transform').match(matrixRegex);
			} else if ($('#mPlayer').css('transform')) {
				matches = $('#mPlayer').css('transform').match(matrixRegex);
			} else if ($('#mPlayer').css('-ms-transform')) {
				matches = $('#mPlayer').css('-ms-transform').match(matrixRegex);
			}
			if (matches) {
				scale = parseFloat(matches[1]);
			} else {
				scale = 1;
			}
			return scale;
		},

		_shuffle : function(arr) {
			arr.sort(function() {
				return Math.round(Math.random()) - 0.5;
			});
		},

		checkAnswer : function(strDisable) {
			var i, self = this;
			$.each(this.options.arrQuestion, function(index, qus) {
				if (self.options.answerArray[index] == $(this).text().replace(/\s/g, '')) {
					self._showCorrectFeedback(this);
					if (strDisable == "CORRECT") {
						$(this).sortable("disable");
					}
				} else {
					self._showIncorrectFeedback(this);
					if (strDisable == "INCORRECT") {
						$(this).sortable("disable");
					}
				}
			});

			this.dispatchEvent("ON_CHECK_ANSWER");
		},

		reset : function(strOpt) {
			var arrWords, self = this;

			if (strOpt === undefined || strOpt.length === 0) {
				strOpt = "ALL";
			}
			$.each(this.options.arrQuestion, function(index, qus) {

				if (self.options.answerArray[index] == $(this).text().replace(/\s/g, '')) {
					if (strOpt == "CORRECT" || strOpt == "ALL") {
						$(this).sortable("destroy");
						$(this).html("");
						arrWords = $(this).prop("ans").slice(0);
						self._shuffle(arrWords);
						self._processWordsArray(this, arrWords);
						self._applySortableFeature(this);
					}
				} else {
					if (strOpt == "INCORRECT" || strOpt == "ALL") {
						$(this).sortable("destroy");
						$(this).html("");
						arrWords = $(this).prop("ans").slice(0);
						self._shuffle(arrWords);
						self._shuffle(arrWords);
						self._processWordsArray(this, arrWords);
						self._applySortableFeature(this);
					}
				}
			});
			this.dispatchEvent("ON_RESET");
		},

		_showCorrectFeedback : function(el) {
			if (this.options.widgetData.feedbackType === 1) {
				$(el).prop('feedback').prop("correct").show();
				$(el).prop('feedback').prop("incorrect").hide();
				$(el).append($(el).prop('feedback'));
			}
		},

		_showIncorrectFeedback : function(el) {
			if (this.options.widgetData.feedbackType === 1) {
				$(el).prop('feedback').prop("incorrect").show();
				$(el).prop('feedback').prop("correct").hide();
				$(el).append($(el).prop('feedback'));
			}
		},

		_resetFeedback : function(el) {
			if (this.options.widgetData.feedbackType === 1) {
				$(el).prop('feedback').remove();
			}
		},

		disable : function(val, strOpt) {
			var i, self = this;
			if (strOpt === undefined || strOpt.length === 0) {
				strOpt = "ALL";
			}
			val = (val == "true" || val === true) ? true : false;
			$.each(this.options.arrQuestion, function(index, qus) {
				if (self.options.answerArray[index] == $(this).text().replace(/\s/g, '')) {
					if (strOpt == "CORRECT" || strOpt == "ALL") {
						if (val) {
							$(this).sortable("disable");
						} else {
							$(this).sortable("enable");
						}
					}
				} else {
					if (strOpt == "INCORRECT" || strOpt == "ALL") {
						if (val) {
							$(this).sortable("disable");
						} else {
							$(this).sortable("enable");
						}
					}
				}
			});
		},

		hideFeedback : function(strOpt) {

		},

		showAnswer : function(strDisable, strFeedback) {
			var arrWords, self = this;
			$.each(this.options.arrQuestion, function(index, qus) {
				if (self.options.answerArray[index] == $(this).text().replace(/\s/g, '')) {

					if (strDisable == "CORRECT" || strDisable == "ALL") {
						$(this).sortable("disable");
					}
					if (strFeedback == "CORRECT" || strFeedback == "ALL") {
						self._resetFeedback(this);
					}

				} else {

					$(this).sortable("destroy");
					$(this).html("");
					arrWords = $(this).prop("ans");
					self._processWordsArray(this, arrWords);
					self._applySortableFeature(this);
					if (strDisable == "INCORRECT" || strDisable == "ALL") {
						$(this).sortable("disable");
					}
					if (strFeedback == "INCORRECT" || strFeedback == "ALL") {
						self._resetFeedback(this);
					}
				}
			});
			this.dispatchEvent("ON_SHOW_ANSWER");
		},

		result : function() {
			return this.options.result;
		},

		destroy : function() {
			$.each(this.options.arrQuestion, function(index, qus) {

				$(this).sortable("destroy");

			});
			this.options.arrQuestion = null;
		}
	});
})(jQuery);
