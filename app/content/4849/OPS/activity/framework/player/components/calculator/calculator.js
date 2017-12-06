/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * Calculator
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'jqueryUI', 'jqueryTouchPunch', 'player/base/base-composite-comp', 'text!components/calculator/template/calculator.html', 'components/calculator/model/calculator-model', 'player/components/calculator/js/calculator-item', 'css!components/calculator/template/style/calculator.css'],

/**
 * A class representing a Calculator. Calculator is a component which is used to make mathematical calculations. It contains a keyborad and a visual display.
 *
 *@class Calculator
 *@augments BaseCompositeComp
 *@param {Object} obj  An object with 'buttonCollection' and 'calculatorWrapperStyle' properties.
 *@example
 *
 * var  calculatorComp, obj = {};
 * obj.buttonCollection = objData;
 * obj.calculatorWrapperStyle = 'ActivityCalculatorWrapperStyle ';
 * <br>this.getComponent(context, "Calculator", "onComponentCreated", obj);
 * <br>function onComponentCreated(objComp){
 *  calculatorComp = objComp;
 * }
 * <br>
 * Component can also be added directly into HTML template using following snippet:
 *
 * &lt;div id="mcompCalculator" type="mComp" compName="Calculator"
 * defaultData='{"calculatorData":"activity/SampleCalculator/data/xml/calulator.xml"}'&gt;&lt;/div&gt;
 *
 * OR
 *
 * &lt;div id="mcompCalculator" type="mComp" compName="Calculator"&gt;&lt;/div&gt;
 *
 * Where;<br>
 * -id is unique identifier for the component
 * -type can only take "mComp" as a value and it helps in differentiating the HTML tags.
 * -compName take the name of the component as value (which is defined in compList.js)
 * -defaultData contains the configurable property values for the component
 * <br>Configurable properties of component:<br>
 * <table border="1" style="white-space:pre-wrap; color:"#000000";"><tr><th>Property</th><th>Type</th><th>Default Value</th><th>Description</th></tr><tr><td>buttonCollection</td><td>json</td><td>json string of <a href="xml/calculator.xml" target="_blank">xml</a></td><td>This data is the collection of buttons which will be shown in the calculator. This property is optional and developer can skip it.<br><br>If no data is provided to the component then it will render with the following basic calculator buttons:<br><i>"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "*", "/", "-", "+", "=", "backspace" and "clear display"</i>.<br><br>If developer wants to update or add new button, then he would require to provide the data in a <a href="xml/calculator.xml" target="_blank">predifined</a> format to the component.</td></tr><tr><td>calculatorWrapperStyle</td><td>CSS class</td><td>calculatorWrapperStyle</td><td>Any style class defined in activity css, though this property is optional and if developer doesn't provide any new style class then calculator will render with its own pre-defined style.<br><br>Note: Developer should avoid definig a style class by the "calculatorWrapperStyle" name in activity css.</td></tr><tr><td>calculatorData</td><td>String</td><td>null</td><td>Conatins the path of xml file which is to be loaded for additional buttons.<br><br>Note: This value is read only when component is configured through HTML template.</td></tr></table>
 *
 *
 */
