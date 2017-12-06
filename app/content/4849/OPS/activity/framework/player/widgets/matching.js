/*jslint nomen: true*/
/*globals console,_,$,basePath*/

/**
 * MatchingWidget
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @namespace HAF.MatchingWidget
 * @description This widget allows user to depict the functionality of keyboard.
 * The element on which it is applied, acts as the option parent.
 * In the options there is property by the name of "keys" which gets overriden by the json data provided by the developer.
 * @example
 * Apply this widget as:
 * $('#matchingContainer').MatchingWidget({correctMapping:["s1:t1","s2:t2","s3:t3","s4:t4"], isOneToOne:true, shuffle:false, linkType:"line"});<br>
 * Where,<br>
 * 1. "#matchingContainer" is the id of element on which widget is applied
 * 2. "correctMapping" is the key-value pair for correct mapping
 * 3. "isOneToOne" defines if the Matching widget is of type one to one or one to many
 * 4. "shuffle" defines if the source and target position will be shuffled during runtime; currently widget only take this value as false
 * 5. "linkType" defines the type for the connection line; currently widget only take this value as line
 */
( function($) {
		"use strict";
		$.widget("custom.MATCHING", $.custom.BASEWIDGET, {

			/**
			 * @name HAF.MatchingWidget#options
			 * @description This object contains all variables which are going to be accessed by the private and public methods of this widget.
			 */
			options : {

				correctMapping : [],
				shuffle : false,
				linkType : "line", //line||curve
				previousSource : null,
				isOneToOne : true, //false==OneToMany
				$svgElem : null,
				functionList : ["checkAnswer", "showAnswer", "reset", "disable"]

			},

			/**
			 * @name HAF.MatchingWidget#_create
			 * @function
			 * @description This function triggers the rendering of keyboard items
			 * @private
			 * @param None
			 * @returns None
			 */
			_create : function() {
				if (this.options.widgetData.feedbackType === undefined) {
					this.options.widgetData.feedbackType = 1;
				}
				this.options.$svgElem = $("<svg xmlns='http://www.w3.org/2000/svg' style='width:100%; height:100%;position:absolute;'></svg>");
				$(this.element).prepend(this.options.$svgElem);
			},

			/**
			 * @name HAF.MatchingWidget#_init
			 * @function
			 * @description This function is called during the initialisation phase of widget
			 * @private
			 * @param None
			 * @returns None
			 */
			_init : function() {
				this.options.correctMapping = [];
				if (!this.options.widgetData.feedbackType) {
					this.options.widgetData.feedbackType = 1;
				}
				
				this.attachListeners("[type=target]");
				this.attachListeners("[type=source]");
			},

			/**
			 * @name HAF.MatchingWidget#attachListeners
			 * @function
			 * @description This function attaches listeners to the source and target elements
			 * @private
			 * @param None
			 * @returns None
			 */
			attachListeners : function(mapping) {
				var mapping, self = this, $feedback;
				
				$.each($(this.element).find(mapping), function() {
					var mapData;
					$(this).off("click").on("click", function(e) {
						self.onItemClicked(e);
					});
					if ($(this).attr("ans")) {
						mapData = $(this).attr("id") + ":" + $(this).attr("ans");
						$(this).removeAttr("ans");
						self.options.correctMapping.push(mapData);
						if (self.options.widgetData.feedbackType === 1) {
							$feedback = $("<div></div>");
							$feedback.prop("correct", $("<div class='" + self.options.widgetData.styleCorrect + "'></div>"));
							$feedback.append($feedback.prop("correct"));
							$feedback.prop("incorrect", $("<div class='" + self.options.widgetData.styleIncorrect + "'></div>"));
							$feedback.append($feedback.prop("incorrect"));
							$(this).prop("feedback", $feedback);
							if ($(this).attr("style-feedback")) {
								$feedback.addClass($(this).attr("style-feedback"));
							} else {
								$feedback.css({
									left : parseFloat($(this).css("left")) + $(this).outerWidth() + "px",
									top : $(this).css("top"),
									position : "absolute"
								});
							}

						}
					}
				});
			},

			/**
			 * @name HAF.MatchingWidget#removeListeners
			 * @function
			 * @description This function attaches listeners to the source and target elements
			 * @private
			 * @param None
			 * @returns None
			 */
			removeListeners : function(mapping) {
				$(this.element).find(mapping).off("click");
			},

			/**
			 * @name HAF.MatchingWidget#onItemClicked
			 * @function
			 * @description This function will be called when source or item elements are clicked
			 * @private
			 * @param None
			 * @returns None
			 */
			onItemClicked : function(event) {
				var type, objThis = this;
				if ($(event.currentTarget).hasClass("disabled")) {
					return;
				}
				type = $(event.currentTarget).attr("type");
				if (type === "source") {
					objThis.saveSourceRefernece(objThis, event.currentTarget);
				} else {
					if (objThis.isTargetOccupied(event.currentTarget) && objThis.isSourceSelected()) {
						// if a source (unlinked) is also selected... move the link to this one and remove previous link
						objThis.removeLink(event.currentTarget);
					}
					// if a unlinked source is selected
					if (objThis.isSourceSelected()) {
						if (objThis.options.isOneToOne) {
							//remove previous links of source
							objThis.removeLink(objThis.options.previousSource);
						}
						objThis.addDataToSourceAndTarget(objThis.options.previousSource, event.currentTarget);
						objThis.drawLink(objThis.options.previousSource, event.currentTarget);
					}
					objThis.removeActiveState(objThis.options.previousSource);
				}

				this.dispatchEvent("ON_ITEM_CLICKED", this, $(event.currentTarget));
				if (this.options.correctMapping.length === this.getLinkedObjectsMap().length) {
					this.dispatchEvent("ALL_SET", this, true);
				} else {
					this.dispatchEvent("ALL_SET", this, false);
				}

			},

			/**
			 * @name HAF.MatchingWidget#addDataToSourceAndTarget
			 * @function
			 * @description This function adds required data to source and target elements
			 * @private
			 * @param {Object} source contains the reference of source element
			 * @param {Object} source contains the reference of target element
			 * @returns None
			 */
			addDataToSourceAndTarget : function(source, target) {
				var targetList, targetId, arrTarget;
				//add SourceData To Target
				$(target).attr('source', $(source).attr('id'));

				//add TargetData To Source
				targetId = $(target).attr('id');
				//if OneToOne
				if (this.options.OneToOne) {
					$(source).attr('target', targetId);
				} else {
					targetList = $(source).attr('target');
					if (targetList) {
						targetList = targetList + '|' + targetId;
						arrTarget = targetList.split('|');
						arrTarget.sort();
						targetList = arrTarget.join('|');
					} else {
						targetList = targetId;
					}
					$(source).attr('target', targetList);
				}
			},

			/**
			 * @name HAF.MatchingWidget#saveSourceRefernece
			 * @function
			 * @description This function saves reference of source
			 * @private
			 * @param {Object} context contains the reference of widget
			 * @param {Object} element contains the reference of element which is clicked
			 * @returns None
			 */
			saveSourceRefernece : function(context, element) {
				//check if source is clicked and if a source is already selected
				context.removeActiveState(context.options.previousSource);
				context.options.previousSource = $(element);
				context.applyActiveState($(element));
			},

			/**
			 * @name HAF.MatchingWidget#isTargetOccupied
			 * @function
			 * @description This function checks if target is already occupied
			 * @private
			 * @param {Object} target contains the reference of target element
			 * @returns Boolean
			 */
			isTargetOccupied : function(target) {
				if ($(target).attr('source')) {
					return true;
				}
				return false;
			},

			/**
			 * @name HAF.MatchingWidget#isTargetOccupied
			 * @function
			 * @description This function checks if source is already occupied
			 * @private
			 * @param None
			 * @returns Boolean
			 */
			isSourceSelected : function() {
				if ($(this.options.previousSource).hasClass('selected')) {
					return true;
				}
				return false;
			},

			/**
			 * @name HAF.MatchingWidget#applyActiveState
			 * @function
			 * @description This function applies active state to the element
			 * @private
			 * @param {Object} element contains the reference of element on which state is to be applied
			 * @returns None
			 */
			applyActiveState : function(element) {
				element.addClass("selected");
			},

			/**
			 * @name HAF.MatchingWidget#removeActiveState
			 * @function
			 * @description This function removes active state from the element
			 * @private
			 * @param {Object} element contains the reference of element on which state is to be removed
			 * @returns None
			 */
			removeActiveState : function(element) {
				if (!element) {
					return;
				}
				element.removeClass("selected");
			},

			/**
			 * @name HAF.MatchingWidget#drawLink
			 * @function
			 * @description This function adds a link between source and target
			 * @private
			 * @param {Object} source contains the reference of source
			 * @param {Object} target contains the reference of target
			 * @returns None
			 */
			drawLink : function(source, target) {
				var sourceX, sourceY, X1, Y1, targetX, targetY, X2, Y2, lineId, newLine;

				sourceX = parseInt($(source).css('left'), 10);
				sourceY = parseInt($(source).css('top'), 10);
				X1 = sourceX + $(source).outerWidth();
				Y1 = sourceY + $(source).outerHeight() / 2;

				targetX = parseInt($(target).css('left'), 10);
				targetY = parseInt($(target).css('top'), 10);
				X2 = targetX;
				Y2 = targetY + $(target).outerHeight() / 2;

				lineId = $(source).attr('id') + '_' + $(target).attr('id');

				newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
				newLine.setAttribute('id', lineId);
				newLine.setAttribute('x1', X1);
				newLine.setAttribute('y1', Y1);
				newLine.setAttribute('x2', X2);
				newLine.setAttribute('y2', Y2);
				this.options.$svgElem.append(newLine);
			},

			/**
			 * @name HAF.MatchingWidget#removeLink
			 * @function
			 * @description This function removes a link between source and target
			 * @private
			 * @param {Object} element contains the reference of target
			 * @returns None
			 */
			removeLink : function(element) {
				var type, sourceId, targetId, lineId, targetList, arrTarget, index;

				type = $(element).attr("type");
				if (type === "target") {
					sourceId = $(element).attr('source');
					lineId = sourceId + '_' + $(element).attr('id');
					$('#' + lineId).remove();
					$(element).attr('source', null);

					if (this.options.isOneToOne) {
						$('#' + sourceId).attr('target', null);
					} else {
						targetList = $('#' + sourceId).attr('target');
						arrTarget = targetList.split('|');
						index = arrTarget.indexOf($(element).attr('id'));
						arrTarget.splice(index, 1);
						arrTarget.sort();
						targetList = arrTarget.join('|');
						$('#' + sourceId).attr('target', targetList);
					}
				} else {
					targetId = $(element).attr('target');
					lineId = $(element).attr('id') + '_' + targetId;
					$('#' + lineId).remove();
					$('#' + targetId).attr('source', null);
					$(element).attr('target', null);
				}
			},

			/**
			 * @name HAF.MatchingWidget#evaluate
			 * @function
			 * @description This function evaluates the matching and returns the result
			 * @public
			 * @param {Boolean} bRemoveIncorrectLines if true then incorrect links are removed from the matching elements
			 * @returns {Object} contains attributes:
			 * "correctAnswer" which provides number of correct answers in Matching
			 * "totalQuestion" which provides number of matching pairs
			 */
			checkAnswer : function(strDisable) {
				var arrCorrectResponse, iCorrectResponseLen, arrUserResponse, nCorrectMatch, i, objResult;
				if ( strDisable instanceof Array) {
					strDisable = strDisable[0];
				}
				if (strDisable) {
					this.disable(true, strDisable);
				}

				arrCorrectResponse = this.options.correctMapping;
				iCorrectResponseLen = arrCorrectResponse.length;
				arrUserResponse = this.getLinkedObjectsMap();
				nCorrectMatch = 0;

				/*jslint plusplus: true*/
				for ( i = 0; i < iCorrectResponseLen; i++) {
					var sourceId = arrCorrectResponse[i].split(":")[0];

					if (arrCorrectResponse.indexOf(arrUserResponse[i]) > -1) {
						this._showCorrectFeedback(sourceId);
						nCorrectMatch++;
					} else {
						this._showIncorrectFeedback(sourceId);
					}
				}

				objResult = {};
				objResult.correctAnswer = nCorrectMatch;
				objResult.totalQuestion = arrUserResponse.length;
				this.dispatchEvent("ON_CHECK_ANSWER", this, objResult);
			},

			/**
			 * @name HAF.MatchingWidget#reveal
			 * @function
			 * @description This function reveals the correct matching
			 * @public
			 * @param None
			 * @returns None
			 */
			showAnswer : function(strDisable) {
				var arrCorrectResponse, iCorrectResponseLen, i, j, mapping, sourceId, targetId, source, target, arrTarget;
				arrCorrectResponse = this.options.correctMapping;
				iCorrectResponseLen = arrCorrectResponse.length;
				if ( strDisable instanceof Array) {
					strDisable = strDisable[0];
				}
				if (strDisable) {
					this.disable(true, strDisable);
				}
				/*jslint plusplus: true*/
				for ( i = 0; i < iCorrectResponseLen; i++) {
					mapping = arrCorrectResponse[i];
					sourceId = mapping.split(':')[0];
					targetId = mapping.split(':')[1];
					source = $('#' + sourceId);
					if (targetId.indexOf('|') > -1) {
						arrTarget = targetId.split('|');
						for ( j = 0; j < arrTarget.length; j++) {
							target = $('#' + arrTarget[j]);
							target.attr('source', sourceId);
						}
					} else {
						target = $('#' + targetId);
						target.attr('source', sourceId);

					}
					source.attr('target', targetId);

					this.removeActiveState(source);
				}
				this._redrawSvg();
				this.dispatchEvent("ON_SHOW_ANSWER");
			},

			/**
			 * @name HAF.MatchingWidget#reset
			 * @function
			 * @description This function resets the matching widget
			 * @public
			 * @param None
			 * @returns None
			 */
			reset : function(strOpt) {
				var bVal, arrCorrectResponse, iCorrectResponseLen, arrUserResponse, i, j, mapping, sourceId, targetId, source, arrTarget;
				if ( strOpt instanceof Array) {
					strOpt = strOpt[0];
				}
				if (strOpt === undefined || strOpt.length === 0) {
					strOpt = "ALL";
				}
				this.disable(false, strOpt);
				arrCorrectResponse = this.options.correctMapping;
				arrUserResponse = this.getLinkedObjectsMap();
				iCorrectResponseLen = arrUserResponse.length;
				/*jslint plusplus: true*/
				for ( i = 0; i < iCorrectResponseLen; i++) {
					bVal = false;
					mapping = arrUserResponse[i];
					sourceId = mapping.split(':')[0];
					source = $('#' + sourceId);
					targetId = mapping.split(':')[1];
					if (arrCorrectResponse.indexOf(arrUserResponse[i]) > -1) {
						if (strOpt === "ALL" || strOpt === "CORRECT") {
							bVal = true;
						}
					} else {
						if (strOpt === "ALL" || strOpt === "INCORRECT") {
							bVal = true;
						}
					}

					if (bVal) {
						source.attr('target', null);
						this._resetFeedback(sourceId);
						if (targetId.indexOf('|') > -1) {
							arrTarget = targetId.split('|');
							for ( j = 0; j < arrTarget.length; j++) {
								$('#' + arrTarget[j]).attr('source', null);
							}
						} else {
							$('#' + targetId).attr('source', null);
						}
					}

					this.removeActiveState(source);
				}
				this._redrawSvg();
				this.dispatchEvent("ON_RESET");
			},

			_redrawSvg : function() {
				var arrCorrectResponse, iCorrectResponseLen, arrUserResponse, i, j, mapping, sourceId, targetId, source, arrTarget;
				this.options.$svgElem.empty();
				arrUserResponse = this.getLinkedObjectsMap();
				for ( i = 0; i < arrUserResponse.length; i += 1) {
					mapping = arrUserResponse[i];
					sourceId = mapping.split(':')[0];
					targetId = mapping.split(':')[1];
					source = $("#" + sourceId);
					if (targetId.indexOf('|') > -1) {
						arrTarget = targetId.split('|');
						for ( j = 0; j < arrTarget.length; j++) {
							this.drawLink(source, $('#' + arrTarget[j]));
						}
					} else {
						this.drawLink(source, $("#" + targetId));
					}
				}

			},
			disable : function(val, strOpt) {
				var i, self = this, arrCorrectResponse, iCorrectResponseLen, arrUserResponse, nCorrectMatch;
				if ( val instanceof Array) {
					strOpt = val[1];
					val = val[0];
				}
				if (strOpt === undefined || strOpt.length === 0) {
					strOpt = "ALL";
				}
				val = (val == "true" || val === true) ? true : false;

				arrCorrectResponse = this.options.correctMapping;
				iCorrectResponseLen = arrCorrectResponse.length;
				arrUserResponse = this.getLinkedObjectsMap();

				/*jslint plusplus: true*/
				for ( i = 0; i < iCorrectResponseLen; i++) {
					var $source, $target, strId;
					strId = arrCorrectResponse[i].split(":")[0];
					$source = $(this.element).find("#" + strId);
					strId = arrCorrectResponse[i].split(":")[1];
					$target = $(this.element).find("#" + strId);
					if (arrCorrectResponse.indexOf(arrUserResponse[i]) > -1) {
						if (strOpt === "ALL" || strOpt === "CORRECT") {
							if (val) {
								$source.addClass("disabled");
								$target.addClass("disabled");
							} else {
								$source.removeClass("disabled");
								$target.removeClass("disabled");
							}
						}
					} else {
						if (strOpt === "ALL" || strOpt === "CORRECT") {
							if (val) {
								$source.addClass("disabled");
								$target.addClass("disabled");
							} else {
								$source.removeClass("disabled");
								$target.removeClass("disabled");
							}
						}
					}
				}
			},

			/**
			 * @name HAF.MatchingWidget#getLinkedObjectsMap
			 * @function
			 * @description This function returns the array of mapping
			 * @public
			 * @param None
			 * @returns {Array}
			 */
			getLinkedObjectsMap : function() {
				var arrSource, iLen, objSource, i, arrLinkedObjects, strCorrectMap;

				arrSource = $(this.element).find('[type=source]');
				iLen = arrSource.length;
				arrLinkedObjects = [];

				/*jslint plusplus: true*/
				for ( i = 0; i < iLen; i++) {
					objSource = arrSource[i];
					strCorrectMap = $(objSource).attr('id') + ":";
					if ($(objSource).attr('target')) {
						strCorrectMap += $(objSource).attr('target');
						arrLinkedObjects.push(strCorrectMap);
					}

				}
				return arrLinkedObjects;
			},

			_showCorrectFeedback : function(strId) {
				var el = $(this.element).find("#" + strId);
				if (this.options.widgetData.feedbackType === 1) {
					$(el).prop('feedback').prop("correct").show();
					$(el).prop('feedback').prop("incorrect").hide();
					$(this.element).append($(el).prop('feedback'));
				}
			},

			_showIncorrectFeedback : function(strId) {
				var el = $(this.element).find("#" + strId);
				if (this.options.widgetData.feedbackType === 1) {
					$(el).prop('feedback').prop("incorrect").show();
					$(el).prop('feedback').prop("correct").hide();
					$(this.element).append($(el).prop('feedback'));
				}
			},

			_resetFeedback : function(strId) {
				var el = $(this.element).find("#" + strId);
				if (this.options.widgetData.feedbackType === 1) {
					$(el).prop('feedback').remove();
				}
			},

			// dispatchEvent : function(strEventName, obj, data) {
			// var customData = {};
			// customData.strEventName = strEventName;
			// customData.parent = this.options.parentObject;
			// customData.data = data;
			// this._trigger("WIDGET_EVENT", obj, customData);
			// },

			/**
			 * @name HAF.MatchingWidget#_destroy
			 * @function
			 * @description This function destroys the the widget
			 * @private
			 * @param None
			 * @returns None
			 */
			destroy : function() {
				this.reset();
				this.options.$svgElem.remove();
				this.removeListeners("[type=target]");
				this.removeListeners("[type=source]");
				this._super();
			}
		});
	}(jQuery));
