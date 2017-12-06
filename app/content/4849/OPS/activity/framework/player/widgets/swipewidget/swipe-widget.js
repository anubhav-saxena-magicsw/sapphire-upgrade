/*jslint nomen: true*/
/*globals console,_,$,basePath,onTouchMove*/

/**
 * SwipeWidget
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @namespace HAF.SwipeWidget
 * @description This widget allows user to depict swipe functionality.
 * It enables the element on which it is applied to react to touch-swipe events
 * @example
 * Apply this widget as:
 * $("#container").SwipeWidget({onSwipe : function(event) { console.log("On swipe", event);}, min_move_x : 20, min_move_y : 20, preventDefaultEvents : true});
 * Where,<br>
 * 1. "#container" is the id of element on which widget is to be applied.
 * 2. "onSwipe" is the callback function for "onSwipe" event.
 * 3. "min_move_x" contains the pixel value for the swipe tollerance in x-coordinate i.e. Event will not be dispatched if swipe is done for less than this amount of pixel
 * 4. "min_move_y" contains the pixel value for the swipe tollerance in y-coordinate i.e. Event will not be dispatched if swipe is done for less than this amount of pixel
 * 5. "preventDefaultEvents" conatains value to check if default event behaviour is to prevented.
 */
(function($) {'use strict';
	$.fn.SwipeWidget = function(settings) {
		var eventData, config;

		config = {
			min_move_x : 20,
			min_move_y : 20,
			onSwipe : function() {

			},
			preventDefaultEvents : true
		};

		eventData = {
			direction : ""
		};

		if (settings) {
			$.extend(config, settings);
		}

		this.each(function() {
			var startX, startY, isMoving, objThis;
			objThis = this;
			
			isMoving = false;

			function cancelTouch() {
				objThis.removeEventListener('touchmove', onTouchMove);
				startX = null;
				isMoving = false;
			}

			function onTouchMove(e) {

				//console.log("touch move...");
				if (config.preventDefaultEvents) {
					e.preventDefault();
				}
				if (isMoving) {
					var x, y, dx, dy;
					x = e.touches[0].pageX;
					y = e.touches[0].pageY;
					dx = startX - x;
					dy = startY - y;

					if (Math.abs(dx) >= config.min_move_x) {
						cancelTouch();
						if (dx > 0) {
							eventData.direction = "left";
							//config.wipeLeft();
							config.onSwipe(eventData);
						} else {
							eventData.direction = "right";
							//config.wipeRight();
							config.onSwipe(eventData);
						}

					} else if (Math.abs(dy) >= config.min_move_y) {
						cancelTouch();
						if (dy > 0) {
							eventData.direction = "down";
							//config.wipeDown();
							config.onSwipe(eventData);
						} else {
							eventData.direction = "up";
							//config.wipeUp();
							config.onSwipe(eventData);
						}
					}

					//this.trigger("onSwipe",eventData);
				}
			}

			function onTouchStart(e) {
				//console.log("touch start...");
				if (e.touches.length === 1) {
					startX = e.touches[0].pageX;
					startY = e.touches[0].pageY;
					isMoving = true;
					objThis.addEventListener('touchmove', onTouchMove, false);
				}
			}

			if (document.documentElement.hasOwnProperty('ontouchstart')) {
				this.addEventListener('touchstart', onTouchStart, false);
			}
			/*if ('ontouchstart' in document.documentElement) {
			 this.addEventListener('touchstart', onTouchStart, false);
			 }*/
		});

		return this;
	};

}(jQuery));