function(Marionette, jqueryUI, jqueryTouchPunch, BaseCompositeComp, CalculatorTemp, CalculatorModel, CalculatorItem, CalculatorCSS) {'use strict';

	var Calculator = /** @lends Calculator.prototype */
	BaseCompositeComp.extend({

		template : _.template(CalculatorTemp),

		itemView : CalculatorItem,

		itemViewContainer : "#calculatorButtonContainer",

		calculatorWrapper : null,

		boundingBox : null,

		click : {},

		calculatorTextItem : null,

		activityContainment : null,

		/**
		 * This function initializes the component
		 * @access private
		 * @memberof Calculator
		 * @param {Object} objCompData Conatins the data to configure the component
		 * @returns None
		 */
		initialize : function(objCompData) {

			var cItemModel, i, iLen, imageCount, arrItemModel = [], objButtonCollection = {}, MyCollection, CalculatorlItemModel;
			this.objData = objCompData;//this property is being used in componentselector for editing.
			this.click = {};
			this.calculatorWrapper = {};
			this.boundingBox = {};
			this.calculatorTextItem = {};
			this.activityContainment = {};
			this.model = new CalculatorModel();
			this.parseCompData(objCompData, this.model);
			this.on(CalculatorItem.BUTTON_CLICKED, this.onButtonClicked);
			$(window).bind("keydown", this, this.handleKeyPress);
			this.itemViewOptions = {
				context : this
			};
			objButtonCollection = this.model.get("buttonCollection");

			CalculatorlItemModel = Backbone.Model.extend({

				defaults : {

					styleName : "",
					value : "",
					type : "",
					label : ""
				}
			});

			MyCollection = Backbone.Collection.extend({

				model : CalculatorlItemModel

			});

			iLen = objButtonCollection.length;

			// console.log("this.nextButtonCounter:"+this.nextButtonCounter);
			for ( i = 0; i < iLen; i += 1) {
				cItemModel = new CalculatorlItemModel();
				cItemModel.set('type', objButtonCollection[i].type);
				cItemModel.set('styleName', objButtonCollection[i].styleName);
				cItemModel.set('value', objButtonCollection[i].value);
				cItemModel.set('label', objButtonCollection[i].label);
				arrItemModel.push(cItemModel);
			}

			this.collection = new MyCollection(arrItemModel);
			this.model.on("change", $.proxy(this.onModelChange, this));

			this.createTextDisplay();
			//console.log("this cid:"+this.cid+" model cid:"+)
		},

		createTextDisplay : function() {
			var TextDisplayItemView = Marionette.ItemView.extend({
				template : "<div> {{ textDisplay }}</div>",

				initialize : function(options) {
					var TextDisplayModel = Backbone.Model.extend({

					});
					this.model = new TextDisplayModel(options);
					this.render();
					this.model.on("change", this.render, this);
				},

				changeData : function(data) {
					this.model.set("textDisplay", data);
				}
			});
			this.calculatorTextItem = new TextDisplayItemView({
				"textDisplay" : this.model.get("textDisplay")
			});
		},

		/**
		 * This function is called when rendering of component is completed
		 * @access private
		 * @memberof Calculator
		 * @param None
		 * @returns None
		 */
		onRender : function() {

			this.$('#calculatorWrapper').addClass(this.model.get("calculatorWrapperStyle"));
		},

		/**
		 * This function is called when component is shown in the DOM
		 * @access private
		 * @memberof Calculator
		 * @param None
		 * @returns None
		 */
		onShow : function() {
			var self = this;
			this.calculatorWrapper = this.$('#calculatorWrapper');
			// this.boundingBox= $('#activityContainer');
			$(this.calculatorWrapper).draggable({
				containment : "document",
				// handle: "#titleBar",
				scroll : false,
				start : $.proxy(this.onDraggingStart, this),
				drag : $.proxy(this.onDragging, this),
				stop : $.proxy(this.onDraggingStop, this)
			});
			this.$('#calcInput').html(this.calculatorTextItem.el);
			
			this.$el.on("click", $.proxy(self.compClick, self));
			this.$el.on("mouseover", $.proxy(self.compRollover, self));
			this.$el.on("mouseout", $.proxy(self.compRollout, self));
		},

		/**
		 * This function updates the view of timer
		 * @access private
		 * @memberof Calculator
		 * @param {Object} objThis contains the reference of component
		 * @returns None
		 */
		onModelChange : function() {
			// this.render();
			// this.$("#calcInput").html(this.model.get("textDisplay"));
			this.calculatorTextItem.changeData(this.model.get("textDisplay"));
		},

		/**
		 * This function is called when dragging of the compnent starts
		 * @access private
		 * @memberof Calculator
		 * @param {Object} event Conatins the reference of event object
		 * @returns None
		 */
		onDraggingStart : function(objEvent, ui) {
			this.click.x = objEvent.clientX;
			this.click.y = objEvent.clientY;
			//console.log("drag start:" + ui.position.left + "::" + ui.position.top);
		},

		/**
		 * This function is called when component is being dragged
		 * @access private
		 * @memberof Calculator
		 * @param {Object} event Conatins the reference of event object
		 * @returns None
		 */
		onDragging : function(objEvent, ui) {

			var obj, nUpdatedX, nUpdatedY, original;
			//console.log("scale val:" + this.getStageScaleValue());
			original = ui.originalPosition;
			nUpdatedX = (objEvent.clientX - this.click.x + original.left) / this.getStageScaleValue();
			nUpdatedY = (objEvent.clientY - this.click.y + original.top ) / this.getStageScaleValue();

			ui.position.left = nUpdatedX;
			ui.position.top = nUpdatedY;
			//console.log("dragging:" + ui.position.left + "::" + ui.position.top);
		},

		/**
		 * This function is called when compnent dragging is stopped
		 * @access private
		 * @memberof Calculator
		 * @param {Object} event Conatins the reference of event object
		 * @returns None
		 */
		onDraggingStop : function(event, ui) {
			//console.log("drag stop:" + ui.position.left + "::" + ui.position.top);
		},

		/**
		 * This function handles the key press of keyboard
		 * @access private
		 * @param {Object} objEvent Conatins the reference of event
		 * @returns None
		 */
		handleKeyPress : function(objEvent) {
			var objClassRef, nValue;
			objClassRef = objEvent.data;
			// console.log(objEvent.keyCode);
			if (objEvent.keyCode >= 96 && objEvent.keyCode <= 105) {
				nValue = objEvent.keyCode - 96;
				objClassRef.addDigit(nValue);
			} else if (objEvent.keyCode >= 48 && objEvent.keyCode <= 57) {
				nValue = objEvent.keyCode - 48;
				objClassRef.addDigit(nValue);
			} else if (objEvent.keyCode === 111 || objEvent.keyCode === 191) {
				nValue = '/';
				objClassRef.doOperator(nValue);
			} else if (objEvent.keyCode === 106) {
				nValue = '*';
				objClassRef.doOperator(nValue);
			} else if (objEvent.keyCode === 109 || objEvent.keyCode === 189) {
				nValue = '-';
				objClassRef.doOperator(nValue);
			} else if (objEvent.keyCode === 107) {
				nValue = '+';
				objClassRef.doOperator(nValue);
			} else if (objEvent.keyCode === 187) {
				nValue = '=';
				objClassRef.doOperator(nValue);
			} else if (objEvent.keyCode === 110 || objEvent.keyCode === 190) {
				nValue = '.';
				if (!objClassRef.model.get("decimal")) {
					objClassRef.addDigit(nValue);
					objClassRef.model.get("decimal", true);
				}
			}
		},

		/**
		 * This function is called when any of the button from calculator is clicked
		 * @access private
		 * @memberof Calculator
		 * @param {Object} event contains the reference of the event
		 * @returns None
		 */
		onButtonClicked : function(event) {
			// console.log("Button clicked", event);
			var model, value, type;
			model = event;
			value = model.get("value");
			type = model.get("type");

			switch(type) {
				case this.DIGIT :
					this.onDigitButtonClick(value);
					break;
				case this.DECIMAL :
					this.onDecimalButtonClick(value);
					break;
				case this.OPERATOR :
					this.onOperatorButtonClick(value);
					break;
				case this.CLEAR_DISPLAY :
					this.onClearDisplayButtonClick(value);
					break;
				case this.BACK_SPACE :
					this.onBackButtonClick(value);
					break;
			}
		},

		/**
		 * This function parse the data and set it to the model of component
		 * @access private
		 * @memberof Calculator
		 * @param {Object} objCompData Conatins the data to configure the component
		 * @param {Object} model Conatins the reference of component's model
		 * @returns None
		 */
		parseCompData : function(objCompData, model) {

			if (objCompData) {

				if (objCompData.parentRef) {
					this.activityContainment = objCompData.parentRef;
				}

				if ((objCompData.buttonCollection !== undefined)) {

					model.set("buttonCollection", this.getButtonCollection(objCompData));
					// model.set("buttonCollection", objCompData.buttonCollection.button);
				}

				if ((objCompData.calculatorWrapperStyle !== undefined)) {

					model.set("calculatorWrapperStyle", objCompData.calculatorWrapperStyle);
				}

			}

		},

		/**
		 * This function returns the index of provided item from the array
		 * @access private
		 * @memberof Calculator
		 * @param {Object} value Contains the value property of caluclator button
		 * @returns None
		 */
		getIndex : function(value) {

			var buttonCollection = this.model.get("buttonCollection"), i;
			for ( i = 0; i < buttonCollection.length; i += 1) {
				if (buttonCollection[i].value === value) {
					return i;
				}
			}
			return -1;
		},

		/**
		 * This function returns the index of provided item from the array
		 * @access private
		 * @memberof Calculator
		 * @param {Object} objCompData Contains data for the component
		 * @returns Array
		 */
		getButtonCollection : function(objCompData) {
			var defaultButtonCollection, newButtons, nLen, i, value, index;
			defaultButtonCollection = this.model.get("buttonCollection");
			newButtons = objCompData.buttonCollection.button;

			if (newButtons) {
				nLen = newButtons.length;
				for ( i = 0; i < nLen; i += 1) {
					value = newButtons[i].value;

					index = this.getIndex(value);
					if (index < 0) {
						defaultButtonCollection.push(newButtons[i]);
					} else {
						defaultButtonCollection[index].label = newButtons[i].label;
						defaultButtonCollection[index].styleName = newButtons[i].styleName;
					}
				}
			}
			return defaultButtonCollection;
		},

		/**
		 * This function handles clicking of digit
		 * @access private
		 * @memberof Calculator
		 * @param {Number} nValue Conatins the value of button
		 * @returns None
		 */
		onDigitButtonClick : function(nValue) {
			var nDigit = parseInt(nValue, 10);
			this.addDigit(nDigit);
		},

		/**
		 * This function handles clicking of operator
		 * @access private
		 * @memberof Calculator
		 * @param {Number} nValue Conatins the value of button
		 * @returns None
		 */
		onOperatorButtonClick : function(nValue) {
			this.doOperator(nValue);
		},

		/**
		 * This function handles clicking of decimal
		 * @access private
		 * @memberof Calculator
		 * @param {Number} nValue Conatins the value of button
		 * @returns None
		 */
		onDecimalButtonClick : function(nValue) {

			if (!this.model.get("decimal")) {
				this.addDigit(nValue);
				this.model.set("decimal", true);
			}
		},

		/**
		 * This function handles clicking of clear display button
		 * @access private
		 * @memberof Calculator
		 * @param {Object} objEvent Conatins the reference of event
		 * @returns None
		 */
		onClearDisplayButtonClick : function(objEvent) {
			this.model.set("textDisplay", '0');
			this.displayValue();
		},

		/**
		 * This function handles clicking of reset button
		 * @access private
		 * @memberof Calculator
		 * @param None
		 * @returns None
		 */
		onResetButtonClick : function() {
			this.clearBtnClick();
		},

		/**
		 * This function handles clicking of backspace button
		 * @access private
		 * @memberof Calculator
		 * @param None
		 * @returns None
		 */
		onBackButtonClick : function() {
			var displayString, dispLength;
			displayString = this.model.get("textDisplay");
			try {

				dispLength = String(this.model.get("textDisplay")).length - 1;
				displayString = String(this.model.get("textDisplay")).substr(0, dispLength);
				this.model.set("textDisplay", displayString);
				this.model.set("operand1", displayString);
			} catch(e) {
			}

			if (displayString === '' || dispLength === undefined) {
				this.model.set("textDisplay", '0');
				this.model.set("operand1", '0');
			}
			console.log("onBackButtonClick:" + this.model.get("textDisplay") + "::" + this.model.get("operand1"));
			this.model.set("isEqualPressed", false);
			this.displayValue();
		},

		/**
		 * This function handles clicking of clear button
		 * @access private
		 * @memberof Calculator
		 * @param {Object} objEvent contains the reference of event
		 * @returns None
		 */
		clearBtnClick : function(objEvent) {
			this.onClearButtonClick();
		},

		/**
		 * This function clears all the members of model
		 * @access private
		 * @memberof Calculator
		 * @param None
		 * @returns None
		 */
		onClearButtonClick : function() {
			this.model.set("operand1", false);
			this.model.set("textDisplay", "0");
			this.model.set("operator", "");
			this.model.set("clear", false);
			this.model.set("decimal", false);
			this.model.set("Status", "");
			this.model.set("setflag", false);
			this.model.set("display_flag", "0");
			this.model.set("flag_inv", "0");
			this.displayValue();
			this.model.set("isNumberPressed", false);
			this.model.set("previousOperator", "undefined");
			this.model.set("previousNumber", "undefined");
			this.model.set("isEqualPressed", false);
			this.model.set("canCalculate", "undefined");
			this.model.set("previousInput", "undefined");
			//this.bForceRound = undefined;
		},

		/**
		 * This function handles operator functionality
		 * @access private
		 * @memberof Calculator
		 * @param {String} newOper contains the new operator
		 * @returns None
		 */
		doOperator : function(newOper) {
			//console.log("DoOperator!!!!! .... " + this.isEqualPressed + " :::: " + newOper + " :::  " + this.canCalculate);
			var bForceReturn = false;
			if (this.model.get("error")) {
				return;
			}

			//console.log("...this.previousInput " + newOper + " ::: " + this.previousInput)
			if (newOper === "=") {
				this.model.set("previousInput", newOper);
			} else if (((newOper === "squareRoot") || (newOper === "cubeRoot"))) {
				//console.log("return.............")
				this.model.set("previousInput", newOper);
				this.model.set("operator", newOper);
				this.doCalculation(this.model.get("previousOperator"));
				this.model.set("isEqualPressed", true);
				this.model.set("previousNumber", this.model.get("textDisplay"));
				this.model.set("operand1", this.model.get("textDisplay"));
				this.displayValue();
				this.model.set("isEqualPressed", false);
				bForceReturn = true;
			} else if (this.model.get("previousInput") !== "number" && this.model.get("previousInput") !== "=") {
				//console.log("return.............")
				this.model.set("previousInput", newOper);
				this.model.set("operator", newOper);
				bForceReturn = true;
			} else {
				this.model.set("previousInput", newOper);
			}

			if (bForceReturn) {
				return;
			}

			if (this.model.get("isNumberPressed") === false && newOper !== "=") {
				//console.log("1111")
				this.model.set("isEqualPressed", false);
				this.model.set("previousOperator", newOper);
				this.model.set("operator", newOper);
				bForceReturn = true;
			} else if (newOper !== "=") {
				//console.log("22222")
				this.model.set("previousInput", newOper);
			}

			if (bForceReturn) {
				return;
			}

			if (newOper !== "=") {
				//console.log("3333")
				this.doCalculation(newOper);
				this.model.set("isEqualPressed", false);
			} else {
				//console.log("44444")
				if (this.model.get("isNumberPressed")) {
					//console.log("55555")
					this.model.set("previousNumber", Number(this.model.get("operand1")));
				} else {
					//console.log("66666")
					this.model.set("operand1", this.model.get("previousNumber"));
				}

				this.doCalculation(this.model.get("previousOperator"));
				this.model.set("isEqualPressed", true);
				//console.log("777777 :::: " + this.isEqualPressed)
			}

			this.displayValue();
		},

		/**
		 * This function handles calculation
		 * @access private
		 * @memberof Calculator
		 * @param {String} newOperator contains the new operator
		 * @returns None
		 */
		doCalculation : function(newOperator) {

			//console.log("...Number(this.textDisplay ) ::<><>:: " + Number(this.textDisplay ) + " ::: " + this.operator + " ::: " + newOperator + " ::<><><>:: " + this.previousNumber)
			// Square root
			if (this.model.get("operator") === "squareRoot") {
				// if(this.model.get("isNumberPressed")){this.model.set("previousNumber",Number(this.model.get("textDisplay")) );}
				this.model.set("textDisplay", parseFloat(Number(Math.sqrt(this.model.get("textDisplay")))));
				this.model.set("isNumberPressed", false);
				this.model.set("bForceRound", true);
				this.forceRound();
			}
			//cube root
			if (this.model.get("operator") === "cubeRoot") {
				// if(this.model.get("isNumberPressed")){this.model.set("previousNumber",Number(this.model.get("textDisplay")) );}
				this.model.set("textDisplay", parseFloat(Number(Math.pow(this.model.get("textDisplay"), 1 / 3))));
				this.model.set("isNumberPressed", false);
				this.model.set("bForceRound", true);
				this.forceRound();
			}
			// X over Y
			if (this.model.get("operator") === "xRestY") {
				if (this.model.get("isNumberPressed")) {
					this.model.set("previousNumber", Number(this.model.get("textDisplay")));
				}
				this.model.set("textDisplay", Math.pow(Number(this.model.get("operand1")), Number(this.model.get("textDisplay"))));
				this.model.set("isNumberPressed", false);
				this.model.set("bForceRound", true);
				this.forceRound();
			}
			// Addition
			if (this.model.get("operator") === "+") {
				if (this.model.get("isNumberPressed")) {
					this.model.set("previousNumber", Number(this.model.get("textDisplay")));
				}
				this.model.set("textDisplay", parseFloat(Number(this.model.get("operand1")) + Number(this.model.get("textDisplay"))));
				this.model.set("isNumberPressed", false);
				this.model.set("bForceRound", true);
				this.forceRound();
			}

			// Subtraction
			if (this.model.get("operator") === "-") {
				if (this.model.get("isNumberPressed")) {
					this.model.set("previousNumber", Number(this.model.get("textDisplay")));
				}
				if (this.model.get("isNumberPressed")) {
					this.model.set("textDisplay", parseFloat(Number(this.model.get("operand1")) - Number(this.model.get("textDisplay"))));
				} else {
					this.model.set("textDisplay", parseFloat(Number(this.model.get("textDisplay")) - Number(this.model.get("operand1"))));
				}
				this.model.set("isNumberPressed", false);
				this.model.set("bForceRound", true);
				this.forceRound();
			}

			// Multiplication
			if (this.model.get("operator") === "*") {
				if (this.model.get("isNumberPressed")) {
					this.model.set("previousNumber", Number(this.model.get("textDisplay")));
				}
				this.model.set("textDisplay", parseFloat(Number(this.model.get("operand1")) * Number(this.model.get("textDisplay"))));
				this.model.set("isNumberPressed", false);
				this.model.set("bForceRound", true);
				this.forceRound();
			}

			// Division
			if (this.model.get("operator") === "/") {
				if (this.model.get("operand1") === "0" && this.model.get("textDisplay") === "0") {
					this.model.set("error", true);
				} else if (!this.model.get("error")) {
					if (this.model.get("isNumberPressed")) {
						this.model.set("previousNumber", Number(this.model.get("textDisplay")));
					}
					if (this.model.get("isNumberPressed")) {
						this.model.set("textDisplay", parseFloat(Number(this.model.get("operand1") / this.model.get("textDisplay")).toFixed(2)));
					} else {
						this.model.get("textDisplay", parseFloat(Number(this.model.get("textDisplay") / this.model.get("operand1")).toFixed(2)));
					}

					this.model.set("isNumberPressed", true);
					this.model.set("bForceRound", false);
					this.forceRound();

				}
			}

			this.model.set("clear", true);
			this.model.set("decimal", false);
			this.model.set("display_flag", "0");
			if (newOperator !== null) {
				this.model.set("operator", newOperator);
				this.model.set("previousOperator", newOperator);
				this.model.set("operand1", this.model.get("textDisplay"));
				this.model.set("canCalculate", false);
			}
		},

		/**
		 * This function round of the digit
		 * @access private
		 * @memberof Calculator
		 * @param None
		 * @returns None
		 */
		forceRound : function() {
			//if(this.bForceRound)
			//{

			//this.bForceRound = false;
			//var strText = String($($.find("[type=display]")).text());
			//console.log(this.preciseRound(Number(strText),2));
			/*
			if(strText.indexOf(".")!= -1)
			{
			console.log(strText.lastIndexOf("0") + " ::>>>>>>>:: ")
			if(strText.lastIndexOf("0")>= strText.length-1)
			{
			var strIndex = strText.indexOf(".");
			var strLastIndex = strText.lastIndexOf("0");
			if(strLastIndex>0)
			{
			var nVal = Number(strText.substr(strIndex, strLastIndex));
			console.log(strText.substr(0, strIndex) + " :::: " + this.preciseRound(Number(nVal),2));
			}
			}
			}
			*/
			//}
		},

		/**
		 * This function checks if digit count has reached to its limit
		 * @access private
		 * @memberof Calculator
		 * @param None
		 * @returns None
		 */
		dispflag : function() {
			var dispFlag, maxCount;
			dispFlag = this.model.get("display_flag");
			maxCount = this.model.get("maxDisplayCount");

			if (this.model.get("textDisplay").length < maxCount || this.model.get("textDisplay").length === undefined) {

				this.model.set("display_flag", dispFlag + 1);
				this.model.set("dispno", true);
			} else {
				this.model.set("dispno", false);
			}
		},

		/**
		 * This function refresh the model
		 * @access private
		 * @memberof Calculator
		 * @param None
		 * @returns None
		 */
		refresh : function() {
			this.model.set("operator", "=");
			this.model.set("clear", true);
			this.model.set("decimal", false);
			this.model.set("Status", "");

			if (this.model.get("newOper") !== null) {
				this.model.set("operator", this.model.get("newOper"));
				this.model.set("operand1", this.model.get("textDisplay"));
			}
		},

		/**
		 * This function handles when digit is punched in to the calculator
		 * @access private
		 * @memberof Calculator
		 * @param {String} digit conatins the value of button
		 * @returns None
		 */
		addDigit : function(digit) {
			//console.log("addDigit!!!!!!!!!  " + this.isEqualPressed)
			if (this.model.get("isEqualPressed")) {
				this.onClearButtonClick();
				this.model.set("isEqualPressed", false);
			}

			this.model.set("previousInput", "number");
			this.model.set("canCalculate", true);

			if (this.model.get("error")) {
				this.refresh();
				this.model.set("error", false);
			}

			if (this.model.get("clear")) {
				this.model.set("clear", false);
				this.model.set("decimal", false);
				this.model.set("textDisplay", "0");
			}

			this.dispflag();

			if (this.model.get("dispno")) {
				if (this.model.get("textDisplay") === "0" && digit !== ".") {
					this.model.set("textDisplay", digit);
				} else {
					this.model.set("textDisplay", this.model.get("textDisplay") + String(digit));

				}
				this.model.set("isNumberPressed", true);
				this.displayValue();
			}
		},

		/**
		 * This function updates the display value in model
		 * @access private
		 * @memberof Calculator
		 * @param None
		 * @returns None
		 */
		displayValue : function() {
			var resultStr = this.model.get("textDisplay");
			// $($.find("[type=display]")).html(resultStr.substr(0,10));
			//console.log("this.bForceRound ::::: " + this.bForceRound)
			if (this.bForceRound) {
				this.model.set("bForceRound", false);
				this.model.set("textDisplay", (this.preciseRound(Number(resultStr.substr(0, 10)), 2)));
			}
		},

		/**
		 * This function rounds of the digit
		 * @access private
		 * @memberof Calculator
		 * @param None
		 * @returns None
		 */
		preciseRound : function(num, decimals) {
			return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
		}
	});

	/**@constant
	 * @memberof Calculator#
	 * @type {string}
	 * @access private
	 * @default
	 */
	Calculator.prototype.DIGIT = 'digit';

	/**@constant
	 * @memberof Calculator#
	 * @type {string}
	 * @access private
	 * @default
	 */
	Calculator.prototype.DECIMAL = 'decimal';

	/**@constant
	 * @memberof Calculator#
	 * @type {string}
	 * @access private
	 * @default
	 */
	Calculator.prototype.OPERATOR = 'operator';

	/**@constant
	 * @memberof Calculator#
	 * @type {string}
	 * @access private
	 * @default
	 */
	Calculator.prototype.CLEAR_DISPLAY = 'clearDisplay';

	/**@constant
	 * @memberof Calculator#
	 * @type {string}
	 * @access private
	 * @default
	 */
	Calculator.prototype.BACK_SPACE = 'backspace';

	/**
	 * Set the super to BaseCompositeComp
	 * @access private
	 * @memberof Calculator#
	 */
	Calculator.prototype.Super = BaseCompositeComp;

	/**
	 * This function flushes the data
	 * @memberof Calculator#
	 * @access private
	 * @param None
	 * @returns None
	 */
	Calculator.prototype.flush = function() {

		var model;
		if (this.collection) {
			while (this.collection.first()) {
				model = this.collection.first();
				model.id = null;
				model.destroy();
				model = null;
			}
		}

		// destroy calculator's model
		if (this.model) {
			this.model.id = null;
			this.model.destroy();
			this.model = null;
			this.collection = null;
		}
	};

	/**
	 * This functions destroys the component
	 * @memberof Calculator#
	 * @access public
	 * @param None
	 * @returns {Boolean} True or false
	 */
	Calculator.prototype.destroy = function() {
		this.$el.off("click");
		this.$el.off("mouseover");
		this.$el.off("mouseout");
		this.off(CalculatorItem.BUTTON_CLICKED, this.onButtonClicked);
		$(window).unbind("keydown");

		this.flush();
		this.unbind();
		this.undelegateEvents();

		this.children.call('destroy');
		this.children.call('remove');

		this.close();

		return this.Super.prototype.destroy(true);
	};

	return Calculator;
});
