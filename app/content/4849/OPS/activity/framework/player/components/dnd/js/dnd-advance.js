/**
 * DndAdvance
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * Here is the full license text and copyright
 * notice for this file. Note that the notice can span several
 * lines and is only terminated by the closing star and slash.
 * @copyright (c) 2013 Magic Software
 */

/*jslint nomen: true*/
/*globals _*/
define(['marionette', 'player/base/base-layout-comp', 'components/dnd/js/dnd-helper-advance', 'text!components/dnd/dnd.html', 'css!components/dnd/css/dnd.css', 'jqueryTouchPunch'], function(Marionette, BaseLayoutComp, DnDHelper, dndTemplate) {'use strict';
	/**
	 * Intializes DnD.
	 * @class DnD
	 * @param {JSON} xml This is param
	 * @augments BaseLayoutComp
	 * @example
	 * <a href="xml/Dnd.xml" target="blank">Sample xml</a>.
	 * Load xml of above format and pass it to the constructor like:
	 * new DnD(objXml);
	 */
	var DnD = BaseLayoutComp.extend({
		template : _.template(dndTemplate),
		//Private variables
		/**
		 * Initializes the component with the values passed in the constructor.
		 * @memberof DnD
		 * @access private
		 */
		initialize : function(objQuesData) {
			this.itemViewContainer = ("#dndHolder");
			this.members = {
				questionData : undefined,
				dragList : undefined,
				droptList : undefined
			};
			if(objQuesData.hasOwnProperty("draggableItem") && objQuesData.hasOwnProperty("droppableItem")){
				this.members.questionData = objQuesData;	
			}
			
			if (objQuesData !== undefined && objQuesData.updatedScale!== undefined) {
				this.setStageScaleValue(objQuesData.updatedScale);
			}
		},

		/**
		 * This gets called when component is rendered.
		 * @memberof DnD
		 * @access private
		 */
		onRender : function() {
			var objThis = this;
			if(this.members.questionData!== undefined){
				this.members.objDnDHelper = new DnDHelper(this);
				this.processQuestionData(this.members.questionData);	
			}
		},
		onShow : function() {
			var self = this;
			this.$el.on("click", $.proxy(self.compClick, self));
			this.$el.on("mouseover", $.proxy(self.compRollover, self));
			this.$el.on("mouseout", $.proxy(self.compRollout, self));
			if(this.members.objDnDHelper){
				this.members.objDnDHelper.handleScaling();	
			}
		},
		onPlayerResizeEvent : function() {
			if(this.members){
				if(this.members.objDnDHelper){
					this.members.objDnDHelper.handleScaling();
				}
			}
		}
	});

	DnD.prototype.__super__ = BaseLayoutComp;

	/**
	 * This is an event which gets triggered when drag start is occured.
	 * This contains the data {dragItem,dropItem,isCorrect,left,top}
	 * dragItem : Item which is being dragged.
	 * dropItem : Item on which draggable is dropped. (undefined in this case.).
	 * isCorrect : true If correctlt dropped. false Otherwise. (false in this case.).
	 * left: left offset of draggable.
	 * top: top offset of draggable.
	 * @memberof DnD
	 */
	DnD.prototype.DND_ITEM_DRAG_START_EVENT = "dndItemDragStartEvent";

	/**
	 * This is an event which gets triggered on dragging.
	 * This contains the data {dragItem,dropItem,isCorrect,left,top}
	 * dragItem : Item which is being dragged.
	 * dropItem : Item on which draggable is dropped. (undefined in this case.).
	 * isCorrect : true If correctlt dropped. false Otherwise. (false in this case.).
	 * left: left offset of draggable.
	 * top: top offset of draggable.
	 * @memberof DnD
	 */
	DnD.prototype.DND_ITEM_DRAG_MOVE_EVENT = "dndItemDragMoveEvent";

	/**
	 * This is an event which gets triggered when draggable is dropped.
	 * This contains the data {dragItem,dropItem,isCorrect,left,top}
	 * dragItem : Item which is being dragged.
	 * dropItem : Item on which draggable is dropped. (undefined if not dropped at droppable.).
	 * isCorrect : true If correctlt dropped. false Otherwise.
	 * left: left offset of draggable.
	 * top: top offset of draggable.
	 * @memberof DnD
	 */
	DnD.prototype.DND_ITEM_DROP_EVENT = "dndItemDropEvent";

	/**
	 * This is an event which gets triggered when draggable is stopped while being dragged.
	 * This contains the data {dragItem,dropItem,isCorrect,left,top}
	 * dragItem : Item which is being dragged.
	 * dropItem : Item on which draggable is dropped. (undefined in this case.).
	 * isCorrect : true If correctlt dropped. false Otherwise. (false in this case.).
	 * left: left offset of draggable.
	 * top: top offset of draggable.
	 * @memberof DnD
	 */

	DnD.prototype.DND_ITEM_DRAG_STOP_EVENT = "dndItemDragStopEvent";

	/**
	 * This sets the theme for the component and sets the argumemts passed through xml to use further.
	 * @memberof DnD
	 * @access private
	 */
	DnD.prototype.processQuestionData = function(qData) {
		this.members.questionData = qData;
		this.$el.removeClass();
		this.$el.addClass(qData.theme);
		this.processDnD();
		this.members.objDnDHelper.handleScaling();
	};
	
	/**
	 * This sets the theme for the component and sets the argumemts passed through xml to use further.
	 * @memberof DnD
	 * @access public
	 */
	DnD.prototype.setQuestionData = function(qData) {
		this.members.questionData = qData;
		this.render();
	};
	
	/**
	 * This processess argumemts passed through xml to use further.
	 * @memberof DnD
	 * @access private
	 */
	DnD.prototype.processDnD = function() {
		var objHelper, m = this.members;
		objHelper = m.objDnDHelper;
		objHelper.setContainment(m.questionData.containment);
		objHelper.revertToPosition(m.questionData.revert);
		objHelper.revertToOriginalPosition(m.questionData.revertToOriginalPosition);
		m.dragList = m.questionData.draggableItem.option;
		m.droptList = m.questionData.droppableItem.option;
		objHelper.dndType(m.questionData.type);
		objHelper.dropCopy(m.questionData.dropCopy);
		objHelper.dragCopy(m.questionData.dragCopy);
		objHelper.multiAccept(m.questionData.multiAccept);
		objHelper.acceptCorrectOnly(m.questionData.onlyCorrect);
		objHelper.replaceExisting(m.questionData.replace);

		m.objDnDHelper.CreateDraggble(this.verifyData(m.dragList), this.$el);
		m.objDnDHelper.CreateDroppable(this.verifyData(m.droptList), this.$el);

	};

	/**
	 * This verifies argumemts passed through xml to be sure if they are not currupt.
	 * @memberof DnD
	 * @param {JSON} objData
	 * @access private
	 */
	DnD.prototype.verifyData = function(objData) {
		if (objData !== undefined && objData.length === undefined) {
			var arrData = [];
			arrData.push(objData);
			return arrData;
		}
		return objData;
	};

	/**
	 * This resets the passed element to its initial position and kills their attachments if any.
	 * @memberof DnD
	 * @param {HTML} el The element which is passed.
	 * @returns none
	 */
	DnD.prototype.reset = function(el) {
		this.members.objDnDHelper.resetItem(el);
	};
	/**
	 * This resets the all elements to their initial position and kills their attachments if any.
	 * @memberof DnD
	 * @param none
	 * @returns none
	 */
	DnD.prototype.resetAll = function() {
		this.members.objDnDHelper.resetAll();
	};

	/**
	 * This function confirms that all draggable are dropped on correct droppables.
	 * @memberof DnD
	 * @param none
	 * @returns {Object} lists of incorrect and correct dragable ids.
	 */
	DnD.prototype.showAnswer = function() {
		return this.members.objDnDHelper.showAnswer();
	};

	/**
	 * This function disables the passed draggable element.
	 * @memberof DnD
	 * @param {HTML} el The draggable element to be freezed.
	 * @returns none.
	 */
	DnD.prototype.freezOption = function(option) {
		this.members.objDnDHelper.freezOption(option);
	};

	/**
	 * This function enables the passed draggable element.
	 * @memberof DnD
	 * @param {HTML} el The draggable element to be unfreezed.
	 * @returns none.
	 */
	DnD.prototype.unfreezOption = function(option) {
		this.members.objDnDHelper.unfreezOption(option);
	};

	/**
	 * This function removes the dragging feature from the passed draggable element.
	 * @memberof DnD
	 * @param {HTML} el The draggable element.
	 * @returns none.
	 */
	DnD.prototype.removeDragFeatureFromOption = function(option) {
		//console.log("option received....", option);
		this.members.objDnDHelper.removeDragFeatureFromOption(option);
	};
	/**
	 * This function dispatches the DND events.
	 * @memberof DnD
	 * @access private
	 */
	DnD.prototype.dispatchDnDEvent = function(strEvent, data) {
		this.customEventDispatcher(strEvent, this, data);
	};

	/**
	 * To override the xml value for correctOnly.
	 * @param {BOOL} bdata The boolean value.
	 * @memberof DnD
	 */
	DnD.prototype.acceptCorrectOnly = function(bdata) {
		this.members.objDnDHelper(bdata);
	};

	/**
	 * To override the xml value for correctFor.
	 * @param {String} strId Id of droppable.
	 * @param {String} strOrder Comma seperated id's for draggables.
	 * @memberof DnD
	 */
	DnD.prototype.changeCorrectFor = function(strId, strOrder) {
		this.members.objDnDHelper.changeCorrectFor(strId, strOrder);
	};

	/**
	 * This function destroys the component.
	 * @memberof DnD
	 * @param none.
	 * @returns none.
	 */
	DnD.prototype.destroy = function() {
		this.$el.off("click");
		this.$el.off("mouseover");
		this.$el.off("mouseout");
		this.members.objDnDHelper.destroy();
		this.members.objDnDHelper = undefined;
		this.members.questionData = {};
		this.itemViewContainer = undefined;
		this.$el.remove();
		delete this.members;
		return this.__super__.prototype.destroy(true);
	};

	return DnD;

});
