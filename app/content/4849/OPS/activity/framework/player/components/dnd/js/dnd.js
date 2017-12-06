/*jslint nomen: true*/
/*globals _*/
define(['marionette', 
	'player/base/base-layout-comp',
	'components/dnd/js/dnd-helper',
	'text!components/dnd/dnd.html',
	'css!components/dnd/css/dnd.css',
	 'jqueryTouchPunch'
	], function(Marionette, BaseCompositeComp, DnDHelper, dndTemplate) {
	'use strict';
	/**
	 * Intializes DnD.
	 * @constructor
	 * @requires player/base/BaseCompositeComp
	 * @augments BaseCompositeComp
	 */
	var DnDComp = /** @lends DnDComp.prototype */
	BaseCompositeComp.extend({
		template : _.template(dndTemplate),
		//Private variables
		initialize : function(objQuesData) {
			this.itemViewContainer = ("#dndHolder");
			this.members.questionData = objQuesData;
		},
		
		onRender:function()
		{
			this.members.objDnDHelper = new DnDHelper(this);
			this.setQuestionData(this.members.questionData);	
		}
	});
	DnDComp.prototype.__super__ = BaseCompositeComp;
	
	DnDComp.prototype.members = 
	{
		questionData:undefined,
		dragList:undefined,
		droptList:undefined
	};
	
	DnDComp.prototype.DND_ITEM_DRAG_START_EVENT = "dndItemDragStartEvent";
	DnDComp.prototype.DND_ITEM_DROP_EVENT = "dndItemDropEvent";
	DnDComp.prototype.DND_ITEM_DRAG_STOP_EVENT = "dndItemDragStopEvent";
	

	DnDComp.prototype.setQuestionData = function(qData)
	{
		this.members.questionData = qData;
		this.$el.removeClass();
		this.$el.addClass( qData.theme);
		this.processDnD();
	};
	
	DnDComp.prototype.processDnD = function()
	{
		var objHelper, m = this.members;
		objHelper = m.objDnDHelper;
		objHelper.cloneDrag(m.questionData.cloneDrag);
		objHelper.setContainment(m.questionData.containment);
		objHelper.revertToPosition(m.questionData.revert);
		m.dragList = m.questionData.draggableItem.option;
		m.droptList = m.questionData.droppableItem.option;
		objHelper.dndType(m.questionData.type);
		objHelper.dropCopy(m.questionData.dropCopy );
		m.objDnDHelper.CreateDraggble(this.verifyData( m.dragList), this.$el);
		m.objDnDHelper.CreateDroppable(this.verifyData( m.droptList), this.$el);
	};
	
	/**
	 * 
	 * @function verifyData convert a object in array.
	 * @memberof DnDComp
	 * @param {Object/Array} objData
	 * @return {Array} objData/arrData
	 */
	DnDComp.prototype.verifyData = function(objData)
	{
		if(objData !== undefined && objData.length === undefined)
		{
			var arrData = [];
			arrData.push(objData);
			return arrData;
		}
		return objData;
	};
	
	DnDComp.prototype.reset = function()
	{
		
	};
	
	DnDComp.prototype.showAnswer = function()
	{
		
	};
	
	DnDComp.prototype.freezOption = function(option)
	{
			//console.log("option received....", option);
			this.members.objDnDHelper.freezOption(option);
	};
	
	DnDComp.prototype.removeDragFeatureFromOption = function(option)
	{
			//console.log("option received....", option);
			this.members.objDnDHelper.removeDragFeatureFromOption(option);
	};
	
	
	
	DnDComp.prototype.dispatchDnDEvent = function(strEvent, data)
	{
		this.customEventDispatcher(strEvent, this, data);
	};
	
	DnDComp.prototype.destroy = function() {
		this.members.objDnDHelper.destroy();
		return this.__super__.destroy(true);
	};

	return DnDComp;

});
