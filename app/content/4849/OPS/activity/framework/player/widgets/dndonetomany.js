/*jslint nomen:true*/
/*global console,_,$, jQuery*/
/**
 * dndonetomany
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */

(function($) {
	$.widget("Template.DND_OTM", $.Template.DND, {
		/**
		 * @class Template.DND_OTM
		 *
		 * Widget 'DND_OTM' is introduced to empower to user to create DnD activity with the minimum effort.
		 *
		 * By using this wiget a 'DnD'  with 'one to many' feature can be created by providing data in JSON and HTML file.
		 *
		 *
		 * "components": [
		 {
		 "id": "widget_1",
		 "type": "widget",
		 "parentId": "#dndWidgetHolder",//parent where we need to add.

		 "data": {
		 "type": "dndonetomany",
		 "templateId": "dndWidgetOneToMany",//a script template id (in HTML file)
		 "widgetName": "DND_OTM", //this attribute must be set in under 'type' category of root div e.g 'type' = 'DND_OTM'
		 "dep": ["dndonetoone"],//do not change.

		 "widgetData": {
		 "align": "vertical",
		 "correctList": {
		 "drop1": ["drag1", "drag2"],
		 "drop2": ["drag3", "drag4"]
		 },
		 "groupMatch": true,//set false if want to verify in ascending or descendign order.
		 "containment": "#mActivity"
		 }
		 },

		 "events": [
		 {
		 "onDrop": [
		 {
		 "target": "helper",
		 "method": "handleWidgetEvent"
		 }
		 ]
		 }
		 ]
		 }
		 ]

		 HTML Structure Sample:

		 <script type="text/template" id="dndWidgetOneToMany">
		 <div id="rootContainerDiv" class="dndRootDiv" type="DND_OTM">
		 <div class="parentDivClassName">
		 <div id="drag1" type="draggable" class="draggableItem pos1">Drag 1</div>
		 <div id="drag2" type="draggable" class="draggableItem pos2">Drag 2</div>
		 <div id="drag3" type="draggable" class="draggableItem pos3">Drag 3</div>
		 <div id="drag4" type="draggable" class="draggableItem pos4">Drag 4</div>

		 <div id="drop1" type="droppable" class="droppableItem pos1">Drop 1</div>
		 <div id="drop2" type="droppable" class="droppableItem drop2Pos">Drop 2</div>

		 </div>
		 </div>

		 </script>

		 * This widget also can be used from a js file also by using 'getComponent' API.
		 *
		 * @see 'DnDOnetoOne' widget to get the details of avaiable API and event list.
		 */
		_init : function() {
			this._super();
			this.options.functionList = ["resetDnd", "enableOption", "resetOption", "disableOption", "unfreezeDnd", "freezeDnd", "checkAnswer", "showAnswer", "getElementPostion"];
			this.dndData.type = this.constants.ONE_TO_MANY;
			this.resetDnd();

		},
		handleOneToMany : function(objEvent, ui) {
			var arrDropItemList = [], dragId, dropId;
			if (this.dndData.containerDiv === undefined)// || this.dndData.objPosition[this.dndData.containerDiv.attr("id")].droppedItem !== undefined || this.dndData.bRevert === undefined || this.dndData.bRevert === true)
			{
				$(ui.helper).css("left", this.dndData.objPosition[$(ui.helper).attr("id")].left);
				$(ui.helper).css("top", this.dndData.objPosition[$(ui.helper).attr("id")].top);
			} else {

				dragId = this.dndData.targetDiv.attr("id");
				dropId = this.dndData.containerDiv.attr("id");

				if (this.dndData.dragItemPosList[dropId] === undefined) {
					this.dndData.dragItemPosList[dropId] = [];
				}

				arrDropItemList = this.dndData.dragItemPosList[dropId];
				arrDropItemList.push(dragId);

				this.dndData.objPosition[this.dndData.targetDiv.attr("id")].dropAt = this.dndData.containerDiv;
				this.dndData.objPosition[this.dndData.containerDiv.attr("id")].droppedItem = this.dndData.targetDiv;
				this.arrangeDragItemPosition(arrDropItemList, this.dndData.containerDiv);
				this.dndData.targetDiv = undefined;
				this.dndData.containerDiv = undefined;
			}
		},

		/**
		 * Method 'arrangeDragItemPosition' introduced to manage the position of dropped item, this
		 * funciton arrange the element horizontally or vertically based on the requirement set by the user.
		 *
		 * @param {Object} arrDragItem Draggable item
		 * @param {Object} container Drag item holder
		 * @return none
		 * @access private
		 */
		arrangeDragItemPosition : function(arrDragItem, container) {
			var i = 0, posx = 0, posy = 0, GAP = 2, target, w, h;

			posx = parseFloat($(container).css("left"));
			posy = parseFloat($(container).css("top"));
			for ( i = 0; i < arrDragItem.length; i = i + 1) {
				targetDiv = $("#" + arrDragItem[i], this.options.parentDiv);
				targetDiv.css("position", "absolute");
				if (this.options.widgetData.align === this.constants.VERTICAL_ALIGN || this.options.widgetData.align === undefined) {
					if ((posy + targetDiv.height()) > ($(container).height() + parseFloat($(container).css("top")))) {
						posx = parseFloat($(container).css("left")) + targetDiv.width();
						posy = parseFloat($(container).css("top"));
					}
				} else {
					if ((posx + targetDiv.width()) > $(container).width() + parseFloat($(container).css("left"))) {
						posx = parseFloat($(container).css("left"));
						posy = parseFloat($(container).css("top")) + targetDiv.height();
					}
				}

				targetDiv.css("left", posx + "px");
				targetDiv.css("top", posy + "px");

				if (this.options.widgetData.align === this.constants.VERTICAL_ALIGN || this.options.widgetData.align === undefined) {
					posx = posx;
					posy = posy + targetDiv.height();
				} else {
					posx = posx + targetDiv.width();
					posy = posy;
				}
			}
		},

		/**
		 * 'rearrangeDroppedItem' method will be invoked when user start dragging element which
		 * is already dropped.
		 * This method is responsible to rearrange the positions of remaining elements in that drop
		 * area.
		 *
		 * @param {Object} dragId
		 * @param {Object} dropId
		 * @return none
		 * @access private
		 */
		rearrangeDroppedItem : function(dragId, dropId) {
			var arrDropItemList = [], nIndex;
			if (this.dndData.dragItemPosList[dropId] === undefined) {
				this.dndData.dragItemPosList[dropId] = [];
			}

			arrDropItemList = this.dndData.dragItemPosList[dropId];
			nIndex = arrDropItemList.indexOf(dragId);
			if (nIndex > -1) {
				arrDropItemList.splice(nIndex, 1);
			}
			this.arrangeDragItemPosition(arrDropItemList, $("#" + dropId, this.options.parentDiv));
		},

		/**
		 * This method will invoked when user call 'checkAnswer' method which is the
		 * member of its base class 'dndOneToOne'.
		 *
		 * verify and dispatch 'ON_ANSWER_CHECKED' event with the result object
		 * @param none
		 * @return none
		 * @acccess private
		 */
		checkAnswerInOneTwoMany : function() {
			var i, arrDropItemList, objclassRef = this, objAnswer = this.options.widgetData.correctList, isCorrect = true, arrCorrectList = [], arrIncorrectList = [], objData = {};

			if (this.options.widgetData.groupMatch === undefined || this.options.widgetData.groupMatch === false) {
				_.each(objAnswer, function(data, strKey) {
					arrDropItemList = objclassRef.dndData.dragItemPosList[strKey];
					if (arrDropItemList !== undefined) {
						if (arrDropItemList.length !== data.length) {
							isCorrect = false;
						}
						for ( i = 0; i < arrDropItemList.length; i = i + 1) {
							if (data[i] !== arrDropItemList[i]) {
								isCorrect = false;
								arrIncorrectList.push(arrDropItemList[i]);
							} else {
								arrCorrectList.push(arrDropItemList[i]);
							}
						}
					} else {
						isCorrect = false;
					}
				});
			} else {
				_.each(objAnswer, function(data, strKey) {
					arrDropItemList = objclassRef.dndData.dragItemPosList[strKey];
					if (arrDropItemList !== undefined) {
						if (arrDropItemList.length !== data.length) {
							isCorrect = false;
						}
						for ( i = 0; i < arrDropItemList.length; i = i + 1) {
							if (data.indexOf(arrDropItemList[i]) < 0) {
								isCorrect = false;
								arrIncorrectList.push(arrDropItemList[i]);
							} else {
								arrCorrectList.push(arrDropItemList[i]);
							}
						}
					} else {
						isCorrect = false;
					}
				});
			}

			objData.correctList = arrCorrectList;
			objData.incorrectList = arrIncorrectList;
			objData.isCorrect = isCorrect;

			this.dispatchEvent(this.constants.ON_ANSWER_CHECKED, {}, objData);
		},

		/**
		 * Responsible to show the correct order when invoked
		 * @param none
		 * @return none
		 * @access public
		 */
		showAnswer : function() {
			var container, objclassRef = this, objAnswer = this.options.widgetData.correctList;
			_.each(objAnswer, function(arrList, strKey) {
				container = $("#" + strKey, objclassRef.options.parentDiv);
				objclassRef.arrangeDragItemPosition(arrList, container);
			});
		},

		/**
		 * Reset the DND widget
		 * @param none
		 * @return none
		 * @access public
		 */
		resetDnd : function() {
			this._super();
			this.dndData.dragItemPosList = {};
		},
		destroy : function() {
			this._super();
		}
	});
})(jQuery);
