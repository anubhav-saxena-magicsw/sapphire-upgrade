/*jslint nomen: true*/
/*globals console,_,$*/

/**
 * CountDownTimer
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'player/base/base-item-comp', 'text!components/countdowntimer/template/countdown-timer.html', 'components/countdowntimer/model/countdown-timer-model', 'css!components/countdowntimer/template/css/countdown-timer.css'],

/**
 * This class will be responsible for timer functionality. This component ticks and updates the text display after every seconds depending upon its format.
 * Timer component can be configured for both incremental and decremental timer and can be used as visual and non visual component.
 * Developer can use its public APis to start, pause, resume, stop during run time. For the complete listing of public APi's please refer API documentation below.
 *@class CountDownTimer
 *@augments BaseItemComp
 *@param {Object} obj  An object with 'decrementalcountdown','timerseperator', 'totalseconds', 'warningafter', 'timeformat', dispatchheartbeat', 'heratbeattimeinterval' and 'countDownTimerWrapperStyle' properties.
 *@example
 *
 * var  CountDownTimer, objCompData = {};
 * objCompData.decrementalcountdown = false;
 * objCompData.timerseperator = "/";
 * objCompData.totalseconds = 30000;
 * objCompData.warningafter = 5;
 * objCompData.timeformat = 0;
 * obj.dispatchheartbeat = true;
 * obj.heratbeattimeinterval = 1;
 * objCompData.countDownTimerWrapperStyle = 'CountDownTimerWrapperStyle1';
 *
 * this.getComponent(context, "countDownTimer", "onComponentCreated", objCompData);
 *
 * function onComponentCreated(objComp){
 * CountDownTimer = objComp;
 * }
 * <br>
 * Component can also be added directly into HTML template using following snippet:
 *
 * &lt;div id="mcompCountDownTimer" type="mComp" compName="countDownTimer"
 * defaultData='{"decrementalcountdown":"true","timerseperator":":",
 * "totalseconds":"30000", "warningafter":"5", "timeformat":"0",
 * "dispatchheartbeat":"true","heratbeattimeinterval":"1"}'&gt;&lt;/div&gt;
 *
 * Where;<br>
 * -id is unique identifier for the component
 * -type can only take "mComp" as a value and it helps in differentiating the HTML tags.
 * -compName take the name of the component as value (which is defined in compList.js)
 * -defaultData contains the configurable property values for the component
 * <br>Configurable properties of component:<br>
 * <table border="1" style="white-space:pre-wrap; color:"#000000";"><tr><th>Property</th><th>Type</th><th>Default Value</th><th>Description</th></tr><tr><td>decrementalcountdown</td><td>Boolean</td><td>true</td><td>This property configure the timer for incremental aur decremental timer.<br><br>If this property is not provided to the component then it will render with decremental timer..</td></tr><tr><td>timerseperator</td><td>String</td><td>:</td><td>This property defines the sepaerator for component.<br><br>If this property is not provided then it will be rendered with ":" seperator.</td></tr><tr><td>totalseconds</td><td>Number</td><td>10</td><td>This property defines the total seconds for the component.<br><br>If this property is not provided then it will run for 10 seconds.</td></tr><tr><td>warningafter</td><td>Number</td><td>5</td><td>This value of this property is used to trigger a warnig event after the specified amount of seconds are consumed.</td></tr><tr><td>timeformat</td><td>Number</td><td>1</td><td>This value of this property is used to format the timer e.g.<br>0 for HH:MM:SS<br>1 for MM:SS<br>2 for SS</td></tr><tr><td>countDownTimerWrapperStyle</td><td>CSS class</td><td>CountDownTimerWrapperStyle</td><td>Any style class defined in activity css, though this property is optional and if developer doesn't provide any new style class then component will render with its own pre-defined style.<br><br>Note: Developer should avoid definig a style class by the "CountDownTimerWrapperStyle" name in activity css.</td></tr><tr><td>dispatchheartbeat</td><td>Boolean</td><td>false</td><td>This property is not mandatory and if no value is provided then component will assume it to be false, setting this property to true will allow this component to dispatch an event on after every second defined in "heratbeattimeinterval" property.</td></tr><tr><td>heratbeattimeinterval</td><td>Number</td><td>5</td><td>This property is not mandatory and it will only work if property "dispatchheartbeat" is set to true.</td></tr></table>
 */
