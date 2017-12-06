/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/

define(['marionette', 'components/container', 'components/sorting/model', 'components/sortable/sortable'],

/**
 *A module representing a Sorting.
 *@class Sorting
 * @augments Container
 *@access private
 */

function(Marionette, Container, Model, Sortable) {
	'use strict';
	var objClassRef,
	    Sorting = Container.extend({
		objData : null,
		objTimer : null,
		objSortable : undefined,
		template : _.template(''),
		initialize : function(obj) {
			this.objData = obj;
			//this property is being used in componentselector for editing.
			this.model = new Model(obj);
			objClassRef = this;
			this.setStageScaleValue(obj.updatedScale);
			this.componentType = "sorting";
		},
		onRender : function() {
			this.$el.attr("class", this.styleClass());
			this.reset();
		},
		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		}
	});

	Sorting.prototype.isValid = function(strCompType) {
		var bValid = false;
		bValid = (strCompType === "sortable" || strCompType === "label") ? true : false;
		return bValid;
	};

	Sorting.prototype.addChild = function(objChild) {
		var childComp = objChild.component;
		if ( childComp instanceof Sortable) {
			if (this.storeChilds(childComp, "sortables")) {
				this.addSortableEvents(childComp);
			}
		} else if (this.bEditor) {
			// Do Nothing
		} else {
			console.warn("Sorting can only have Sortable kind of objects!!");
			return;
		}
		this.Super.prototype.addChild.call(this, objChild);
	};

	Sorting.prototype.storeChilds = function(objComp, strKey) {
		var arr,
		    ind;
		arr = this.sortables();
		ind = arr.indexOf(objComp.getID());
		if (ind < 0) {
			arr.push(objComp.getID());
			this.model.set(strKey, arr.join("|"));
			return true;
		}
		return false;
	};

	Sorting.prototype.addSortableEvents = function(objComp) {
		var self = this;
		objComp.on(this.eventConst.CREATION_COMPLETE, function() {
			this.off(self.eventConst.CREATION_COMPLETE);
			self.onSortableCreationComplete(this);
		});
	};

	Sorting.prototype.onSortableCreationComplete = function(objComp) {
		var self = this;
		if (self.objTimer) {
			clearTimeout(self.objTimer);
		}
		self.objTimer = setTimeout(function() {
			self.objTimer = undefined;
			if (!self.bEditor) {
				self.shuffleSortables();
			}
			self.styleSortables();
		}, 100);
	};

	Sorting.prototype.shuffleSortables = function() {
		var i,
		    arr,
		    ci,
		    ri,
		    objSort,
		    tmp;
		if ((this.model.get("shuffle") !== "true") && (this.model.get("shuffle") !== true)) {
			return;
		}
		arr = this.sortables();
		ci = arr.length;
		while (0 !== ci) {
			ri = Math.floor(Math.random() * ci);
			ci -= 1;
			tmp = arr[ci];
			arr[ci] = arr[ri];
			arr[ri] = tmp;
		}
		this.model.set("sortables", arr.join("|"));
		for ( i = 0; i < arr.length; i += 1) {
			objSort = this[arr[i]];
			this.$el.append(objSort.$el);
		}
	};

	Sorting.prototype.styleSortables = function() {
		var arr,
		    ind,
		    index,
		    objSort,
		    L = 0,
		    T = 0,
		    W = 0,
		    H = 0,
		    self = this;
		L = parseFloat(this.$el.css("padding-left"));
		T = parseFloat(this.$el.css("padding-top"));
		arr = this.$el.children();
		for ( ind = 0; ind < arr.length; ind += 1) {
			objSort = arr.eq(ind);
			if (this.model.get("direction") === "HORIZONTAL") {
				objSort.css("float", "left");
				objSort.css("left", 0 + "px");
				objSort.css("top", 0 + "px");
				//L += objSort.outerWidth() + parseFloat(objSort.css("margin-left")) + parseFloat(objSort.css("margin-right"));
			} else if (this.model.get("direction") === "VERTICAL") {
				objSort.css("left", 0 + "px");
				objSort.css("top", 0 + "px");
				//T += objSort.outerHeight() + parseFloat(objSort.css("margin-top")) + parseFloat(objSort.css("margin-bottom"));
			}

		}

		W = this.$el.outerWidth() + parseFloat(this.$el.css("margin-left")) + parseFloat(this.$el.css("margin-right"));
		H = this.$el.outerHeight() + parseFloat(this.$el.css("margin-top")) + parseFloat(this.$el.css("margin-bottom"));

		if (self.objSortable === undefined) {
			setTimeout(function() {
				self.applySorting();
			}, 100);
		}

	};

	Sorting.prototype.applySorting = function() {
		var self = this;
		if (this.bEditor) {
			return;
		}
		this.objSortable = this.$el.sortable({
			start : function(event, ui) {
				self.startL = parseFloat(ui.helper.css("left"));
				self.startT = parseFloat(ui.helper.css("top"));
				self.startX = event.clientX;
				self.startY = event.clientY;
				if (self.placeholder().length) {
					ui.placeholder.css("visibility", "visible");
					ui.placeholder.addClass(self.placeholder());
					if (self.model.get("direction") === "HORIZONTAL") {
						ui.placeholder.css("float", "left");
						ui.placeholder.width(ui.helper.width());
					}
				}
				objClassRef.customEventDispatcher("start", objClassRef, {
					"event" : event,
					"ui" : ui
				});
			},
			update : function(event, ui) {
				self.styleSortables();
				objClassRef.customEventDispatcher("update", objClassRef, {
					"event" : event,
					"ui" : ui
				});
			},
			sort : function(event, ui) {
				var nUpdatedX,
				    nUpdatedY,
				    scale;
				scale = self.getStageScaleValue();
				if (scale === 1) {
					return;
				}
				nUpdatedX = self.startL + (event.clientX - self.startX) / scale;
				nUpdatedY = self.startT + (event.clientY - self.startY) / scale;
				ui.helper.css("left", nUpdatedX + "px");
				ui.helper.css("top", nUpdatedY + "px");
				objClassRef.customEventDispatcher("sort", objClassRef, {
					"event" : event,
					"ui" : ui
				});
			},
			stop : function(event, ui) {
				self.styleSortables();
				objClassRef.customEventDispatcher("stop", objClassRef, {
					"event" : event,
					"ui" : ui
				});
			},
			scroll : false
		});
	};

	Sorting.prototype.placeholder = function(str) {
		if (str) {
			this.model.set("placeholder", str);
		} else {
			return this.model.get("placeholder");
		}
	};

	Sorting.prototype.sortables = function() {
		var arr,
		    strValue;
		strValue = this.model.get("sortables");
		if (strValue.length > 0) {
			arr = strValue.split("|");
		} else {
			arr = [];
		}
		return arr;
	};

	Sorting.prototype.checkAnswer = function() {
		var arr,
		    arrVal,
		    ind,
		    i,
		    objSort,
		    strValue,
		    bCorrect = false;
		arrVal = [];
		arr = this.sortables();
		for ( i = 0; i < arr.length; i += 1) {
			objSort = this[arr[i]];
			ind = this.$el.children().index(objSort.$el);
			arrVal[ind] = objSort.value();
		}
		strValue = arrVal.join("|");

		if (strValue === this.model.get("answer")) {
			bCorrect = true;
		}
		objClassRef.customEventDispatcher("onCheckAnswer", objClassRef, bCorrect);
		return bCorrect;
	};

	Sorting.prototype.reset = function() {
		var arr,
		    objSort,
		    i;
		arr = this.sortables();
		for ( i = 0; i < arr.length; i += 1) {
			objSort = this[arr[i]];
			objSort.$el.removeAttr("style");
			this.$el.append(objSort.$el);
		}
		if (this.objSortable) {
			this.$el.sortable("destroy");
			this.objSortable = undefined;
		}
		this.styleSortables();

	};

	/**
	 * To Enable Sorting component.
	 * @memberof Sorting
	 * @param none objThis Intance of Sorting.
	 * @returns none.
	 */
	Sorting.prototype.enable = function() {
		this.$el.sortable("enable");
	};

	/**
	 * To Disable Sorting component.
	 * @memberof Sorting
	 * @param none objThis Intance of Sorting.
	 * @returns none.
	 */
	Sorting.prototype.disable = function() {
		this.$el.sortable("disable");
	};

	Sorting.prototype.data = function(arg) {
		if (arg) {
			this.model.set("data", arg);
		} else {
			return this.model.get("data");
		}
	};

	Sorting.prototype.styleClass = function(arg) {
		if (arg) {
			this.model.set("styleClass", arg);
		} else {
			return this.model.get("styleClass");
		}
	};

	Sorting.prototype.Super = Container;

	/**
	 * To Destroy Sorting component.
	 * @memberof Sorting
	 * @param none objThis Intance of Sorting.
	 * @returns none.
	 */
	Sorting.prototype.destroy = function() {

		return this.Super.prototype.destroy(true);
	};

	return Sorting;
});
