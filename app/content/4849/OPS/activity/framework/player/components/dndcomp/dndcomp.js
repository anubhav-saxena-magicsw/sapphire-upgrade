/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/

define(['marionette', 'components/container', 'components/dndcomp/model', 'components/draggable/draggable', 'components/droppable/droppable'],

/**
 *A module representing a DndComp.
 *@class DndComp
 * @augments Container
 *@access private
 */

function(Marionette, Container, Model, Draggable, Droppable) {
	'use strict';
	var objClassRef, DndComp = Container.extend({
		objData : null,
		template : _.template(''),
		objDraggable : undefined,
		objFeedback : null,
		objHint : null,
		objClone : null,
		initialize : function(obj) {
			this.objData = obj;
			//this property is being used in componentselector for editing.
			this.model = new Model(obj);
			objClassRef = this;
			this.componentType = "dnd";
		},
		onRender : function() {
			this.$el.addClass(this.styleClass());
		},
		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		}
	});

	DndComp.prototype.addChild = function(objChild) {
		var childComp = objChild.component, type;
		if ( childComp instanceof Draggable) {
			if (this.storeChilds(childComp, "draggables")) {
				this.addDraggableEvents(childComp);
				if (this.model.get("cloning") === "true" || this.model.get("cloning") === true) {
					childComp.enableCloning();
				}
				type = "draggables";
			}
		} else if ( childComp instanceof Droppable) {
			if (this.storeChilds(childComp, "droppables")) {
				this.addDroppableEvents(childComp);
			}
		} else if (childComp.componentType === "hint") {
			this.objHint = childComp;

		} else if (childComp.componentType === "feedback") {
			this.objFeedback = childComp;

		} else if (this.bEditor) {
			// Do Nothing
		} else {
			console.warn("DndComp can only have Draggable or Droppable kind of objects!!");
			return;
		}
		this.DnDSuper.prototype.addChild.call(this, objChild);
		if (!this.bEditor) {
			this.randomizePositions(type);
		}
	};

	/**
	 * This method is responsible to check that given component type
	 * can be added in its dom or not
	 * will return true if given component type (in parameter) can be added
	 * in its dom.
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof MultipleChoice#
	 */
	DndComp.prototype.isValid = function(strCompType) {
		var isvalid = false;
		isvalid = (strCompType === "draggable" || strCompType === "droppable" || strCompType === "feedback" || strCompType === "hint" || strCompType === "label") ? true : false;
		return isvalid;
	};

	DndComp.prototype.storeChilds = function(objComp, strKey) {
		var arr, ind, strValue;
		strValue = this.model.get(strKey);
		if (strValue.length > 0) {
			arr = strValue.split("|");
		} else {
			arr = [];
		}
		ind = arr.indexOf(objComp.getID());
		if (ind < 0) {
			arr.push(objComp.getID());
			this.model.set(strKey, arr.join("|"));
			return true;
		}
		return false;
	};

	DndComp.prototype.randomizePositions = function(type) {
		var l, t, randomNum, arr, obj1, obj2, tmp;
		if (type === undefined) {
			return;
		}
		arr = this.model.get(type).split("|");
		randomNum = Math.floor(Math.random() * arr.length);
		obj1 = this[arr[randomNum]];
		randomNum = Math.floor(Math.random() * arr.length);
		obj2 = this[arr[randomNum]];
		if (obj1.getID() === obj2.getID()) {
			return;
		}
		if (this.model.get("shuffle") === "true") {
			tmp = obj1.styleClass();
			obj1.styleClass(obj2.styleClass());
			obj2.styleClass(tmp);
		}
	};

	DndComp.prototype.addDraggableEvents = function(objDraggable) {
		objDraggable.on("start", this.onDragStart);
		objDraggable.on("drag", this.onDragMove);
		objDraggable.on("stop", this.onDragStop);
	};

	DndComp.prototype.addDroppableEvents = function(objDroppable) {
		objDroppable.on("drop", this.onDrop);
		objDroppable.on("over", this.onOver);
	};

	DndComp.prototype.onDragStart = function(e) {
		var origPos, zIndex = objClassRef.model.get("lastzindex") + 1;
		objClassRef.model.set("lastzindex", zIndex);
		this.setZindex(zIndex);
		this.setContainmentDiv(objClassRef.el);
		objClassRef.objDraggable = this;
		if (objClassRef.objDraggable.model.get("clone") === "true" || objClassRef.objDraggable.model.get("clone") === true) {
			$(e.customData.ui.helper).css("z-index", zIndex);
			origPos = objClassRef.objDraggable.originalPos;
			objClassRef.objClone = objClassRef.getClone(objClassRef.objDraggable);
			objClassRef.objClone.setOriginalPosition(origPos);
			objClassRef.objClone.$el.hide();
			objClassRef.objClone.on("revertComplete", function() {
				objClassRef.removeClone(this);
				objClassRef.objClone = null;
			});
			objClassRef.objDraggable = objClassRef.objClone;
		}
		objClassRef.customEventDispatcher("onDragStart", objClassRef, this);
	};

	DndComp.prototype.removeClone = function(obj) {
		delete objClassRef[obj.getID()];
		obj.$el.remove();
		obj.destroy();
		objClassRef.updateModel();
	};

	DndComp.prototype.updateModel = function() {
		var arr1, arr2;
		arr1 = objClassRef.model.get("draggables").split("|");
		arr2 = objClassRef.model.get("draggables").split("|");
		$.each(arr1, function(i, strDrag) {
			if (objClassRef[strDrag] === undefined) {
				arr2.splice(arr2.indexOf(strDrag), 1);
			}
		});
		objClassRef.model.set("draggables", arr2.join("|"));
	};

	DndComp.prototype.onDragMove = function(e) {
		objClassRef.customEventDispatcher("onDragMove", objClassRef, this);
	};

	DndComp.prototype.onDragStop = function(e) {
		if (objClassRef.objDraggable) {
			if (objClassRef.objClone !== null) {
				objClassRef.objDraggable.setCurrentPosition(e.customData.ui.position);
				objClassRef.objDraggable.$el.show();
			}
			objClassRef.removeAssociation(objClassRef.objDraggable.getID());
			objClassRef.objDraggable.revertBack();
		}
		objClassRef.objDraggable = undefined;
		objClassRef.objClone = null;
		objClassRef.customEventDispatcher("onDragStop", objClassRef, this);
	};

	DndComp.prototype.onOver = function(e) {
		objClassRef.customEventDispatcher("onOver", objClassRef, this);
	};

	DndComp.prototype.onDrop = function(e) {
		if (objClassRef.objDraggable.model.get("droppedAt") === this.getID()) {
			objClassRef.objDraggable = undefined;
			objClassRef.arrange(this);
			return;
		}
		objClassRef.removeAssociation(objClassRef.objDraggable.getID());
		if (objClassRef.validateOnDrop(this)) {
			if (objClassRef.objClone !== null) {
				objClassRef.objClone.setCurrentPosition(e.customData.ui.position);
				objClassRef.objClone.$el.show();
				objClassRef.objClone = null;
			}
			objClassRef.makeAssociation(objClassRef.objDraggable.getID(), this.getID());
			objClassRef.objDraggable = undefined;
		}
		objClassRef.customEventDispatcher("onDrop", objClassRef, this);
		if (objClassRef.getStatus().bAllDropped) {
			objClassRef.customEventDispatcher("onAllPlaced", objClassRef, this);
		} else {
			objClassRef.customEventDispatcher("onAllNotPlaced", objClassRef, this);
		}
	};

	DndComp.prototype.validateOnDrop = function(objDrop) {
		var bReplace, type, draId, objDrag;
		type = objClassRef.model.get("type");
		bReplace = objClassRef.model.get("ondropreplace");
		if (type === "ONE_TO_ONE") {
			if (objDrop.isEmpty()) {
				return true;
			} else if (bReplace === "true" || bReplace === true) {
				draId = objDrop.model.get("filledWith");
				objClassRef.removeAssociation(draId);
				objDrag = objClassRef[draId];
				objDrag.revertBack();
				return true;
			}
		} else if (type === "MANY_TO_ONE") {
			return true;
		}
		return false;
	};

	DndComp.prototype.arrange = function(objDrop) {
		var i, x = 0, y = 0, strVal, arrDrag, objDrop, objDrag;
		if (!objDrop) {
			return;
		}
		switch(this.model.get("ondropalignment")) {

		case "VERTICAL":
			x = parseFloat(objDrop.$el.css("left"));
			y = parseFloat(objDrop.$el.css("top"));
			strVal = objDrop.model.get("filledWith");
			if (strVal.length) {
				arrDrag = strVal.split("|");
				for ( i = 0; i < arrDrag.length; i += 1) {
					objDrag = this[arrDrag[i]];
					objDrag.$el.css("top", y + "px");
					objDrag.$el.css("left", x + "px");
					y += objDrag.$el.height();
					if ((y + objDrag.$el.height()) > (parseFloat(objDrop.$el.css("top")) + objDrop.$el.height())) {
						y = parseFloat(objDrop.$el.css("top"));
						x += objDrag.$el.width();
					}
					if (objDrag.$el.css("z-index") === "auto") {
						objDrag.$el.css("z-index", 1);
					}

				}
			}

			break;
		case "HORIZONTAL":
			x = parseFloat(objDrop.$el.css("left"));
			y = parseFloat(objDrop.$el.css("top"));
			strVal = objDrop.model.get("filledWith");
			if (strVal.length) {
				arrDrag = strVal.split("|");
				for ( i = 0; i < arrDrag.length; i += 1) {
					objDrag = this[arrDrag[i]];
					objDrag.$el.css("top", y + "px");
					objDrag.$el.css("left", x + "px");
					x += objDrag.$el.width();
					if ((x + objDrag.$el.width()) > (parseFloat(objDrop.$el.css("left")) + objDrop.$el.width())) {
						x = parseFloat(objDrop.$el.css("left"));
						y += objDrag.$el.height();
					}
					if (objDrag.$el.css("z-index") === "auto") {
						objDrag.$el.css("z-index", 1);
					}
				}
			}

			break;
		case "CENTER":
			x = parseFloat(objDrop.$el.css("left"));
			y = parseFloat(objDrop.$el.css("top"));
			strVal = objDrop.model.get("filledWith");
			if (strVal.length) {
				arrDrag = strVal.split("|");
				for ( i = 0; i < arrDrag.length; i += 1) {
					objDrag = this[arrDrag[i]];
					x = parseFloat(objDrop.$el.css("left")) + (objDrop.$el.width() - objDrag.$el.width()) / 2;
					y = parseFloat(objDrop.$el.css("top")) + (objDrop.$el.height() - objDrag.$el.height()) / 2;
					objDrag.$el.css("top", y + "px");
					objDrag.$el.css("left", x + "px");
					if (objDrag.$el.css("z-index") === "auto") {
						objDrag.$el.css("z-index", 1);
					}

				}
			}
			break;
		default :
			// console.log("default");
			break;
		}
	};

	DndComp.prototype.removeAssociation = function(strDra) {
		var model, arr, objDrop, index;
		model = this[strDra].model;
		if (model.get("droppedAt") !== undefined) {
			objDrop = this[model.get("droppedAt")];
			model.set("droppedAt", undefined);
		}
		if (objDrop) {
			model = objDrop.model;
			arr = model.get("filledWith").split("|");
		}
		if (arr) {
			index = arr.indexOf(strDra);
		}
		if (index > -1) {
			arr.splice(index, 1);
			model.set("filledWith", arr.join("|"));
		}
		this.arrange(objDrop);
	};

	DndComp.prototype.makeAssociation = function(strDra, strDro) {
		var model, arr, strValue;
		model = this[strDra].model;
		model.set("droppedAt", strDro);
		model = this[strDro].model;

		if (!this[strDro].isEmpty()) {
			arr = model.get("filledWith").split("|");
			arr.push(strDra);
			strDra = arr.join("|");
		}
		model.set("filledWith", strDra);
		this.arrange(this[strDro]);
	};

	/**
	 * This method is used to get which droppable
	 * carries which draggable.
	 * @memberof DndComp
	 * @param none
	 * @returns none.
	 */
	DndComp.prototype.getState = function() {
		var i, arrDroppables, strFilledWith, strValue, strDrop, stateDict, objClassRef = this;
		arrDroppables = [];
		stateDict = {};

		strValue = this.model.get("droppables");
		if (strValue.length > 0) {
			arrDroppables = strValue.split("|");
		}

		for ( i = 0; i < arrDroppables.length; i++) {
			strDrop = arrDroppables[i];
			stateDict[strDrop] = objClassRef[strDrop].model.get("filledWith");
		}
		return stateDict;
	};

	/**
	 * This method is used to set draggable to their
	 * droppables.
	 * @memberof DndComp
	 * @param none
	 * @returns none.
	 */
	DndComp.prototype.setState = function(stateDict) {
		var i, strDrag, objDrag, objClone, arrDraggables, objClassRef = this;
		objClassRef.reset("ALL", false);
		$.each(stateDict, function(strDrop, strFilledWith) {
			arrDraggables = [];
			if (strFilledWith && strFilledWith.length) {
				arrDraggables = strFilledWith.split("|");
			}
			for ( i = 0; i < arrDraggables.length; i += 1) {
				strDrag = arrDraggables[i];
				if (strDrag.indexOf('_clone_') !== -1) {
					objDrag = objClassRef[strDrag.split("_clone_")[0]];
					if (objDrag.model.get('clone') === true || objDrag.model.get('clone') === "true") {
						if (objClassRef[strDrag]) {
							objClone = objClassRef[strDrag];
						} else {
							objClone = objClassRef.getClone(objDrag, strDrag);
							objClone.setOriginalPosition(objDrag.$el.position());
							objClone.model.set("droppedAt", strDrop);
							objDrag.model.set("cloneCounter", objDrag.model.get("cloneCounter") + 1);
							objClone.off("revertComplete").on("revertComplete", function() {
								objClassRef.removeClone(this);
								objClassRef.objClone = null;
							});
						}
					}
				} else {
					objDrag = objClassRef[strDrag];
					objDrag.model.set("droppedAt", strDrop);
				}
			}
			objClassRef[strDrop].model.set("filledWith", strFilledWith);
			objClassRef.arrange(objClassRef[strDrop]);
		});

	};

	DndComp.prototype.showAnswer = function() {
		var i, j, arrDroppables, arrDraggables, strFilledWith, strValue, strAns, arrAns, strDrop, objDrop, objDrag, stateDict;
		arrDroppables = [];
		arrDraggables = [];
		stateDict = {};
		objClassRef.reset("ALL", false);
		strValue = this.model.get("droppables");
		if (strValue.length > 0) {
			arrDroppables = strValue.split("|");
		}
		strValue = this.model.get("draggables");
		if (strValue.length > 0) {
			arrDraggables = strValue.split("|");
		}

		for ( i = 0; i < arrDroppables.length; i += 1) {
			strDrop = arrDroppables[i];
			objDrop = objClassRef[strDrop];
			strAns = objDrop.getValue();
			if (strAns.indexOf("|") !== -1) {
				arrAns = strAns.split("|");
			} else {
				arrAns = [];
				arrAns.push(strAns);
			}

			strFilledWith = "";
			for ( j = 0; j < arrDraggables.length; j += 1) {
				if (arrDraggables[j]) {
					objDrag = objClassRef[arrDraggables[j]];
					strValue = objDrag.getValue();
					if (!objDrag.originalPosition) {
						objDrag.setOriginalPosition(objDrag.$el.position());
					}

					if (arrAns.indexOf(strValue) !== -1) {
						if (objDrag.model.get("clone") === true || objDrag.model.get("clone") === "true") {
							objDrag.getClone();
							strFilledWith += arrDraggables[j] + "_clone_" + objDrag.model.get("cloneCounter");
						} else {
							strFilledWith += arrDraggables[j];
							arrDraggables[j] = undefined;
						}
						if (arrAns.length > 1) {
							strFilledWith += "|";
						}
						arrAns.splice(arrAns.indexOf(strValue), 1);
					}
				}
			}
			stateDict[strDrop] = strFilledWith;
		}
		objClassRef.setState(stateDict);
	};

	DndComp.prototype.checkAnswer = function(strOption) {
		var objAns = this._checkAnswer();
		if (objAns.INCORRECT.length > 0) {
			this.customEventDispatcher("allNotCorrect", objClassRef, objAns);
		} else {
			if (objAns.CORRECT.length === objAns.TOTAL) {
				this.customEventDispatcher("allCorrect", objClassRef, objAns);
			} else {
				this.customEventDispatcher("allNotCorrect", objClassRef, objAns);
			}

		}
	};

	DndComp.prototype._checkAnswer = function(strOption) {
		var i, j, strValue, strAns, arrAns, arrDroppables, arrDraggables, objDrop, objDrag, arrCorrect, arrIncorrect, objData, total = 0;
		strValue = this.model.get("droppables");
		arrDroppables = [];
		arrCorrect = [];
		arrIncorrect = [];
		if (strValue.length > 0) {
			arrDroppables = strValue.split("|");
		}
		for ( i = 0; i < arrDroppables.length; i += 1) {
			objDrop = objClassRef[arrDroppables[i]];
			strValue = objDrop.model.get("filledWith");
			strAns = objDrop.getValue();
			if (strAns.indexOf("|") !== -1) {
				total += strAns.split("|").length;
			} else if (strAns.trim().length) {
				total += 1;
			}
			arrDraggables = [];
			if (strValue.length > 0) {
				arrDraggables = strValue.split("|");
			}
			for ( j = 0; j < arrDraggables.length; j += 1) {
				objDrag = objClassRef[arrDraggables[j]];
				if (strAns.indexOf(objDrag.getValue()) === -1) {
					arrIncorrect.push(objDrag.getID());
				} else {
					arrCorrect.push(objDrag.getID());
					strAns = strAns.replace(objDrag.getValue(), "");
				}
			}
		}
		objData = {
			"CORRECT" : arrCorrect,
			"INCORRECT" : arrIncorrect,
			"TOTAL" : total
		};
		return objData;
	};

	DndComp.prototype.showFeedback = function() {
		var status = this.getStatus(), bVal = true;
		if (status.arrIncorrect.length > 0) {
			bVal = false;
		} else {
			if (status.arrCorrect.length === status.total) {
				bVal = true;
			} else {
				bVal = false;
			}
		}

		if (this.objFeedback) {
			this.objFeedback.showFeedback(bVal);
		}
		this.showDraggablesFeedback();
		this.showDroppablesFeedback();
	};

	DndComp.prototype.showDraggablesFeedback = function() {
		var status = this.getStatus(), bVal = true, strVal, arrDrag = [], self = this;
		strVal = this.model.get("draggables");
		if (strVal.length) {
			arrDrag = strVal.split("|");
		}
		$.each(arrDrag, function(i, strId) {
			if (status.arrIncorrect.indexOf(strId) === -1) {
				self[strId].showFeedback(true);
			} else {
				self[strId].showFeedback(false);
			}
		});
	};

	DndComp.prototype.showDroppablesFeedback = function() {

	};

	DndComp.prototype.hideFeedback = function() {
		if (this.objFeedback) {
			this.objFeedback.hideFeedback();
		}
		this.hideDraggablesFeedback();
		this.hideDroppablesFeedback();
	};

	DndComp.prototype.hideDraggablesFeedback = function() {
		var arrDrag = [], strVal, self = this;
		strVal = this.model.get("draggables");
		if (strVal.length) {
			arrDrag = strVal.split("|");
		}
		$.each(arrDrag, function(i, strId) {
			self[strId].hideFeedback();
		});
	};

	DndComp.prototype.hideDroppablesFeedback = function() {

	};

	DndComp.prototype.showHint = function() {
		if (this.objHint !== null) {
			this.objHint.showHint();
		}
		this.showDraggablesHint();
		this.showDroppablesHint();
	};

	DndComp.prototype.showDraggablesHint = function() {
		this._showHideDragDropHint("draggables", true);
	};

	DndComp.prototype.showDroppablesHint = function() {
		this._showHideDragDropHint("droppables", true);
	};

	DndComp.prototype.hideHint = function() {
		if (this.objHint !== null) {
			this.objHint.hideHint();
		}
		this.hideDraggablesHint();
		this.hideDroppablesHint();
	};

	DndComp.prototype.hideDraggablesHint = function() {
		this._showHideDragDropHint("draggables", false);
	};

	DndComp.prototype.hideDroppablesHint = function() {
		this._showHideDragDropHint("droppables", false);
	};

	DndComp.prototype._showHideDragDropHint = function(type, bVal) {
		var strVal, arr = [], self = this;
		strVal = this.model.get(type);
		if (strVal.length) {
			arr = strVal.split("|");
		}
		$.each(arr, function(i, strId) {
			if (bVal) {
				self[strId].showHint();
			} else {
				self[strId].hideHint();
			}
		});
	};

	DndComp.prototype.resetDraggable = function(strId, animate) {
		var obj;
		if (this[strId]) {
			obj = this[strId];
			this.removeAssociation(strId);
			obj.revertBack(animate);
		}
	};

	DndComp.prototype.reset = function(strOption, animate) {
		var i, arrDrag, strVal, status, self = this;
		status = this.getStatus();
		if (strOption === "INCORRECT") {
			arrDrag = status.arrIncorrect;
		} else if (strOption === "CORRECT") {
			arrDrag = status.arrCorrect;
		} else if (strOption === "ALL" || strOption === undefined) {
			arrDrag = [];
			strVal = this.model.get("draggables");
			if (strVal.length) {
				arrDrag = strVal.split("|");
			}
		}
		$.each(arrDrag, function(i, val) {
			self.resetDraggable(val, animate);
		});

	};

	DndComp.prototype.resetIncorrect = function() {
		this.reset("INCORRECT");
	};

	DndComp.prototype.resetCorrect = function() {
		this.reset("CORRECT");
	};

	DndComp.prototype.getStatus = function() {
		var i, arr, result, bAllDropped, strValue, count, bAllCorrect, arrAssociations, strDrop, objStatus;
		count = 0;
		objStatus = {};
		bAllDropped = false;
		bAllCorrect = false;
		arr = [];
		arrAssociations = [];
		result = this._checkAnswer();
		strValue = this.model.get("draggables");
		if (strValue.length > 0) {
			arr = strValue.split("|");
			if (result.CORRECT.length === result.total && result.INCORRECT.length === 0) {
				bAllCorrect = true;
			}
		}
		for ( i = 0; i < arr.length; i += 1) {
			strDrop = this[arr[i]].model.get("droppedAt");
			if (strDrop) {
				arrAssociations.push({
					draggable : arr[i],
					droppable : strDrop
				});
				count += 1;
			}
		}
		if (count >= result.total) {
			bAllDropped = true;
		}

		objStatus.arrDraggables = this.model.get("draggables").split("|");
		objStatus.arrDroppables = this.model.get("droppables").split("|");
		objStatus.bAllDropped = bAllDropped;
		objStatus.bAllCorrect = bAllCorrect;
		objStatus.arrAssociations = arrAssociations;
		objStatus.arrCorrect = result.CORRECT;
		objStatus.arrIncorrect = result.INCORRECT;
		objStatus.total = result.TOTAL;
		//objClassRef.customEventDispatcher("statusChange", objClassRef, objStatus);
		return objStatus;
	};

	/**
	 * To Enable DndComp component.
	 * @memberof DndComp
	 * @param none objThis Intance of DndComp.
	 * @returns none.
	 */
	DndComp.prototype.enable = function() {
		this.$DndComp.DndComp("enable");
	};

	/**
	 * To Disable DndComp component.
	 * @memberof DndComp
	 * @param none objThis Intance of DndComp.
	 * @returns none.
	 */
	DndComp.prototype.disable = function() {
		this.$DndComp.DndComp("disable");
	};

	DndComp.prototype.data = function(arg) {
		if (arg) {
			this.model.set("data", arg);
		} else {
			return this.model.get("data");
		}
	};

	DndComp.prototype.styleClass = function(arg) {
		if (arg) {
			this.model.set("styleClass", arg);
		} else {
			return this.model.get("styleClass");
		}
	};

	DndComp.prototype.getClone = function(objDrag, strId) {
		var cloneId, objClone, $clone, objConf;
		$clone = objDrag.getClone();
		if (!strId) {
			cloneId = objDrag.getID() + "_clone_" + objDrag.model.get("cloneCounter");
		} else {
			cloneId = strId;
		}

		$clone.attr("id", cloneId);
		this.$el.append($clone);
		objConf = _.extend({}, objDrag.model.attributes);
		objConf = _.extend(objConf, {
			clone : false,
			elementId : "#" + cloneId
		});
		objClone = new Draggable(objConf);
		objClone.render();
		objClone.setContainmentDiv(this.el);
		objClone.setID(cloneId);
		this[cloneId] = objClone;
		this.storeChilds(objClone, "draggables");
		this.addDraggableEvents(objClone);
		return objClone;
	};

	DndComp.prototype.DnDSuper = Container;

	/**
	 * To Destroy DndComp component.
	 * @memberof DndComp
	 * @param none objThis Intance of DndComp.
	 * @returns none.
	 */
	DndComp.prototype.destroy = function() {
		var i, objDrag, objDrop, arrDroppables, arrDraggables, strValue;
		strValue = this.model.get("droppables");
		if (strValue.length > 0) {
			arrDroppables = strValue.split("|");
			for ( i = 0; i < arrDroppables.length; i += 1) {
				objDrop = this[arrDroppables[i]];
				objDrop.off("drop");
				objDrop.off("over");
			}
		}

		strValue = this.model.get("draggables");
		if (strValue.length > 0) {
			arrDraggables = strValue.split("|");
			for ( i = 0; i < arrDraggables.length; i += 1) {
				objDrag = this[arrDraggables[i]];
				objDrag.off("start");
				objDrag.off("drag");
				objDrag.off("stop");
			}

		}
		return this.DnDSuper.prototype.destroy.call(this, true);
	};

	return DndComp;
});
