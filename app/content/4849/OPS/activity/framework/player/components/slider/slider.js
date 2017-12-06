/*jslint nomen: true*/
/*globals console,Backbone,_,$*/
/**
 * Slider
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['marionette', 'jqueryUI', 'jqueryTouchPunch', 'player/base/base-item-comp', 'text!components/slider/template/slider.html', 'components/slider/model/slider-model', 'components/slider/js/sliderconst', 'css!components/slider/template/style/slider.css'],

/**
 * This component provides the functionality of a slider component.
 * It can be configured for allignment (horizontal or vertical), steps, length and default position.
 * It dispatches the current position of thumb in percentage on every user interaction e.g. when draging starts, while being drageed and when dragging stops.
 * It provides public APIs getCurrentPosition, setCurrentPosition, maxSliderPosition, minSliderPosition and destroy which can be used to update the component during runtime.
 *
 *@class Slider
 *@augments BaseCompositeComp
 *@param {Object} obj  An object with 'sectionData', 'compLength', 'defaultSelectedSection' and 'sectionNavigatorWrapperStyle' properties.
 *@example
 *
 * var  sliderComp, obj = {};
 * obj.sliderLength = 200;
 * obj.defalutPosition = 20;// Provide an array in case two thumbs in the slider are required E.g. [20,80]
 * obj.minSlidingPostion = 20;
 * obj.maxSlidingPostion = 80;
 * obj.allignment = SliderConstants.CONSTANTS.VERTICAL;;
 * obj.steps = 5;
 * obj.sliderWrapperStyle = 'SliderVerticalWrapperStyle';
 *
 * this.getComponent(context, "Slider", "onComponentCreated", obj);
 *
 * function onComponentCreated(objComp){
 *  sliderComp = objComp;
 * }
 * <br>
 * Component can also be added directly into HTML template using following snippet:
 * &lt;div id="mcompSlider" type="mComp" compName="Slider" defaultData='{"sliderLength":"200",
 * "defalutPosition":"20", "minSlidingPostion":"20",  "sliderWrapperStyle":"SliderVerticalWrapperStyle",
 * "maxSlidingPostion":"80", "allignment":"vertical"}' &gt;&lt;/div&gt;
 * <br>
 * Where;<br>
 * -id is unique identifier for the component
 * -type can only take "mComp" as a value and it helps in differentiating the HTML tags.
 * -compName take the name of the component as value (which is defined in compList.js)
 * -defaultData contains the configurable property values for the component
 * <br>Configurable properties of component:<br>
 * <table border="1" style="white-space:pre-wrap; color:"#000000";"><tr><th>Property</th><th>Type</th><th>Default Value</th><th>Description</th></tr><tr><td>sliderLength</td><td>integer</td><td>100</td><td>This property defines the length of component.</td></tr><tr><td>defalutPosition</td><td>Number</td><td>0</td><td>This property defines the default position of slider thumb and component treats this value as percentage value.<br><br>If this property is not provided by the developer then by default thumb would be placed at the start i.e. at 0 percent.<br> If the slider is to be used as a "Range slider" i.e with two thumbs then developer would need to provide this value in an array. E.g [20,80].<br>where first value defines the default position of first thumb and second value defines the default position of second thumb.</td></tr><tr><td>allignment</td><td>String</td><td>SliderConstants.CONSTANTS.HORIZONTAL</td><td>This property cofigures the allignment of component.<br><br>If deveoper doesn't provide this property then by default component renders with horizontal allignment.</td></tr><tr><td>minSlidingPostion</td><td>Number</td><td>0</td><td>This property defines the minimum value to which thumb can be dragged.<br><br>If developer doesn't provide any value then by default it is set to 0 percent.<br><br>Note: Value assigned to this property should not be less than the value of "defalutPosition" property.</td></tr><tr><td>maxSlidingPostion</td><td>Number</td><td>100</td><td>This property defines the maximum value to which thumb can be dragged.<br><br>If developer doesn't provide any value then by default it is set to 100 percent.<br><br>Note: Value assigned to this property should not be greater than 100 percent.</td></tr><tr><td>sliderWrapperStyle</td><td>CSS class</td><td>SliderHorizontalWrapperStyle</td><td>Any style class defined in activity css, though this property is optional and if developer doesn't provide any new style class then calculator will render with its own pre-defined style.<br><br>Note: Developer should avoid definig a style class by the "SliderHorizontalWrapperStyle" name in activity css.</td></tr></table>
 */
