/*jslint nomen: true*/
/*globals window,define,$, _,console*/
/**
 * Debugger
 * @fileoverview Class Debugger is responsible to provide custom debug window and controll its functionality.
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(['marionette', 'jqueryTouchPunch'], function(Marionette, TouchPunch) {"use strict";
	/**
	 * @class Debugger
	 * Class 'Debugger' is introduced to manage debug related task.
	 * if application debug mode set to true then a custom popup window will be addded
	 * in application area. where console.log and any application error will appear. error message
	 * will appear with the file name and line number also
	 *
	 * This is very useful when we need to debug in iPad environment.
	 *
	 * Also this class is responsible to create logger to find the cause of any error.
	 *
	 * To use the feature of debug mode debug mode value can be modify in Playeconfig xml or
	 * also debug mode on commnad can be given through the queryStirng.
	 *
	 * exmple
	 * server/index.html?debug=true
	 * @access private
	 */
	var MDebugger = function(strDomElement) {
		this.FONT_SIZE = 12;
		this.TEXT_COLOR = "black";
		this.WARNING_COLOR = "green";
		this.ERROR_COLOR = "red";
		this.OBJECT_KEY_COLOR = "#8080CC";
		this.OBJECT_TEXT_COLOR = "#1919A3";
		this.DEBUGGER_SIZE = {};
		this.DEBUGGER_SIZE.maxHeight = 600;
		this.DEBUGGER_SIZE.maxWidth = 800;
		this.DEBUGGER_SIZE.minHeight = 150;
		this.DEBUGGER_SIZE.minWidth = 250;
		this.domElement = $("#" + strDomElement);
		this.debuggerArea = this.domElement.find("#debugTextHeaderAndTextArea");
		this.bEnableDebugger = false;
		this.consoleHolder = console;
		this.errorHolder = window.onerror;
		this.txtDebugger = this.domElement.find("#debugTextArea");
		this.btnHide = this.domElement.find("#btnHideDebugger");
		this.btnShow = this.domElement.find("#btnShowDebugger");
		this.btnClear = this.domElement.find("#btnClearDebugger");
		this.isDragging = false;
		this.isMinimize = undefined;
	};

	/**
	 * Mehtod enableDebugger is responsible to activate or deactivate debug mode application
	 * window. This is responsble to call 'overrideConsole' method for further action.
	 * @param {Boolean} bEnable
	 * @return none
	 * @memberof MDebugger#
	 * @acccess private
	 */
	MDebugger.prototype.enableDebugger = function(bEnable, isErrorLogger, isInMinimizedState) {
		this.isMinimize = isInMinimizedState;
		this.bEnableDebugger = bEnable;
		this.bEnableErrorLogger = isErrorLogger;
		this.strErrorLoggerData = "";
		this.overrideConsole(bEnable, isErrorLogger);
		this.initDebuggerButtons();
	};

	/**
	 * Method initDebuggerButtons initlizing the debug control(s).
	 * e.g add events to 'showHideDebugger' button to provide on/off controller to end user.
	 * @param none
	 * @return none
	 * @memberof MDebugger#
	 * @access private
	 */
	MDebugger.prototype.initDebuggerButtons = function() {
		var objThis = this, objDebugWindow, bShow = "none";
		this.btnClear.bind("click", this, function() {
			objThis.txtDebugger.html("");
		});

		objDebugWindow = objThis.domElement.find("#debugTextHeaderAndTextArea");

		this.btnShow.bind("click", this, function() {
			if (objThis.isDragging === true) {
				return false;
			}
			bShow = "block";
			objDebugWindow = objThis.domElement.find("#debugTextHeaderAndTextArea");
			objDebugWindow.css("left", objThis.btnShow.css("left"));
			objDebugWindow.css("top", objThis.btnShow.css("top"));
			objDebugWindow.css("display", bShow);
			objThis.btnShow.css("display", "none");
		});

		this.btnHide.bind("click", this, function() {
			bShow = "none";
			objDebugWindow = objThis.domElement.find("#debugTextHeaderAndTextArea");
			objDebugWindow.css("display", bShow);
			objThis.btnShow.css("left", objDebugWindow.css("left"));
			objThis.btnShow.css("top", objDebugWindow.css("top"));
			objThis.btnShow.css("display", "block");
		});

		if (this.isMinimize === true) {
			objDebugWindow.css("display", bShow);
			objThis.btnShow.css("left", objDebugWindow.css("left"));
			objThis.btnShow.css("top", objDebugWindow.css("top"));
			objThis.btnShow.css("display", "block");
		}
	};

	/**
	 * Method 'overrideConsole' is responsible to make debug mode enable or disable
	 * by overriding the browser console object.
	 * @param {Boolean} b possibel value will be true/false
	 * @return none
	 * @memberof MDebugger#
	 * @access private
	 */
	MDebugger.prototype.overrideConsole = function(bShowConsole, isErrorLogger) {
		window.console = {};
		if (bShowConsole === true || isErrorLogger === true) {
			console.warn = $.proxy(this.showWarning, this);

			//Overriding Console.log
			console.log = $.proxy(this.consoleLog, this);

			//..Overriding Error logger
			window.onerror = $.proxy(this.errorLog, this);

			//Adding Resizer functionality in Debugger window.
			this.addResizer(this.debuggerArea);

			//Adding Drag feature
			this.makeDraggable(this.debuggerArea);
		} else {
			window.console = this.consoleHolder;
			window.onerror = this.errorHolder;
		}

		if (bShowConsole === true) {
			this.domElement.css("display", "block");
		}

	};

	/**
	 *  Displaying the console text in debugger text window and also
	 * pass the value to browser console window.
	 * @param {Object} msg value that need to be display.
	 * @return none
	 * @memberof MDebugger#
	 * @access private
	 */
	MDebugger.prototype.consoleLog = function() {

		var strMsg = "", i, key;
		for ( i = 0; i < arguments.length; i += 1) {
			//Object passed but not an array.
			if (_.isObject(arguments[i]) && _.isArray(arguments[i]) === false) {
				for (key in arguments[i]) {
					if (arguments[i].hasOwnProperty(key)) {
						//..Fetch first level of object property and add in console window.
						strMsg = strMsg + "<I><B><font color='" + this.OBJECT_KEY_COLOR + "'>" + key + "</font></B></I>:<font color='" + this.OBJECT_TEXT_COLOR + "'>" + arguments[i][key] + "</font>   ";
					}
				}
			} else {
				if (_.isArray(arguments[i])) {
					//..Array object passed as a argument
					strMsg = strMsg + "[ " + arguments[i] + " ] ";
					strMsg = strMsg + "> length:" + arguments[i].length;
				} else {
					//..String passed as a argument.
					strMsg = strMsg + arguments[i] + " ";
				}
			}

		}

		this.txtDebugger.append("<font color='" + this.TEXT_COLOR + "'>" + strMsg + "</font><br>");
		this.strErrorLoggerData = this.strErrorLoggerData + "\n " + strMsg;
		if (this.consoleHolder.log !== undefined) {
			this.consoleHolder.log.apply(this.consoleHolder, arguments);
		}

		this.txtDebugger.scrollTop(this.txtDebugger.innerHeight());
	};

	/**
	 *  Displaying the console text in debugger text window and also
	 * pass the value to browser console window.
	 * @param {Object} msg value that need to be display.
	 * @return none
	 * @memberof MDebugger#
	 * @access private
	 */
	MDebugger.prototype.errorLog = function(desc, page, line) {
		var strMessage = desc + " > " + page + ":" + line;
		this.txtDebugger.append("<font color='red'>" + strMessage + "</font><br>");
		this.strErrorLoggerData = this.strErrorLoggerData + "\n " + strMessage;
		this.txtDebugger.scrollTop(this.txtDebugger.innerHeight());
	};

	/**
	 *  Displaying the warning text in debugger text window and also
	 * pass the value to browser console window.
	 * @param {Object} msg value that need to be display.
	 * @return none
	 * @memberof MDebugger#
	 * @access private
	 */
	MDebugger.prototype.showWarning = function(desc, page, line) {
		this.txtDebugger.append("<font color='" + this.WARNING_COLOR + "'>Warning: " + desc + "</font><br>");
		this.strErrorLoggerData = this.strErrorLoggerData + "\n " + desc + " ::: " + page + " ::: " + line;
		this.consoleHolder.warn(desc);
		this.txtDebugger.scrollTop(this.txtDebugger.innerHeight());
	};

	/**
	 * Adding resizer
	 * @param {Object} objTarget reference of target that needs to be resized
	 * @return none
	 * @memberof MDebugger#
	 * @access private
	 */
	MDebugger.prototype.addResizer = function(objTarget) {
		var objClassRef = this, objResizer;
		objTarget.resizable({
			maxHeight : objClassRef.DEBUGGER_SIZE.maxHeight,
			maxWidth : objClassRef.DEBUGGER_SIZE.maxWidth,
			minHeight : objClassRef.DEBUGGER_SIZE.minHeight,
			minWidth : objClassRef.DEBUGGER_SIZE.minWidth
		});

		objResizer = this.domElement.find(".ui-resizable-handle");
		objResizer.removeClass();
		objResizer.addClass("resizerHandler");
	};

	/**
	 * Adding Drag feature in Custom Debugger popup window object.
	 * @access private
	 * @param {Object} objTarget
	 * @memberof MDebugger#
	 * @return none
	 */
	MDebugger.prototype.makeDraggable = function(objTarget) {
		objTarget.draggable({
			handle : "#objHeadaer",
			containment : 'document'
		});

		//adding drag feature in 'show debugger window button' to allow the user
		//to drag when debug window is in minimize state.
		var objClassRef = this;
		this.btnShow.draggable({
			containment : 'document',
			drag : function(objEvnt, ui) {
				objClassRef.isDragging = true;
			},
			stop : _.debounce(function() {
				objClassRef.isDragging = false;
			}, 100)
		});
	};

	/**
	 * Return error log
	 * @access private
	 * @param None
	 * @memberof MDebugger#
	 * @return none
	 */
	MDebugger.prototype.getErrorLogData = function() {
		return this.strErrorLoggerData;
	};

	return MDebugger;
}); 