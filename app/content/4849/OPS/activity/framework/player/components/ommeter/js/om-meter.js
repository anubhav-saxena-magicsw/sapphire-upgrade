/*jslint nomen: true*/
/*globals console,Backbone,device,_,$*/

/**
 * OEM Meter
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'underscore', 'jqueryUI', 'jqueryTouchPunch', 'player/base/base-composite-comp', 'text!player/components/ommeter/om-meter.html'], function(Marionette, _, JQueryUI, JQTouchPunch, BaseCompositeComp, templateHTML) {'use strict';
	var OmMeter;
	OmMeter = BaseCompositeComp.extend({
		template : _.template(templateHTML),
		KNOB_BUTTON_STATE_CHANGE : "knob_position_change_event",
		SWITCH_BUTTON_CLICK_EVENT : "switchButtonChangeEvent",
		knob : undefined,
		connectionPoint : [],
		rotationDegree : [],
		knobIndex : 0,
		OFF : "KNOB_OFF",
		ON : "KNOB_ON",
		ERROR : "ERROR",
		strMeterMode : undefined,
		display : undefined,
		meterValue : undefined,
		connectionPointLen : 4,
		numOfKnobPosition : 8,
		knobCurrentPosition : 0,
		divMeterKnob : undefined,
		bgDimension : 760,
		bReverseMode : true,
		dataObject : undefined,
		arrConnerctor : [],
		connectionObject : [],
		arrSwitchButtons : [],
		arrSwitchAngles : [],
		isRunningOnDevice : false,
		objKnobBase : null,
		objKnob : null,
		objKnobOffset : null,
		objKnobBaseOffset : null,
		objKnobContainer : null,
		nCurrentNeedleAngle : 0,
		nCurrentAngle : 0,
		bKnobOffSetCalculated : false,
		bKnobBaseOffSetCalculated : false,
		bIsActive : true,

		onRender : function() {

			this.bgDimension = this.dataObject.bgDimension;
			this.bReverseMode = (this.dataObject.reverseMode !== undefined) ? this.dataObject.reverseMode : true;
			this.numOfKnobPosition = Number(this.dataObject.numberOfSteps);
			this.arrState = this.dataObject.meterState;
			this.bCreateSwitchButtons = this.dataObject.createSwitch;
			this.arrSwitchAngles = this.dataObject.switchAngles;
			this.createMeterElements();

		},

		initialize : function(obj) {
			this.arrSwitchButtons = [];
			this.arrSwitchAngles = [];
			this.arrConnector = [];
			this.connectionObject = [];
			this.isRunningOnDevice = (device.mobile() || device.tablet()) ? true : false;
			this.dataObject = obj;
			this.degree = 0;
			this.first = undefined;

		},

		/**
		 * This function returns the nearest major step
		 * @access private
		 * @memberof Slider
		 * @param {Number} goal Contains the position of thumb where it is dropped
		 * @returns None
		 */
		findNearestAngle : function(angle) {
			var currentVal, iLen, arrStepsPos, closest = null, maxValue, minValue, differenceVal;
			arrStepsPos = this.arrSwitchAngles;
			
			iLen = this.arrSwitchAngles.length;
			maxValue = this.arrSwitchAngles[iLen-1];
			//console.log("this.arrSwitchAngles",this.arrSwitchAngles,iLen);
			//console.log("angle:",angle , "maxValue:",maxValue);
			if(angle > maxValue)
			{
				minValue = this.arrSwitchAngles[0];
				differenceVal = maxValue - minValue;
				//console.log("((differenceVal/2) + maxValue)"+((differenceVal/2) + maxValue));
				if(angle <= (Number(differenceVal/2) + Number(maxValue)) )
				{
					closest = maxValue;
				}
				else
				{
					closest = minValue;
				}
			}
			else
			{
				$.each(this.arrSwitchAngles, function() {
				if (closest === null || Math.abs(this - angle) < Math.abs(closest - angle)) {
					closest = this;

				}
			});
			}
			
			currentVal = Number(closest);
			////////console.log("Nearest>>>"+currentVal);
			return currentVal;
		},

		onShow : function() {
			this.objKnobBase = $(this.el).find("#meterKnobBase");
			this.objKnob = $(this.el).find("#meterKnob");
			this.elCenterDiv = $(this.el).find("#centerDiv");
			this.elCenterDiv.css("left",(parseFloat(this.objKnob.css("left")) + this.objKnob.width()/2 - 5) +"px");
			this.elCenterDiv.css("top", (parseFloat(this.objKnob.css("top"))+ this.objKnob.height()/2 - 5) +"px");
			//this.objKnobContainer = $(this.el).find("#knobContainer");
			//this.objKnobOffset = {left:this.objKnob.css("left"),top:this.objKnob.css("top")};
			this.addEvents();
		},

		addEvents : function() {

			if (!this.isRunningOnDevice) {
				//this.objKnobBase.off("click").on("click", $.proxy(this.clickOnKnobBase, this));
				this.objKnob.off("mousedown").on("mousedown", $.proxy(this.downOnKnob, this));
			} else {
				//this.objKnobBase.off("click").on("click", $.proxy(this.clickOnKnobBase, this));
				this.objKnob.off("touchstart").on("touchstart", $.proxy(this.downOnKnob, this));
			}

		},

		clickOnKnobBase : function(event) {

			if (!this.bIsActive) {
				return;
			}
			//////console.log("base clicked");
			if (!this.bKnobBaseOffSetCalculated) {
				this.bKnobBaseOffSetCalculated = true;
				this.objKnobBaseOffset = this.objKnobBase.offset();
			}

			this.rotateKnob(event);
		},

		downOnKnob : function(event) {
			//////console.log("down on knob");
			if (!this.bIsActive) {
				return;
			}
			this.objKnobOffset = this.objKnob.offset();
			//console.log("this.objKnobOffset>>>>>>>>>>>>",this.objKnobOffset);

			//this.rotateKnob(event);

			if (!this.isRunningOnDevice) {
				this.objKnob.off("mousemove", $.proxy(this.moveOnKnob, this)).on("mousemove", $.proxy(this.moveOnKnob, this));
				this.objKnob.off("mouseup", $.proxy(this.upOnKnob, this)).on("mouseup", $.proxy(this.upOnKnob, this));
				this.objKnob.off("mouseout").on("mouseout", $.proxy(this.upOnKnob, this));
			} else {
				this.objKnob.off("touchmove").on("touchmove", $.proxy(this.moveOnKnob, this));
				this.objKnob.off("touchend").on("touchend", $.proxy(this.upOnKnob, this));
				this.objKnob.off("mouseout").on("mouseout", $.proxy(this.upOnKnob, this));
			}

		},

		moveOnKnob : function(event) {
			//////console.log("move on knob");
			this.rotateKnob(event);

		},

		upOnKnob : function(event) {
			var angle, objData = {};
			//////console.log("up on knob");
			this.first = undefined;
			angle = this.findNearestAngle(this.degree);
			this.degree = angle;
			//this.nCurrentAngle = angle;
			//console.log(this.degree);
			//console.log("on up @@@@@@@@@@@@@@this.nCurrentAngle:"+this.nCurrentAngle+" angle:"+angle);
			this.setKnobAngle(angle);

			if (!this.isRunningOnDevice) {
				this.objKnob.off("mousemove", $.proxy(this.moveOnKnob, this));
				this.objKnob.off("mouseup", $.proxy(this.upOnKnob, this));
				this.objKnob.off("mouseout", $.proxy(this.upOnKnob, this));
			} else {
				this.objKnob.off("touchmove", $.proxy(this.moveOnKnob, this));
				this.objKnob.off("touchend", $.proxy(this.upOnKnob, this));
			}

			objData.type = this.KNOB_BUTTON_STATE_CHANGE;
			objData.currentIndex = this.getCurrentKnobPosition();
			//////console.log("bIncreaseAndSet !!!!!!!!!!!!!!!!!", bIncreaseAndSet, nUpdatedBgPosition);
			this.trigger(this.KNOB_BUTTON_STATE_CHANGE, objData);

			//this.getCurrentKnobPosition();

		},

		setKnobAngle : function(angle) {
			//this.nCurrentAngle = angle;
			this.objKnob.css('-moz-transform', 'rotate(' + angle + 'deg)');
			this.objKnob.css('-webkit-transform', 'rotate(' + angle + 'deg)');
			this.objKnob.css('-o-transform', 'rotate(' + angle + 'deg)');
			this.objKnob.css('-ms-transform', 'rotate(' + angle + 'deg)');

		},

		getAngleForKnob : function(event) {
			var center_x, center_y, mouse_x, mouse_y, radians, degree, objEvent;
			if (this.isRunningOnDevice) {
				event.preventDefault();
				objEvent = event.originalEvent.touches[0];
			} else {
				objEvent = event;
			}
			
			center_x = (this.elCenterDiv.offset().left) + ((this.elCenterDiv.width() * this.getStageScaleValue()) / 2 );
			center_y = (this.elCenterDiv.offset().top) + ((this.elCenterDiv.height() * this.getStageScaleValue()) / 2 );
			
			mouse_x = objEvent.pageX ;
			mouse_y = objEvent.pageY ;

			radians = Math.atan2(mouse_x - center_x, mouse_y - center_y);
			this.degree = parseFloat(this.degree);
			if (this.first) {
				if ((radians * (180 / Math.PI) * -1) < 0) {
					this.degree += (360 + (radians * (180 / Math.PI) * -1)) - this.first;
				} else {
					this.degree += (radians * (180 / Math.PI) * -1) - this.first;
				}
			}
			
			if ((radians * (180 / Math.PI) * -1) < 0) {
				this.first = 360 + (radians * (180 / Math.PI) * -1);
			} else {
				this.first = (radians * (180 / Math.PI) * -1);
			}

			if (this.degree < 0) {
				this.degree = 360 - Math.abs(this.degree);
			}
			if (this.degree > 360) {
				this.degree = this.degree%360;
			}
			//console.log("R ",(radians * (180 / Math.PI) * -1));
			//console.log("F ",this.first);
			//console.log("D ", this.degree);

		},

		rotateKnob : function(event) {
			var degree, targetId;

			targetId = event.target.id;
			//////console.log("event>>>",targetId);
			this.getAngleForKnob(event);
			////////console.log("degreeee>>",this.objKnobOffset," ",degree+"  ",objEvent.pageX," ",objEvent.pageY);

			this.setKnobAngle(this.degree);
		},

		getCurrentKnobPosition : function() {
			var count, iLen, knobPosition;

			iLen = this.arrSwitchAngles.length;

			for ( count = 0; count < iLen; count++) {
				if (this.degree == this.arrSwitchAngles[count]) {
					knobPosition = count;
					break;
				}
			}

			return this.arrState[knobPosition];
		}
	});

	OmMeter.prototype.mode = function(strMode) {
		this.strMeterMode = strMode;
	};

	OmMeter.prototype.__super__ = BaseCompositeComp;

	OmMeter.prototype.setKnobPosition = function() {
		//this.knobIndex;
		//this.divMeterKnob
	};

	OmMeter.prototype.createMeterElements = function() {
		var meterBodyDiv, connectionPointDiv, i, switchDiv, objClassRef = this;
		meterBodyDiv = $('<div id="meterHolder"/>');

		connectionPointDiv = $('<div id="" type="connectionPoint" index="" style="width:10px;height:10px;background:yellow"/>');

		for ( i = 1; i <= this.connectionPointLen; i += 1) {
			connectionPointDiv = $('<div id="point_' + i + '" type="connectionPoint" index="" class="point' + i + '"/>');
			meterBodyDiv.append(connectionPointDiv);
			this.arrConnerctor.push($(connectionPointDiv).attr("id"));
		}

		this.$el.find('[id=bgHolder]').append(meterBodyDiv);

		if (this.bCreateSwitchButtons === true) {
			for ( i = 0; i < this.numOfKnobPosition; i += 1) {
				switchDiv = $('<div id="switch' + i + '" class="switchStyle' + i + '" indexValue="' + i + '"/>');
				meterBodyDiv.append(switchDiv);
				this.arrSwitchButtons.push(switchDiv);
				switchDiv.on(this.getEventType(), objClassRef, objClassRef.handleSwitchClick);
			}

		}

		this.initlizeButtons();

		//this.setText("hello");
	};

	OmMeter.prototype.handleSwitchClick = function(objEvent) {
		var objData, nIndexValue = Number($(objEvent.currentTarget).attr("indexValue"));
		//objEvent.data.knobCurrentPosition = nIndexValue;
		//objEvent.data.setKnobPosition(true);
		//objEvent.data.nCurrentAngle = objEvent.data.arrSwitchAngles[nIndexValue];
		objEvent.data.degree = objEvent.data.arrSwitchAngles[nIndexValue];
		objEvent.data.setKnobAngle(objEvent.data.degree);
		objData = {};
		objData.type = objEvent.data.SWITCH_BUTTON_CLICK_EVENT;
		objData.currentIndex = nIndexValue;
		objEvent.data.trigger(objData.type, objData);
	};

	OmMeter.prototype.getDiv = function(d) {
		return $("<div id='" + d.startDiv + "' class='" + d.startCss + "'/>" + "<div id='" + d.endDiv + "' class='" + d.endCss + "'/>");
	};

	OmMeter.prototype.initlizeButtons = function() {
		var objClassRef = this;
		//this.divMeterKnob = this.$el.find('[id=meterSwitch]');
		//this.divMeterKnob.on(this.getEventType(), objClassRef, objClassRef.handleKnobClick);
	};

	OmMeter.prototype.handleKnobClick = function(objEvent) {
		objEvent.data.setKnobPosition();

	};

	OmMeter.prototype.setKnobPosition = function(bIncreaseAndSet) {

		var nUpdatedBgPosition, objData;
		if (this.bReverseMode === true) {
			if (bIncreaseAndSet === undefined) {
				this.knobCurrentPosition = this.knobCurrentPosition + 1;
			}
			this.knobCurrentPosition = (this.knobCurrentPosition < this.numOfKnobPosition) ? this.knobCurrentPosition : 0;
			nUpdatedBgPosition = (this.bgDimension / this.numOfKnobPosition) * this.knobCurrentPosition;
			nUpdatedBgPosition = (this.bReverseMode === true) ? (this.bgDimension - nUpdatedBgPosition) : nUpdatedBgPosition;
		} else {
			if (bIncreaseAndSet === undefined) {
				this.knobCurrentPosition = this.knobCurrentPosition - 1;
			}
			nUpdatedBgPosition = (this.bgDimension / this.numOfKnobPosition) * this.knobCurrentPosition;
			nUpdatedBgPosition = this.bgDimension - nUpdatedBgPosition;
		}
		this.divMeterKnob.css("background-position", nUpdatedBgPosition + "px 0px");

		objData = {};
		objData.type = this.KNOB_BUTTON_STATE_CHANGE;
		objData.currentIndex = this.knobCurrentPosition;
		//////console.log("bIncreaseAndSet !!!!!!!!!!!!!!!!!", bIncreaseAndSet, nUpdatedBgPosition);
		this.trigger(this.KNOB_BUTTON_STATE_CHANGE, objData);
	};

	OmMeter.prototype.getEventType = function() {
		var strEvent = "mousedown";
		//(device.mobile() === true || device.tablet() === true) ? "tap" : "click";
		return strEvent;
	};

	//------------------
	OmMeter.prototype.changeDisplayStyle = function(strStyleName) {
		var display = this.$el.find('[id=displayText]');
		display.removeClass();
		display.addClass("displayText");
	};

	OmMeter.prototype.setText = function(strValue) {
		var display = this.$el.find('[id=displayText]');
		display.html(strValue);
	};

	OmMeter.prototype.enable = function(bEnable) {
		var objClassRef = this;
		if (bEnable === true) {
			this.divMeterKnob.off(this.getEventType());
			this.divMeterKnob.on(this.getEventType(), objClassRef, objClassRef.handleKnobClick);
		} else {
			this.divMeterKnob.off(this.getEventType());
		}
	};

	OmMeter.prototype.getMeterState = function() {
		return this.getCurrentKnobPosition();
	};

	OmMeter.prototype.reset = function() {
		//this.knobCurrentPosition = -1;
		//this.setKnobPosition();
		this.degree = 0;
		this.setKnobAngle(0);
	};

	OmMeter.prototype.getConnectorList = function() {
		return this.arrConnerctor;
	};

	OmMeter.prototype.destroy = function() {
		var i = 0;
		for ( i = 0; i < this.arrSwitchButtons.length; i += 1) {
			this.arrSwitchButtons[i].off(this.getEventType());
		}
		this.arrConnerctor = [];
		this.divMeterKnob.off(this.getEventType());
		return this.__super__.prototype.destroy(true);
	};

	return OmMeter;

});
