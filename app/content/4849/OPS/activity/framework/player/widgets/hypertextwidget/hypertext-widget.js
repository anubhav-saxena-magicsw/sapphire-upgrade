/*jslint nomen: true*/
/*globals console,_,$*/

/**
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @namespace HAF.HyperTextWidget
 * @description This widget allows user to launch description popup an click of text specified within &lt; a &gt; tag. It also adds style to the tags.
 * @example
 * <a href="xml/HyperTextWidget.xml" target="blank">Sample Html</a>.
 * Apply this widget as:
 * $('#comp').HyperTextWidget();
 */
( function($) {"use strict";
		$.widget("HAF.HyperTextWidget", {

			/**
			 * @name HAF.HyperTextWidget#options
			 * @description This object contains all variables which are going to be accessed by the private and public methods of this widget.
			 */
			options : {
				maxWidth : 200,
				leftGap : 30,
				topGap : 30
			},

			/**
			 * @name HAF.HyperTextWidget#_create
			 * @function
			 * @description This function makes all options clickable.
			 * @private
			 */
			_create : function() {
				var self, text, popupDiv = $("<span id='hyperText'> </span>"), closeBtn = $("<div id='closeBtn'></div>"), objRecursive;
				self = this;
				this.element.find("a").each(function(index, el) {
					if ($.trim($(el).attr("hyper-text")).length > 0) {
						require(['css!player/widgets/hypertextwidget/css/hypertext-widget.css'], function() {

						});
						$(el).off('click').on("click", function() {
							popupDiv.html($(el).attr("hyper-text"));
							popupDiv.attr('class', '');
							if ($.trim($(el).attr("style-class")).length > 0) {
								popupDiv.addClass($(el).attr("style-class"));
							} else {
								popupDiv.addClass('hypertextwidget');
							}
							closeBtn.attr('class', '');
							if ($.trim($(el).attr("close-style-class")).length > 0) {
								closeBtn.addClass($(el).attr("close-style-class"));
							} else {
								closeBtn.addClass("hypertextwidgetcloseBtn");
							}
							popupDiv.append(closeBtn);
							popupDiv.css('position', 'absolute');

							popupDiv.prop("originator-el", $(el));

							popupDiv.css('left', $(this).offset().left - self.options.leftGap + "px");
							popupDiv.css('top', $(this).offset().top + self.options.topGap + "px");
							popupDiv.css('max-width', self.options.maxWidth + "px");

							if ($(el).attr("left-gap") !== undefined && isNaN(parseFloat($(el).attr("left-gap"))) === false) {
								popupDiv.css('left', $(this).offset().left - parseFloat($(el).attr("left-gap")) + "px");
							}
							if ($(el).attr("top-gap") !== undefined && isNaN(parseFloat($(el).attr("top-gap"))) === false) {
								popupDiv.css('top', $(this).offset().top + parseFloat($(el).attr("top-gap")) + "px");
							}

							if ($(el).attr("max-width") !== undefined && isNaN(parseFloat($(el).attr("max-width"))) === false) {
								popupDiv.css('max-width', parseFloat($(el).attr("max-width")) + "px");
							}
							self.close();
							$('#mActivity').append(popupDiv);
							self.popupDiv = popupDiv;
							self.closeBtn = closeBtn;
							closeBtn.on("click", function() {
								self.close();
							});

							objRecursive = popupDiv.HyperTextWidget(self.options);
							popupDiv.prop("objRecursive", objRecursive);
						});
					}

				});
				$(window).resize(function(e) {
					self.reposition();
				});
			},
			reposition : function() {
				var popupDiv, ol, ot, el;
				popupDiv = this.popupDiv;
				if (popupDiv === undefined) {
					return;
				} else if (popupDiv.prop("originator-el") === undefined) {
					return;
				}
				el = popupDiv.prop("originator-el");
				ol = $(el).offset().left;
				ot = $(el).offset().top;

				popupDiv.css('left', ol - this.options.leftGap + "px");
				popupDiv.css('top', ot + this.options.topGap + "px");

				if ($(el).attr("left-gap") !== undefined && isNaN(parseFloat($(el).attr("left-gap"))) === false) {
					popupDiv.css('left', ol - parseFloat($(el).attr("left-gap")) + "px");
				}
				if ($(el).attr("top-gap") !== undefined && isNaN(parseFloat($(el).attr("top-gap"))) === false) {
					popupDiv.css('top', ot + parseFloat($(el).attr("top-gap")) + "px");
				}
			},
			close : function() {
				var popupDiv, closeBtn;
				popupDiv = this.popupDiv;
				closeBtn = this.closeBtn;
				if (popupDiv !== undefined && closeBtn !== undefined) {
					if (popupDiv.prop("objRecursive") !== undefined) {
						popupDiv.prop("objRecursive").HyperTextWidget("close");
					}
					closeBtn.off("click");
					popupDiv.remove();
				}
				delete this.popupDiv;
				delete this.closeBtn;
			},
			/**
			 * @name HAF.HyperTextWidget#_destroy
			 * @function
			 * @description This function calls the reset api and remove click events associated with the options.
			 * @private
			 */
			_destroy : function() {
				this.close();
				this.element.find("a").each(function(index, el) {
					$(el).off("click");
				});
			}
		});
	}(jQuery));