function(Marionette, BaseItemComp, CountDownTimerTemp, CountDownTimerModel, CountDownTimerCSS) {
	'use strict';

	var CountDownTimer = /** @lends CountDownTimer.prototype */
	BaseItemComp.extend({

		template : _.template('<div id="wrapper"><div id="timer" align="center">{{ timerData }}</div></div>'),
		compData : null,
		heartbeatCounter : 0,

		/**
		 * This function initializes the component
		 * @access private
		 * @memberof CountDownTimer
		 * @param {Object} objCompData Conatins the data to configure the component
		 * @returns None
		 */
		initialize : function(objCompData) {
			this.model = new CountDownTimerModel();
			this.compData = objCompData;
			this.objData = objCompData;
			//this property is being used in componentselector for editing.
			//render data for the component
			this.model.on("change", $.proxy(this.onModelChange, this));
			this.componentType = "countdown-timer";
		},

		onRender : function() {
			this.renderDataParcel(this.compData, this.model);
			//this.$('#wrapper').addClass(this.model.get("countDownTimerWrapperStyle"));
			this.$el.addClass(this.compData.styleClass);
		},

		redrawComponent : function() {
			this.renderDataParcel(this.compData, this.model);
		},
		/**
		 * This function is called when component is shown in the DOM
		 * @access private
		 * @memberof CountDownTimer
		 * @param None
		 * @returns None
		 */
		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		},

		/**
		 * This function renders the data by which component will be configured
		 * @access private
		 * @memberof CountDownTimer
		 * @param {Object} objCompData Conatins the data to configure the component
		 * @param {Object} model Conatins the reference of component's model
		 * @returns None
		 */
		renderDataParcel : function(objCompData, model) {

			var parsedIntValue,
			    bValue;

			if (objCompData.clockmode !== undefined) {
				if ( typeof objCompData.clockmode === "string") {
					bValue = (objCompData.clockmode === "true") ? true : false;
				} else {
					bValue = objCompData.clockmode;
				}
				model.set("clockmode", bValue);
				if (bValue) {
					objCompData.decrementalcountdown = false;
				}
			}

			/*
			 if (objCompData.countDownTimerWrapperStyle !== undefined) {
			 if (objCompData.countDownTimerWrapperStyle !== model.get("countDownTimerWrapperStyle")) {
			 model.set("countDownTimerWrapperStyle", objCompData.countDownTimerWrapperStyle);
			 }
			 } else {
			 model.set("countDownTimerWrapperStyle", "CountDownTimerWrapperStyle");
			 }
			 */

			if (objCompData.decrementalcountdown !== undefined) {

				if ( typeof objCompData.decrementalcountdown === "string") {
					bValue = (objCompData.decrementalcountdown === "true") ? true : false;
				} else {
					bValue = objCompData.decrementalcountdown;
				}

				if (model.get("decrementalcountdown") !== bValue) {
					model.set("decrementalcountdown", bValue);
				}
			}

			if (objCompData.timerseperator !== undefined) {
				if (objCompData.timerseperator !== model.get("timerseperator")) {
					model.set("timerseperator", objCompData.timerseperator);
				}
			}

			if (objCompData.totalseconds !== undefined) {

				parsedIntValue = parseInt(objCompData.totalseconds, 10);

				if (parsedIntValue !== model.get("totalseconds")) {
					model.set("totalseconds", parsedIntValue);
				}
			}

			if (objCompData.tickrate !== undefined) {

				parsedIntValue = parseInt(objCompData.tickrate, 10);

				if (parsedIntValue !== model.get("tickrate")) {
					model.set("tickrate", parsedIntValue);
				}
			}

			if (objCompData.warningafter !== undefined) {
				if (objCompData.warningafter !== model.get("warningafter")) {

					parsedIntValue = parseInt(objCompData.warningafter, 10);

					if (parsedIntValue <= model.get("totalseconds")) {
						model.set("warningafter", parsedIntValue);
					} else {
						parsedIntValue = model.get("totalseconds");
						model.set("warningafter", parsedIntValue);
					}
				}
			}
			
			if (objCompData.timeformat !== undefined) {
				parsedIntValue = parseInt(objCompData.timeformat, 10);
				if (model.get("timeformat") !== parsedIntValue) {
					model.set("timeformat", parsedIntValue);
				}
			}

			if (objCompData.dispatchheartbeat !== undefined) {

				if ( typeof objCompData.dispatchheartbeat === "string") {
					bValue = (objCompData.dispatchheartbeat === "true") ? true : false;
				} else {
					bValue = objCompData.dispatchheartbeat;
				}

				if (model.get("dispatchheartbeat") !== bValue) {
					model.set("dispatchheartbeat", bValue);
				}
			}

			if (objCompData.heratbeattimeinterval !== undefined) {

				parsedIntValue = parseInt(objCompData.heratbeattimeinterval, 10);

				if (parsedIntValue !== model.get("heratbeattimeinterval")) {
					model.set("heratbeattimeinterval", parsedIntValue);
				}
			}

			if (model.get("decrementalcountdown")) {
				model.set("timerData", this.getFormattedTime(model.get("totalseconds"), model.get("timeformat")));
			} else {
				model.set("timerData", this.getFormattedTime(0, model.get("timeformat")));
			}

			//console.log("parcel data:"+model.get("timeformat"));

		},

		/**
		 * This function updates the view of timer
		 * @access private
		 * @memberof CountDownTimer
		 * @param {Object} objThis contains the reference of component
		 * @returns None
		 */
		updateTimerView : function(objThis) {
			//If timer is pause then no need to increment or decrement
			if (objThis.model.get("isTimerPaused")) {
				return;
			}

			if (objThis.model.get("decrementalcountdown")) {
				objThis.decrementTimer(objThis);
			} else {
				objThis.incrementTimer(objThis);
			}

		},

		/**
		 * This function increments the timer value
		 * @access private
		 * @memberof CountDownTimer
		 * @param {Object} objThis contains the reference of component
		 * @returns None
		 */
		incrementTimer : function(objThis) {
			if (objThis.model.get("secondsCounter") <= objThis.model.get("totalseconds")) {
				var nCurrentsecond = objThis.model.get("secondsCounter");
				/*jslint plusplus: true*/
				objThis.model.set("secondsCounter", ++nCurrentsecond);
				objThis.heartbeatCounter++;
				objThis.model.set("timerData", (objThis.getFormattedTime(objThis.model.get("secondsCounter"), objThis.model.get("timeformat"))));
				// console.log(objThis.getFormattedTime(objThis.model.get("secondsCounter"), objThis.model.get("timeformat")) + " (" + objThis.model.get("secondsCounter") + " seconds)");

				if ((this.model.get("dispatchheartbeat")) && (objThis.heartbeatCounter === this.model.get("heratbeattimeinterval"))) {
					objThis.heartbeatCounter = 0;
					//Dispatch timer ticking
					objThis.customEventDispatcher(objThis.TIMER_HEARBEAT, objThis, objThis.model.get("timerData"));
				}

				//Check if warning event needs to be dispatched
				if ((objThis.model.get("secondsCounter")) === objThis.model.get("warningafter")) {
					objThis.customEventDispatcher(objThis.TIMER_WARNING, objThis, objThis.model.get("timerData"));
				}

				if (objThis.model.get("clockmode")) {
					objThis.model.set("totalseconds", (objThis.model.get("secondsCounter") + 1));
				}
				//Stop timer if it reaches to its limit
				if (objThis.model.get("secondsCounter") > objThis.model.get("totalseconds")) {
					objThis.stopTimer();
				}
			}
		},

		/**
		 * This function decrement the timer value
		 * @access private
		 * @memberof CountDownTimer
		 * @param {Object} objThis contains the reference of component
		 * @returns None
		 */
		decrementTimer : function(objThis) {
			if (objThis.model.get("secondsCounter") >= 1) {
				var nCurrentsecond,
				    iWarningTime;

				nCurrentsecond = objThis.model.get("secondsCounter");
				/*jslint plusplus: true*/
				objThis.model.set("secondsCounter", --nCurrentsecond);
				objThis.heartbeatCounter++;
				objThis.model.set("timerData", (objThis.getFormattedTime(objThis.model.get("secondsCounter"), objThis.model.get("timeformat"))));
				// console.log(objThis.getFormattedTime(objThis.model.get("secondsCounter"), objThis.model.get("timeformat")) + " (" + objThis.model.get("secondsCounter") + " seconds)");

				if ((this.model.get("dispatchheartbeat")) && (objThis.heartbeatCounter === this.model.get("heratbeattimeinterval"))) {
					objThis.heartbeatCounter = 0;
					//Dispatch timer ticking
					objThis.customEventDispatcher(objThis.TIMER_HEARBEAT, objThis, objThis.model.get("timerData"));
				}

				//Check if warning event needs to be dispatched
				iWarningTime = objThis.model.get("totalseconds") - objThis.model.get("warningafter");
				if (objThis.model.get("secondsCounter") === iWarningTime) {
					objThis.customEventDispatcher(objThis.TIMER_WARNING, objThis, objThis.model.get("timerData"));
				}

				//Stop timer if it reaches to its limit
				if (objThis.model.get("secondsCounter") <= 0) {
					objThis.stopTimer();
				}
			}
		},

		/**
		 * This function returns the format that needs to be displayed
		 * @access private
		 * @memberof CountDownTimer
		 * @param {Number} secs Contains the number of seconds
		 * @param {Number} nFormat Contains the timer format
		 * @returns {String}
		 */
		getFormattedTime : function(secs, nFormat) {
			var strFormat,
			    h,
			    divisor_for_minutes,
			    m,
			    divisor_for_seconds,
			    s,
			    pad = function(n) {
				return (n < 10 ? "0" + n : n);
			};

			h = Math.floor(secs / (60 * 60));

			divisor_for_minutes = secs % (60 * 60);
			m = Math.floor(divisor_for_minutes / 60);

			divisor_for_seconds = divisor_for_minutes % 60;
			s = Math.ceil(divisor_for_seconds);

			if (nFormat === 0) {
				strFormat = pad(h) + this.model.get("timerseperator") + pad(m) + this.model.get("timerseperator") + pad(s);
			} else if (nFormat === 1) {
				strFormat = pad(m) + this.model.get("timerseperator") + pad(s);
			} else if (nFormat === 2) {
				strFormat = pad(s);
			}
			return strFormat;
		},

		/**
		 * This function check timer availabilty
		 * @access private
		 * @memberof CountDownTimer
		 * @param {Object} objThis contains the reference of component
		 * @returns None
		 */
		checkTimerAvailability : function(objThis) {
			if (objThis.model.get("decrementalcountdown")) {
				if (objThis.model.get("secondsCounter") <= 0) {
					objThis.stopTimer();
				}
			} else {
				if (objThis.model.get("secondsCounter") >= objThis.model.get("totalseconds")) {
					objThis.stopTimer();
				}
			}
		},

		/**
		 * This function kills the timer
		 * @access private
		 * @memberof CountDownTimer
		 * @param {Object} objThis contains the reference of component
		 * @returns None
		 */
		killTimer : function(objThis) {
			objThis.model.set("isTimerPaused", false);
			window.clearInterval(objThis.model.get("timerReference"));
			objThis.model.set("timerReference", null);
		},
		/**
		 * This function updates the view of timer
		 * @access private
		 * @memberof CountDownTimer
		 * @param {Object} objThis contains the reference of component
		 * @returns None
		 */
		onModelChange : function() {
			//console.log("timer:"+this.model.get("timerData"));
			this.$("#timer").html(this.model.get("timerData"));
		}
	});

	/**
	 * Set the super to BaseItemComp
	 * @access private
	 * @memberof CountDownTimer#
	 */
	CountDownTimer.prototype.CountDownTimerSuper = BaseItemComp;

	/**@constant
	 * @memberof CountDownTimer#
	 * @access private
	 * @type {string}
	 * @default
	 */
	CountDownTimer.prototype.TIMER_HEARBEAT = 'timerHeartbeat';

	/**@constant
	 * @memberof CountDownTimer#
	 * @access public
	 * @type {string}
	 * @default
	 */
	CountDownTimer.prototype.TIMER_FINISHED = 'timerFinished';

	/**@constant
	 * @memberof CountDownTimer#
	 * @access public
	 * @type {string}
	 * @default
	 */
	CountDownTimer.prototype.TIMER_STARTED = 'timerStarted';

	/**@constant
	 * @memberof CountDownTimer#
	 * @access public
	 * @type {string}
	 * @default
	 */
	CountDownTimer.prototype.TIMER_WARNING = 'timerWarning';

	/**@constant
	 * @memberof CountDownTimer#
	 * @access public
	 * @type {string}
	 * @default
	 */
	CountDownTimer.prototype.TIMER_PAUSED = 'timerPaused';

	/**
	 * This function is used to add penalty to the existing time
	 * @memberof CountDownTimer#
	 * @access public
	 * @param {int} iValue Conatains the penalty time
	 * @returns None.
	 */
	CountDownTimer.prototype.deductPenalty = function(iValue) {
		if (this.model.get("decrementalcountdown")) {
			this.model.set("secondsCounter", (this.model.get("secondsCounter") - (iValue - 1)));
		} else {
			this.model.set("secondsCounter", (this.model.get("secondsCounter") + (iValue - 1)));
		}
		this.checkTimerAvailability(this);
	};

	/**
	 * This function is used to add bonus to the existing time
	 * @memberof CountDownTimer#
	 * @access public
	 * @param {int} iValue Conatains the bonus time
	 * @returns None
	 */
	CountDownTimer.prototype.addBonus = function(iValue) {
		if (this.model.get("decrementalcountdown")) {
			this.model.set("secondsCounter", (this.model.get("secondsCounter") + (iValue + 1)));
		} else {
			var nSeconds = (this.model.get("secondsCounter") - (iValue + 1));
			nSeconds = (nSeconds < 0) ? 0 : nSeconds;
			this.model.set("secondsCounter", nSeconds);
		}

	};

	/**
	 * This function starts the timer
	 * @memberof CountDownTimer#
	 * @access public
	 * @param None
	 * @returns None
	 */
	CountDownTimer.prototype.startTimer = function() {
		var objSelf = this;
		if (!this.model.get("timerReference")) {
			this.model.set("secondsCounter", (this.model.get("decrementalcountdown") ? this.model.get("totalseconds") : 0));
			this.model.set("timerReference", window.setInterval(function() {
				objSelf.updateTimerView(objSelf);
			}, this.model.get("tickrate")));
			this.customEventDispatcher(this.TIMER_STARTED, this, this.model.get("timerData"));
		} else {
			console.log("Timer already running.\n Either pause the current timer and then resume it or stop the timer");
		}
	};

	/**
	 * This function stops the timer
	 * @memberof CountDownTimer#
	 * @access public
	 * @param None
	 * @returns None
	 */
	CountDownTimer.prototype.stopTimer = function() {
		this.killTimer(this);
		this.customEventDispatcher(this.TIMER_FINISHED, this, this.model.get("timerData"));
	};

	/**
	 * This function restarts the timer
	 * @memberof CountDownTimer#
	 * @access public
	 * @param {int} value contains the new value in seconds for the timer to run, if no value is provided then
	 * timer will restart with already assigned value.
	 * @returns None
	 */
	CountDownTimer.prototype.restartTimer = function(value) {
		if (!this.model.get("isTimerPaused")) {
			this.model.set("isTimerPaused", true);
		}
		this.killTimer(this);
		if (value !== undefined) {
			this.model.set("totalseconds", value);
		}

		this.startTimer();

	};

	/**
	 * This functions pauses the timer
	 * @memberof CountDownTimer#
	 * @access public
	 * @param None
	 * @returns None
	 */
	CountDownTimer.prototype.pauseTimer = function() {
		this.model.set("isTimerPaused", true);
		this.customEventDispatcher(this.TIMER_PAUSED, this, this.model.get("timerData"));
	};

	/**
	 * This functions resumes the timer
	 * @memberof CountDownTimer#
	 * @access public
	 * @param None
	 * @returns None
	 */
	CountDownTimer.prototype.resumeTimer = function() {
		this.model.set("isTimerPaused", false);
	};

	CountDownTimer.prototype.show = function() {
		this.$el.show();
	};

	CountDownTimer.prototype.hide = function() {
		this.$el.hide();
	};

	/**
	 * This function flushes the data
	 * @memberof CountDownTimer#
	 * @access private
	 * @param None
	 * @returns None
	 */
	CountDownTimer.prototype.flush = function(value) {
		if (this.model) {
			this.model.id = null;
			this.model.destroy();
			this.model = null;
		}
	};

	/**
	 * This functions destroys the component
	 * @memberof CountDownTimer#
	 * @access public
	 * @param None
	 * @returns {Boolean} True or false
	 */
	CountDownTimer.prototype.destroy = function() {
		this.flush();
		this.unbind();
		this.undelegateEvents();
		this.close();
		return this.CountDownTimerSuper.prototype.destroy.call(this, true);
	};

	return CountDownTimer;
});
