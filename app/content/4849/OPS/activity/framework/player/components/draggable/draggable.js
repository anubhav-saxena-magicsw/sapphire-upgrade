/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/

define(['marionette', 'components/container', 'components/draggable/model', 'jqueryTouchPunch'],

/**
 *A module representing a Draggable.
 *@class Draggable
 * @augments Container
 *@access private
 */

function(Marionette, Container, Model) {
	'use strict';
	var Draggable = Container.extend({
		objData : null,
		template : _.template(''),
		dId : undefined,
		$draggable : undefined,
		containmentDiv : undefined,
		originalPos : undefined,
		currentPos : undefined,
		feedback : null,
		objHint : null,
		initialize : function(obj) {
			this.$draggable = undefined;
			this.originalPos = undefined;
			this.currentPos = undefined;
			this.objData = obj;
			//this property is being used in componentselector for editing.
			this.model = new Model(obj);
			this.componentType = "draggable";
		},
		onRender : function() {
			if (this.objData.elementId === undefined) {
				this.$draggable = this.$el;
			} else if (this.objData.elementId.toString().charAt(0) == "#") {
				this.dId = this.objData.elementId.toString();
				this.$draggable = $(this.dId);
				this.$el = this.$draggable;
				this.el = this.$draggable[0];

			} else {
				throw new Error("Error : Please pass some valid id selector");
			}

			if (this.objData.containment !== undefined && this.objData.containment.toString().charAt(0) == "#") {
				this.containmentDiv = $(this.objData.containment.toString());
			}

			if (this.objData !== undefined && this.objData.updatedScale !== undefined) {
				this.setStageScaleValue(this.objData.updatedScale);
			}
			this.$draggable.attr("class", this.styleClass());
			this._makeDraggable(this.$draggable);

		},
		onPlayerResizeEvent : function() {
			this.handleScaling();
		},

		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		},

		onAttach : function() {
			console.log("draggable attached....... in DOM");
		}
	});

	Draggable.prototype.addChild = function(objChild) {
		var childComp = objChild.component, type;
		if (childComp.componentType === "hint") {
			this.objHint = childComp;
			if (this.bEditor === false) {
				this.objHint.hideHint();
			}
		} else if (childComp.componentType === "feedback") {
			this.feedback = childComp;
			if (this.bEditor === false) {
				this.feedback.hide();
			}
		}
		this.Super.prototype.addChild.call(this, objChild);
	};

	Draggable.prototype.showFeedback = function(bVal) {
		if (this.feedback) {
			this.feedback.showFeedback(bVal);
		}
	};

	Draggable.prototype.hideFeedback = function() {
		if (this.feedback) {
			this.hideFeedback();
		}
	};

	Draggable.prototype.showHint = function() {
		if (this.objHint !== null) {
			this.objHint.showHint();
		}
	};

	Draggable.prototype.hideHint = function() {
		if (this.objHint !== null) {
			this.objHint.hideHint();
		}
	};

	Draggable.prototype.isValid = function(strCompType) {
		var bValid = false;
		bValid = (strCompType === "draggable" || strCompType === "droppable" || strCompType === "dnd") ? false : true;
		return bValid;
	};
	/**
	 * To create draggable component.
	 * @memberof Draggable
	 * @param none objThis Intance of Draggable.
	 * @returns none.
	 * @access private
	 */
	Draggable.prototype._makeDraggable = function($draggable) {
		var pos, self = this;
		setTimeout(function() {
			$draggable.css("position", "absolute");
		}, 0);

		if (this.bEditor) {
			return;
		}
		$draggable.draggable({
			start : function(event, ui) {
				self.start = {};
				var data = {
					event : event,
					ui : ui
				};
				if (self.originalPos === undefined) {
					self.originalPos = {
						left : ui.originalPosition.left,
						top : ui.originalPosition.top
					};
				}
				self.currentPos = {
					left : ui.position.left,
					top : ui.position.top
				};
				self.start.x = event.clientX;
				self.start.y = event.clientY;
				self.customEventDispatcher("start", self, data);
			},
			drag : function(event, ui) {
				var nUpdatedX, nUpdatedY, cont, data = {
					event : event,
					ui : ui
				};
				nUpdatedX = ui.originalPosition.left + (event.clientX - self.start.x) / self.getStageScaleValue();
				nUpdatedY = ui.originalPosition.top + (event.clientY - self.start.y) / self.getStageScaleValue();
				cont = self.containementCordinates();

				if (nUpdatedX < cont.left) {
					nUpdatedX = cont.left;
				} else if (nUpdatedX > cont.right) {
					nUpdatedX = cont.right;
				}
				if (nUpdatedY < cont.top) {
					nUpdatedY = cont.top;
				} else if (nUpdatedY > cont.bottom) {
					nUpdatedY = cont.bottom;
				}

				ui.position.left = nUpdatedX;
				ui.position.top = nUpdatedY;

				self.currentPos = {
					left : nUpdatedX,
					top : nUpdatedY
				};
				self.customEventDispatcher("drag", self, data);
			},

			stop : function(event, ui) {
				var data = {
					event : event,
					ui : ui
				};
				self.currentPos = {
					left : ui.position.left,
					top : ui.position.top
				};
				self.customEventDispatcher("stop", self, data);
			},
			scroll : false

		});

		if (this.model.get("clone") === "true" || this.model.get("clone") === true) {
			$draggable.draggable({
				helper : "clone"
			});
		}

	};

	Draggable.prototype.setValue = function(val) {
		this.model.set("value", val);
	};

	Draggable.prototype.getValue = function() {
		return this.model.get("value");
	};

	Draggable.prototype.enableCloning = function() {
		this.model.set("clone", true);
		if (this.$draggable) {
			this.$draggable.draggable({
				helper : "clone"
			});
		}
	};

	Draggable.prototype.disableCloning = function() {
		this.model.set("clone", false);
		if (this.$draggable) {
			this.$draggable.draggable({
				helper : "original"
			});
		}
	};

	Draggable.prototype.getClone = function() {
		var $clone, count = 0;
		if (this.model.get("clone") === "true" || this.model.get("clone") === true) {
			if (this.$draggable) {
				$clone = this.$draggable.clone();
				count = this.model.get("cloneCounter");
				this.model.set("cloneCounter", parseInt(count + 1, 10));
			}
		}
		return $clone;
	};

	Draggable.prototype.containementCordinates = function() {
		var self = this, left, top, right, bottom;
		if (self.containmentDiv) {
			left = 0;
			top = 0;
			right = left + this.containmentDiv.width() - this.$draggable.width();
			bottom = top + this.containmentDiv.height() - this.$draggable.height();
		} else {
			left = 0;
			top = 0;
			right = left + $(this.$el.parent()).width() - this.$draggable.width();
			bottom = top + $(this.$el.parent()).height() - this.$draggable.height();
		}
		return {
			left : left,
			top : top,
			right : right,
			bottom : bottom
		};
	};

	Draggable.prototype.revertBack = function(bAnimate) {
		var self = this, time;

		if (self.originalPos === undefined) {
			return;
		}
		if (bAnimate === false) {
			this.$draggable.css("left", self.originalPos.left + "px");
			this.$draggable.css("top", self.originalPos.top + "px");
			self.customEventDispatcher("revertComplete", self, self);
			return;
		}
		this.$draggable.animate({
			left : self.originalPos.left,
			top : self.originalPos.top
		}, {
			complete : function(e) {
				self.customEventDispatcher("revertComplete", self, e);
			},
			progress : function(e) {
				self.customEventDispatcher("revertProgress", self, e);
			}
		});
	};

	Draggable.prototype.setOriginalPosition = function(objPos) {
		if (parseFloat(objPos.left) !== isNaN && parseFloat(objPos.top) !== isNaN) {
			this.originalPos = {};
			this.originalPos.left = parseFloat(objPos.left);
			this.originalPos.top = parseFloat(objPos.top);
		}
	};

	Draggable.prototype.setCurrentPosition = function(objPos) {
		if (parseFloat(objPos.left) !== isNaN && parseFloat(objPos.top) !== isNaN) {
			this.currentPos = {};
			this.currentPos.left = parseFloat(objPos.left);
			this.currentPos.top = parseFloat(objPos.top);
			this.$draggable.css("left", this.currentPos.left);
			this.$draggable.css("top", this.currentPos.top);
		}
	};

	Draggable.prototype.setCurrentPositionToOriginalPosition = function() {
		if (this.currentPos !== undefined) {
			this.originalPos = this.currentPos;
		}
	};

	/**
	 * To Enable draggable component.
	 * @memberof Draggable
	 * @param none objThis Intance of Draggable.
	 * @returns none.
	 */
	Draggable.prototype.enable = function() {
		this.$draggable.draggable("enable");
	};

	/**
	 * To Disable draggable component.
	 * @memberof Draggable
	 * @param none objThis Intance of Draggable.
	 * @returns none.
	 */
	Draggable.prototype.disable = function() {
		this.$draggable.draggable("disable");
	};

	Draggable.prototype.setContainmentDiv = function(div) {
		this.containmentDiv = $(div);
	};

	Draggable.prototype.data = function(arg) {
		if (arg) {
			this.model.set("data", arg);
		} else {
			return this.model.get("data");
		}
	};

	Draggable.prototype.styleClass = function(arg) {
		if (arg) {
			this.$el.removeClass(this.model.get("styleClass"));
			this.model.set("styleClass", arg);
			this.$el.addClass(arg);
		} else {
			return this.model.get("styleClass");
		}
	};

	Draggable.prototype.setZindex = function(num) {
		this.$el.css("z-index", num);
	};

	Draggable.prototype.handleScaling = function() {
	};

	Draggable.prototype.Super = Container;

	/**
	 * To Destroy draggable component.
	 * @memberof Draggable
	 * @param none objThis Intance of Draggable.
	 * @returns none.
	 */
	Draggable.prototype.destroy = function() {
		//TODO
		this.$draggable.draggable({});
		this.$draggable.draggable("destroy");
		return this.Super.prototype.destroy(true);
	};

	return Draggable;
});
