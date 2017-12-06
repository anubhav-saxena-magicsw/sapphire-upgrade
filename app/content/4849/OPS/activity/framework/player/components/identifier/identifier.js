/*jslint nomen: true,plusplus: true*/
/*globals console,Backbone,_,$*/
/**
 * Identifier
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['marionette', 'jqueryUI', 'jqueryTouchPunch', 'player/base/base-item-comp', 'text!components/identifier/template/identifier.html', 'components/identifier/model/identifier-model', 'components/identifier/js/identifierconst', 'css!components/identifier/template/style/identifier.css'], function(Marionette, jqueryUI, jqueryTouchPunch, BaseItemComp, IdentifierTemp, IdentifierModel, IdentifierConstants, IdentifierCSS) {'use strict';

	var userActions = [],punctuationArray=[",",".","?"], Identifier = /** @lends Identifier.prototype */
	BaseItemComp.extend({

		template : _.template(IdentifierTemp),
		/*class members*/
		content : null, /* this will be a string*/
		objProperty : null, /*this will define style i.e. bold,color or underline*/
		compData : null,
		objContainer : null,
		objSpan : null,
		objColorVal : "#000000",
		correctAnswer : null,
		/*userActions : [],*/

		/**
		 * This function initializes the component
		 * @access private
		 * @memberof Identifier
		 * @param {Object} objCompData Conatins the data to configure the component
		 * @returns None
		 */
		initialize : function(objCompData) {

			this.objData = objData;//this property is being used in componentselector for editing.
			this.initializeComp(objCompData);
		},

		/**
		 * This function initializes all the required elements for the component
		 * @access private
		 * @memberof Identifier
		 * @param {Object} objCompData Conatins the data to configure the component
		 * @returns None
		 */
		initializeComp : function(objCompData) {

			/* should check with model if any previous state*/
			// objCompData refrence
			this.compData = objCompData;
			// model should be initialze;
			this.model = new IdentifierModel();
			this.parseCompData(this, objCompData, this.model);
			// parsecomp data

		},
		/**
		 * This function parse the data and set it to the model of component
		 * @access private
		 * @memberof Identifier
		 * @param {Object} context Conatins the context of the component
		 * @param {Object} objCompData Conatins the data to configure the component
		 * @param {Object} model Conatins the reference of component's model
		 * @returns None
		 */
		parseCompData : function(context, objCompData, model) {

			//.. need to check here if any value in model or not..
			context.content = objCompData.content;
			context.objProperty = objCompData.property;
			context.correctAnswer = objCompData.correctAnswer;

			//.. need to modify content into span tags if there is no span tags already..
			if (context.content.search("<span>") == -1) {
				var tempArr = context.content.split(" "), i = 0, tempStr = "";
				while (i < tempArr.length) {
					//..
					if(!context.checkPunctuation(tempArr[i]))
					{
						tempStr += "<div class='highlightercontainer'><span id=" + "'span_" + i + "' isclicked='false' index='" + i + "'>" + tempArr[i] + "</span><div id='logo_" + i + "' class='logoCont'></div></div>";
					}else{
						tempStr += "<div class='highlightercontainer'><span class='adjustmargin' id=" + "'span_" + i + "' isclicked='false' index='" + i + "'>" + tempArr[i] + "</span><div id='logo_" + i + "' class='logoCont_none'></div></div>";
					}
					
					i++;

				}
				context.content = tempStr;
			}

			model.set("content", context.content);
			model.set("property", context.objProperty);
			if (objCompData.color !== undefined) {
				context.objColorVal = objCompData.color;
			}
			model.set("color", context.objColorVal);

			//..
			//console.log("Data is ",userActions);

			//..

		},
		/**
		 * This function is called when rendering of component is started
		 * @access private
		 * @memberof Identifier
		 * @param None
		 * @returns None
		 */
		onRender : function() {
			// initialize
			this.initIdentifier();
		},

		/**
		 * This function is called when rendering of component is completed
		 * @access private
		 * @memberof Identifier
		 * @param None
		 * @returns None
		 */
		onShow : function() {
			this.configureView(this);

		},

		/**
		 * This function is called when component is shown in the DOM
		 * @access private
		 * @memberof Identifier
		 * @param None
		 * @returns None
		 */
		initIdentifier : function() {

			this.objContainer = this.$('#identifierWrapper');

		},
		/**
		 * This function attaches relevant event on the identifier
		 * @access private
		 * @memberof Identifier
		 * @param None
		 * @returns None
		 */
		attachSelectionEvent : function() {
			this.objSpan = this.$('#identifierWrapper span');
			$(this.objSpan).on("mousedown", this, this.mouseInteractionOnSpan);
			$(this.objSpan).on("mouseup", this, this.mouseInteractionOnSpan);

			//.. testing purpose attaching check answer,correct answer and your answer..
			this.$('input[type="button"]').on('click', this, this.btnClickHandler);

			//..

		},
		btnClickHandler : function(evt) {
			var id = evt.target.id;
			switch(id) {
				case "check":
					evt.data.checkAnswer();
					break;
				case "your":
					evt.data.yourAnswer();
					break;
				case "correct":
					evt.data.setCorrectAnswer();
					break;
				case "reset":
					evt.data.resetIdentifier();
					break;
				case "disable":
					evt.data.getResult();
					break;
			}

		},
		/**
		 * This function triggers mousedown event on thumb
		 * @access private
		 * @memberof Slider
		 * @param {Object} event contains the referenc of thumb
		 * @returns None
		 */
		mouseInteractionOnSpan : function(event) {

			var isClicked, setVal;
			if (event.type === "mousedown") {
				event.data.trigger(IdentifierConstants.EVENTS.MOUSEDOWN_ON_SPAN, event.target.id);
			} else {
				//..toggle property..
				isClicked = $(event.target).attr("isclicked");
				if (isClicked !== undefined) {
					setVal = (isClicked === "true") ? "false" : "true";
					$(event.target).attr("isclicked", setVal);
					event.data.applyStyle($(event.target), setVal);
				}

				//..trigger event
				event.data.trigger(IdentifierConstants.EVENTS.MOUSEUP_ON_SPAN, event.target.id);
			}

		},
		/**
		 * This function renders the component as per the configuration data
		 * @access private
		 * @memberof Identifier
		 * @param {Object} objThis Conatins the data to configure the component
		 * @returns None
		 */
		configureView : function(objThis) {

			// need to check with model and set state;
			objThis.content = objThis.model.get("content");
			// appending into container.
			$(objThis.objContainer).append(objThis.content);
			objThis.attachSelectionEvent();

		},

		/**
		 * This function resets the component to its default value
		 * @access private
		 * @memberof Identifier
		 * @param None
		 * @returns None
		 */
		resetIdentifier : function() {
			//console.log('resetIdentifier');
			this.removeAllSelectedStyle();
			userActions = [];
			$(this.objSpan).removeClass("disableItem");
		}
	});

	/**
	 * Set the super to BaseItemComp
	 * @access private
	 * @memberof BaseItemComp#
	 */
	Identifier.prototype.Super = BaseItemComp;

	Identifier.prototype.applyStyle = function(obj, boolean) {
		var colorVal, prop, underLineProp;
		//..preserve user input against selected dom element
		var inputObj = {};
		inputObj.domId = obj.attr("id");
		inputObj.index = obj.attr("index");
		inputObj.spanValue = obj.text();
		//..
		boolean = (boolean === "true") ? true : false;
		prop = this.model.get('property');
		switch(prop) {
			case IdentifierConstants.CONSTANTS.HIGHLIGHTER:
				if (boolean) {
					colorVal = this.objColorVal;
					inputObj.style = prop;
				} else {
					colorVal = "#000000";
					inputObj.style = "none";
				}
				obj.css('color', colorVal);

				break;
			case IdentifierConstants.CONSTANTS.UNDERLINE:
				if (boolean) {
					underLineProp = "underline";
					inputObj.style = prop;
				} else {
					underLineProp = "none";
					inputObj.style = "none";
				}
				obj.css('text-decoration', underLineProp);
				break;
		}
		this.saveUserAction(inputObj);

	};
	Identifier.prototype.getUserActionArr = function() {
		return userActions;
	};
	Identifier.prototype.setUserActionArr = function(arr) {
		//consolelog('set user actionnn');
		userActions = arr;
	};
	Identifier.prototype.saveUserAction = function(param) {
		//. check if it exists already
		if (userActions.length > 0) {
			var i = 0;
			while (i < userActions.length) {
				if (userActions[i].domId === param.domId) {
					userActions.splice(i, 1);
				}
				i++;
			}
		}
		if (param.style != "none") {
			//alert('push');
			userActions.push(param);

		}

	};
	Identifier.prototype.checkPunctuation = function(value) {
		var i, flag = false;
		for ( i = 0; i < punctuationArray.length; i++) {
			if (punctuationArray[i] === value) {
				flag = true;
			}
		}
		return flag;

	};
	Identifier.prototype.search = function(array, value) {

		var i, flag = false;
		for ( i = 0; i < array.length; i++) {
			//consolelog("array[i].domId", array[i].index);

			if (array[i].spanValue === value.spanValue && array[i].index == value.index) {
				flag = true;
			}
		}
		return flag;

	};
	Identifier.prototype.checkAnswer = function() {
		this.disableIdentifier();
		this.computeAction();

	};
	Identifier.prototype.setCorrectAnswer = function() {

		this.removeAllSelectedStyle();
		var i = 0, prop;
		while (i < this.correctAnswer.length) {
			this.setCorrectStyles(this.correctAnswer[i]);
			i++;
		}
	};
	Identifier.prototype.setCorrectStyles = function(obj) {
		var objThis = this, prop;
		$('#identifierWrapper span').filter(function() {
			var indx = $(this).attr('index');

			if (obj.spanValue === $(this).text() && obj.index == indx) {

				prop = obj.style[0];
				var divId = objThis.getDivId($(this).attr('id'));

				switch(prop) {
					case IdentifierConstants.CONSTANTS.HIGHLIGHTER:
						$(this).css("color", objThis.objColorVal);
						$(this).attr("isclicked", "true");
						$(divId).removeClass("inCorrectResponse").addClass('correctResponse');
						break;
					case IdentifierConstants.CONSTANTS.UNDERLINE:
						$(this).css("text-decoration", "underline");
						$(this).attr("isclicked", "true");
						$(divId).removeClass("inCorrectResponse").addClass('correctResponse');
						break;
				}

			}
		});
	};
	Identifier.prototype.yourAnswer = function() {
		this.removeAllSelectedStyle();
		this.setUserActions();
		this.computeAction();
	};
	Identifier.prototype.setUserActions = function() {
		var i = 0, prop, spanId;
		while (i < userActions.length) {
			prop = userActions[i].style;
			spanId = "#" + userActions[i].domId;
			$(spanId).attr("isclicked", "true");
			switch(prop) {
				case IdentifierConstants.CONSTANTS.HIGHLIGHTER:
					$(spanId).css("color", this.objColorVal);
					break;
				case IdentifierConstants.CONSTANTS.UNDERLINE:
					$(spanId).css("text-decoration", "underline");
					break;
			}
			i++;
		}
	};
	Identifier.prototype.computeAction = function() {
		// set correct or incorrect logo..
		//if (userActions.length > 0) {
			var i = 0, j = 0, divId, flag;
			while (i < userActions.length) {
				divId = this.getDivId(userActions[i].domId);
				flag = this.search(this.correctAnswer, userActions[i]);
				if (flag) {
					$(divId).removeClass("inCorrectResponse").addClass("correctResponse");
				} else {
					$(divId).removeClass("correctResponse").addClass("inCorrectResponse");
				}

				i++;
			}
		/*} else {
			$("#identifierWrapper .logoCont").each(function() {
				$(this).removeClass("correctResponse").addClass("inCorrectResponse");
			});
		}*/

	};
	Identifier.prototype.getDivId = function(id) {
		var str = id, indx = str.indexOf("_") + 1, diff = str.length - indx, divId = "#logo_" + str.substr(indx, diff);
		return divId;
	};
	/*
	 * this will compute for score board.
	 * */
	Identifier.prototype.getResult = function() {
		var flag, i = 0, scoreArray = [], isFound;
		while (i < this.correctAnswer.length) {
			if (this.correctAnswer.length == userActions.length) {
				isFound = this.search(userActions, this.correctAnswer[i]);
				if (isFound) {
					flag = true;
				} else {
					flag = false;
					break;
				}

			} else {
				flag = false;

			}

			i++;
		}
		scoreArray.push(flag);
		//consolelog(scoreArray, " scoreArray");
		return scoreArray;

	};
	Identifier.prototype.removeAllSelectedStyle = function() {

		$("#identifierWrapper span").attr("style", "");
		$("#identifierWrapper span").attr("isclicked", "false");
		var specificElement = $("#identifierWrapper .highlightercontainer div");
		specificElement.each(function(){
			if($(this).hasClass('logoCont'))
			{
				$(this).attr("class", "");
				$(this).attr("class", "logoCont");		
			}
		});
		
		//console.log('removeAllSelectedStyle');
		/*var i = 0, prop,spanId;
		 while (i < userActions.length) {
		 prop = userActions[i].style;
		 var str = userActions[i].domId;
		 var indx = str.indexOf("_")+1;
		 var diff = str.length - indx;
		 var divId = "#logo_"+str.substr(indx,diff);

		 switch(prop) {
		 case IdentifierConstants.CONSTANTS.HIGHLIGHTER:
		 spanId = "#"+userActions[i].domId;
		 $(spanId).css("color", "#000000");
		 $(divId).attr("class","logoCont");
		 break;
		 case IdentifierConstants.CONSTANTS.UNDERLINE:
		 spanId = "#"+userActions[i].domId;
		 $(spanId).css("text-decoration", "none");
		 $(divId).attr("class","logoCont");
		 break;
		 }

		 i++;
		 }*/
	};
	/**
	 * This function is used to disable the slider so that the slider cannot be dragged
	 * @memberof Identifier#
	 * @access public
	 * @param None
	 * @returns None
	 */
	Identifier.prototype.disableIdentifier = function() {
		$(this.objSpan).addClass("disableItem");
		//$(this.objSpan).off("mousedown", this, this.mouseInteractionOnSpan);
		//$(this.objSpan).off("mouseup", this, this.mouseInteractionOnSpan);
	};

	/**
	 * This function flushes the data
	 * @memberof Identifier
	 * @access private
	 * @param None
	 * @returns None
	 */
	Identifier.prototype.flush = function() {

		this.model.id = null;
		this.model.destroy();
		this.model = null;
	};

	/**
	 * This functions destroys the component
	 * @memberof Identifier#
	 * @access public
	 * @param None
	 * @returns {Boolean} True or false
	 */
	Identifier.prototype.destroy = function() {
		//console.log('destroyyyyyy',userActions);
		/*this.objThumbMin = null;
		 this.objSlidingBar = null;
		 this.objBackground = null;
		 this.objBoundingBox = null;
		 this.padding = 0;

		 this.flush();
		 this.unbind();
		 this.undelegateEvents();*/
		punctuationArray=[];
		this.flush();
		userActions = [];
		this.content = null;
		this.objProperty = null;
		this.compData = null;
		this.objContainer = null;
		this.objSpan = null;
		this.objColorVal = "#000000";
		this.correctAnswer = null;
		//consolelog('after destroyyyyyy',userActions);
		this.close();

		return this.Super.prototype.destroy(true);
	};
	/*
	 * Took question text,options (i.e style etc.) as parameter and render
	 * Selection handler
	 * Model will be updated
	 * Rese,Check Answer,Correct Answer,Your Answer will be handled here..
	 *
	 * */

	return Identifier;
});
