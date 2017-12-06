/*globals console,Backbone*/
/**
 * CalculatorModel
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(['backbone'],
/**
 *A class containing model for calculator component
 *@class CalculatorModel
 *@augments Backbone.Model
 *@access private
 *@example
 * 
 *require(['components/calculator/model/CalculatorModel'], function(CalculatorModel) {
 *    var calculatorModel = new CalculatorModel();
 *});
 */
function(Backbone) {"use strict";
	var CalculatorModel = /** @lends CalculatorModel.prototype */
	Backbone.Model.extend({

		defaults : function(){
			
			return{
				
				isDragRequired : false,
				// buttonCollection: {},
				buttonCollection : [{
					label : "0",
					styleName : "CalcBtnStyleZero",
					type : "digit",
					value : "0"
	
				}, {
					label : "1",
					styleName : "CalcBtnStyle1",
					type : "digit",
					value : "1"
	
				}, {
					label : "2",
					styleName : "CalcBtnStyle2",
					type : "digit",
					value : "2"
	
				}, {
					label : "3",
					styleName : "CalcBtnStyle3",
					type : "digit",
					value : "3"
	
				}, {
					label : "4",
					styleName : "CalcBtnStyle4",
					type : "digit",
					value : "4"
	
				}, {
					label : "5",
					styleName : "CalcBtnStyle5",
					type : "digit",
					value : "5"
	
				}, {
					label : "6",
					styleName : "CalcBtnStyle6",
					type : "digit",
					value : "6"
	
				}, {
					label : "7",
					styleName : "CalcBtnStyle7",
					type : "digit",
					value : "7"
	
				}, {
					label : "8",
					styleName : "CalcBtnStyle8",
					type : "digit",
					value : "8"
	
				}, {
					label : "9",
					styleName : "CalcBtnStyle9",
					type : "digit",
					value : "9"
	
				}, {
					label : ".",
					styleName : "CalcBtnStyleDecimal",
					type : "decimal",
					value : "."
	
				}, {
					label : "*",
					styleName : "CalcBtnStyleMultiplication",
					type : "operator",
					value : "*"
	
				}, {
					label : "/",
					styleName : "CalcBtnStyleDivision",
					type : "operator",
					value : "/"
	
				}, {
					label : "-",
					styleName : "CalcBtnStyleMinus",
					type : "operator",
					value : "-"
	
				}, {
					label : "+",
					styleName : "CalcBtnStyleSum",
					type : "operator",
					value : "+"
	
				}, {
					label : "=",
					styleName : "CalcBtnStyleEqulas",
					type : "operator",
					value : "="
	
				}, {
					label : "C",
					styleName : "CalcBtnStyleClear",
					type : "clearDisplay",
					value : ""
	
				}, {
					label : "Backspace",
					styleName : "CalcBtnStyleBackspace",
					type : "backspace",
					value : ""
	
				}],
				showTitleBarButtons : false,
				state : "maximized", //maximized | minimized
				calculatorWrapperStyle : 'CalculatorWrapperStyle',
				textDisplay : "0",
				display_flag : 0,
				maxDisplayCount : 18,
				error : false,
				operator : "",
				clear : true,
				decimal : false,
				newOper : null,
				operand1 : false,
				isNumberPressed : false,
				previousOperator : undefined,
				previousNumber : undefined,
				isEqualPressed : false,
				canCalculate : undefined,
				previousInput : undefined,
				bForceRound : false,
				dispno : false
			};
			
		}
	});

	return CalculatorModel;
});
