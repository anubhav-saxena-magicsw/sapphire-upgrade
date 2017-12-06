/*jslint nomen: true*/
/*globals Backbone,_,$,console*/
define(['marionette', 'components/option/option', 'jqueryUI'], function(Marionette, Option) {"use strict";
	var DnDHelper = function(dndComp) {
		this.members.DND_COMP_REF = dndComp;
		this.members.dndElements = {};
		return _.extend(this, Backbone.Events);
	};

	DnDHelper.prototype.members = {
		DND_COMP_REF : undefined,
		dndType : undefined,
		bDropCopy : false,
		dndItemView : {},
		activeDroppable : undefined,
		activeDraggable : undefined,
		activeDraggableUI : undefined,
		revertToPosition : "invalid",
		dndElements : undefined,
		itemHolder : undefined,
		arrDragList : undefined,
		arrDropList : undefined,
		dragHelper : false,
		itemCounterDrag : 0,
		itemCounterDrop : 0,
		zIndexValue : 1,
		containment:undefined,
		click:{}

	};

	DnDHelper.prototype.ONE_TO_ONE = "oneToOne";
	DnDHelper.prototype.ONE_TO_Many = "oneToMany";
	DnDHelper.prototype.DND_INITLIZED = "dndInitlize";
	DnDHelper.prototype.DRAGGABLE = "draggable";
	DnDHelper.prototype.DROPPABLE = "droppable";

	DnDHelper.prototype.DND_ITEM_DRAG_START_EVENT = "dndItemDragStartEvent";
	DnDHelper.prototype.DND_ITEM_DROP_EVENT = "dndItemDropEvent";
	DnDHelper.prototype.DND_ITEM_DRAG_STOP_EVENT = "dndItemDragStopEvent";
	

	DnDHelper.prototype.cloneDrag = function(strDragClone) {
		this.members.dragHelper = (strDragClone === "true") ? true : false;
	};

	DnDHelper.prototype.dndType = function(strType) {
		this.members.dndType = strType;
	};

	DnDHelper.prototype.dropCopy = function(strDropCopy) {
		this.members.bDropCopy = (strDropCopy === "true" || strDropCopy === true) ? true : false;
	};

	DnDHelper.prototype.revertToPosition = function(strRevert) {
		this.members.revertToPosition = (strRevert === "true") ? true : (strRevert === "false") ? false : strRevert;
	};

	DnDHelper.prototype.CreateDraggble = function(dragItemList, region) {
		var i, m;
		m = this.members;
		m.arrDragList = dragItemList;
		for ( i = 0; i < m.arrDragList.length; i += 1) {
			this.createElements(region, m.arrDragList[i], "draggable");
		}
	};

	DnDHelper.prototype.CreateDroppable = function(dropItemList, region) {
		var i, m;
		m = this.members;
		m.arrDropList = dropItemList;
		for ( i = 0; i < m.arrDropList.length; i += 1) {
			this.createElements(region, m.arrDropList[i], "droppable");
		}
	};

	DnDHelper.prototype.createElements = function(region, data, strType) {
		var nCounter, strName, modelData, objOption;
		if (this.members.itemHolder === undefined) {
			this.members.itemHolder = region.find("#dndHolder");
		}

		//Getting model for dnd element(s)
		/*jslint plusplus: true*/
		nCounter = (strType === this.DRAGGABLE) ? this.members.itemCounterDrag++ : this.members.itemCounterDrop++;
		strName = strType + "_" + nCounter;
		modelData = this.getElementModel(data, strName);
		objOption = new Option();
		objOption.model = modelData;

		this.members.itemCounter++;
		objOption.setName(strName);
		objOption.render();

		objOption.$el.attr("id", data.id);
		objOption.$el.attr("type", strType);
		objOption.$el.attr("dataCID", objOption.cid);

		//appending dnd elements into the view.
		this.members.itemHolder.append(objOption.$el);
		this.members.dndElements[objOption.cid] = objOption;
		//preserve draggabel/droppable item for further action eg. finding correct answer
		if (strType === this.DRAGGABLE) {
			this.addDragEvent(objOption.$el);
		}//initlizing draggable item.
		if (strType === this.DROPPABLE) {
			this.addDropEvent(objOption.$el);
		}//initlizing droppable item
		this.members.dndItemView[strName] = objOption;
		objOption.$el.removeAttr('style');
		objOption.$el.addClass(strType + nCounter);
	};

	DnDHelper.prototype.getElementModel = function(data, parentCID) {
		// creating model for draggable and droppable item
		var ElementModel = Backbone.Model.extend({
			defaults : {
				parentCID : parentCID,
				id : data.id,
				correct : data.correct,
				label : data.label,
				type : data.type,
				img : '',
				position : undefined
			}
		});
		return new ElementModel();
	};

	DnDHelper.prototype.addDropEvent = function(dropTarget) {
		var objClassRef = this;
		dropTarget.droppable({
			drop : function(objEvent, ui) {
				objClassRef.handleDropEvent(objEvent, ui);
			}
		});
	};

	DnDHelper.prototype.addDragEvent = function(dragItem) {
		var objClassRef = this;
		$(dragItem).draggable({
			
			containment : "parent",
			
			revert : function(ref) {
				return objClassRef.handleDragRevert(ref);
			},
			start : function(objEvent, ui) {
				objClassRef.handleDragStart(objEvent, ui);
			},
			stop : function(objEvent, ui) {
				objClassRef.handleDragStop(objEvent, ui);
			},
			drag : function(objEvnt, ui) {
				objClassRef.handleDragItemMovement(objEvnt, ui);
			}
		});

		if (this.members.dragHelper) {
			$(dragItem).draggable({
				helper : "clone"
			});
		}
		
		if (this.containment !== undefined) {
			$(dragItem).draggable({
				containment : this.containment
			});
		}
		
		
	};

	DnDHelper.prototype.initlizeDraggable = function() {
		this.trigger(this, this.DND_INITLIZED, this);
	};

	//-------------------------------------------------//
	DnDHelper.prototype.handleDragStart = function(objEvent, ui) {
		var objClassRef, dragItem_cid, objDragData, objPosition, nUpdatedX,nUpdatedY,originalXY;
		objClassRef = this;
		this.members.click.x = objEvent.clientX;
		this.members.click.y = objEvent.clientY;
		/*jslint plusplus: true*/
		this.members.zIndexValue++;
		this.members.activeDraggable = objEvent.currentTarget;
		this.members.activeDraggableUI = ui;
		
		this.members.DND_COMP_REF.dispatchDnDEvent(this.DND_ITEM_DRAG_START_EVENT, this.getEventData());

		$(this.members.activeDraggable).css("z-index", this.members.zIndexValue);
		if (this.members.dragHelper) {
			this.members.zIndexValue++;
			ui.helper.css("z-index", this.members.zIndexValue);
		}

		$(this.members.activeDraggable).draggable({
			stack : $(objClassRef.members.itemHolder)
		});
		dragItem_cid = $(objEvent.target).attr("datacid");
		objDragData = this.members.dndElements[dragItem_cid];
		if (objDragData.model.get("position") === undefined) {
			objPosition = {};
			originalXY = ui.originalPosition;
			nUpdatedX = (objEvent.clientX - this.members.click.x + originalXY.left) / this.members.DND_COMP_REF.getStageScaleValue();
			nUpdatedY = (objEvent.clientY - this.members.click.y + originalXY.top ) / this.members.DND_COMP_REF.getStageScaleValue();
			objPosition.left = nUpdatedX;
			objPosition.top = nUpdatedY;
			objDragData.model.set("position", objPosition);
		}
	};

	DnDHelper.prototype.handleDragStop = function(objEvent, ui) {
		var m = this.members, objDropData;
		this.members.DND_COMP_REF.dispatchDnDEvent(this.DND_ITEM_DRAG_STOP_EVENT, this.getEventData());
	};

	DnDHelper.prototype.handleDragItemMovement = function(objEvent, ui) {
		var nUpdatedX,nUpdatedY,originalXY, boundX, boundY, boundW, boundH;
		originalXY = ui.originalPosition;
		nUpdatedX = (objEvent.clientX - this.members.click.x + originalXY.left) / this.members.DND_COMP_REF.getStageScaleValue();
		nUpdatedY = (objEvent.clientY - this.members.click.y + originalXY.top ) / this.members.DND_COMP_REF.getStageScaleValue();
		if (this.containment !== undefined) {
			boundX = $(this.containment).position().left;
			boundY = $(this.containment).position().top;
			boundW = boundX + $(this.containment).width() - $(this.members.activeDraggable).width();
			boundH = boundY + $(this.containment).height() - $(this.members.activeDraggable).height();

			if (nUpdatedX < boundX) {
				nUpdatedX = boundX;
			} else if (nUpdatedX > boundW) {
				nUpdatedX = boundW;
			}
			if (nUpdatedY < boundY) {
				nUpdatedY = boundY;
			} else if (nUpdatedY > boundH) {
				nUpdatedY = boundH;
			}
		}
		ui.position.left = nUpdatedX;
		ui.position.top = nUpdatedY;
	};

	DnDHelper.prototype.handleDropEvent = function(objEvent, ui) {
		if (this.members.bDropCopy === true && this.members.cloneDrag === true) {
			this.members.activeDroppable = objEvent.target;
		} else {
			this.members.activeDroppable = objEvent.target;
		}
		//console.log(this.members.activeDraggable, " :::: " , ui.helper + " ::: " +  this.members.bDropCopy);

		//objClassRef.verifyDroppedItem(objEvent, ui);
	};

	DnDHelper.prototype.verifyDroppedItem = function(objTarget) {
		var droppable_cid, objDropData, isFilled, drraggble_cid, objDragData, objModelData, m, tempModel;
		droppable_cid = $(objTarget).attr("datacid");
		objDropData = this.members.dndElements[droppable_cid];
		isFilled = objDropData.model.get("isFilled");
		if (isFilled === true && this.ONE_TO_ONE === this.members.dndType) {
			return true;
		}

		drraggble_cid = $(this.members.activeDraggable).attr("datacid");
		objDragData = this.members.dndElements[drraggble_cid];
		objModelData = objDragData.model;
		objDropData.model.set("dragItem_cid", drraggble_cid);
		objDropData.model.set("isCorrect", (objModelData.get("correct") === objDropData.model.get("id")));
		objDropData.model.set("isFilled", true);
		m = this.members;
		if (m.dragHelper !== true && m.bDropCopy !== true) {
			if (objModelData.get("droppedAt") !== undefined) {
				tempModel = this.getItemModel(objModelData.get("droppedAt"));
				tempModel.set("isFilled", false);
			}
		}

		objModelData.set("droppedAt", droppable_cid);
		return false;
	};

	DnDHelper.prototype.getItemModel = function(str_cid) {
		var objModelData, elementData;
		elementData = this.members.dndElements[str_cid];
		objModelData = elementData.model;
		return objModelData;
	};

	DnDHelper.prototype.handleCloneReturn = function(ref, dragItemRef) {
		$(dragItemRef).draggable("destroy");
		$(dragItemRef).remove();
		var model = this.getItemModel($(dragItemRef).attr("droppedcid"));
		model.set("isFilled", false);
	};

	DnDHelper.prototype.handleDragRevert = function(that) {
		var b, m, objClassRef, objData, objDropData;
		m = this.members;
		if (m.dragHelper === true && m.bDropCopy === true && m.activeDroppable !== undefined) {
			m.activeDraggable = $(m.activeDraggableUI.helper).clone();
			b = this.verifyDroppedItem(m.activeDroppable);
			if (b === false) {
				m.itemHolder.append(m.activeDraggable);
				$(m.activeDraggable).attr("droppedcid", $(m.activeDroppable).attr("datacid"));
				this.setElementInCenter(m.activeDraggable, m.activeDroppable);
				objClassRef = this;
				m.activeDraggable.draggable({
					start : function(objEvent){
						objClassRef.members.click.x = objEvent.clientX;
						objClassRef.members.click.y = objEvent.clientY;
					},
					revert : function(ref) {
						return objClassRef.handleCloneReturn(ref, this);
					},
					drag : function(objEvnt, ui) {
						var nUpdatedX,nUpdatedY,originalXY;
						originalXY = ui.originalPosition;
						nUpdatedX = (objEvnt.clientX - objClassRef.members.click.x + originalXY.left) / objClassRef.members.DND_COMP_REF.getStageScaleValue();
						nUpdatedY = (objEvnt.clientY - objClassRef.members.click.y + originalXY.top ) / objClassRef.members.DND_COMP_REF.getStageScaleValue();
						ui.position.left = nUpdatedX;
						ui.position.top = nUpdatedY;
					}
				});
			}
			m.activeDroppable = m.activeDraggable = m.activeDraggableUI = undefined;
			return b;
		}

		if (m.activeDroppable !== undefined) {
			b = this.verifyDroppedItem(m.activeDroppable);
			this.setElementInCenter(m.activeDraggable, m.activeDroppable);
			m.activeDroppable = undefined;
			return b;
		}

		if (m.activeDroppable === undefined) {
			objData = {};
			objData.left = $(m.activeDraggable).position().left;
			objData.top = $(m.activeDraggable).position().top;
			objData.dragItem = m.activeDraggable;
			objData.dragItemHolder = m.activeDroppable;
			objDropData = this.members.dndElements[$(this.members.activeDraggable).attr("datacid")];
			objData.isCorrect = objDropData.model.get("dragItem_cid");
			this.members.DND_COMP_REF.dispatchDnDEvent(this.DND_ITEM_DROP_EVENT, objData);
			
			m.activeDraggableUI.originalPosition.left = objDropData.model.get("position").left;
			m.activeDraggableUI.originalPosition.top = objDropData.model.get("position").top;
			
			
		
			
			return this.setDropTargetData();
		}

		return this.members.revertToPosition;
	};

	DnDHelper.prototype.setDropTargetData = function() {
		var m, drraggble_cid, objDragData, dragItemmodel, droppedItemRef, dropItemModel;
		m = this.members;
		if (m.dragHelper === true && m.bDropCopy === true && m.activeDroppable === undefined) {
			return true;
		}
		drraggble_cid = $(m.activeDraggable).attr("datacid");
		objDragData = m.dndElements[drraggble_cid];
		dragItemmodel = objDragData.model;
		droppedItemRef = dragItemmodel.get("droppedAt");
		if (droppedItemRef !== undefined) {
			dropItemModel = m.dndElements[droppedItemRef].model;
			dropItemModel.set("dragItem_cid", undefined);
			dropItemModel.set("isFilled", false);
			m.activeDraggableUI.originalPosition.left = dragItemmodel.get("position").left;
			m.activeDraggableUI.originalPosition.top = dragItemmodel.get("position").top;
			m.activeDraggableUI = undefined;
			m.activeDroppable = undefined;
			dragItemmodel.set("droppedAt", undefined);
			return this.members.revertToPosition;
		}
	};

	DnDHelper.prototype.setElementInCenter = function(element, container) {
		var objData, posX, posY, objDropData;
		element = $(element);
		container = $(container);
		//posX = container.position().left + (container.innerWidth() - element.innerWidth()) / 2;
		//posY = container.position().top + (container.innerHeight() - element.innerHeight()) / 2;
		posX = parseFloat(container.css("left"))  + (container.innerWidth() - element.innerWidth()) / 2;
		posY = parseFloat(container.css("top"))  + (container.innerHeight() - element.innerHeight()) / 2;
		
		element.css("position", "absolute");
		element.css("left", posX + "px");
		element.css("top", posY + "px");

		this.members.DND_COMP_REF.dispatchDnDEvent(this.DND_ITEM_DROP_EVENT, this.getEventData());

	};
	
	DnDHelper.prototype.freezOption = function(option)
	{
		$(option).draggable("disable");
	};
	
	DnDHelper.prototype.removeDragFeatureFromOption = function(option)
	{
		$(option).draggable("destroy");
	};
	
	DnDHelper.prototype.setContainment = function(containment)
	{
		this.containment = containment;
	};
	
	
	DnDHelper.prototype.getContainment = function(option)
	{
		return this.containment;
	};
	
	DnDHelper.prototype.getEventData = function()
	{
		var objData = {}, drraggble_cid, droppable_cid, m = this.members, objDragData, objDragModelData, objDropModelData;
		droppable_cid=undefined;
		if(this.members.activeDraggable)
		{
			objData.left = $(this.members.activeDraggable).position().left;
			objData.top = $(this.members.activeDraggable).position().top;
		}
		
		if(this.members.activeDroppable)
		{
			objData.left = $(this.members.activeDroppable).position().left;
			objData.top = $(this.members.activeDroppable).position().top;
			droppable_cid = $(m.activeDroppable).attr("datacid");
		}
		
		
		objData.dragItem = this.members.activeDraggable;
		objData.dragItemHolder = this.members.activeDroppable;
		
		
		
		if(droppable_cid !== undefined)
		{
			drraggble_cid = $(m.activeDraggable).attr("datacid");
			objDragData = m.dndElements[drraggble_cid];
			objDragModelData = objDragData.model;
			objData.isCorrect = (objDragModelData.get("correct") === $(this.members.activeDroppable).attr("id"));
		}
		
		
		return objData;
	};
	

	//TODO //DESTROY ALL DND ITEM AND MODEL.
	DnDHelper.prototype.destroy = function() {
		//this.members.dndElements
	};

	return DnDHelper;
});
