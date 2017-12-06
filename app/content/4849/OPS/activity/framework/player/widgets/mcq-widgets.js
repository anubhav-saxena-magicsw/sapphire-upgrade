/*jslint nomen: true*/
/*globals console,_,$*/

/**
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @namespace HAF.MCQWidget
 * @description This widget allows user to apply MCQ properties to the html elements. The element on which it is applied, acts as the option parent. Options are the children elements which contain the attribute type="option"
 * @example
 * <a href="xml/MCQWidget.xml" target="blank">Sample Html</a>.
 * Apply this widget as:
 * $('#comp').MCQWidget();
 */
( function($) {"use strict";
		$.widget("HAF.MCQWidget", {

			/**
			 * @name HAF.MCQWidget#options
			 * @description This object contains all variables which are going to be accessed by the private and public methods of this widget.
			 */
			options : {
				arr : undefined,
				audioBasePath : undefined,
				lastSelected : undefined,
				audioTag : undefined,
				bkeepOrder : false,
				bMultiSelect : true,
				optionData : [],
				change : "CHANGE",
				correctOrder : [],
				cOrder : []
			},
			/**
			 * @name HAF.MCQWidget#constants
			 * @description This function returns the object for constants used in this widget.
			 */
			constants : function() {
				return {
					change : this.options.change
				};
			},
			/**
			 * @name HAF.MCQWidget#disable
			 * @function
			 * @description This function disables/enables all clickable options.
			 * @param {BOOL} bval True to disable. False to enable.
			 * @param {Object} [el] enables/disables specific option.
			 */
			disable : function(bval, el) {
				var i, node, arrNode = [];
				if (el !== undefined) {
					if ($(el).get(0).bDisabled !== undefined) {
						arrNode.push(el);
					}
				} else {
					arrNode = this.options.arr;
				}

				for ( i = 0; i < arrNode.length; i += 1) {
					node = arrNode[i];
					if (bval === true) {
						$(node).addClass("disabled");
						$(node).get(0).bDisabled = true;
					} else {
						$(node).removeClass("disabled");
						$(node).get(0).bDisabled = false;
					}
				}
			},

			/**
			 * @name HAF.MCQWidget#reset
			 * @function
			 * @description This function resets all clickable options to default state.
			 */
			reset : function() {
				var i, node;
				for ( i = 0; i < this.options.arr.length; i += 1) {
					node = this.options.arr[i];
					$(node).removeClass("active");
					$(node).removeClass("disabled");
					node.bDisabled = false;
				}
				this.options.correctOrder = this.options.cOrder.slice(0);
				this.options.lastSelected = undefined;
				this._stopAudio();
			},

			/**
			 * @name HAF.MCQWidget#_create
			 * @function
			 * @description This function makes all options clickable.
			 * @private
			 */
			_create : function() {
				var i, node;
				this.options.arr = this.element.find("[type='option']");
				//this.options.audioBasePath = this.element.data("baseaudiopath");
				//this.options.bkeepOrder = (this.element.data("keeporder") === "true" || this.element.data("keeporder") === true) ? true : false;
				//this.options.bMultiSelect = (this.element.data("multiselect") === "true" || this.element.data("multiselect") === true) ? true : false;
				this.options.cOrder = this.options.correctOrder.slice(0);

				if (this.options.optionData.length !== this.options.arr.length) {
					console.error("Options count and data do not match...");
					return;
				}
				for ( i = 0; i < this.options.arr.length; i += 1) {
					node = this.options.arr[i];
					node.order = i;
					$(node).data("correct", this.options.optionData[i]);
					node.bDisabled = false;
					this._addClick(node);
				}

			},

			/**
			 * @name HAF.MCQWidget#_addClick
			 * @function
			 * @description This function applies click event on the div passed as arguments.
			 * @param {Object} node Div which is supposed to be the option for MCQ.
			 * @private
			 */
			_addClick : function(node) {
				var self = this, audioSource, response, eventData;
				$(node).on("click", function(e) {
					eventData = {
						el : $(this),
						isCorrect : $(this).data("correct")
					};
					response = self._validateResponse(this);
					if (response.bProceed === false) {
						return;
					}
					if (response.bOrder === false) {
						eventData.isCorrect = false;
					}

					if (self.options.bMultiSelect === false) {
						$(self.options.lastSelected).removeClass("active");
					}
					$(this).addClass("active");
					self.options.lastSelected = this;

					audioSource = self._getAudioSource(this);
					if (audioSource.file !== undefined) {
						self._stopAudio();
						self._playAudio(audioSource.file, audioSource.type);
					}

					$(self.element).trigger(self.options.change, eventData);

				});
			},

			/**
			 * @name HAF.MCQWidget#_validateResponse
			 * @function
			 * @description This function checks wheather the resopnse is valid or not and returns the object with info.
			 * @param {Object} node Optio Div which is clicked.
			 * @returns {Object} An Object containing the properties bProceed(indicates that if further processing is needed), bOrder(indiacates that the order is maintained or not.)
			 * @private
			 */
			_validateResponse : function(node) {
				var objResponse = {
					bProceed : true,
					bOrder : true
				};
				
				if (node.bDisabled === true) {
					objResponse.bProceed = false;
					return objResponse;
				}
				if (this.options.bkeepOrder) {
					if (this.options.correctOrder[0].toString() !== node.order.toString()) {
						objResponse.bOrder = false;
					} else {
						this.options.correctOrder.shift();
						if (this.options.correctOrder.length === 0) {
							this.options.correctOrder = this.options.cOrder.slice(0);
						}
					}
				}
				return objResponse;
			},

			/**
			 * @name HAF.MCQWidget#_getAudioSource
			 * @function
			 * @description This function gets the audio info for the option clicked.
			 * @param {Object} node Optio Div which is clicked.
			 * @returns {Object} An Object containing the audio file path and types array.
			 * @private
			 */
			_getAudioSource : function(node) {
				var i, filePath, fileType, arrType = ['mp3', 'ogg'];
				filePath = $(node).data("audiofile");
				if (filePath !== undefined) {
					if ((this.options.audioBasePath !== undefined) && this.options.audioBasePath.length > 0) {
						filePath = this.options.audioBasePath + "/" + filePath;
					}
				} else {
					return {
						file : undefined,
						type : undefined
					};
				}

				if ($(node).data("audiotype") !== undefined) {
					arrType = $(node).data("audiotype").split(',');
				}

				for ( i = 0; i < arrType.length; i += 1) {
					fileType = "." + arrType[i];
					if (filePath.indexOf(fileType) !== -1) {
						arrType = [];
						break;
					}
				}

				return {
					file : filePath,
					type : arrType
				};
			},

			/**
			 * @name HAF.MCQWidget#_playAudio
			 * @function
			 * @description This function plays the audio passed as argument.
			 * @param {String} path Audio file url.
			 * @param {Object} arrType An array of valid types.
			 * @private
			 */
			_playAudio : function(path, arrType) {
				var i, strSource = "";
				if (this.options.audioTag === undefined) {
					this.options.audioTag = document.createElement("audio");
				}
				$(this.options.audioTag).html("");
				for ( i = 0; i < arrType.length; i += 1) {
					strSource = strSource + "<source src = '" + path + "." + arrType[i] + "'></source>";
				}
				if (strSource.length === 0) {
					strSource = "<source src = '" + path + "'></source>";
				}
				$(this.options.audioTag).append(strSource);
				this.options.audioTag.load();
				this.options.audioTag.play();
			},

			/**
			 * @name HAF.MCQWidget#_stopAudio
			 * @function
			 * @description This function stops the current audio.
			 * @private
			 */
			_stopAudio : function() {
				if (this.options.audioTag !== undefined) {
					this.options.audioTag.pause();
				}
			},

			/**
			 * @name HAF.MCQWidget#_destroy
			 * @function
			 * @description This function calls the reset api and remove click events associated with the options.
			 * @private
			 */
			_destroy : function() {
				this.reset();
				var i, node;
				for ( i = 0; i < this.options.arr.length; i += 1) {
					node = this.options.arr[i];
					$(node).off("click");
				}
			}
		});
	}(jQuery));