function(Marionette, jqueryUI, jqueryTouchPunch, BaseItemComp, SliderTemp, SliderModel, SliderConstants, SliderCSS) {
	'use strict';

	var Slider = /** @lends Slider.prototype */
	BaseItemComp.extend({

		template : _.template(SliderTemp),

		isRangeSlider : false,

		objThumbMin : null,

		objThumbMax : null,

		objSlidingBar : null,

		objBackground : null,

		objBoundingBox : null,

		objCompBlocker : null,

		padding : 0,

		thumbIndex : 1,

		compData : null,

		click : {},

		previousPosition : null,

		lowerZIndexValue : 1,

		higherZIndexValue : 2,

		orgPos : {
			thumbMin : null,
			thumbMax : null
		},

		objSliderData : undefined,

		/**
		 * This function initializes the component
		 * @access private
		 * @memberof Slider
		 * @param {Object} objCompData Conatins the data to configure the component
		 * @returns None
		 */
		initialize : function(objCompData) {
			this.objSliderData = objCompData;
		},

		/**
		 * This function initializes all the required elements for the component
		 * @access private
		 * @memberof Slider
		 * @param {Object} objCompData Conatins the data to configure the component
		 * @returns None
		 */
		initializeComp : function() {
			if (this.objSliderData !== undefined && this.objSliderData.updatedScale !== undefined) {
				this.setStageScaleValue(this.objSliderData.updatedScale);
			}
			this.previousPosition = {};
			this.orgPos = {
				thumbMin : null,
				thumbMax : null
			};
			this.click = {};
			this.compData = this.objSliderData;
			// console.log("Component Initialized..", this.objSliderData);
			this.model = new SliderModel();
			this.parseCompData(this, this.objSliderData, this.model);
			this.model.set("stepsPosition", this.getMajorTicks());
		},

		/**
		 * This function is called when rendering of component is started
		 * @access private
		 * @memberof Slider
		 * @param None
		 * @returns None
		 */
		onRender : function() {
			this.$('#sliderWrapper').addClass(this.objSliderData.sliderWrapperStyle);
		},

		/**
		 * This function is called when rendering of component is completed
		 * @access private
		 * @memberof Slider
		 * @param None
		 * @returns None
		 */
		onShow : function() {
			this.initializeComp();
			this.initSlider();
			this.configureView(this);
			/*
			 if (this.model.get("sliderLength") !== parseInt(this.$('#sliderWrapper').css("width"))) {
			 this.model.get("sliderLength", parseInt(this.$('#sliderWrapper').css("width")));
			 }
			 */
		},

		/**
		 * This function is called when component is shown in the DOM
		 * @access private
		 * @memberof Slider
		 * @param None
		 * @returns None
		 */
		initSlider : function() {

			this.objBackground = this.$('#sliderWrapper');
			this.objBoundingBox = this.$('#boundingBox');
			this.objSlidingBar = this.$('#slidingBar');
			this.objThumbMin = this.$('#thumbMin');
			this.objCompBlocker = this.$('#compBlocker');
			this.minThumbZindex = this.objThumbMin.css("z-index");
			//console.log("this.minThumbZindex:" + this.minThumbZindex);
			if (this.isRangeSlider) {
				this.objThumbMax = this.$('#thumbMax');
				this.objThumbMax.addClass("SliderThumbStyle");
				this.maxThumbZindex = this.objThumbMax.css("z-index");
				//console.log("this.maxThumbZindex:" + this.maxThumbZindex);
			}

			this.attachDragEvent();
		},

		/**
		 * This function attaches relevant event on the slider
		 * @access private
		 * @memberof Slider
		 * @param None
		 * @returns None
		 */
		attachDragEvent : function() {
			$(this.objThumbMin).draggable({
				axis : (this.model.get("allignment") === SliderConstants.CONSTANTS.HORIZONTAL) ? "x" : "y",
				containment : this.objBoundingBox,
				scroll : false,
				start : $.proxy(this.onDraggingStart, this),
				drag : $.proxy(this.onDragging, this),
				stop : $.proxy(this.onDraggingStop, this)
			});

			$(this.objThumbMin).on("mousedown", this, this.mouseInteractionOnThumb);
			$(this.objThumbMin).on("mouseup", this, this.mouseInteractionOnThumb);

			if (this.isRangeSlider) {
				$(this.objThumbMax).draggable({
					axis : (this.model.get("allignment") === SliderConstants.CONSTANTS.HORIZONTAL) ? "x" : "y",
					containment : this.objBoundingBox,
					scroll : false,
					start : $.proxy(this.onDraggingStart, this),
					drag : $.proxy(this.onDragging, this),
					stop : $.proxy(this.onDraggingStop, this)
				});

				$(this.objThumbMax).on("mousedown", this, this.mouseInteractionOnThumb);
				$(this.objThumbMax).on("mouseup", this, this.mouseInteractionOnThumb);
			}
		},

		/**
		 * This function triggers mousedown event on thumb
		 * @access private
		 * @memberof Slider
		 * @param {Object} event contains the referenc of thumb
		 * @returns None
		 */
		mouseInteractionOnThumb : function(event) {
			if (event.type === "mousedown") {
				event.data.customEventDispatcher(SliderConstants.EVENTS.MOUSEDOWN_ON_THUMB, event.data, event.target.id);
			} else {
				event.data.customEventDispatcher(SliderConstants.EVENTS.MOUSEUP_ON_THUMB, event.data, event.target.id);
			}

		},

		/**
		 * This function updates the z-Indes of the slider thumb
		 * @access private
		 * @memberof Slider
		 * @param {Object} targetThumb reference of thumb being clicked
		 * @returns None
		 */
		updateZIndex : function(targetThumb) {
			/*jslint plusplus: true*/
			$(targetThumb).css("z-index", this.higherZIndexValue);

			if (targetThumb.id === "thumbMin") {
				//set lower index to max thumb
				$("#thumbMax").css("z-index", this.lowerZIndexValue);
			} else {
				//set lower index to min thumb
				$("#thumbMin").css("z-index", this.lowerZIndexValue);
			}
		},

		/**
		 * This function is called when dragging of slider thumb starts
		 * @access private
		 * @memberof Slider
		 * @param {Object} event Conatins the reference of event object
		 * @returns None
		 */
		onDraggingStart : function(objEvent, ui) {

			//console.log("this strat>>>",this);
			var thumbId, objCurrentPercentage, zIndexValue;

			thumbId = objEvent.target.id;

			if (this.isRangeSlider) {
				this.updateZIndex(objEvent.target);
			}

			this.click.x = objEvent.clientX;
			this.click.y = objEvent.clientY;

			objCurrentPercentage = this.model.get("currentPercentage");
			this.customEventDispatcher(SliderConstants.EVENTS.SLIDING_STARTED, this, objCurrentPercentage[thumbId]);
		},

		/**
		 * This function is called when the slider thumb is being dragged
		 * @access private
		 * @memberof Slider
		 * @param {Object} event Conatins the reference of event object
		 * @returns None
		 */
		onDragging : function(objEvent, ui) {
			var objData, nUpdatedX, nUpdatedY, original, target, targetId;
			// obj = $(this.objThumbMin).position();

			target = objEvent.target;
			targetId = objEvent.target.id;
			original = ui.originalPosition;
			//console.log("Drag start this.orgPos", this.orgPos);
			//console.log("isRangeSlider::"+this.isRangeSlider,"Start:",this, "this.orgPos:",this.orgPos);
			if (this.orgPos[targetId] !== null) {
				nUpdatedX = (objEvent.clientX - this.click.x + (this.orgPos[targetId].left * this.getStageScaleValue())) / this.getStageScaleValue();
				nUpdatedY = (objEvent.clientY - this.click.y + (this.orgPos[targetId].top * this.getStageScaleValue()) ) / this.getStageScaleValue();

			} else {
				nUpdatedX = (objEvent.clientX - this.click.x + original.left) / this.getStageScaleValue();
				nUpdatedY = (objEvent.clientY - this.click.y + original.top ) / this.getStageScaleValue();
			}

			if (this.model.get("allignment") === SliderConstants.CONSTANTS.HORIZONTAL) {
				objData = this.getPercentage(nUpdatedX, this.model.get("sliderLength"));
			} else {
				objData = this.getPercentage((((this.model.get("sliderLength")) - (nUpdatedY))), this.model.get("sliderLength"));
			}

			if (this.isThumbWithinboundary(target, ui, nUpdatedX, nUpdatedY)) {
				this.customEventDispatcher(SliderConstants.EVENTS.SLIDING_IN_PROGRESS, this, objData);
			} else {
				if (objData >= 100) {
					objData = 100;
				} else {
					objData = 0;
				}
				this.customEventDispatcher(SliderConstants.EVENTS.SLIDING_IN_PROGRESS, this, objData);
			}
		},

		/**
		 * This function is called when slider thumb is stopped
		 * @access private
		 * @memberof Slider
		 * @param {Object} event Conatins the reference of event object
		 * @returns None
		 */
		onDraggingStop : function(event, ui) {

			var nearest, thumbId, targetThumb, objCurrentPos = {}, objCurrentPercent = {}, percentage;

			thumbId = event.target.id;

			targetThumb = event.target;

			// console.log("Before placing:", $(this.objThumbMin).position());

			if (this.model.get("allignment") === SliderConstants.CONSTANTS.HORIZONTAL) {

				if (this.model.get("steps") !== 2)//This means snapping required
				{
					//update position
					nearest = this.findNearestMajorStep(ui.position.left);
					percentage = this.getPercentage(nearest, this.model.get("sliderLength"));

					if (percentage < this.model.get("minSlidingPostion")) {
						return;
					}

					this.orgPos[thumbId] = ui.position;

					//console.log("nearest:" + nearest);
					objCurrentPos = this.model.get("currentPosition");
					objCurrentPos[thumbId] = nearest;
					this.model.set("currentPosition", objCurrentPos);

					//update percentage
					objCurrentPercent = this.model.get("currentPercentage");
					objCurrentPercent[thumbId] = this.getPercentage(nearest, this.model.get("sliderLength"));
					this.model.set("currentPercentage", objCurrentPercent);
					$(targetThumb).css('left', nearest + 'px');
					this.orgPos[thumbId].left = nearest;

				} else {

					this.orgPos[thumbId] = ui.position;
					//update position
					objCurrentPos = this.model.get("currentPosition");
					objCurrentPos[thumbId] = ui.position.left;
					this.model.set("currentPosition", objCurrentPos);

					//update percentage
					objCurrentPercent = this.model.get("currentPercentage");
					objCurrentPercent[thumbId] = this.getPercentage(ui.position.left, this.model.get("sliderLength"));
					this.model.set("currentPercentage", objCurrentPercent);
				}
			} else {

				this.orgPos[thumbId] = ui.position;
				if (this.model.get("steps") !== 2)//This means snapping required
				{
					//update position
					nearest = this.findNearestMajorStep(ui.position.top);
					objCurrentPos = this.model.get("currentPosition");
					objCurrentPos[thumbId] = (this.model.get("sliderLength") - nearest);

					this.model.set("currentPosition", objCurrentPos);

					//update percentage
					objCurrentPercent = this.model.get("currentPercentage");
					objCurrentPercent[thumbId] = this.getPercentage((this.model.get("sliderLength") - nearest), this.model.get("sliderLength"));
					this.model.set("currentPercentage", objCurrentPercent);
					$(targetThumb).css('top', nearest + 'px');
					this.orgPos[thumbId].top = nearest;
				} else {
					//update position
					objCurrentPos = this.model.get("currentPosition");
					objCurrentPos[thumbId] = (this.model.get("sliderLength") - (ui.position.top));
					this.model.set("currentPosition", objCurrentPos);

					//update percentage
					objCurrentPercent = this.model.get("currentPercentage");
					objCurrentPercent[thumbId] = this.getPercentage((this.model.get("sliderLength") - (ui.position.top)), this.model.get("sliderLength"));
					this.model.set("currentPercentage", objCurrentPercent);
				}

			}

			this.previousPosition = this.orgPos[thumbId];
			this.customEventDispatcher(SliderConstants.EVENTS.SLIDING_STOPPED, this, objCurrentPercent[thumbId]);
		},

		/**
		 * This function checks if the thumb is with in boundary box
		 * @access private
		 * @memberof Slider
		 * @param {Object} target Conatins the reference of current thumb
		 * @param {Object} ui Conatins the reference of ui object
		 * @param {Number} nUpdatedX Conatins the updated left position
		 * @param {Number} nUpdatedY Conatins the updated top position
		 * @returns None
		 */
		isThumbWithinboundary : function(target, ui, nUpdatedX, nUpdatedY) {

			var minValue, maxValue, bVal = false, calculatedPos, objBoundaryValues = {};

			objBoundaryValues = this.getBoundaryValues(target, ui, nUpdatedX, nUpdatedY);
			minValue = objBoundaryValues.minValue;
			maxValue = objBoundaryValues.maxValue;
			calculatedPos = objBoundaryValues.calculatedPos;

			if (this.model.get("allignment") === SliderConstants.CONSTANTS.HORIZONTAL) {

				if ((nUpdatedX > minValue) && (nUpdatedX <= maxValue)) {
					ui.position.left = nUpdatedX;
					ui.position.top = nUpdatedY;
					bVal = true;
				} else if (nUpdatedX <= minValue) {
					ui.position.left = minValue;
					ui.position.top = nUpdatedY;
				} else if (nUpdatedX > maxValue) {
					ui.position.left = maxValue;
					ui.position.top = nUpdatedY;
				}
			} else {

				if ((calculatedPos > minValue) && (calculatedPos <= maxValue)) {
					ui.position.top = nUpdatedY;
					ui.position.left = nUpdatedX;
					bVal = true;
				} else if (calculatedPos <= minValue) {
					ui.position.top = this.model.get("sliderLength") - minValue;
					ui.position.left = nUpdatedX;
				} else if (calculatedPos > maxValue) {
					ui.position.top = this.model.get("sliderLength") - maxValue;
					ui.position.left = nUpdatedX;
				}

			}

			return bVal;
		},

		/**
		 * This function returns the boundary values
		 * @access private
		 * @memberof Slider
		 * @param {Object} target Conatins the reference of current thumb
		 * @param {Object} ui Conatins the reference of ui object
		 * @param {Number} nUpdatedX Conatins the updated left position
		 * @param {Number} nUpdatedY Conatins the updated top position
		 * @returns None
		 */
		getBoundaryValues : function(target, ui, nUpdatedX, nUpdatedY) {
			var minValue, maxValue, otherSliderPos, objCurrentPos, calculatedPos, actualTopPos, objBoundaryValues = {}, objVerticalBoundaryValues = {};

			minValue = ((this.model.get("minSlidingPostion") * this.model.get("sliderLength")) / 100 );
			maxValue = ((this.model.get("maxSlidingPostion") * this.model.get("sliderLength")) / 100 );
			objCurrentPos = this.model.get("currentPosition");

			if (!this.isRangeSlider) {
				if (this.model.get("allignment") === SliderConstants.CONSTANTS.VERTICAL) {
					objVerticalBoundaryValues = this.getVerticalBoundaryValues(target, ui, nUpdatedX, nUpdatedY, minValue, maxValue);
					minValue = objVerticalBoundaryValues.minValue;
					maxValue = objVerticalBoundaryValues.maxValue;
					calculatedPos = objVerticalBoundaryValues.calculatedPos;
				}
			} else {
				if (this.model.get("allignment") === SliderConstants.CONSTANTS.HORIZONTAL) {
					if (target.id === "thumbMin") {
						otherSliderPos = objCurrentPos.thumbMax;
						maxValue = (maxValue > otherSliderPos) ? otherSliderPos : maxValue;
					} else {
						otherSliderPos = objCurrentPos.thumbMin;
						minValue = (minValue > otherSliderPos) ? minValue : otherSliderPos;
					}
				} else {
					objVerticalBoundaryValues = this.getVerticalBoundaryValues(target, ui, nUpdatedX, nUpdatedY, minValue, maxValue);
					minValue = objVerticalBoundaryValues.minValue;
					maxValue = objVerticalBoundaryValues.maxValue;
					calculatedPos = objVerticalBoundaryValues.calculatedPos;
				}

			}

			objBoundaryValues.minValue = minValue;
			objBoundaryValues.maxValue = maxValue;
			objBoundaryValues.calculatedPos = calculatedPos;
			return objBoundaryValues;
		},

		/**
		 * This function returns the boundary values
		 * @access private
		 * @memberof Slider
		 * @param {Object} target Conatins the reference of current thumb
		 * @param {Object} ui Conatins the reference of ui object
		 * @param {Number} nUpdatedX Conatins the updated left position
		 * @param {Number} nUpdatedY Conatins the updated top position
		 * @param {Number} minValue Conatins minimum value for boundary
		 * @param {Number} maxValue Conatins the maximum value for boundary
		 * @returns None
		 */
		getVerticalBoundaryValues : function(target, ui, nUpdatedX, nUpdatedY, minValue, maxValue) {
			var otherSliderPos, objCurrentPos, calculatedPos, actualTopPos, objBoundaryValues = {};

			objCurrentPos = this.model.get("currentPosition");

			if (target.id === "thumbMin") {
				otherSliderPos = objCurrentPos.thumbMax;
				calculatedPos = this.model.get("sliderLength") - nUpdatedY;
				maxValue = (maxValue > otherSliderPos) ? otherSliderPos : maxValue;
				//console.log("minValue:"+minValue+"maxValue:"+maxValue+" nUpdatedY:"+nUpdatedY+" calculatedPos:"+calculatedPos+" otherSliderPos:"+otherSliderPos);
			} else {
				otherSliderPos = objCurrentPos.thumbMin;
				calculatedPos = this.model.get("sliderLength") - nUpdatedY;
				minValue = (minValue > otherSliderPos) ? minValue : otherSliderPos;
				//console.log("minValue:"+minValue+"maxValue:"+maxValue+" nUpdatedY:"+nUpdatedY+" calculatedPos:"+calculatedPos+" otherSliderPos:"+otherSliderPos);
			}

			objBoundaryValues.calculatedPos = calculatedPos;
			objBoundaryValues.minValue = minValue;
			objBoundaryValues.maxValue = maxValue;

			return objBoundaryValues;
		},

		/**
		 * This function returns the percentage of provided values
		 * @access private
		 * @memberof Slider
		 * @param {Number} numerator Conatins the numerator value
		 * @param {Number} model Contains the denominator value
		 * @returns None
		 */
		getPercentage : function(numerator, denominator) {
			var percentage = ((numerator / denominator) * 100);
			return percentage;
		},

		/**
		 * This function returns the nearest major step
		 * @access private
		 * @memberof Slider
		 * @param {Number} goal Contains the position of thumb where it is dropped
		 * @returns None
		 */
		findNearestMajorStep : function(goal) {
			var currentVal, iLen, arrStepsPos, closest = null;
			arrStepsPos = this.model.get("stepsPosition");
			iLen = arrStepsPos.length;

			$.each(arrStepsPos, function() {
				if (closest === null || Math.abs(this - goal) < Math.abs(closest - goal)) {
					closest = this;

				}
			});

			currentVal = Number(closest);
			return currentVal;
		},

		/**
		 * This function renders the component as per the configuration data
		 * @access private
		 * @memberof Slider
		 * @param {Object} objThis Conatins the data to configure the component
		 * @returns None
		 */
		configureView : function(objThis) {

			var defaultPosInPercent, defaultPosInPixel, defautPosObj = {}, currentPosObj = {}, currentPercentObj = {};

			defautPosObj = this.model.get("defalutPosition");

			//For min thumb
			defaultPosInPercent = defautPosObj.thumbMin;
			defaultPosInPixel = ((defaultPosInPercent * (this.model.get("sliderLength"))) / 100);
			currentPosObj.thumbMin = defaultPosInPixel;
			currentPercentObj.thumbMin = defaultPosInPercent;

			//console.log("defaultPosInPercent:"+defaultPosInPercent+" defaultPosInPixel:"+defaultPosInPixel);

			if (this.model.get("allignment") === SliderConstants.CONSTANTS.HORIZONTAL) {

				this.padding = $(this.objThumbMin).width() / 2;
				$(this.objBackground).css('width', (this.model.get("sliderLength") + (2 * this.padding)) + 'px');
				$(this.objBackground).css('position', 'relative');
				$(this.objSlidingBar).css('width', this.model.get("sliderLength") + 'px');
				$(this.objSlidingBar).css('left', this.padding + 'px');
				$(this.objSlidingBar).css('position', 'absolute');
				$(this.objThumbMin).css('left', currentPosObj.thumbMin + 'px');
				$(this.objThumbMin).css('position', 'absolute');

				//For max thumb
				if (this.isRangeSlider) {
					defaultPosInPercent = defautPosObj.thumbMax;
					defaultPosInPixel = ((defaultPosInPercent * (this.model.get("sliderLength"))) / 100);
					currentPosObj.thumbMax = defaultPosInPixel;
					currentPercentObj.thumbMax = defaultPosInPercent;

					$(this.objThumbMax).css('left', currentPosObj.thumbMax + 'px');
					$(this.objThumbMax).css('position', 'absolute');
				}

			} else {
				this.padding = $(this.objThumbMin).height() / 2;
				$(this.objBackground).css('height', (this.model.get("sliderLength") + (2 * this.padding)) + 'px');
				$(this.objBackground).css('position', 'relative');
				$(this.objSlidingBar).css('height', this.model.get("sliderLength") + 'px');
				$(this.objSlidingBar).css('top', this.padding + 'px');
				$(this.objSlidingBar).css('position', 'absolute');
				$(this.objThumbMin).css('top', (this.model.get("sliderLength") - currentPosObj.thumbMin) + 'px');
				$(this.objThumbMin).css('position', 'absolute');

				//For max thumb
				if (this.isRangeSlider) {
					defaultPosInPercent = defautPosObj.thumbMax;
					defaultPosInPixel = ((defaultPosInPercent * (this.model.get("sliderLength"))) / 100);
					currentPosObj.thumbMax = defaultPosInPixel;
					currentPercentObj.thumbMax = defaultPosInPercent;

					$(this.objThumbMax).css('top', (this.model.get("sliderLength") - currentPosObj.thumbMax) + 'px');
					$(this.objThumbMax).css('position', 'absolute');
				}
			}

			//this.orgPos.thumbMin =  {top: $(this.objThumbMin).css('top'), left:$(this.objThumbMin).css('left')}
			//this.orgPos.thumbMax =  {top: $(this.objThumbMax).css('top'), left:$(this.objThumbMax).css('left')}

			this.model.set("currentPosition", currentPosObj);
			this.model.set("currentPercentage", currentPercentObj);

		},

		/**
		 * This function parse the data and set it to the model of component
		 * @access private
		 * @memberof Slider
		 * @param {Object} context Conatins the context of the component
		 * @param {Object} objCompData Conatins the data to configure the component
		 * @param {Object} model Conatins the reference of component's model
		 * @returns None
		 */
		parseCompData : function(context, objCompData, model) {

			var defaultPosObj, validatedObj, parsedIntValue, bValue;

			defaultPosObj = {
				thumbMin : null,
				thumbMax : null
			};

			if ((objCompData.sliderWrapperStyle !== model.get("sliderWrapperStyle")) && (objCompData.sliderWrapperStyle !== undefined)) {
				model.set("sliderWrapperStyle", objCompData.sliderWrapperStyle);
			} else {
				model.set("sliderWrapperStyle", "SliderHorizontalWrapperStyle");
			}

			if (objCompData.allignment !== undefined) {
				if (objCompData.allignment !== model.get("allignment")) {
					model.set("allignment", objCompData.allignment);
				}
			}

			if (objCompData.sliderLength !== undefined) {
				parsedIntValue = parseInt(objCompData.sliderLength, 10);
				if (parsedIntValue !== model.get("sliderLength")) {
					model.set("sliderLength", parsedIntValue);
				}
			} else {
				if (model.get("allignment") === "horizontal") {
					model.set("sliderLength", parseInt(this.$('#sliderWrapper').css('width')));
				} else {
					model.set("sliderLength", parseInt(this.$('#sliderWrapper').css('height')));
				}
			}

			if (objCompData.steps !== undefined) {
				parsedIntValue = parseInt(objCompData.steps, 10);
				if (parsedIntValue !== model.get("steps")) {
					model.set("steps", parsedIntValue);
				}
			}

			if (objCompData.minSlidingPostion !== undefined) {

				parsedIntValue = parseInt(objCompData.minSlidingPostion, 10);

				if (parsedIntValue !== model.get("minSlidingPostion")) {
					model.set("minSlidingPostion", parsedIntValue);
				}

			} else {
				model.set("minSlidingPostion", 0);
			}

			if (objCompData.maxSlidingPostion !== undefined) {

				parsedIntValue = parseInt(objCompData.maxSlidingPostion, 10);

				if (parsedIntValue !== model.get("maxSlidingPostion")) {
					model.set("maxSlidingPostion", parsedIntValue);
				}

			} else {
				model.set("maxSlidingPostion", 100);
			}

			if (objCompData.defalutPosition !== undefined) {

				if (objCompData.defalutPosition instanceof Array) {
					context.isRangeSlider = true;
				}

				validatedObj = context.getValidatedDefaultPosition(objCompData);

				defaultPosObj.thumbMin = validatedObj.thumbMin;
				defaultPosObj.thumbMax = validatedObj.thumbMax;

				model.set("defalutPosition", defaultPosObj);
			}

		},

		/**
		 * This function validates and returns the default position for thumbs and if they are out of boundary then sets theres values to min and max range
		 * @access private
		 * @memberof Slider
		 * @param {Object} objCompData Conatins the data to configure the component
		 * @returns {Object}
		 */
		getValidatedDefaultPosition : function(objCompData) {
			var minSlidingPos, maxSlidingPos, objData, minThumbDefaultPos, maxThumbDefaultPos;

			objData = {

				thumbMin : null,
				thumbMax : null
			};

			minSlidingPos = this.model.get("minSlidingPostion");
			maxSlidingPos = this.model.get("maxSlidingPostion");

			minThumbDefaultPos = parseInt(objCompData.defalutPosition[0], 10);
			maxThumbDefaultPos = parseInt(objCompData.defalutPosition[1], 10);

			if (this.isRangeSlider) {
				if ((minThumbDefaultPos >= minSlidingPos) && ((minThumbDefaultPos <= maxSlidingPos) && (minThumbDefaultPos <= maxThumbDefaultPos))) {
					objData.thumbMin = minThumbDefaultPos;
				} else {
					objData.thumbMin = this.model.get("minSlidingPostion");
				}

				if ((maxThumbDefaultPos <= maxSlidingPos) && ((maxThumbDefaultPos >= minSlidingPos) && ((maxThumbDefaultPos >= minThumbDefaultPos)))) {
					objData.thumbMax = maxThumbDefaultPos;
				} else {
					objData.thumbMax = this.model.get("maxSlidingPostion");
				}
			} else {
				if ((objCompData.defalutPosition >= minSlidingPos) && (objCompData.defalutPosition <= maxSlidingPos)) {
					objData.thumbMin = objCompData.defalutPosition;
				} else {
					objData.thumbMin = this.model.get("minSlidingPostion");
				}

			}
			//console.log("objData.thumbMin:" + objData.thumbMin + " objData.thumbMax:" + objData.thumbMax);
			return objData;
		},

		/**
		 * This function resets the component to its default value
		 * @access private
		 * @memberof Slider
		 * @param None
		 * @returns None
		 */
		resetSlider : function() {
			var defalutPos = {}, arrPosition = [], value;
			this.initializeComp(this.compData);
			defalutPos = this.model.get("defalutPosition");

			if (this.isRangeSlider) {
				arrPosition = [defalutPos.thumbMin, defalutPos.thumbMax];
				this.updateThumbPosition(arrPosition);
				//this.orgPos.thumbMin = {left:$(this.objThumbMin).css("left"),top:$(this.objThumbMin).css("top")};
				//this.orgPos.thumbMax = {left:$(this.objThumbMax).css("left"),top:$(this.objThumbMax).css("top")};
			} else {
				value = defalutPos.thumbMin;
				this.updateThumbPosition(value);
				//this.orgPos.thumbMin = {left:$(this.objThumbMin).css("left"),top:$(this.objThumbMin).css("top")};
			}

		},
		/**
		 * This function returns an array of major ticks values
		 * @access private
		 * @memberof Slider
		 * @param None
		 * @returns None
		 */
		getMajorTicks : function() {
			var arrMajorTicks, nSteps, nLength, nMajorTicksDistance, counter;
			arrMajorTicks = [];
			nSteps = this.model.get("steps");
			nLength = this.model.get("sliderLength");
			nMajorTicksDistance = nLength / nSteps;

			for ( counter = 0; counter <= nSteps; counter += 1) {
				arrMajorTicks.push(counter * nMajorTicksDistance);
			}
			// console.log("arrMajorTicks ", arrMajorTicks);
			return arrMajorTicks;
		},

		/**
		 * This function updtaes the slider thumb position
		 * @access private
		 * @memberof Slider
		 * @param {Number} nValue Conatains the value of slider
		 * @returns None
		 */
		updateThumbPosition : function(nValue) {

			var objCurrentPos = {}, objCurrentPercent = {}, topPosition;
			objCurrentPos = this.model.get("currentPosition");
			objCurrentPercent = this.model.get("currentPercentage");

			if ( nValue instanceof Array) {
				objCurrentPos.thumbMin = ((nValue[0] * (this.model.get("sliderLength"))) / 100);
				objCurrentPercent.thumbMin = nValue[0];

				objCurrentPos.thumbMax = ((nValue[1] * (this.model.get("sliderLength"))) / 100);
				objCurrentPercent.thumbMax = nValue[1];

				this.setThumbPosition(this.objThumbMin, "thumbMin", objCurrentPos.thumbMin);
				this.setThumbPosition(this.objThumbMax, "thumbMax", objCurrentPos.thumbMax);

			} else {
				objCurrentPos.thumbMin = ((nValue * (this.model.get("sliderLength"))) / 100);
				objCurrentPercent.thumbMin = nValue;

				this.setThumbPosition(this.objThumbMin, "thumbMin", objCurrentPos.thumbMin);
			}

			this.model.set("currentPosition", objCurrentPos);
			this.model.set("currentPercentage", objCurrentPercent);

		},

		/**
		 * This function positions the required thumb on the slider
		 * @access private
		 * @memberof Slider
		 * @param {Object} thumb Conatains the jQuery object of thumb
		 * @param {Number} nValue Conatains the position of thumb
		 * @returns None
		 */
		setThumbPosition : function(thumb, thumbId, value) {
			var topPosition;
			//thumbId = thumb.id;
			$(thumb).css('height', $(thumb).height() + 'px');
			$(thumb).css('width', $(thumb).width() + 'px');
			$(thumb).css('position', 'absolute');

			if (this.model.get("allignment") === SliderConstants.CONSTANTS.HORIZONTAL) {
				$(thumb).css('left', value + 'px');
				//$(thumb).css('top', '0px');
				if (this.orgPos[thumbId]) {
					this.orgPos[thumbId].left = value;
				} else {
					this.orgPos[thumbId] = {
						left : value,
						top : $("#" + thumbId).css("top")
					};
				}

			} else {
				topPosition = (this.model.get("sliderLength") - value);
				//$(thumb).css('left', '0px');
				$(thumb).css('top', +topPosition + 'px');

				if (this.orgPos[thumbId]) {
					this.orgPos[thumbId].top = topPosition;
				} else {
					this.orgPos[thumbId] = {
						left : $("#" + thumbId).css("left"),
						top : topPosition
					};
				}

			}
			//console.log("this.orgPos:", this.orgPos);
		}
	});

	/**
	 * Set the super to BaseItemComp
	 * @access private
	 * @memberof BaseItemComp#
	 */
	Slider.prototype.Super = BaseItemComp;

	/**
	 * This function is used to get the current position (in percentage) of slider
	 * @memberof Slider#
	 * @access public
	 * @param None
	 * @returns {Number}.
	 */
	Slider.prototype.getCurrentPosition = function() {

		var data = {}, objCurrentValue = this.model.get("currentPercentage");

		if (this.isRangeSlider) {
			data.minValue = objCurrentValue.thumbMin;
			data.maxValue = objCurrentValue.thumbMax;
			return data;
		}
		return objCurrentValue.thumbMin;
	};

	/**
	 * This function is used to set the current position (in percentage) of slider
	 * @memberof Slider#
	 * @access public
	 * @param {Number} nValue Conatains the value of slider
	 * @returns None
	 */
	Slider.prototype.setCurrentPosition = function(nValue) {

		this.updateThumbPosition(nValue);
	};

	/**
	 * This function is used to enable the slider so that the slider can be dragged
	 * @memberof Slider#
	 * @access public
	 * @param None
	 * @returns None
	 */
	Slider.prototype.enableSlider = function() {

		this.objCompBlocker.css("width", "0");
		this.objCompBlocker.css("height", "0");
		this.objCompBlocker.css("z-index", "0");
	};

	/**
	 * This function is used to disable the slider so that the slider cannot be dragged
	 * @memberof Slider#
	 * @access public
	 * @param None
	 * @returns None
	 */
	Slider.prototype.disableSlider = function(objCss) {

		this.objCompBlocker.css("width", "100%");
		this.objCompBlocker.css("height", "100%");
		this.objCompBlocker.css("z-index", "1000");
		this.objCompBlocker.css("opacity", ".5");
		this.objCompBlocker.css(objCss);
	};

	/**
	 * This function is used to set the maximum position to which slider can be drageed
	 * @memberof Slider#
	 * @access public
	 * @param {Number} nValue Conatains the maximum value to which thumb can be dragged
	 * @returns None
	 */
	Slider.prototype.maxSliderPosition = function(nValue) {

		//this.model.set("maxSlidingPostion", nValue);
		this.compData.maxSlidingPostion = nValue;
		this.resetSlider();
	};

	/**
	 * This function is used to set the minimum position to which slider can be drageed
	 * @memberof Slider#
	 * @access public
	 * @param {Number} nValue Conatains the minimum value to which thumb can be dragged
	 * @returns None
	 */
	Slider.prototype.minSliderPosition = function(nValue) {

		//this.model.set("minSlidingPostion", nValue);
		this.compData.minSlidingPostion = nValue;
		this.resetSlider();
	};

	/**
	 * This function flushes the data
	 * @memberof Slider
	 * @access private
	 * @param None
	 * @returns None
	 */
	Slider.prototype.flush = function() {

		this.model.id = null;
		this.model.destroy();
		this.model = null;
	};

	/**
	 * This functions destroys the component
	 * @memberof Slider#
	 * @access public
	 * @param None
	 * @returns {Boolean} True or false
	 */
	Slider.prototype.destroy = function() {

		this.objSliderData = null;
		this.objThumbMin = null;
		this.objSlidingBar = null;
		this.objBackground = null;
		this.objBoundingBox = null;
		this.padding = 0;

		this.flush();
		this.unbind();
		this.undelegateEvents();
		this.close();

		return this.Super.prototype.destroy(true);
	};

	return Slider;
});
