/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * MatchingBox
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['marionette', 'player/screen/screen-helper', 'components/case/case'], function(Marionette, ScreenHelper, Case) {'use strict';
	var MatchingBox;

	MatchingBox = Case.extend({
		objData : null,
		objMatchingChild : null,
		clickCounter : 0,
		newCanvas : null,
		child_dict : null,
		answer_dict : {},
		feedback : null,
		colAObject : undefined,
		colBObject : undefined,
		lineVar : false,
		hintComp : null,
		get_state_obj : null,
		scaleValue : 1,
		arrCanvasLine : [],
		objTimer : null,
		nTotalCount : 0,
		template : _.template(''),

		initialize : function(obj) {
			this.componentType = "matching";
			this.scaleValue = 0.8;
			this.arrCanvasLine = [];
			this.answer_dict = {};
			this.child_dict = {};
			this.get_state_obj = {};
			this.objData = obj;
			this.newCanvas = null;
		},

		onRender : function() {
			var self = this;
			if (this.objData.styleClass !== undefined) {
				$(this.$el).addClass(this.objData.styleClass);
			}

			this.newCanvas = $('<canvas/>').css({
				'border' : '1px solid transparent',
				'position' : 'absolute',
				'top' : '0px',
				'left' : '0px'
			});

			if (this.bEditor === false) {
				this.$el.append(this.newCanvas);
			}

			$(window).resize(function() {
				var state = self.getState();
				self.onPlayerResizeEvent();
				self.setState(state);
			});

		},

		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		},

		onPlayerResizeEvent : function() {
			this.newCanvas.attr('width', this.$el.outerWidth()).attr('height', this.$el.outerHeight());
		},

		/**
		 * This method is responsible to check that given component type will be added in its dom
		 * @param {Object} strCompType
		 * @return {Boolean}
		 * @access private
		 * @memberof Case#
		 */
		isValid : function(strCompType) {
			var validComponent = false;
			validComponent = (strCompType === "matchingChild" || strCompType === "case" || strCompType === "feedback" || strCompType === "label" || strCompType === "hint");
			return validComponent;
		},

		/**
		 * This method add the supported child component in it
		 * @param {Object} strCompType
		 * @return {Boolean}
		 * @access private
		 * @memberof Case#
		 */
		addChild : function(objChild) {
			var childComp = objChild.component, objClassRef = this;
			if (childComp.componentType === "matchingChild") {
				this.child_dict[childComp.getID()] = childComp;
				this.objMatchingChild = childComp;
				childComp.$el.on('click', objClassRef, this.handleChildClick);
				this.nTotalCount = this.nTotalCount + 1;
			} else if (childComp.componentType === "feedback") {
				this.feedback = childComp;
			} else if (childComp.componentType === "hint") {
				this.hintComp = childComp;
			}

			this.MatchingBoxSuper.prototype.addChild.call(this, objChild);
		},

		/**
		 * This method handle the click event on the child component
		 * @param {Object} strCompType
		 * @return {Boolean}
		 * @access private
		 * @memberof Case#
		 */
		handleChildClick : function(objEvent) {
			objEvent.data.onOptionClicked(objEvent);
		}
	});

	MatchingBox.prototype.DISABLED_STATE = "disableState";
	MatchingBox.prototype.ENABLED_STATE = "enableState";
	MatchingBox.prototype.GET_STATE_EVENT = "getStateEvent";
	MatchingBox.prototype.SET_STATE_EVENT = "setStateEvent";
	MatchingBox.prototype.RESET_STATE_EVENT = "resetStateEvent";
	MatchingBox.prototype.CHECK_ANSWER = "checkAnswerEvent";
	MatchingBox.prototype.SHOW_ANSWER = "showAnswerEvent";
	MatchingBox.prototype.PAIR_EVENT = "onPairEvent";
	MatchingBox.prototype.ALL_CHILD_PAIRD_EVENT = "onAllChildPairedEvent";

	/**
	 * on clicking the child component it sets the category A and category B elements
	 * check the line to be drawn already exist or not
	 * call the function for drawing the line on the canvas
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof Case#
	 */
	MatchingBox.prototype.onOptionClicked = function(objEvent) {
		var strCompId = objEvent.currentTarget.id, objDataToSend = {}, tempArr, nCount = 0;
		this.prepareDataForLines(strCompId);
		objDataToSend.allChild = this.child_dict;
		objDataToSend.paired = this.answer_dict;
		_.filter(this.answer_dict, function(obj, key) {
			nCount = nCount + 1;
		});
		this.customEventDispatcher(this.ALL_CHILD_PAIRD_EVENT, this, (nCount === this.nTotalCount));
		this.customEventDispatcher(this.PAIR_EVENT, this, objDataToSend);

	};

	MatchingBox.prototype.removeReferences = function(strCompId) {
		var tempArr, tempArr2;
		if (this.answer_dict[strCompId] !== undefined) {
			tempArr = this.answer_dict[strCompId].split("_##_");
			delete this.answer_dict[tempArr[0]];
			if (this.answer_dict[tempArr[1]] !== undefined) {
				tempArr2 = this.answer_dict[tempArr[1]].split("_##_");
				delete this.answer_dict[tempArr2[0]];
				delete this.answer_dict[tempArr2[1]];
			}
			delete this.answer_dict[tempArr[1]];
		}
	};
	/**
	 * It will prepare the data for line to be drawn
	 * call the function for drawing the line on the canvas
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof Case#
	 */
	MatchingBox.prototype.prepareDataForLines = function(strCompId) {
		var canvasID, c, ctx, bLineDrawn, strStoreId, objCanvasRef, tempArr;
		if (this.child_dict[strCompId].options.category === "question") {
			this.colAObject = this.child_dict[strCompId];
		} else {
			this.colBObject = this.child_dict[strCompId];
		}

		this.lineVar = this.removeLines(this.colAObject, this.colBObject);

		if (this.lineVar) {
			objCanvasRef = $('canvas', this.$el);
			canvasID = objCanvasRef.attr('id');
			c = document.getElementById(canvasID);
			ctx = c.getContext("2d");
			ctx.scale(1, 1);
			ctx.clearRect(0, 0, $(this.$el).width(), $(this.$el).height());
		}

		if (this.bEditor === false) {
			bLineDrawn = this.drawLine(this.colAObject, this.colBObject);
		}

		if (bLineDrawn === true) {

			this.removeReferences(this.colAObject.getID());
			this.removeReferences(this.colBObject.getID());
			strStoreId = this.colAObject.getID() + "_##_" + this.colBObject.getID();
			this.answer_dict[this.colAObject.getID()] = strStoreId;
			this.answer_dict[this.colBObject.getID()] = strStoreId;
			this.colAObject = undefined;
			this.colBObject = undefined;
		}
	};

	/**
	 *Invoked when ready to use.
	 */
	MatchingBox.prototype.onUpdateComplete = function() {
		this.newCanvas.attr('width', this.$el.outerWidth()).attr('height', this.$el.outerHeight());
	};

	/**
	 * This method used to display the correct output on canvas
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof Case#
	 */
	MatchingBox.prototype.showAnswer = function() {
		var objClassRef = this, childObj, showAnswerObj = {};
		_.filter(this.child_dict, function(obj, key) {
			showAnswerObj[obj.options.answer] = (showAnswerObj[obj.options.answer] === undefined) ? [] : showAnswerObj[obj.options.answer];
			showAnswerObj[obj.options.answer].push(key);
		});

		_.filter(showAnswerObj, function(arrPair, key) {
			objClassRef.prepareDataForLines(arrPair[0]);
			objClassRef.prepareDataForLines(arrPair[1]);
		});

		this.customEventDispatcher(this.SHOW_ANSWER, this, this);

	};

	/**
	 * It removes the line previously existing line on the same element to be clicked
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof Case#
	 */
	MatchingBox.prototype.removeLines = function(objCol1, objCol2) {
		var strColAId, strColBId, bResult = false;
		if (objCol1 !== undefined && objCol2 !== undefined) {
			strColAId = objCol1.getID();
			strColBId = objCol2.getID();
			if (this.answer_dict[strColBId]) {
				this.child_dict[strColBId].options.flag = '0';
				bResult = true;

			} else if (this.answer_dict[strColAId]) {
				this.child_dict[strColAId].options.flag = '0';
				bResult = true;
			}
		}
		return bResult;
	};

	/**
	 * This function used to draw the line between the child element on the canvas
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof Case#
	 */
	MatchingBox.prototype.drawLine = function(objCol1, objCol2) {
		var canvasID, c, ctx, startX, startY, endX, endY, objCanvasRef, self = this, canvasObj, j;
		//this.scaleValue = 0.7;
		if (objCol1 !== undefined && objCol2 !== undefined) {
			objCanvasRef = $('canvas', this.$el);
			
			startX = (objCol1.$el.position().left / this.getStageScaleValue() + objCol1.$el.outerWidth());
			startY = (objCol1.$el.position().top / this.getStageScaleValue() + objCol1.$el.outerHeight() / 2);
			endX = (objCol2.$el.position().left / this.getStageScaleValue());
			endY = (objCol2.$el.position().top / this.getStageScaleValue() + objCol2.$el.outerHeight() / 2);

			startX = startX - Number(this.objData.leftCoordinate);
			startY = startY + Number(this.objData.topCoordinate);
			endX = endX + Number(this.objData.rightCoordinate);
			endY = endY + Number(this.objData.topCoordinate);
			
			console.log("********coordinate*********",startX,startY,endX,endY)
			
			canvasID = objCanvasRef.attr('id');
			c = document.getElementById(canvasID);
			ctx = c.getContext("2d");
			ctx.beginPath();

			$(this.arrCanvasLine).each(function(i, cur) {
				if ($(objCol1.$el).attr('id') === cur.targetA) {
					self.arrCanvasLine.splice(i, 1);
				}
			});

			$(this.arrCanvasLine).each(function(k, cur) {
				if ($(objCol2.$el).attr('id') === cur.targetB) {
					self.arrCanvasLine.splice(k, 1);
				}
			});

			canvasObj = {
				'moveToX' : startX,
				'moveToY' : startY,
				'lineToX' : endX,
				'lineToY' : endY,
				'targetA' : $(objCol1.$el).attr('id'),
				'targetB' : $(objCol2.$el).attr('id')
			};

			this.arrCanvasLine.push(canvasObj);
			for ( j = 0; j < self.arrCanvasLine.length; j++) {
				ctx.clearRect(0, 0, $(this.$el).width(), $(this.$el).height());
				ctx.moveTo(self.arrCanvasLine[j].moveToX, self.arrCanvasLine[j].moveToY);
				ctx.lineTo(self.arrCanvasLine[j].lineToX, self.arrCanvasLine[j].lineToY);
				ctx.strokeStyle = this.objData.lineColor;
				ctx.lineWidth = (this.objData.lineWidth);
				ctx.stroke();
			}

			return true;
		}
		return false;

	};

	/**
	 * This function check the answer of the matching and returns the result
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof Case#
	 */
	MatchingBox.prototype.checkAnswer = function() {
		var objClassRef = this, childDict, isCorrect, supeFlag = 1, prop;
		_.filter(this.answer_dict, function(obj, key) {
			if (isCorrect !== false) {
				isCorrect = (objClassRef.child_dict[obj.split("_##_")[0]].options.answer === objClassRef.child_dict[obj.split("_##_")[1]].options.answer);
			}
		});
		if (objClassRef.feedback !== null) {
			objClassRef.feedback.showFeedback(isCorrect);
		}
		this.customEventDispatcher(this.CHECK_ANSWER, this, isCorrect);
		return isCorrect;
	};

	/**
	 * This function get the current state of the component
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof Case#
	 */
	MatchingBox.prototype.getState = function() {
		var getStateVar = JSON.parse(JSON.stringify(this.answer_dict));
		this.customEventDispatcher(this.GET_STATE_EVENT, this, getStateVar);
		return getStateVar;
	};

	/**
	 * This function set the get state of the component
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof Case#
	 */
	MatchingBox.prototype.setState = function(objSetState) {
		var self = this, colALObject, colBLObject;
		if (this.bEditor === false) {
			this.reset();
			this.answer_dict = JSON.parse(JSON.stringify(objSetState));
			_.filter(this.answer_dict, function(obj, key) {
				colALObject = self.child_dict[obj.split("_##_")[0]];
				colBLObject = self.child_dict[obj.split("_##_")[1]];
				self.drawLine(colALObject, colBLObject);
			});
			this.customEventDispatcher(this.SET_STATE_EVENT, this, this);
		}
	};

	/**
	 * This function reset the component and its value
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof Case#
	 */
	MatchingBox.prototype.reset = function() {
		var canvasID, objCanvasRefreset, c, ctx, self = this;
		objCanvasRefreset = $('canvas', this.$el);
		canvasID = objCanvasRefreset.attr('id');
		c = document.getElementById(canvasID);
		ctx = c.getContext("2d");
		ctx.clearRect(0, 0, $(this.$el).width(), $(this.$el).height());
		this.answer_dict = {};
		this.arrCanvasLine = [];
		this.customEventDispatcher(this.RESET_STATE_EVENT, this, this);
	};

	/**
	 * This function set the scaling value
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof Case#
	 */
	MatchingBox.prototype.setStageScaleValue = function(obj) {
		this.scaleValue = obj;
	};

	/**
	 * This function disable the component
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof Case#
	 */
	MatchingBox.prototype.disable = function() {
		this.$el.css('pointer-events', 'none');
		this.customEventDispatcher(this.DISABLED_STATE, this, this);
	};

	/**
	 * This function enable the component
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof Case#
	 */
	MatchingBox.prototype.enable = function() {
		this.$el.css('pointer-events', '');
		this.customEventDispatcher(this.ENABLED_STATE, this, this);
	};

	MatchingBox.prototype.MatchingBoxSuper = Case;

	MatchingBox.prototype.destroy = function() {
		this.answer_dict.length = 0;
		this.child_dict.length = 0;
		this.arrCanvasLine.length = 0;
		return this.MatchingBoxSuper.prototype.destroy.call(this, true);
	};

	return MatchingBox;
});
