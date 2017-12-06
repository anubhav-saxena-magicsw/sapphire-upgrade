/*jslint nomen: true*/
/*globals ,console,$, */

( function($) {"use strict";
		$.widget("Pearson.ZoomWidget", {

			options : {
				minZoom : 1,
				maxZoom : 2.2,
				lastZoom : 1,
				zoomStep : 0.2,
				lastPanX : undefined,
				lastPanY : undefined,
				shouldPan : true,
				isPanning : false,
				zoomType : "scale"
			},

			_create : function() {
				var $content = $(this.element), o = this.options, strFontSize, nFontSize, nFontDelta;
				if (o.zoomType === "scale") {
					this.resetZoom();
					if (o.shouldPan === true) {
						this._addPanEvents();
					}
				}
			},

			_addPanEvents : function() {
				var $content = $(this.element), $parent = $(this.element).parent(), o = this.options, self = this;
				$parent.off("mousedown").on("mousedown", function(e) {
					o.isPanning = true;
				});
				$parent.off("mouseup mouseleave").on("mouseup mouseleave", function(e) {
					o.isPanning = false;
					o.lastPanX = undefined;
					o.lastPanY = undefined;
				});

				$parent.off("mousemove").on("mousemove", function(e) {
					var sl, st, diffX, diffY;
					if (o.isPanning === true) {
						if (o.lastPanX !== undefined) {
							diffX = o.lastPanX - e.clientX;
							diffY = o.lastPanY - e.clientY;
						} else {
							diffX = 0;
							diffY = 0;
						}
						o.lastPanX = e.clientX;
						o.lastPanY = e.clientY;
						sl = $parent.scrollLeft();
						st = $parent.scrollTop();
						sl += diffX;
						st += diffY;
						if (st > ($content.height() * o.lastZoom - $content.height())) {
							st = ($content.height() * o.lastZoom - $content.height());
						} else if (st < ($content.height() - $content.height() * o.lastZoom)) {
							st = ($content.height() - $content.height() * o.lastZoom);
						}

						if (sl > ($content.width() * o.lastZoom - $content.width())) {
							sl = ($content.width() * o.lastZoom - $content.width());
						} else if (sl < ($content.width() - $content.width() * o.lastZoom)) {
							sl = ($content.width() - $content.width() * o.lastZoom);
						}
						self._scrollTo(sl, st);
					}

				});
			},

			initialize : function() {
				var $parent = $(this.element).parent();
				if ($parent.css("overflow") === "visible") {
					$parent.css("overflow", "auto");
				}
				this.resetZoom();
			},

			resetZoom : function() {
				var o = this.options;
				o.lastZoom = o.minZoom;
				this._applyZoom();
			},
			clearZoom : function() {
				var $parent = $(this.element).parent();
				this.resetZoom();
				if ($parent.css("overflow") === "auto") {
					$parent.css("overflow", "visible");
				}

			},
			zoomIn : function() {
				var o = this.options;
				if (o.lastZoom < o.maxZoom) {
					o.lastZoom += o.zoomStep;
				} else {
					return;
				}
				this._applyZoom();
			},

			zoomOut : function() {
				var o = this.options;
				if (o.lastZoom > o.minZoom) {
					o.lastZoom -= o.zoomStep;
				} else {
					return;
				}
				this._applyZoom();
			},

			_applyZoom : function() {
				var $content = $(this.element), cssObj, scaleFunc, o = this.options;
				cssObj = {};

				if (o.zoomType === "scale") {
					scaleFunc = "scale(" + this.options.lastZoom + ")";
					cssObj.transform = scaleFunc;
					cssObj["-ms-transform"] = scaleFunc;
					cssObj["-moz-transform"] = scaleFunc;
					cssObj["-webkit-transform"] = scaleFunc;
					cssObj["-o-transform"] = scaleFunc;
					cssObj["transform-origin"] = "0% 0%";
					cssObj["-ms-transform-origin"] = "0% 0%";
					cssObj["-moz-transform-origin"] = "0% 0%";
					cssObj["-webkit-transform-origin"] = "0% 0%";
					cssObj["-o-transform-origin"] = "0% 0%";
				}else{
					cssObj["font-size"] = this.options.lastZoom + "px";
				}
				
				$content.css(cssObj);
				this._scrollToCenter();
			},

			_scrollToCenter : function() {
				var $content = $(this.element), scrolltop, scrollleft;
				scrolltop = ($content.height() * this.options.lastZoom - $content.height()) / 2;
				scrollleft = ($content.width() * this.options.lastZoom - $content.width()) / 2;
				this._scrollTo(scrollleft, scrolltop);
			},

			_scrollTo : function(x, y) {
				var $parent = $(this.element).parent();
				$parent.scrollTop(y);
				$parent.scrollLeft(x);

			},

			_destroy : function() {
				var $content = $(this.element);
				this.resetZoom();
				$content.off("mousedown");
				$content.off("mouseup");
				$content.off("mousemove");
			}
		});
	}(jQuery));

