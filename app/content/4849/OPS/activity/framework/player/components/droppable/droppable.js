/*jslint nomen: true */
/*globals MCQCompHelper,_,$,console,Backbone*/

define(['marionette', 'components/container', 'components/droppable/model', 'jqueryTouchPunch'],

/**
 * @class Droppable
 * @augments Container
 * @param {Object} obj .
 */

function(Marionette, Container, Model) {
	'use strict';
	var Droppable = Container.extend({
		template : _.template(''),
		objData : null,
		dId : undefined,
		$droppable : undefined,
		feedback : null,
		objHint : null,
		/**
		 * Initialization begins here.
		 * @access private
		 * @memberof Droppable
		 */
		initialize : function(obj) {
			this.objData = obj;
			//this property is being used in componentselector for editing.
			this.model = new Model(obj);
			this.componentType = "droppable";
		},

		onRender : function() {
			if (this.objData.elementId === undefined) {
				this.$droppable = this.$el;
			} else if (this.objData.elementId.toString().charAt(0) == "#") {
				this.dId = this.objData.elementId.toString();
				this.$droppable = $(this.dId);
			} else {
				throw new Error("Error : Please pass some valid id selector");
			}

			if (this.objData !== undefined && this.objData.updatedScale !== undefined) {
				this.setStageScaleValue(this.objData.updatedScale);
			}

			this.makeDroppable();
		},
		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		}
	});

	Droppable.prototype.addChild = function(objChild) {
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

	Droppable.prototype.showFeedback = function(bVal) {
		if (this.feedback) {
			this.feedback.showFeedback(bVal);
		}
	};

	Droppable.prototype.hideFeedback = function() {
		if (this.feedback) {
			this.hideFeedback();
		}
	};

	Droppable.prototype.showHint = function() {
		if (this.objHint !== null) {
			this.objHint.showHint();
		}
	};

	Droppable.prototype.hideHint = function() {
		if (this.objHint !== null) {
			this.objHint.hideHint();
		}
	};

	Droppable.prototype.isValid = function(strCompType) {
		var bValid = false;
		bValid = (strCompType === "draggable" || strCompType === "droppable" || strCompType === "dnd") ? false : true;
		return bValid;
	};

	/**
	 * Create the jQuery Droppable features at Selector.
	 * @memberof Droppable
	 * @param none.
	 * @returns none.
	 */

	Droppable.prototype.makeDroppable = function() {
		var self = this, data = {};
		setTimeout(function() {
			self.$droppable.css("position", "absolute");
		}, 0);
		this.$droppable.addClass(self.styleClass());
		if (this.bEditor) {
			return;
		}
		self.$droppable.droppable({
			drop : function(event, ui) {
				data.ui = ui;
				data.event = event;
				self.customEventDispatcher("drop", self, data);
			},
			activeClass : self.activeClass(),
			hoverClass : self.hoverClass(),
			over : function(event, ui) {
				data.ui = ui;
				data.event = event;
				self.customEventDispatcher("over", self, data);
			}
		});
	};

	/**
	 * Enable the Droppable Method on selector.
	 * @memberof Droppable
	 * @param none.
	 * @returns none.
	 */
	Droppable.prototype.enable = function() {
		this.$droppable.droppable("enable");
	};

	/**
	 * Disable the Droppable Method on selector.
	 * @memberof Droppable
	 * @param none.
	 * @returns none.
	 */

	Droppable.prototype.disable = function() {
		this.$droppable.droppable("disable");
	};

	Droppable.prototype.setValue = function(val) {
		this.model.set("value", val);
	};

	Droppable.prototype.getValue = function() {
		return this.model.get("value");
	};

	Droppable.prototype.data = function(arg) {
		if (arg) {
			this.model.set("data", arg);
		} else {
			return this.model.get("data");
		}
	};

	Droppable.prototype.styleClass = function(arg) {
		if (arg) {
			this.model.set("styleClass", arg);
		} else {
			return this.model.get("styleClass");
		}
	};

	Droppable.prototype.activeClass = function(arg) {
		if (arg) {
			this.model.set("activeClass", arg);
		} else {
			return this.model.get("activeClass");
		}
	};

	Droppable.prototype.hoverClass = function(arg) {
		if (arg) {
			this.model.set("hoverClass", arg);
		} else {
			return this.model.get("hoverClass");
		}
	};

	Droppable.prototype.isEmpty = function() {
		return (this.model.get("filledWith").length > 0 ? false : true);
	};

	Droppable.prototype.Super = Container;

	/**
	 * Destroys Droppable instance.
	 * @memberof Droppable
	 * @param none.
	 * @returns none.
	 *
	 */
	Droppable.prototype.destroy = function() {
		//TODO
		this.$droppable.droppable({});
		this.$droppable.droppable("destroy");
		return this.Super.prototype.destroy(true);
	};

	return Droppable;
});

