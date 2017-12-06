/*jslint nomen: true*/
/*globals Backbone,_,$,console*/

/**
 * DnDHelper
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * Here is the full license text and copyright
 * notice for this file. Note that the notice can span several
 * lines and is only terminated by the closing star and slash.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(['marionette', 'components/option/option', 'jqueryUI'], function(Marionette, Option) {"use strict";

	/**
	 * This initilaizes the helper class for Dnd Component.
	 * @class DnDHelper
	 * @access private
	 */
	var DnDHelper = function(dndComp) {

		/**
		 * This initilaizes the helper object with default values.
		 * @memberof DnDHelper
		 * @access private
		 */
		this.members = {
			DND_COMP_REF : dndComp,
			dndType : undefined,
			bDropCopy : false,
			bDragCopy : false,
			bMultiAccept : false,
			bAcceptCorrectOnly : false,
			bRplaceExisting : true,
			dndItemView : {},
			activeDroppable : undefined,
			activeDraggable : undefined,
			activeDraggableUI : undefined,
			revertToPosition : "flase",
			revertToOriginalPosition : "true",
			dndElements : {},
			itemHolder : undefined,
			arrDragList : undefined,
			arrDropList : undefined,
			itemCounterDrag : 0,
			itemCounterDrop : 0,
			itemCounter : 0,
			zIndexValue : 1,
			containment : undefined,
			click : {},
			removeItemRef : false
		};

		return _.extend(this, Backbone.Events);
	};

	DnDHelper.prototype.ONE_TO_ONE = "oneToOne";
	DnDHelper.prototype.ONE_TO_Many = "oneToMany";
	DnDHelper.prototype.DND_INITLIZED = "dndInitlize";
	DnDHelper.prototype.DRAGGABLE = "draggable";
	DnDHelper.prototype.DROPPABLE = "droppable";

	DnDHelper.prototype.DND_ITEM_DRAG_START_EVENT = "dndItemDragStartEvent";
	DnDHelper.prototype.DND_ITEM_DROP_EVENT = "dndItemDropEvent";
	DnDHelper.prototype.DND_ITEM_DRAG_STOP_EVENT = "dndItemDragStopEvent";
	DnDHelper.prototype.DND_ITEM_DRAG_MOVE_EVENT = "dndItemDragMoveEvent";

	/**
	 * This sets the type of component.
	 * @memberof DnDHelper
	 * @access private
	 */

	DnDHelper.prototype.dndType = function(strType) {
		this.members.dndType = strType;
	};

	/**
	 * This sets the boolean bDropCopy for component.
	 * @memberof DnDHelper
	 * @access private
	 */

	DnDHelper.prototype.dropCopy = function(strDropCopy) {
		this.members.bDropCopy = (strDropCopy === "true" || strDropCopy === true) ? true : false;
	};

	/**
	 * This sets the boolean bDragCopy for component.
	 * @memberof DnDHelper
	 * @access private
	 */

	DnDHelper.prototype.dragCopy = function(strDragCopy) {
		this.members.bDragCopy = (strDragCopy === "true" || strDragCopy === true) ? true : false;
	};

	/**
	 * This sets the boolean bMultiAccept for component.
	 * @memberof DnDHelper
	 * @access private
	 */

	DnDHelper.prototype.multiAccept = function(strMultiAccept) {
		this.members.bMultiAccept = (strMultiAccept === "true" || strMultiAccept === true) ? true : false;
	};

	/**
	 * This sets the boolean bAcceptCorrectOnly for component.
	 * @memberof DnDHelper
	 * @access private
	 */
	DnDHelper.prototype.acceptCorrectOnly = function(strCorrectOnly) {
		this.members.bAcceptCorrectOnly = (strCorrectOnly === "true" || strCorrectOnly === true) ? true : false;
	};

	/**
	 * This sets the boolean bRplaceExisting for component.
	 * @memberof DnDHelper
	 * @access private
	 */
	DnDHelper.prototype.replaceExisting = function(strReplaceExisting) {
		this.members.bRplaceExisting = (strReplaceExisting === "true" || strReplaceExisting === true) ? true : false;
	};

	/**
	 * This sets the boolean revertToPosition for component.
	 * @memberof DnDHelper
	 * @access private
	 */
	DnDHelper.prototype.revertToPosition = function(strRevert) {
		this.members.revertToPosition = (strRevert === "true") ? true : (strRevert === "false") ? false : strRevert;
	};

	/**
	 * This sets the boolean revertToOriginalPosition for component.
	 * @memberof DnDHelper
	 * @access private
	 */
	DnDHelper.prototype.revertToOriginalPosition = function(strRevert) {
		this.members.revertToOriginalPosition = (strRevert === "true") ? true : (strRevert === "false") ? false : strRevert;
	};

	/**
	 * This function create the draggable elements.
	 * @memberof DnDHelper
	 * @param {Array} dragItemList
	 * @param {HTML} region
	 * @access private
	 */
	DnDHelper.prototype.CreateDraggble = function(dragItemList, region) {
		var i, m;
		m = this.members;
		m.arrDragList = dragItemList;
		for ( i = 0; i < m.arrDragList.length; i += 1) {
			this.createElements(region, m.arrDragList[i], "draggable");
		}
	};

	/**
	 * This function create the droppable elements.
	 * @memberof DnDHelper
	 * @param {Array} dropItemList
	 * @param {HTML} region
	 * @access private
	 */
	DnDHelper.prototype.CreateDroppable = function(dropItemList, region) {
		var i, m;
		m = this.members;
		m.arrDropList = dropItemList;
		for ( i = 0; i < m.arrDropList.length; i += 1) {
			this.createElements(region, m.arrDropList[i], "droppable");
		}
	};

	/**
	 * This function create the object of Option and assign them properties of draggable or droppables as required..
	 * @memberof DnDHelper
	 * @param {HTML} region
	 * @param {JSON} data
	 * @param {String} strType
	 * @access private
	 */
	DnDHelper.prototype.createElements = function(region, data, strType) {
		var nCounter, strName, modelData, objOption;
		if (this.members.itemHolder === undefined) {
			this.members.itemHolder = region.find("#dndHolder");
		}
		//console.log("++++  ",data);
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
		objOption.$el.attr("nCounter", nCounter);

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
		if (data.styleClass) {
			objOption.$el.addClass(data.styleClass);
		}
		if (data.styleLeft) {
			objOption.$el.css("left", data.styleLeft);
		}
		if (data.styleTop) {
			objOption.$el.css("top", data.styleTop);
		}
	};

	/**
	 * This function create the model for Option object.
	 * @memberof DnDHelper
	 * @param {JSON} data
	 * @param {String} parentCID
	 * @access private
	 */
	DnDHelper.prototype.getElementModel = function(data, parentCID) {
		// creating model for draggable and droppable item
		var m, ElementModel;
		m = this.members;
		ElementModel = Backbone.Model.extend({
			defaults : {
				parentCID : parentCID,
				id : data.id,
				correctFor : data.correctFor,
				label : data.label,
				type : data.type,
				img : '',
				onlyCorrect : m.bAcceptCorrectOnly,
				multiAccept : m.bMultiAccept,
				replace : m.bRplaceExisting,
				filledWith : [],
				position : undefined,
				originalPosition : undefined
			}
		});
		return new ElementModel();
	};

	/**
	 * This function creates jquery dropable.
	 * @memberof DnDHelper
	 * @param {HTML} dropTarget
	 * @access private
	 */
	DnDHelper.prototype.addDropEvent = function(dropTarget) {
		var objClassRef = this;
		dropTarget.droppable({
			drop : function(objEvent, ui) {
				objClassRef.handleDropEvent(objEvent, ui);
			}
		});
	};

	/**
	 * This function creates jquery draggable.
	 * @memberof DnDHelper
	 * @param {HTML} dragItem
	 * @access private
	 */
	DnDHelper.prototype.addDragEvent = function(dragItem) {
		var objClassRef = this;
		$(dragItem).draggable({

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

		if (this.members.bDropCopy === true || this.members.bDragCopy === true) {
			$(dragItem).draggable({
				helper : "clone"
			});
		}
	};

	/**
	 * This function dispatches DND_INITLIZED event.
	 * @memberof DnDHelper
	 * @access private
	 */
	DnDHelper.prototype.initlizeDraggable = function() {
		this.trigger(this, this.DND_INITLIZED, this);
	};

	/**
	 * This function is a handler for Drag start.
	 * @memberof DnDHelper
	 * @access private
	 */
	DnDHelper.prototype.handleDragStart = function(objEvent, ui) {
		var objClassRef, dragItem_cid, objDragData, objPosition, nUpdatedX, nUpdatedY, originalXY;
		objClassRef = this;
		/*jslint plusplus: true*/
		this.members.click.x = objEvent.clientX;
		this.members.click.y = objEvent.clientY;

		this.members.zIndexValue++;
		this.members.activeDraggable = objEvent.currentTarget;
		this.members.activeDraggableUI = ui;
		this.members.DND_COMP_REF.dispatchDnDEvent(this.DND_ITEM_DRAG_START_EVENT, this.getEventData());

		$(this.members.activeDraggable).css("z-index", this.members.zIndexValue);
		if (this.members.bDropCopy === true || this.members.bDragCopy === true) {
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
			nUpdatedX = (originalXY.left ) / this.members.DND_COMP_REF.getStageScaleValue();
			nUpdatedY = (originalXY.top ) / this.members.DND_COMP_REF.getStageScaleValue();

			objPosition.left = nUpdatedX;
			objPosition.top = nUpdatedY;
			objDragData.model.set("position", objPosition);
			objDragData.model.set("originalPosition", objPosition);
		}
		//this.handleScaling();
	};

	/**
	 * This function is to resize droppables on scaling to fix jquery issue.
	 * @memberof DnDHelper
	 * @access private
	 */
	DnDHelper.prototype.handleScaling = function() {
		var i, dropable, objCss, scale, scaleFun, wid, hit, left, top, arrDropables;
		arrDropables = this.members.itemHolder.find('[type=droppable]');
		scale = this.members.DND_COMP_REF.getStageScaleValue();
		scaleFun = "scale(" + 1 / scale + ")";
		objCss = {};
		objCss.transform = scaleFun;
		objCss["-ms-transform"] = scaleFun;
		objCss["-moz-transform"] = scaleFun;
		objCss["-webkit-transform"] = scaleFun;
		objCss["-o-transform"] = scaleFun;
		for ( i = 0; i < arrDropables.length; i += 1) {
			dropable = arrDropables[i];
			if ($(dropable).prop('oh') === undefined) {
				$(dropable).prop('oh', $(dropable).height());
			}
			if ($(dropable).prop('ow') === undefined) {
				$(dropable).prop('ow', $(dropable).width());
			}

			if ($(dropable).prop('ol') === undefined) {
				$(dropable).prop('ol', parseFloat($(dropable).css('left')));
			}
			if ($(dropable).prop('ot') === undefined) {
				$(dropable).prop('ot', parseFloat($(dropable).css('top')));
			}

			if ($(dropable).prop('scale') === scale) {
				return;
			}

			$(dropable).prop('scale', scale);
			scaleFun = "scale(" + scale + ")";
			$(dropable).children().css({
				transform : scaleFun,
				'-ms-transform' : scaleFun,
				'-moz-transform' : scaleFun,
				'-webkit-transform' : scaleFun,
				'-o-transform' : scaleFun,
				"transform-origin" : "0% 0%",
				"-ms-transform-origin" : "0% 0%",
				"-moz-transform-origin" : "0% 0%",
				"-webkit-transform-origin" : "0% 0%",
				"-o-transform-origin" : "0% 0%"
			});

			$(dropable).css(objCss);

			wid = $(dropable).prop('ow');
			hit = $(dropable).prop('oh');

			left = $(dropable).prop('ol');
			left = left - (wid * scale - wid) / 2;

			top = $(dropable).prop('ot');
			top = top - (hit * scale - hit) / 2;

			$(dropable).width(wid * scale);
			$(dropable).height(hit * scale);

			$(dropable).css("left", left + 'px');
			$(dropable).css("top", top + 'px');
		}

	};

	/**
	 * This function is a handler for Drag stop.
	 * @memberof DnDHelper
	 * @access private
	 */
	DnDHelper.prototype.handleDragStop = function(objEvent, ui) {
		var m = this.members, objDropData;
		this.members.DND_COMP_REF.dispatchDnDEvent(this.DND_ITEM_DRAG_STOP_EVENT, this.getEventData());
	};

	/**
	 * This function is a handler for Drag move.
	 * @memberof DnDHelper
	 * @access private
	 */
	DnDHelper.prototype.handleDragItemMovement = function(objEvent, ui) {
		var nUpdatedX, nUpdatedY, originalXY, boundX, boundY, boundW, boundH;
		originalXY = ui.originalPosition;
		nUpdatedX = (objEvent.clientX - this.members.click.x + originalXY.left) / this.members.DND_COMP_REF.getStageScaleValue();
		nUpdatedY = (objEvent.clientY - this.members.click.y + originalXY.top ) / this.members.DND_COMP_REF.getStageScaleValue();
		if (this.containment !== undefined) {
			boundX = $(this.containment).position().left / this.members.DND_COMP_REF.getStageScaleValue();
			boundY = $(this.containment).position().top / this.members.DND_COMP_REF.getStageScaleValue();
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
		
		this.members.DND_COMP_REF.dispatchDnDEvent(this.DND_ITEM_DRAG_MOVE_EVENT, this.getEventData());
	};

	/**
	 * This function is a handler for Drag drop.
	 * @memberof DnDHelper
	 * @access private
	 */
	DnDHelper.prototype.handleDropEvent = function(objEvent, ui) {
		this.members.activeDroppable = objEvent.target;
	};

	/**
	 * This function verifies if the draggable is allowed to dropped at the current droppable.
	 * @memberof DnDHelper
	 * @param {HTML} dra Current draggable
	 * @param {HTML} dro Current droppable
	 * @returns {Bool} true if allowed. false otherwise.
	 * @access private
	 */
	DnDHelper.prototype.verifyDroppedItem = function(dra, dro) {
		var m, draId, draCid, droCid, draModel, droModel, strCorrectFor,arrCorrectFor, bOnlyCorrect, bMultiAccept, bReplace, bCorrect, bFilled, bSame;
		draCid = $(dra).attr('dataCID');
		droCid = $(dro).attr('dataCID');
		draModel = this.getItemModel(draCid);
		droModel = this.getItemModel(droCid);
		draId = draModel.get('id');
		strCorrectFor = droModel.get("correctFor");
		bOnlyCorrect = droModel.get("onlyCorrect");
		bMultiAccept = droModel.get("multiAccept");
		bReplace = droModel.get("replace");
		arrCorrectFor = strCorrectFor.split(',');
		bCorrect = (arrCorrectFor.indexOf(draId) !== -1) ? true : false;
		bFilled = (droModel.get("filledWith").length > 0) ? true : false;
		bSame = (droModel.get("filledWith").indexOf(draCid) !== -1) ? true : false;
		if (bFilled) {
			if (!bMultiAccept) {
				if (!bSame) {
					if (!bReplace) {
						return false;
					}
				}
			}
		}

		if (bOnlyCorrect) {
			if (!bCorrect) {
				return false;
			}
		}

		return true;
	};

	/**
	 * This function returns the model for Option object.
	 * @memberof DnDHelper
	 * @param {String} str_cid cid for Option object.
	 * @returns {Object} objModelData.
	 * @access private
	 */
	DnDHelper.prototype.getItemModel = function(str_cid) {
		var objModelData, elementData;
		elementData = this.members.dndElements[str_cid];
		if (elementData !== undefined) {
			objModelData = elementData.model;
		}
		return objModelData;
	};

	/**
	 * This function creates the identical Option object for current draggable and adds it to the screen.
	 * @memberof DnDHelper
	 * @param none.
	 * @returns none.
	 * @access private
	 */
	DnDHelper.prototype.addDraggableCopy = function() {
		var m, objCopy, strDraCid, draModel, bval;
		m = this.members;
		strDraCid = $(m.activeDraggable).attr("dataCID");
		draModel = this.getItemModel(strDraCid);
		objCopy = {};

		objCopy.nCounter = $(m.activeDraggable).attr("nCounter");
		objCopy.type = draModel.get("type");
		objCopy.id = draModel.get("id");
		objCopy.label = draModel.get("label");
		objCopy.img = draModel.get("img");
		objCopy.position = draModel.get("position");
		objCopy.originalPosition = draModel.get("originalPosition");

		draModel = this.getElementModel(objCopy);
		draModel.set('position', objCopy.position);
		draModel.set('originalPosition', objCopy.originalPosition);
		objCopy.objOption = new Option();
		objCopy.objOption.model = draModel;
		objCopy.objOption.render();
		objCopy.objOption.$el.attr("dataCID", objCopy.objOption.cid);
		objCopy.objOption.$el.attr("nCounter", objCopy.nCounter);
		objCopy.objOption.$el.removeAttr('style');
		objCopy.objOption.$el.addClass(objCopy.type + objCopy.nCounter);
		m.bDropCopy = false;
		if (m.bDragCopy === true) {
			bval = m.bDragCopy;
			m.bDragCopy = false;
		}
		this.addDragEvent(objCopy.objOption.$el);
		m.bDropCopy = true;
		if (bval !== undefined) {
			m.bDragCopy = bval;
			bval = undefined;
		}
		m.itemHolder.append(objCopy.objOption.$el);
		m.dndElements[objCopy.objOption.cid] = objCopy.objOption;
		m.activeDraggable = objCopy.objOption.$el;
	};

	/**
	 * This function handles the drag revert.
	 * @memberof DnDHelper
	 * @access private
	 */
	DnDHelper.prototype.handleDragRevert = function(that) {
		var b, m, strDraCid, strDroCid, draModel, droModel, objData, objDropData, objCopy, arrFilled;
		m = this.members;
		strDraCid = $(m.activeDraggable).attr("dataCID");
		draModel = this.getItemModel(strDraCid);
		
		if (m.activeDroppable !== undefined) {

			b = this.verifyDroppedItem(m.activeDraggable, m.activeDroppable);
			if (!b) {
				this.members.DND_COMP_REF.dispatchDnDEvent(this.DND_ITEM_DROP_EVENT, this.getEventData());
				strDraCid = $(m.activeDraggable).attr("dataCID");
				m.activeDraggableUI.originalPosition.left = draModel.get("position").left;
				m.activeDraggableUI.originalPosition.top = draModel.get("position").top;

				if ($(m.activeDraggable).attr("droppedAt") !== undefined && m.revertToOriginalPosition) {
					strDroCid = $(m.activeDraggable).attr("droppedAt");
					$(m.activeDraggable).removeAttr("droppedAt");
					droModel = this.getItemModel(strDroCid);
					arrFilled = droModel.get("filledWith");
					arrFilled.splice(arrFilled.indexOf(strDraCid), 1);

					if (m.bDropCopy === true) {
						objCopy = {};
						objCopy.objOption = m.dndElements[strDraCid];
						$(objCopy.objOption.$el).draggable("destroy");
						$(objCopy.objOption.$el).remove();
						delete m.dndElements[strDraCid];
						//m.dndElements[strDraCid] = undefined;
					} else if (m.bDragCopy === true) {
						m.activeDraggableUI.helper.remove();
						this.resetItem(m.activeDraggable);
					}

				}

				m.activeDraggable = m.activeDroppable = undefined;

				return m.revertToPosition;
			}

			if (m.bDropCopy === true) {
				if ($(m.activeDraggable).attr("droppedAt") === undefined) {
					this.addDraggableCopy();
				}
			}
			strDraCid = $(m.activeDraggable).attr("dataCID");

			if ($(m.activeDraggable).attr("droppedAt") !== undefined) {
				strDroCid = $(m.activeDraggable).attr("droppedAt");
				$(m.activeDraggable).removeAttr("droppedAt");
				droModel = this.getItemModel(strDroCid);
				arrFilled = droModel.get("filledWith");
				arrFilled.splice(arrFilled.indexOf(strDraCid), 1);
			}

			strDroCid = $(m.activeDroppable).attr("dataCID");
			$(m.activeDraggable).attr("droppedAt", strDroCid);

			droModel = this.getItemModel(strDroCid);
			arrFilled = droModel.get("filledWith");

			if ((arrFilled.length > 0) && (droModel.get("multiAccept") === false) && (droModel.get("replace") === true)) {
				this.resetItem(m.activeDroppable);
			}

			arrFilled.push(strDraCid);
			this.setElementInCenter(m.activeDraggable, m.activeDroppable);
			this.members.DND_COMP_REF.dispatchDnDEvent(this.DND_ITEM_DROP_EVENT, this.getEventData());
			m.activeDraggable = m.activeDroppable = undefined;
			return false;
		}

		if (m.activeDroppable === undefined) {

			m.activeDraggableUI.originalPosition.left = draModel.get("originalPosition").left;
			m.activeDraggableUI.originalPosition.top = draModel.get("originalPosition").top;
			draModel.set("position",draModel.get("originalPosition"));

			if ($(m.activeDraggable).attr("droppedAt") !== undefined) {
				strDroCid = $(m.activeDraggable).attr("droppedAt");
				$(m.activeDraggable).removeAttr("droppedAt");
				droModel = this.getItemModel(strDroCid);
				arrFilled = droModel.get("filledWith");
				arrFilled.splice(arrFilled.indexOf(strDraCid), 1);
				if (m.bDropCopy === true) {
					objCopy = {};
					objCopy.objOption = m.dndElements[strDraCid];
					$(objCopy.objOption.$el).draggable("destroy");
					$(objCopy.objOption.$el).remove();
					delete m.dndElements[strDraCid];
					//m.dndElements[strDraCid] = undefined;
				} else if (m.bDragCopy === true) {
					m.activeDraggableUI.helper.remove();
					this.resetItem(m.activeDraggable);
				}

			}

			this.members.DND_COMP_REF.dispatchDnDEvent(this.DND_ITEM_DROP_EVENT, this.getEventData());
			m.activeDraggable = m.activeDroppable = m.activeDraggableUI = undefined;

			return m.revertToPosition;

		}

	};

	/**
	 * This aligns the draggable to the droppable centerally.
	 * @memberof DnDHelper
	 * @param {HTML} element draggable.
	 * @param {HTML} container droppable.
	 * @returns none.
	 * @access private
	 */
	DnDHelper.prototype.setElementInCenter = function(element, container) {
		var objData, posX, posY, objDropData, objDragData, dragItem_cid;
		element = $(element);
		container = $(container);
		//posX = container.position().left/this.members.DND_COMP_REF.getStageScaleValue() + (container.innerWidth() - element.innerWidth()) / 2;
		//posY = container.position().top/this.members.DND_COMP_REF.getStageScaleValue()  + (container.innerHeight() - element.innerHeight()) / 2;
		//alert(container.position().left / this.members.DND_COMP_REF.getStageScaleValue()+"\n"+container.css("left"));
		// element.position({
		// left : posX,
		// top : posY
		// });
		//console.log(container,$(container).css('left') );

		posX = parseFloat(container.css("left")) + (container.innerWidth() - element.innerWidth()) / 2;
		posY = parseFloat(container.css("top")) + (container.innerHeight() - element.innerHeight()) / 2;

		element.css("position", "absolute");
		element.css("left", posX + "px");
		element.css("top", posY + "px");
		element.css("z-index", this.members.zIndexValue);

		if (!this.members.revertToOriginalPosition) {
			dragItem_cid = $(element).attr("datacid");
			objDragData = this.members.dndElements[dragItem_cid];
			objDragData.model.set("position", {
				left : posX,
				top : posY
			});
		}
	};

	/**
	 * This disabless the draggable.
	 * @memberof DnDHelper
	 * @param {HTML} option
	 * @access private
	 */
	DnDHelper.prototype.freezOption = function(option) {
		$(option).draggable("disable");
	};

	/**
	 * This enabless the draggable.
	 * @memberof DnDHelper
	 * @param {HTML} option
	 * @access private
	 */
	DnDHelper.prototype.unfreezOption = function(option) {
		$(option).draggable("enable");
	};

	/**
	 * This removes the draggable feature from element.
	 * @memberof DnDHelper
	 * @param {HTML} option
	 * @access private
	 */
	DnDHelper.prototype.removeDragFeatureFromOption = function(option) {
		$(option).draggable("destroy");
	};

	/**
	 * This sets the containment for the dnd comp.
	 * @memberof DnDHelper
	 * @param {HTML} containment
	 * @access private
	 */
	DnDHelper.prototype.setContainment = function(containment) {
		this.containment = (containment !== undefined && $(containment).length > 0) ? containment : undefined;
	};

	/**
	 * This returns the containment for the dnd comp.
	 * @memberof DnDHelper
	 * @param none.
	 * @returns {HTML} containment
	 * @access private
	 */
	DnDHelper.prototype.getContainment = function(option) {
		return this.containment;
	};

	/**
	 * This returns the object to be diapatched with events.
	 * @memberof DnDHelper
	 * @param none.
	 * @returns {Object} objData
	 * @access private
	 */
	DnDHelper.prototype.getEventData = function() {
		var m, draCid, draId, droCid, draModel, droModel, objData = {};
		m = this.members;
		objData.isCorrect = false;
		if (m.activeDraggable !== undefined) {
			objData.left = $(m.activeDraggableUI.helper).position().left;
			objData.top = $(m.activeDraggableUI.helper).position().top;
			if (m.activeDroppable !== undefined) {
				draCid = $(m.activeDraggable).attr("dataCID");
				draModel = this.getItemModel(draCid);
				draId = draModel.get("id");
				droCid = $(m.activeDroppable).attr("dataCID");
				droModel = this.getItemModel(droCid);
				if (droModel.get("correctFor").indexOf(draId) !== -1) {
					objData.isCorrect = true;
				}
			}
		}

		//console.log(m.activeDraggable, " ::::: " , m.activeDroppable );
		objData.dragItem = m.activeDraggable;
		objData.dropItem = m.activeDroppable;
		//console.log(objData);
		return objData;
	};

	/**
	 * This resets the draggable passed..
	 * @memberof DnDHelper
	 * @param {String} draCid.
	 * @returns none.
	 * @access private
	 */
	DnDHelper.prototype.resetDraggable = function(draCid) {
		var m, draId, objOption, droCid, draModel, droModel, arrFilled, objCopy, zInd;
		m = this.members;
		draModel = this.getItemModel(draCid);
		draId = draModel.get("id");
		objOption = m.dndElements[draCid];
		if ($(objOption.$el).attr("droppedAt") !== undefined) {
			droCid = $(objOption.$el).attr("droppedAt");
			droModel = this.getItemModel(droCid);
			$(objOption.$el).removeAttr("droppedAt");
			arrFilled = droModel.get("filledWith");
			arrFilled.splice(arrFilled.indexOf(draCid), 1);
			if (m.bDropCopy === true) {
				objCopy = {};
				objCopy.objOption = m.dndElements[draCid];
				$(objCopy.objOption.$el).draggable("destroy");
				$(objCopy.objOption.$el).remove();
				m.dndElements[draCid] = undefined;
			}
		}
		$(objOption.$el).removeAttr('style');
	};

	/**
	 * This function confirms that all draggable are dropped on correct droppables.
	 * @memberof DnDHelper
	 * @param none
	 * @returns {Object} lists of incorrect and correct dragable ids.
	 * @access private
	 */
	DnDHelper.prototype.showAnswer = function() {
		var i, draCid, droCid, modelDra, modelDro, strType, strCorrectFor, objThis = this, list_correct = [], list_incorrect = [];
		$.each(this.members.dndElements, function() {
			draCid = undefined;
			draCid = this.$el.attr("dataCID");
			modelDra = objThis.getItemModel(draCid);
			strType = modelDra.get("type");
			if (strType === objThis.DRAGGABLE) {
				droCid = undefined;
				strCorrectFor = undefined;
				if (this.$el.attr("droppedAt") !== undefined) {
					droCid = this.$el.attr("droppedAt");
					modelDro = objThis.getItemModel(droCid);
					strCorrectFor = modelDro.get("correctFor");

					if (strCorrectFor.indexOf(modelDra.get("id")) !== -1) {
						list_correct.push(modelDra.get("id"));
					} else {
						list_incorrect.push(modelDra.get("id"));
					}
				}
			}
		});

		return {
			correct : list_correct,
			incorrect : list_incorrect
		};

	};

	/**
	 * This resets the droppable passed..
	 * @memberof DnDHelper
	 * @param {String} droCid.
	 * @returns none.
	 * @access private
	 */
	DnDHelper.prototype.resetDroppable = function(droCid) {
		var m, droModel, arrFilled, len;
		m = this.members;
		droModel = this.getItemModel(droCid);
		arrFilled = droModel.get("filledWith");
		len = arrFilled.length;
		while (len > 0) {
			this.resetDraggable(arrFilled[0]);
			len -= 1;
		}
	};

	/**
	 * This resets the item passed..
	 * @memberof DnDHelper
	 * @param {HTML} el.
	 * @returns none.
	 * @access private
	 */
	DnDHelper.prototype.resetItem = function(el) {

		var cid, model, strType;
		cid = $(el).attr("dataCID");

		model = this.getItemModel(cid);
		strType = model.get("type");

		if (strType === this.DRAGGABLE) {
			this.resetDraggable(cid);
		} else {
			this.resetDroppable(cid);
		}

	};

	/**
	 * This resets all existing items
	 * @memberof DnDHelper
	 * @param none.
	 * @returns none.
	 * @access private
	 */
	DnDHelper.prototype.resetAll = function() {
		var i, objThis = this;
		$.each(this.members.dndElements, function() {
			if (this instanceof Option) {
				objThis.resetItem(this.$el);
			}

		});
	};

	/**
	 * This returns the item for given cid.
	 * @memberof DnDHelper
	 * @param {String} datacid
	 * @returns {HTML} el.
	 * @access private
	 */
	DnDHelper.prototype.getElementByCid = function(datacid) {
		var option, el;
		option = this.members.dndElements[datacid];
		el = option.$el;
		return el;
	};

	/**
	 * To override the xml value for correctFor.
	 * @param {String} strId Id of droppable.
	 * @param {String} strOrder Comma seperated id's for draggables.
	 * @memberof DnDHelper
	 * @access private
	 */

	DnDHelper.prototype.changeCorrectFor = function(strId, strOrder) {
		var el, cid, model;
		el = this.members.itemHolder.find("#"+strId)[0];
		if ($(el).attr('type') !== "droppable") {
			throw (new Error("Data can only be set on droppables!!"));
		}

		cid = $(el).attr("dataCID");
		model = this.getItemModel(cid);
		model.set("correctFor", strOrder);

	};

	/**
	 * This destroys the objects and properties used.
	 * @memberof DnDHelper
	 * @access private
	 */
	DnDHelper.prototype.destroy = function() {
		var i = 0, model, objThis = this;
		$.each(this.members.dndElements, function() {
			if (this instanceof Option) {
				objThis.resetItem(this.$el);
				try {
					if (this.model.get("type") === this.DRAGGABLE) {
						$(this.$el).draggable('destroy');
					} else {
						$(this.$el).droppable('destroy');
					}
				} catch(e) {

				}

				this.model.set('filledWith', []);
				this.model.set('position', undefined);
				this.model = null;
				$(this.$el).remove();
			}
		});
		this.members.dndElements = {};
		this.members.itemCounterDrag = 0;
		this.members.itemCounterDrop = 0;
		this.members.itemCounter = 0;
		this.members.zIndexValue = 1;
		this.members.DND_COMP_REF = undefined;
		delete this.members;
	};

	return DnDHelper;
});
