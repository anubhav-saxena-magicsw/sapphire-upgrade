/*jslint nomen: true*/
/*globals console,_,$,basePath,device*/

/**
 * CustomKeyboardWidget
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @namespace HAF.CustomKeyboardWidget
 * @description This widget allows user to depict the functionality of keyboard.
 * The element on which it is applied, acts as the option parent.
 * In the options there is property by the name of "keys" which gets overriden by the json data provided by the developer.
 * @example
 * Apply this widget as:
 * $('#customKeyboard').CustomKeyboardWidget({keys:this.customKeys,defaultKeySet:"CharKeyset"});<br>
 * Where,<br>
 * 1. "#customKeyboard" is the id of element on which it is applied and "this.customKeys" is the json data of predefined format<a href="data/customKeyboardData.js" target="blank">(Sample Data)</a>. It contains the keys which needs to be rendered in the keyboard.
 * 2. "defaultKeySet" is the default view of customkeyboard and it can take only "CharKeyset", "NumericKeyset" and "SpecialCharKeyset" values.
 */
( function($) {
		"use strict";
		$.widget("custom.CustomKeyboardWidget", {

			/**
			 * @name HAF.CustomKeyboardWidget#options
			 * @description This object contains all variables which are going to be accessed by the private and public methods of this widget.
			 */
			options : {
				actualKeycodes : [{
					id : "0",
					keycode : "48"

				}, {
					id : "1",
					keycode : "49"

				}, {
					id : "2",
					keycode : "50"

				}, {
					id : "3",
					keycode : "51"

				}, {
					id : "4",
					keycode : "52"

				}, {
					id : "5",
					keycode : "53"

				}, {
					id : "6",
					keycode : "54"

				}, {
					id : "7",
					keycode : "55"

				}, {
					id : "8",
					keycode : "56"

				}, {
					id : "9",
					keycode : "57"

				}, {
					id : "a",
					keycode : "97"

				}, {
					id : "b",
					keycode : "98"

				}, {
					id : "c",
					keycode : "99"

				}, {
					id : "d",
					keycode : "100"

				}, {
					id : "e",
					keycode : "101"

				}, {
					id : "f",
					keycode : "102"

				}, {
					id : "g",
					keycode : "103"

				}, {
					id : "h",
					keycode : "104"

				}, {
					id : "i",
					keycode : "105"

				}, {
					id : "j",
					keycode : "106"

				}, {
					id : "k",
					keycode : "107"

				}, {
					id : "l",
					keycode : "108"

				}, {
					id : "b",
					keycode : "109"

				}, {
					id : "n",
					keycode : "110"

				}, {
					id : "o",
					keycode : "111"

				}, {
					id : "p",
					keycode : "112"

				}, {
					id : "q",
					keycode : "113"

				}, {
					id : "r",
					keycode : "114"

				}, {
					id : "s",
					keycode : "115"

				}, {
					id : "t",
					keycode : "116"

				}, {
					id : "u",
					keycode : "117"

				}, {
					id : "v",
					keycode : "118"

				}, {
					id : "w",
					keycode : "119"

				}, {
					id : "x",
					keycode : "120"

				}, {
					id : "y",
					keycode : "121"

				}, {
					id : "z",
					keycode : "122"

				}, {
					id : "A",
					keycode : "65"

				}, {
					id : "B",
					keycode : "66"

				}, {
					id : "C",
					keycode : "67"

				}, {
					id : "D",
					keycode : "68"

				}, {
					id : "E",
					keycode : "69"

				}, {
					id : "F",
					keycode : "70"

				}, {
					id : "G",
					keycode : "71"

				}, {
					id : "H",
					keycode : "72"

				}, {
					id : "I",
					keycode : "73"

				}, {
					id : "J",
					keycode : "74"

				}, {
					id : "K",
					keycode : "75"

				}, {
					id : "L",
					keycode : "76"

				}, {
					id : "M",
					keycode : "77"

				}, {
					id : "N",
					keycode : "78"

				}, {
					id : "O",
					keycode : "79"

				}, {
					id : "P",
					keycode : "80"

				}, {
					id : "Q",
					keycode : "81"

				}, {
					id : "R",
					keycode : "82"

				}, {
					id : "S",
					keycode : "83"

				}, {
					id : "T",
					keycode : "84"

				}, {
					id : "U",
					keycode : "85"

				}, {
					id : "V",
					keycode : "86"

				}, {
					id : "W",
					keycode : "87"

				}, {
					id : "X",
					keycode : "88"

				}, {
					id : "Y",
					keycode : "89"

				}, {
					id : "Z",
					keycode : "90"

				}, {
					id : "exclamation",
					keycode : "33"

				}, {
					id : "atTheRate",
					keycode : "64"

				}, {
					id : "hash",
					keycode : "35"

				}, {
					id : "percentage",
					keycode : "37"

				}, {
					id : "carrot",
					keycode : "94"

				}, {
					id : "empersand",
					keycode : "38"

				}, {
					id : "asterisk",
					keycode : "42"

				}, {
					id : "bracketOpen",
					keycode : "40"

				}, {
					id : "bracketClose",
					keycode : "41"

				}, {
					id : "minus",
					keycode : "45"

				}, {
					id : "plus",
					keycode : "43"

				}, {
					id : "divide",
					keycode : "47"

				}, {
					id : "decimal",
					keycode : "46"

				}, {
					id : "equals",
					keycode : "61"

				}, {
					id : "questionMark",
					keycode : "63"

				}, {
					id : "underscore",
					keycode : "95"
				}, {
					id : "curlyBracketOpen",
					keycode : "123"
				}, {
					id : "curlyBracketClose",
					keycode : "125"
				}, {
					id : "squareBracketOpen",
					keycode : "91"
				}, {
					id : "squareBracketClose",
					keycode : "93"
				}, {
					id : "pipe",
					keycode : "124"
				}, {
					id : "backslash",
					keycode : "92"
				}, {
					id : "colon",
					keycode : "58"
				}, {
					id : "semicolon",
					keycode : "59"
				}, {
					id : "doubleQuotes",
					keycode : "34"
				}, {
					id : "singleQuotes",
					keycode : "39"
				}, {
					id : "comma",
					keycode : "44"
				}, {
					id : "tilde",
					keycode : "126"
				}, {
					id : "graveAcent",
					keycode : "96"
				}, {
					id : "backspace",
					keycode : "8"
				}, {
					id : "space",
					keycode : "32"
				}, {
					id : "tab",
					keycode : "9"
				}, {
					id : "shift",
					keycode : "16"
				}, {
					id : "ctrl",
					keycode : "17"
				}, {
					id : "alt",
					keycode : "18"
				}, {
					id : "capsLock",
					keycode : "20"
				}, {
					id : "arrowUp",
					keycode : "38"
				}, {
					id : "arrowDown",
					keycode : "40"
				}, {
					id : "arrowLeft",
					keycode : "37"
				}, {
					id : "arrowRight",
					keycode : "39"
				}, {
					id : "enter",
					keycode : "13"
				}],

				keys : {

					numeric : [{
						label : "0",
						labelSubScript : "",
						styleName : "CalcBtnStyleZero",
						id : "0",
						keycode : "48",
						shiftKeyCode : "48",
						type : "digit"
					}, {
						label : "1",
						labelSubScript : "",
						styleName : "CalcBtnStyle1",
						id : "1",
						keycode : "49",
						shiftKeyCode : "49",
						type : "digit"
					}, {
						label : "2",
						labelSubScript : "",
						styleName : "CalcBtnStyle2",
						id : "2",
						keycode : "50",
						shiftKeyCode : "50",
						type : "digit"
					}, {
						label : "3",
						labelSubScript : "",
						styleName : "CalcBtnStyle3",
						id : "3",
						keycode : "51",
						shiftKeyCode : "51",
						type : "digit"
					}, {
						label : "4",
						labelSubScript : "",
						styleName : "CalcBtnStyle4",
						id : "4",
						keycode : "52",
						shiftKeyCode : "52",
						type : "digit"
					}, {
						label : "5",
						labelSubScript : "",
						styleName : "CalcBtnStyle5",
						id : "5",
						keycode : "53",
						shiftKeyCode : "53",
						type : "digit"
					}, {
						label : "6",
						labelSubScript : "",
						styleName : "CalcBtnStyle6",
						id : "6",
						keycode : "54",
						shiftKeyCode : "54",
						type : "digit"
					}, {
						label : "7",
						labelSubScript : "",
						styleName : "CalcBtnStyle7",
						id : "7",
						keycode : "55",
						shiftKeyCode : "55",
						type : "digit"
					}, {
						label : "8",
						labelSubScript : "",
						styleName : "CalcBtnStyle8",
						id : "8",
						keycode : "56",
						shiftKeyCode : "56",
						type : "digit"
					}, {
						label : "9",
						labelSubScript : "",
						styleName : "CalcBtnStyle9",
						id : "9",
						keycode : "57",
						shiftKeyCode : "57",
						type : "digit"
					}],
					characters : [{
						label : "A",
						labelSubScript : "a",
						styleName : "CalcBtnStyleA",
						id : "a",
						keycode : "97",
						shiftKeyCode : "65",
						type : "character"
					}, {
						label : "b",
						labelSubScript : "B",
						styleName : "CalcBtnStyleB",
						id : "b",
						keycode : "98",
						shiftKeyCode : "66",
						type : "character"
					}, {
						label : "C",
						labelSubScript : "c",
						styleName : "CalcBtnStyleC",
						id : "c",
						keycode : "99",
						shiftKeyCode : "67",
						type : "character"
					}, {
						label : "d",
						labelSubScript : "D",
						styleName : "CalcBtnStyleD",
						id : "d",
						keycode : "100",
						shiftKeyCode : "68",
						type : "character"
					}, {
						label : "E",
						labelSubScript : "e",
						styleName : "CalcBtnStyleE",
						id : "e",
						keycode : "101",
						shiftKeyCode : "69",
						type : "character"
					}, {
						label : "F",
						labelSubScript : "f",
						styleName : "CalcBtnStyleF",
						id : "f",
						keycode : "102",
						shiftKeyCode : "70",
						type : "character"
					}, {
						label : "G",
						labelSubScript : "g",
						styleName : "CalcBtnStyleG",
						id : "g",
						keycode : "103",
						shiftKeyCode : "71",
						type : "character"
					}, {
						label : "H",
						labelSubScript : "h",
						styleName : "CalcBtnStyleH",
						id : "h",
						keycode : "104",
						shiftKeyCode : "72",
						type : "character"
					}, {
						label : "I",
						labelSubScript : "i",
						styleName : "CalcBtnStyleI",
						id : "i",
						keycode : "105",
						shiftKeyCode : "73",
						type : "character"
					}, {
						label : "J",
						labelSubScript : "j",
						styleName : "CalcBtnStyleJ",
						id : "j",
						keycode : "106",
						shiftKeyCode : "74",
						type : "character"
					}, {
						label : "K",
						labelSubScript : "k",
						styleName : "CalcBtnStyleK",
						id : "k",
						keycode : "107",
						shiftKeyCode : "75",
						type : "character"
					}, {
						label : "L",
						labelSubScript : "l",
						styleName : "CalcBtnStyleL",
						id : "l",
						keycode : "108",
						shiftKeyCode : "76",
						type : "character"
					}, {
						label : "M",
						labelSubScript : "m",
						styleName : "CalcBtnStyleM",
						id : "m",
						keycode : "109",
						shiftKeyCode : "77",
						type : "character"

					}, {
						label : "N",
						labelSubScript : "n",
						styleName : "CalcBtnStyleN",
						id : "n",
						keycode : "110",
						shiftKeyCode : "78",
						type : "character"

					}, {
						label : "O",
						labelSubScript : "o",
						styleName : "CalcBtnStyleO",
						id : "o",
						keycode : "111",
						shiftKeyCode : "79",
						type : "character"

					}, {
						label : "P",
						labelSubScript : "p",
						styleName : "CalcBtnStyleP",
						id : "p",
						keycode : "112",
						shiftKeyCode : "80",
						type : "character"

					}, {
						label : "Q",
						labelSubScript : "q",
						styleName : "CalcBtnStyleQ",
						id : "q",
						keycode : "113",
						shiftKeyCode : "81",
						type : "character"

					}, {
						label : "R",
						labelSubScript : "r",
						styleName : "CalcBtnStyleR",
						id : "r",
						keycode : "114",
						shiftKeyCode : "82",
						type : "character"

					}, {
						label : "S",
						labelSubScript : "s",
						styleName : "CalcBtnStyleS",
						id : "s",
						keycode : "115",
						shiftKeyCode : "83",
						type : "character"

					}, {
						label : "T",
						labelSubScript : "t",
						styleName : "CalcBtnStyleT",
						id : "t",
						keycode : "116",
						shiftKeyCode : "84",
						type : "character"

					}, {
						label : "U",
						labelSubScript : "u",
						styleName : "CalcBtnStyleU",
						id : "u",
						keycode : "117",
						shiftKeyCode : "85",
						type : "character"

					}, {
						label : "V",
						labelSubScript : "v",
						styleName : "CalcBtnStyleV",
						id : "v",
						keycode : "118",
						shiftKeyCode : "86",
						type : "character"

					}, {
						label : "W",
						labelSubScript : "w",
						styleName : "CalcBtnStyleW",
						id : "w",
						keycode : "119",
						shiftKeyCode : "87",
						type : "character"

					}, {
						label : "X",
						labelSubScript : "x",
						styleName : "CalcBtnStyleX",
						id : "x",
						keycode : "120",
						shiftKeyCode : "88",
						type : "character"

					}, {
						label : "Y",
						labelSubScript : "y",
						styleName : "CalcBtnStyleY",
						id : "y",
						keycode : "121",
						shiftKeyCode : "89",
						type : "character"

					}, {
						label : "Z",
						labelSubScript : "z",
						styleName : "CalcBtnStyleZ",
						id : "z",
						keycode : "122",
						shiftKeyCode : "90",
						type : "character"

					}],
					specialCharacters : [{
						label : "!",
						labelSubScript : "",
						styleName : "CalcBtnStyleExclamation",
						id : "exclamation",
						keycode : "33",
						shiftKeyCode : "33",
						type : "specialCharacter"

					}, {
						label : "@",
						labelSubScript : "",
						styleName : "CalcBtnStyleAt",
						id : "atTheRate",
						keycode : "64",
						shiftKeyCode : "64",
						type : "specialCharacter"

					}, {
						label : "#",
						labelSubScript : "",
						styleName : "CalcBtnStyleHash",
						id : "hash",
						keycode : "35",
						shiftKeyCode : "35",
						type : "specialCharacter"

					}, {
						label : "%",
						labelSubScript : "",
						styleName : "CalcBtnStylePercent",
						id : "percentage",
						keycode : "37",
						shiftKeyCode : "37",
						type : "specialCharacter"

					}, {
						label : "^",
						labelSubScript : "",
						styleName : "CalcBtnStyleCarrot",
						id : "carrot",
						keycode : "94",
						shiftKeyCode : "94",
						type : "specialCharacter"

					}, {
						label : "&",
						labelSubScript : "",
						styleName : "CalcBtnStyleEmpersand",
						id : "empersand",
						keycode : "38",
						shiftKeyCode : "48",
						type : "specialCharacter"

					}, {
						label : "*",
						labelSubScript : "",
						styleName : "CalcBtnStyleMultiplication",
						id : "asterisk",
						keycode : "42",
						shiftKeyCode : "42",
						type : "specialCharacter"

					}, {
						label : "(",
						labelSubScript : "",
						styleName : "CalcBtnStyleBracketOpen",
						id : "bracketOpen",
						keycode : "40",
						shiftKeyCode : "40",
						type : "specialCharacter"

					}, {
						label : ")",
						labelSubScript : "",
						styleName : "CalcBtnStyleBracketClose",
						id : "bracketClose",
						keycode : "41",
						shiftKeyCode : "41",
						type : "specialCharacter"

					}, {
						label : "-",
						labelSubScript : "",
						styleName : "CalcBtnStyleMinus",
						id : "minus",
						keycode : "45",
						shiftKeyCode : "45",
						type : "specialCharacter"

					}, {
						label : "+",
						labelSubScript : "",
						styleName : "CalcBtnStyleSum",
						id : "plus",
						keycode : "43",
						shiftKeyCode : "43",
						type : "specialCharacter"

					}, {
						label : "/",
						labelSubScript : "",
						styleName : "CalcBtnStyleDivision",
						id : "divide",
						keycode : "47",
						shiftKeyCode : "47",
						type : "specialCharacter"

					}, {
						label : ".",
						labelSubScript : "",
						styleName : "CalcBtnStyleDecimal",
						id : "decimal",
						keycode : "46",
						shiftKeyCode : "46",
						type : "specialCharacter"

					}, {
						label : "=",
						labelSubScript : "",
						styleName : "CalcBtnStyleEqulas",
						id : "equals",
						keycode : "61",
						shiftKeyCode : "61",
						type : "specialCharacter"

					}, {
						label : "?",
						labelSubScript : "",
						styleName : "CalcBtnStyleQuestionMark",
						id : "questionMark",
						keycode : "63",
						shiftKeyCode : "63",
						type : "specialCharacter"

					}, {
						label : "_",
						labelSubScript : "",
						styleName : "CalcBtnStyleUnderscore",
						id : "underscore",
						keycode : "95",
						shiftKeyCode : "95",
						type : "specialCharacter"
					}, {
						label : "{",
						labelSubScript : "",
						styleName : "CalcBtnStyleCurlyOpen",
						id : "curlyBracketOpen",
						keycode : "123",
						shiftKeyCode : "123",
						type : "specialCharacter"
					}, {
						label : "}",
						labelSubScript : "",
						styleName : "CalcBtnStyleCurlyClose",
						id : "curlyBracketClose",
						keycode : "125",
						shiftKeyCode : "125",
						type : "specialCharacter"
					}, {
						label : "[",
						labelSubScript : "",
						styleName : "CalcBtnStyleSquareOpen",
						id : "squareBracketOpen",
						keycode : "91",
						shiftKeyCode : "91",
						type : "specialCharacter"
					}, {
						label : "]",
						labelSubScript : "",
						styleName : "CalcBtnStyleSquareClose",
						id : "squareBracketClose",
						keycode : "93",
						shiftKeyCode : "93",
						type : "specialCharacter"
					}, {
						label : "|",
						labelSubScript : "",
						styleName : "CalcBtnStyleOR",
						id : "pipe",
						keycode : "124",
						shiftKeyCode : "124",
						type : "specialCharacter"
					}, {
						label : "\\",
						labelSubScript : "",
						styleName : "CalcBtnStyleBackslash",
						id : "backslash",
						keycode : "92",
						shiftKeyCode : "92",
						type : "specialCharacter"
					}, {
						label : ":",
						labelSubScript : "",
						styleName : "CalcBtnStyleColon",
						id : "colon",
						keycode : "58",
						shiftKeyCode : "58",
						type : "specialCharacter"
					}, {
						label : ";",
						labelSubScript : "",
						styleName : "CalcBtnStyleSemiColon",
						id : "semicolon",
						keycode : "59",
						shiftKeyCode : "59",
						type : "specialCharacter"
					}, {
						label : "\"",
						labelSubScript : "",
						styleName : "CalcBtnStyleDoubleQuotes",
						id : "doubleQuotes",
						keycode : "34",
						shiftKeyCode : "34",
						type : "specialCharacter"
					}, {
						label : "'",
						labelSubScript : "",
						styleName : "CalcBtnStyleSingleQuotes",
						id : "singleQuotes",
						keycode : "39",
						shiftKeyCode : "39",
						type : "specialCharacter"
					}, {
						label : ",",
						labelSubScript : "",
						styleName : "CalcBtnStyleComma",
						id : "comma",
						keycode : "44",
						shiftKeyCode : "44",
						type : "specialCharacter"
					}, {
						label : "~",
						labelSubScript : "",
						styleName : "CalcBtnStyleTilde",
						id : "tilde",
						keycode : "126",
						shiftKeyCode : "126",
						type : "specialCharacter"
					}, {
						label : "'",
						labelSubScript : "",
						styleName : "CalcBtnStyleGraveAcent",
						id : "graveAcent",
						keycode : "96",
						shiftKeyCode : "96",
						type : "specialCharacter"
					}],
					specialKeys : [{
						label : "Backspace",
						labelSubScript : "",
						styleName : "CalcBtnStyleBackspace",
						id : "backspace",
						keycode : "8",
						shiftKeyCode : "8",
						type : "specialKeys"
					}, {
						label : "Space",
						labelSubScript : "",
						styleName : "CalcBtnStylespace",
						id : "space",
						keycode : "32",
						shiftKeyCode : "32",
						type : "specialKeys"
					}, {
						label : "Tab",
						labelSubScript : "",
						styleName : "CalcBtnStyleTab",
						id : "tab",
						keycode : "9",
						shiftKeyCode : "9",
						type : "specialKeys"
					}, {
						label : "Shift",
						labelSubScript : "",
						styleName : "CalcBtnStyleShift",
						id : "shift",
						keycode : "16",
						shiftKeyCode : "16",
						type : "specialKeys"
					}, {
						label : "Ctrl",
						labelSubScript : "",
						styleName : "CalcBtnStyleCtrl",
						id : "ctrl",
						keycode : "17",
						shiftKeyCode : "17",
						type : "specialKeys"
					}, {
						label : "Alt",
						labelSubScript : "",
						styleName : "CalcBtnStyleAlt",
						id : "alt",
						keycode : "18",
						shiftKeyCode : "18",
						type : "specialKeys"
					}, {
						label : "Caps",
						labelSubScript : "",
						styleName : "CalcBtnStyleCaps",
						id : "capslock",
						keycode : "20",
						shiftKeyCode : "20",
						type : "specialKeys"
					}, {
						label : "Up",
						labelSubScript : "",
						styleName : "CalcBtnStyleArrowUp",
						id : "arrowUp",
						keycode : "38",
						shiftKeyCode : "38",
						type : "specialKeys"
					}, {
						label : "Down",
						labelSubScript : "",
						styleName : "CalcBtnStyleArrowDown",
						id : "arrowDown",
						keycode : "40",
						shiftKeyCode : "40",
						type : "specialKeys"
					}, {
						label : "Left",
						labelSubScript : "",
						styleName : "CalcBtnStyleArrowLeft",
						id : "arrowLeft",
						keycode : "37",
						shiftKeyCode : "37",
						type : "specialKeys"
					}, {
						label : "Right",
						labelSubScript : "",
						styleName : "CalcBtnStyleArrowRight",
						id : "arrowRight",
						keycode : "39",
						shiftKeyCode : "39",
						type : "specialKeys"
					}, {
						label : "Enter",
						labelSubScript : "",
						styleName : "CalcBtnStyleEnter",
						id : "enter",
						keycode : "13",
						shiftKeyCode : "13",
						type : "specialKeys"
					}, {
						label : "123",
						labelSubScript : "",
						styleName : "NumericToggleButtonStyleName",
						id : "NumericKeyset",
						keycode : "numeric",
						shiftKeyCode : "numeric",
						type : "keySetToggle"
					}, {
						label : "abc",
						labelSubScript : "",
						styleName : "CharToggleButtonStyleName",
						id : "CharKeyset",
						keycode : "character",
						shiftKeyCode : "character",
						type : "keySetToggle"
					}, {
						label : "#+=",
						labelSubScript : "",
						styleName : "SpecialCharToggleButtonStyle",
						id : "SpecialCharKeyset",
						keycode : "Specialcharacter",
						shiftKeyCode : "Specialcharacter",
						type : "keySetToggle"
					}]
				},

				specialCharacterCustomMapping : [{
					key : "!",
					mappedKey : "exclamation"
				}, {
					key : "@",
					mappedKey : "atTheRate"
				}, {
					key : "#",
					mappedKey : "hash"
				}, {
					key : "%",
					mappedKey : "percentage"
				}, {
					key : "^",
					mappedKey : "carrot"
				}, {
					key : "&",
					mappedKey : "empersand"
				}, {
					key : "*",
					mappedKey : "asterisk"
				}, {
					key : "(",
					mappedKey : "bracketOpen"
				}, {
					key : ")",
					mappedKey : "bracketClose"
				}, {
					key : "-",
					mappedKey : "minus"
				}, {
					key : "+",
					mappedKey : "plus"
				}, {
					key : "/",
					mappedKey : "divide"
				}, {
					key : ".",
					mappedKey : "decimal"
				}, {
					key : "=",
					mappedKey : "equals"
				}, {
					key : "?",
					mappedKey : "questionMark"
				}, {
					key : "_",
					mappedKey : "underscore"
				}, {
					key : "{",
					mappedKey : "curlyBracketOpen"
				}, {
					key : "}",
					mappedKey : "curlyBracketClose"
				}, {
					key : "[",
					mappedKey : "squareBracketOpen"
				}, {
					key : "]",
					mappedKey : "squareBracketClose"
				}, {
					key : "|",
					mappedKey : "pipe"
				}, {
					key : "\\",
					mappedKey : "backslash"
				}, {
					key : ":",
					mappedKey : "colon"
				}, {
					key : ";",
					mappedKey : "semicolon"
				}, {
					key : "\"",
					mappedKey : "doubleQuotes"
				}, {
					key : "'",
					mappedKey : "singleQuotes"
				}, {
					key : ",",
					mappedKey : "comma"
				}, {
					key : "~",
					mappedKey : "tilde"
				}, {
					key : "`",
					mappedKey : "graveAcent"
				}],

				bCapsLockEnabled : false,

				bShiftEnabled : false,

				bAltEnabled : false,

				bCtrlEnabled : false,

				specialKeyid : null,

				KeyboardWrapper : null,

				numericKeyWrapper : null,

				characterKeyWrapper : null,

				specialCharacterKeyWrapper : null,

				specialKeysWrapper : null,

				wrapper : null,

				currentActiveKeySet : null,

				currentActiveToggleKey : null,

				eventData : {
					shiftKey : false,
					ctrlkey : false,
					altKey : false,
					capsKey : false,
					keycode : ""
				},

				isRunningOnDevice : false,
				bUseHWKeyboard : true,
				bCapsKeyValidationDone : false,
				keySelected : "keySelected",
				backspace : "backspace",
				tab : "tab",
				shift : "shift",
				ctrl : 'ctrl',
				alt : 'alt',
				capslock : 'capslock',
				arrowUp : 'arrowUp',
				arrowDown : 'arrowDown',
				arrowLeft : 'arrowLeft',
				arrowRight : 'arrowRight',
				enter : 'enter',
				numericToggleKeyID : 'NumericKeyset',
				numericToggleKeyCode : 'numeric',
				charToggleKeyID : 'CharKeyset',
				charToggleKeyCode : 'character',
				specialCharToggleKeyID : 'SpecialCharKeyset',
				specialCharToggleKeyCode : 'Specialcharacter',
				css_link : $("<link>", {
					rel : "stylesheet",
					type : "text/css",
					href : basePath + "framework/player/widgets/customkeyboard/css/custom-keyboard-widget.css"
				}),
				arrDisable : []

			},

			/**
			 * @name HAF.CustomKeyboardWidget#constants
			 * @description This function returns the object for constants used in this widget.
			 */
			constants : function() {
				return this.options.keySelected;
			},

			/**
			 * @name HAF.CustomKeyboardWidget#_isOtherKey
			 * @function
			 * @description This function checks if backspace,arrow keys etc are clicked
			 * @private
			 * @param {Object} context conatains the context of widget.
			 * @param {String} keyCode conatains the keycode.
			 * @returns {Boolean} returns true of false
			 */
			_isOtherKey : function(context, keyCode) {
				var bVal = false;
				switch(keyCode) {
				case 8:
					context.options.specialKeyid = context.options.backspace;
					bVal = true;
					break;
				case 37:
					context.options.specialKeyid = context.options.arrowLeft;
					bVal = true;
					break;
				case 38:
					context.options.specialKeyid = context.options.arrowUp;
					bVal = true;
					break;
				case 39:
					context.options.specialKeyid = context.options.arrowRight;
					bVal = true;
					break;
				case 40:
					context.options.specialKeyid = context.options.arrowDown;
					bVal = true;
					break;
				case 20:
					context.options.specialKeyid = context.options.capslock;
					context.options.bCapsLockEnabled = !context.options.bCapsLockEnabled;
					bVal = true;
					break;
				case 9:
					context.options.specialKeyid = context.options.tab;
					bVal = true;
					break;
				case 16:
					context.options.specialKeyid = context.options.shift;
					bVal = true;
					break;
				case 17:
					context.options.specialKeyid = context.options.ctrl;
					bVal = true;
					break;
				case 18:
					context.options.specialKeyid = context.options.alt;
					bVal = true;
					break;
				}

				return bVal;
			},

			/**
			 * @name HAF.CustomKeyboardWidget#_keyDownOnVirtualKeyboard
			 * @function
			 * @description This function handles the mousedown
			 * @private
			 * @param {Object} e conatains the reference of event.
			 * @returns None
			 */
			_keyDownOnVirtualKeyboard : function(e) {
				$(e.currentTarget).addClass("DownStyle");
			},

			/**
			 * @name HAF.CustomKeyboardWidget#_keyUpOnVirtualKeyboard
			 * @function
			 * @description This function handles the mouseup event
			 * @private
			 * @param {Object} e conatains the reference of event.
			 * @returns None
			 */
			_keyUpOnVirtualKeyboard : function(e) {
				$(e.currentTarget).removeClass("DownStyle");
				var objClassRef, keyId, keyCode, shiftKeyCode, keyType, mapping, targetDiv;
				targetDiv = e.currentTarget;
				keyType = $(targetDiv).attr("type");

				if (keyType === undefined) {
					targetDiv = $(targetDiv).parent();
					keyType = $(targetDiv).attr("type");
				}

				if ((keyType === "character") || (keyType === "specialCharacter") || (keyType === "digit") || (keyType === "specialKeys") || (keyType === "keySetToggle")) {

					objClassRef = e.data;
					mapping = "[keyid=" + objClassRef.options.capslock + "]";
					keyId = $(targetDiv).attr("keyid");
					keyCode = $(targetDiv).attr("keycode");

					if (keyType === "keySetToggle") {
						objClassRef._toggleKeyboard(keyId);
					} else {
						if ((keyType === "specialKeys") && (keyId === "capslock")) {
							objClassRef.options.bCapsLockEnabled = !objClassRef.options.bCapsLockEnabled;
						}
						if ((keyType === "specialKeys") && (keyId === "ctrl")) {
							objClassRef.options.bCtrlEnabled = !objClassRef.options.bCtrlEnabled;
						}
						if ((keyType === "specialKeys") && (keyId === "alt")) {
							objClassRef.options.bAltEnabled = !objClassRef.options.bAltEnabled;
						}
						if ((keyType === "specialKeys") && (keyId === "shift")) {
							objClassRef.options.bShiftEnabled = !objClassRef.options.bShiftEnabled;
						}

						objClassRef.options.eventData.shiftKey = objClassRef.options.bShiftEnabled;
						objClassRef.options.eventData.ctrlkey = objClassRef.options.bCtrlEnabled;
						objClassRef.options.eventData.altKey = objClassRef.options.bAltEnabled;
						objClassRef.options.eventData.capsKey = objClassRef.options.bCapsLockEnabled;

						if (objClassRef.options.bCapsLockEnabled) {
							objClassRef._activateCapsLockButton(true, objClassRef);
							shiftKeyCode = $(targetDiv).attr("shiftkeycode");
							objClassRef.options.eventData.keycode = Number(shiftKeyCode);
						} else {
							objClassRef._activateCapsLockButton(false, objClassRef);
							objClassRef.options.eventData.keycode = Number(keyCode);
						}

						if (objClassRef.options.bShiftEnabled) {
							shiftKeyCode = $(targetDiv).attr("shiftkeycode");
							objClassRef.options.eventData.keycode = Number(shiftKeyCode);
							objClassRef._activateShiftKey(true, objClassRef);
							if (keyId !== "shift") {
								objClassRef.options.bShiftEnabled = false;
								objClassRef._activateShiftKey(false, objClassRef);
							}
						} else {
							objClassRef.options.eventData.keycode = Number(keyCode);
							objClassRef._activateShiftKey(false, objClassRef);
						}

						objClassRef.options.wrapper.trigger(objClassRef.options.keySelected, objClassRef.options.eventData);

						//reset ctrl and alt boolean properties after dispatching the event as they are not toggle buttons
						objClassRef.options.bCtrlEnabled = false;
						objClassRef.options.bAltEnabled = false;
					}

				}
			},

			/**
			 * @name HAF.CustomKeyboardWidget#_handleKeyPressOnWindow
			 * @function
			 * @description This function handles the keypress event from hardware keyboard
			 * @private
			 * @param {Object} e conatains the reference of event.
			 * @returns None
			 */
			_handleKeyPressOnWindow : function(e) {
				var objClassRef, keyCode, charCode, keyCharacter, index;
				objClassRef = e.data;
				index = objClassRef.options.arrDisable.indexOf(String(e.keyCode));
				if (objClassRef.options.bUseHWKeyboard && index == -1) {
					charCode = e.charCode;

					//check if caps lock is already enabled prior to initializing of widget
					if (!objClassRef.options.bCapsKeyValidationDone) {
						objClassRef._capsKeyValidation(e);
					}

					objClassRef.options.eventData.shiftKey = e.shiftKey;
					objClassRef.options.eventData.ctrlkey = e.ctrlKey;
					objClassRef.options.eventData.altKey = e.altKey;
					objClassRef.options.eventData.capsKey = objClassRef.options.bCapsLockEnabled;

					if (objClassRef.options.bCapsLockEnabled || e.shiftKey) {
						/* since we have kept the id of only small letters therefore we are adding 32 here,
						 * as we always get the keycode of capital letters when any alphabet is pressed along with ctrl or alt button
						 */
						if (e.charCode >= 65 && e.charCode <= 90) {
							keyCharacter = String.fromCharCode(charCode + 32);
							keyCode = objClassRef._getShiftKeyCodeById(keyCharacter);
						} else if (charCode === 32) {
							keyCode = charCode;
						} else {
							keyCode = objClassRef._getMappedKeyCodeById(String.fromCharCode(charCode));
						}

					} else {
						//checking if space bar is pressed
						if (charCode === 32) {
							keyCode = charCode;
						} else {
							keyCode = objClassRef._getMappedKeyCodeById(String.fromCharCode(charCode));
						}

					}

					objClassRef.options.eventData.keycode = Number(keyCode);
					objClassRef.options.wrapper.trigger(objClassRef.options.keySelected, objClassRef.options.eventData);

				}

			},

			/**
			 * @name HAF.CustomKeyboardWidget#_handleKeyDownOnWindow
			 * @function
			 * @description This function handles the keydown event from hardware keyboard
			 * @private
			 * @param {Object} e conatains the reference of event.
			 * @returns None
			 */
			_handleKeyDownOnWindow : function(e) {

				var objClassRef, keyCode, alphabet, index;
				objClassRef = e.data;
				index = objClassRef.options.arrDisable.indexOf(String(e.keyCode));
				if (objClassRef.options.bUseHWKeyboard && index == -1) {
					keyCode = e.keyCode;
					//backspace prevented to go to previous screen
					if (e.keyCode === 8) {
						e.preventDefault();
					}
					if (!e.shiftKey && objClassRef._isOtherKey(objClassRef, keyCode)) {
						objClassRef.options.eventData.shiftKey = e.shiftKey;
						objClassRef.options.eventData.ctrlkey = e.ctrlKey;
						objClassRef.options.eventData.altKey = e.altKey;
						objClassRef.options.eventData.capsKey = objClassRef.options.bCapsLockEnabled;

						if (objClassRef.options.bCapsLockEnabled) {
							objClassRef._activateCapsLockButton(true, objClassRef);
						} else {
							objClassRef._activateCapsLockButton(false, objClassRef);
						}

						keyCode = objClassRef._getMappedKeyCodeById(objClassRef.options.specialKeyid);
						objClassRef.options.eventData.keycode = Number(keyCode);
						objClassRef.options.wrapper.trigger(objClassRef.options.keySelected, objClassRef.options.eventData);
					} else if (!e.shiftKey && (e.ctrlKey || e.altKey)) {
						objClassRef.options.eventData.shiftKey = e.shiftKey;
						objClassRef.options.eventData.ctrlkey = e.ctrlKey;
						objClassRef.options.eventData.altKey = e.altKey;
						objClassRef.options.eventData.capsKey = objClassRef.options.bCapsLockEnabled;

						/* since we have kept the id of only small letters therefore we are adding 32 here,
						 * as we always get the keycode of capital letters when any alphabet is pressed along with ctrl or alt button
						 */
						alphabet = String.fromCharCode(keyCode + 32);
						keyCode = objClassRef._getShiftKeyCodeById(alphabet);
						objClassRef.options.eventData.keycode = Number(keyCode);

						objClassRef.options.wrapper.trigger(objClassRef.options.keySelected, objClassRef.options.eventData);
					}
				}

			},

			/**
			 * @name HAF.CustomKeyboardWidget#_capsKeyValidation
			 * @function
			 * @description This function validates if the key pressed here is caps key
			 * @private
			 * @param {Object} event conatains the reference of event.
			 * @returns None
			 */
			_capsKeyValidation : function(event) {
				var btnCapslock, mapping, objClassRef;
				objClassRef = event.data;

				if (65 <= event.charCode && event.charCode <= 90) {
					if (!event.shiftKey) {
						objClassRef._activateCapsLockButton(true, objClassRef);
						objClassRef.options.bCapsKeyValidationDone = true;
						objClassRef.options.bCapsLockEnabled = true;
					}
				}
			},

			/**
			 * @name HAF.CustomKeyboardWidget#_activateCapsLockButton
			 * @function
			 * @description This function update the state of caps button
			 * @private
			 * @param {Object} bVal conatains if active state needs to be added.
			 * @param {Object} objClassRef conatains the reference of widget.
			 * @returns None
			 */
			_activateCapsLockButton : function(bVal, objClassRef) {
				var btnCapslock, mapping;

				mapping = "[keyid=" + objClassRef.options.capslock + "]";
				btnCapslock = $(objClassRef.options.KeyboardWrapper).find(mapping);

				if (bVal) {
					$(btnCapslock).addClass("active");
				} else {
					$(btnCapslock).removeClass("active");
				}
			},

			/**
			 * @name HAF.CustomKeyboardWidget#_activateShiftKey
			 * @function
			 * @description This function update the state of shift button
			 * @private
			 * @param {Object} bVal conatains if active state needs to be added.
			 * @param {Object} objClassRef conatains the reference of widget.
			 * @returns None
			 */
			_activateShiftKey : function(bVal, objClassRef) {
				var btnShift, mapping;

				mapping = "[keyid=" + objClassRef.options.shift + "]";
				btnShift = $(objClassRef.options.KeyboardWrapper).find(mapping);

				if (bVal) {
					$(btnShift).addClass("active");
				} else {
					$(btnShift).removeClass("active");
				}
			},

			/**
			 * @name HAF.CustomKeyboardWidget#_getSpecialCharacterMapping
			 * @function
			 * @description This function returns the mapped code for special character
			 * @private
			 * @param {String} character conatains the character of the key.
			 * @returns {String}
			 */
			_getSpecialCharacterMapping : function(character) {
				var len, i, mappedKeyCode, mappingObj = {};
				len = this.options.specialCharacterCustomMapping.length;
				for ( i = 0; i < len; i += 1) {
					mappingObj = this.options.specialCharacterCustomMapping[i];
					if (mappingObj.key === character) {
						mappedKeyCode = mappingObj.mappedKey;
						break;
					}
				}
				return mappedKeyCode;
			},

			/**
			 * @name HAF.CustomKeyboardWidget#_getMappedKeyCodeById
			 * @function
			 * @description This function returns the mapped code for the keys
			 * @private
			 * @param {String} keyId conatains the keyid of the key.
			 * @returns {String}
			 */
			_getMappedKeyCodeById : function(keyId) {
				var mappedKeyCode, mapping;
				mapping = "[keyid=" + keyId + "]";
				try {
					mappedKeyCode = $(this.options.KeyboardWrapper).find(mapping).attr("keycode");
				} catch(e) {
					mapping = "[keyid=" + this._getSpecialCharacterMapping(keyId) + "]";
					mappedKeyCode = $(this.options.KeyboardWrapper).find(mapping).attr("keycode");
				}

				return mappedKeyCode;
			},

			/**
			 * @name HAF.CustomKeyboardWidget#_getShiftKeyCodeById
			 * @function
			 * @description This function returns the shift key code for the keys
			 * @private
			 * @param {String} keyId conatains the keyid of the key.
			 * @returns {String}
			 */
			_getShiftKeyCodeById : function(keyId) {
				var mappedKeyCode, mapping;
				mapping = "[keyid=" + keyId + "]";
				mappedKeyCode = $(this.options.KeyboardWrapper).find(mapping).attr("shiftkeycode");
				return mappedKeyCode;
			},

			/**
			 * @name HAF.CustomKeyboardWidget#_init
			 * @function
			 * @description This function is called during the initialization fase of widget
			 * @private
			 * @param None
			 * @returns None
			 */
			_init : function() {
				this.options.css_link.appendTo('head');
			},

			/**
			 * @name HAF.CustomKeyboardWidget#_create
			 * @function
			 * @description This function triggers the rendering of keyboard items
			 * @private
			 * @param None
			 * @returns None
			 */
			_create : function() {
				var mapping;
				this.options.isRunningOnDevice = (device.mobile() || device.tablet()) ? true : false;
				this._attachListeners();
				this.options.wrapper = $(this.element);
				this.options.wrapper.append("<div id='keyboardWrapper' class='keyboardWrapperStyle'></div>");
				this.options.KeyboardWrapper = $(this.options.wrapper).find("#keyboardWrapper");
				this._renderKeys();
			},

			//To do: This function need to be optimized

			/**
			 * @name HAF.CustomKeyboardWidget#_renderKeys
			 * @function
			 * @description This function renders the data for the keyboard
			 * @private
			 * @param None
			 * @returns None
			 */
			_renderKeys : function() {
				var i, key, nCharKeyCount, nNumericKeyCount, nSpecialCharKeyCount, nSpecialKeysCount, strSubScriptLabel, objLabelContainer;

				nSpecialKeysCount = (this.options.keys.specialKeys === undefined) ? 0 : this.options.keys.specialKeys.length;
				nCharKeyCount = (this.options.keys.characters === undefined) ? 0 : this.options.keys.characters.length;
				nNumericKeyCount = (this.options.keys.numeric === undefined) ? 0 : this.options.keys.numeric.length;
				nSpecialCharKeyCount = (this.options.keys.specialCharacters === undefined) ? 0 : this.options.keys.specialCharacters.length;

				//add special keys like alt, ctrl, Enter etc.
				if (nSpecialKeysCount > 0) {

					this.options.KeyboardWrapper.append("<div id='specialKeysWrapper' class='specialKeysWrapperStyle'></div>");
					this.options.specialKeysWrapper = $(this.options.KeyboardWrapper).find("#specialKeysWrapper");

					for ( i = 0; i < nSpecialKeysCount; i += 1) {

						strSubScriptLabel = this.options.keys.specialKeys[i].labelSubScript;

						if (strSubScriptLabel !== "" && strSubScriptLabel !== undefined) {
							key = "<div keyid=\"" + this.options.keys.specialKeys[i].id + "\" class=\"" + this.options.keys.specialKeys[i].styleName + "\" keycode=\"" + this.options.keys.specialKeys[i].keycode + "\" type=\"" + this.options.keys.specialKeys[i].type + "\" shiftKeyCode=\"" + this.options.keys.specialKeys[i].shiftKeyCode + "\"><div class=\"Uppercase\">" + this.options.keys.specialKeys[i].label + "</div><div class=\"Lowercase\">" + this.options.keys.specialKeys[i].labelSubScript + "</div></div>";
						} else {
							key = "<div keyid=\"" + this.options.keys.specialKeys[i].id + "\" class=\"" + this.options.keys.specialKeys[i].styleName + "\" keycode=\"" + this.options.keys.specialKeys[i].keycode + "\" type=\"" + this.options.keys.specialKeys[i].type + "\" shiftKeyCode=\"" + this.options.keys.specialKeys[i].shiftKeyCode + "\">" + this.options.keys.specialKeys[i].label + "</div>";
						}

						this.options.specialKeysWrapper.append(key);
					}

					if (this.options.isRunningOnDevice) {
						$("#specialKeysWrapper>div").unbind("touchstart").bind("touchstart", this, this._keyDownOnVirtualKeyboard);
						$("#specialKeysWrapper>div").unbind("touchend").bind("touchend", this, this._keyUpOnVirtualKeyboard);

						//$(e.currentTarget).removeClass("DownStyle");
					} else {
						$("#specialKeysWrapper>div").unbind("mousedown").bind("mousedown", this, this._keyDownOnVirtualKeyboard);
						$("#specialKeysWrapper>div").unbind("mouseup").bind("mouseup", this, this._keyUpOnVirtualKeyboard);
						$("#specialKeysWrapper>div").unbind("mouseleave").bind("mouseleave", this, function(e) {
							$(e.currentTarget).removeClass("DownStyle");
						});
					}

				}

				//adding keys to numeric container
				if (nNumericKeyCount > 0) {
					this.options.KeyboardWrapper.append("<div id='numericKeyWrapper' class='numericWrapperStyle'></div>");
					this.options.numericKeyWrapper = $(this.options.KeyboardWrapper).find("#numericKeyWrapper");

					for ( i = 0; i < nNumericKeyCount; i += 1) {

						strSubScriptLabel = this.options.keys.numeric[i].labelSubScript;

						if (strSubScriptLabel !== "" && strSubScriptLabel !== undefined) {
							key = "<div keyid=\"" + this.options.keys.numeric[i].id + "\" class=\"" + this.options.keys.numeric[i].styleName + "\" keycode=\"" + this.options.keys.numeric[i].keycode + "\" type=\"" + this.options.keys.numeric[i].type + "\" shiftKeyCode=\"" + this.options.keys.numeric[i].shiftKeyCode + "\"><div class=\"Uppercase\">" + this.options.keys.numeric[i].label + "</div><div class=\"Lowercase\">" + this.options.keys.numeric[i].labelSubScript + "</div></div>";
						} else {
							key = "<div keyid=\"" + this.options.keys.numeric[i].id + "\" class=\"" + this.options.keys.numeric[i].styleName + "\" keycode=\"" + this.options.keys.numeric[i].keycode + "\" type=\"" + this.options.keys.numeric[i].type + "\" shiftKeyCode=\"" + this.options.keys.numeric[i].shiftKeyCode + "\">" + this.options.keys.numeric[i].label + "</div>";
						}

						this.options.numericKeyWrapper.append(key);
					}

					if (this.options.isRunningOnDevice) {
						$("#numericKeyWrapper>div").unbind("touchstart").bind("touchstart", this, this._keyDownOnVirtualKeyboard);
						$("#numericKeyWrapper>div").unbind("touchend").bind("touchend", this, this._keyUpOnVirtualKeyboard);

					} else {
						$("#numericKeyWrapper>div").unbind("mousedown").bind("mousedown", this, this._keyDownOnVirtualKeyboard);
						$("#numericKeyWrapper>div").unbind("mouseup").bind("mouseup", this, this._keyUpOnVirtualKeyboard);
						$("#numericKeyWrapper>div").unbind("mouseleave").bind("mouseleave", this, function(e) {
							$(e.currentTarget).removeClass("DownStyle");
						});
					}

				}
				//adding keys to character container
				if (nCharKeyCount > 0) {
					this.options.KeyboardWrapper.append("<div id='characterKeyWrapper' class='characterWrapperStyle'></div>");
					this.options.characterKeyWrapper = $(this.options.KeyboardWrapper).find("#characterKeyWrapper");

					for ( i = 0; i < nCharKeyCount; i += 1) {
						strSubScriptLabel = this.options.keys.characters[i].labelSubScript;

						if (strSubScriptLabel !== "" && strSubScriptLabel !== undefined) {
							key = "<div keyid=\"" + this.options.keys.characters[i].id + "\" class=\"" + this.options.keys.characters[i].styleName + "\" keycode=\"" + this.options.keys.characters[i].keycode + "\" type=\"" + this.options.keys.characters[i].type + "\" shiftKeyCode=\"" + this.options.keys.characters[i].shiftKeyCode + "\"><div class=\"Uppercase\">" + this.options.keys.characters[i].label + "</div><div class=\"Lowercase\">" + this.options.keys.characters[i].labelSubScript + "</div></div>";
						} else {
							key = "<div keyid=\"" + this.options.keys.characters[i].id + "\" class=\"" + this.options.keys.characters[i].styleName + "\" keycode=\"" + this.options.keys.characters[i].keycode + "\" type=\"" + this.options.keys.characters[i].type + "\" shiftKeyCode=\"" + this.options.keys.characters[i].shiftKeyCode + "\">" + this.options.keys.characters[i].label + "</div>";
						}

						this.options.characterKeyWrapper.append(key);

					}

					if (this.options.isRunningOnDevice) {
						$("#characterKeyWrapper>div").unbind("touchstart").bind("touchstart", this, this._keyDownOnVirtualKeyboard);
						$("#characterKeyWrapper>div").unbind("touchend").bind("touchend", this, this._keyUpOnVirtualKeyboard);
					} else {
						$("#characterKeyWrapper>div").unbind("mousedown").bind("mousedown", this, this._keyDownOnVirtualKeyboard);
						$("#characterKeyWrapper>div").unbind("mouseup").bind("mouseup", this, this._keyUpOnVirtualKeyboard);
						$("#characterKeyWrapper>div").unbind("mouseleave").bind("mouseleave", this, function(e) {
							$(e.currentTarget).removeClass("DownStyle");
						});

					}

				}
				//adding keys to numeric container
				if (nSpecialCharKeyCount > 0) {
					this.options.KeyboardWrapper.append("<div id='specialCharWrapper' class='specialCharWrapperStyle'></div>");
					this.options.specialCharacterKeyWrapper = $(this.options.KeyboardWrapper).find("#specialCharWrapper");

					for ( i = 0; i < nSpecialCharKeyCount; i += 1) {

						strSubScriptLabel = this.options.keys.specialCharacters[i].labelSubScript;

						if (strSubScriptLabel !== "" && strSubScriptLabel !== undefined) {
							key = "<div keyid=\"" + this.options.keys.specialCharacters[i].id + "\" class=\"" + this.options.keys.specialCharacters[i].styleName + "\" keycode=\"" + this.options.keys.specialCharacters[i].keycode + "\" type=\"" + this.options.keys.specialCharacters[i].type + "\" shiftKeyCode=\"" + this.options.keys.specialCharacters[i].shiftKeyCode + "\"><div class=\"Uppercase\">" + this.options.keys.specialCharacters[i].label + "</div><div class=\"Lowercase\">" + this.options.keys.specialCharacters[i].labelSubScript + "</div></div>";
						} else {
							key = "<div keyid=\"" + this.options.keys.specialCharacters[i].id + "\" class=\"" + this.options.keys.specialCharacters[i].styleName + "\" keycode=\"" + this.options.keys.specialCharacters[i].keycode + "\" type=\"" + this.options.keys.specialCharacters[i].type + "\" shiftKeyCode=\"" + this.options.keys.specialCharacters[i].shiftKeyCode + "\">" + this.options.keys.specialCharacters[i].label + "</div>";
						}

						this.options.specialCharacterKeyWrapper.append(key);
					}

					if (this.options.isRunningOnDevice) {
						$("#specialCharWrapper>div").unbind("touchstart").bind("touchstart", this, this._keyDownOnVirtualKeyboard);
						$("#specialCharWrapper>div").unbind("touchend").bind("touchend", this, this._keyUpOnVirtualKeyboard);
					} else {
						$("#specialCharWrapper>div").unbind("mousedown").bind("mousedown", this, this._keyDownOnVirtualKeyboard);
						$("#specialCharWrapper>div").unbind("mouseup").bind("mouseup", this, this._keyUpOnVirtualKeyboard);
						$("#specialCharWrapper>div").unbind("mouseleave").bind("mouseleave", this, function(e) {
							$(e.currentTarget).removeClass("DownStyle");
						});
					}

				}

				this._toggleKeyboard(this.options.defaultKeySet);

			},

			disable : function(strClass) {
				var $blocker = $('<div/>');
				if (this.options.bDisabled) {
					return;
				}
				this.options.KeyboardWrapper.addClass("disabled");
				this.options.KeyboardWrapper.append($blocker);
				if (strClass && strClass.length > 0) {
					$blocker.addClass(strClass);
				}
				this.options.KeyboardWrapper.prop("blocker", $blocker);
				this.options.KeyboardWrapper.prop("bUseHWKeyboard", this.options.bUseHWKeyboard);
				this.options.bUseHWKeyboard = false;
				this.options.bDisabled = true;
			},

			enable : function() {
				if (!this.options.bDisabled) {
					return;
				}
				this.options.KeyboardWrapper.removeClass("disabled");
				this.options.KeyboardWrapper.prop("blocker").remove();
				this.options.bUseHWKeyboard = this.options.KeyboardWrapper.prop("bUseHWKeyboard");
				this.options.bDisabled = false;
			},

			hideKeys : function(arrKeyIds) {
				var i = 0, $key;
				for ( i = 0; i < arrKeyIds.length; i += 1) {
					$key = this.options.KeyboardWrapper.find("[keyid=" + arrKeyIds[i] + "]");
					if ($key.length && $key.css("display") !== "none") {
						this.options.arrDisable.push(String($key.attr('keyCode')));
						this.options.arrDisable.push(String($key.attr('shiftkeycode')));
						$key.hide();
					}
				}
			},

			showKeys : function(arrKeyIds) {
				var i = 0, $key, index;
				for ( i = 0; i < arrKeyIds.length; i += 1) {
					$key = this.options.KeyboardWrapper.find("[keyid=" + arrKeyIds[i] + "]");
					index = this.options.arrDisable.indexOf(String($key.attr('keyCode')));
					if (index !== -1) {
						this.options.arrDisable.splice(index, 1);
						$key.show();
					}
					index = this.options.arrDisable.indexOf(String($key.attr('shiftkeycode')));
					if (index !== -1) {
						this.options.arrDisable.splice(index, 1);
						$key.show();
					}
				}
			},

			/**
			 * @name HAF.CustomKeyboardWidget#_toggleKeyboard
			 * @function
			 * @description This function toggles the keyboard view
			 * @private
			 * @param {String} toggleKeyId id of the togglebutton
			 * @returns None
			 */
			_toggleKeyboard : function(toggleKeyId) {
				var mapping;
				if (this.options.currentActiveKeySet) {
					$(this.options.currentActiveToggleKey).removeClass("active");
					$(this.options.currentActiveKeySet).css("display", "none");
				}

				switch(toggleKeyId) {
				case this.options.numericToggleKeyID:
					this.options.currentActiveKeySet = this.options.numericKeyWrapper;
					break;
				case this.options.charToggleKeyID:
					this.options.currentActiveKeySet = this.options.characterKeyWrapper;
					break;
				case this.options.specialCharToggleKeyID:
					this.options.currentActiveKeySet = this.options.specialCharacterKeyWrapper;
					break;
				}

				mapping = "[keyid = " + toggleKeyId + "]";
				this.options.currentActiveToggleKey = $(this.options.specialKeysWrapper).find(mapping);
				this.options.currentActiveToggleKey.addClass("active");
				$(this.options.currentActiveKeySet).css("display", "inline");

			},

			/**
			 * @name HAF.CustomKeyboardWidget#setKeyboard
			 * @function
			 * @description This function toggles the keyboard view as per the parameter
			 * @public
			 * @param {String} toggleKeyId contains the id for the keyset
			 * @returns None
			 * @example
			 * //For character keyboard
			 * $('#customKeyboard').CustomKeyboardWidget("setKeyboard","CharKeyset");
			 * OR
			 * //For special character keyboard
			 * $('#customKeyboard').CustomKeyboardWidget("setKeyboard","SpecialCharKeyset");
			 * OR
			 * //For numeric keyboard
			 * $('#customKeyboard').CustomKeyboardWidget("setKeyboard","NumericKeyset");
			 */
			setKeyboard : function(toggleKeyId) {
				this._toggleKeyboard(toggleKeyId);
			},

			/**
			 * @name HAF.CustomKeyboardWidget#useHWKeyboard
			 * @function
			 * @description This function enable and disable the hardware keyboard
			 * @public
			 * @param {Boolean} bVal contains the boolean value to enable and disable the hardware keyboard
			 * @returns None
			 */
			useHWKeyboard : function(bVal) {
				if (this.options.bDisabled) {
					return;
				}
				this.options.bUseHWKeyboard = bVal;
			},

			/**
			 * @name HAF.CustomKeyboardWidget#_attachListeners
			 * @function
			 * @description This function attaches the relevant listeners for the keyboard
			 * @private
			 * @param None
			 * @returns None
			 */
			_attachListeners : function() {
				$(window).bind("keypress", this, this._handleKeyPressOnWindow);
				//for tracking arrowkeys and backspace
				$(window).bind("keydown", this, this._handleKeyDownOnWindow);
			},

			/**
			 * @name HAF.CustomKeyboardWidget#_destroy
			 * @function
			 * @description This function destroys the the widget
			 * @private
			 * @param None
			 * @returns None
			 */
			_destroy : function() {
				$(window).unbind("keypress");
				$(window).unbind("keydown");
				if (this.options.isRunningOnDevice) {
					$("#specialKeysWrapper>div").unbind("touchstart");
					$("#specialKeysWrapper>div").unbind("touchend");
					$("#numericKeyWrapper>div").unbind("touchstart");
					$("#numericKeyWrapper>div").unbind("touchend");
					$("#characterKeyWrapper>div").unbind("touchstart");
					$("#characterKeyWrapper>div").unbind("touchend");
					$("#specialCharWrapper>div").unbind("touchstart");
					$("#specialCharWrapper>div").unbind("touchend");
				} else {
					$("#specialKeysWrapper>div").unbind("mousedown");
					$("#specialKeysWrapper>div").unbind("mouseup");
					$("#specialKeysWrapper>div").unbind("mouseleave");
					$("#numericKeyWrapper>div").unbind("mousedown");
					$("#numericKeyWrapper>div").unbind("mouseup");
					$("#numericKeyWrapper>div").unbind("mouseleave");
					$("#characterKeyWrapper>div").unbind("mousedown");
					$("#characterKeyWrapper>div").unbind("mouseup");
					$("#characterKeyWrapper>div").unbind("mouseleave");
					$("#specialCharWrapper>div").unbind("mousedown");
					$("#specialCharWrapper>div").unbind("mouseup");
					$("#specialCharWrapper>div").unbind("mouseleave");
				}

				this.options = {};

			}
		});
	}(jQuery));
