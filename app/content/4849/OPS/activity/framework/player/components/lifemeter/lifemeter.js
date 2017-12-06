/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/

define(['marionette', 'player/base/base-composite-comp', 'text!components/lifemeter/template/lifemeter.html', 'css!components/lifemeter/template/css/lifemeter.css', 'components/lifemeter/model/lifemeter-model', 'components/lifemeter/js/life', 'components/lifemeter/js/lifemeter-constants'],

/**
 * A class representing a LifeMeter.<br>
 * LifeMeter is a component which intializes with some numbers of lives, and provides the methods to increase or decrease lives between 0 to initial value.
 * The main use of this component is in situation when you have to show the user that there are certain number of attempts to perform some task.
 * These attempts are symbolized via divs (can be custumized for look and feel via css) each represents an attempt.
 * At completion of any attempt the available attempts can be reduced via provided method for losing life.
 * There could be situation when in the middle user is rewarded an attempt. This can be achieved with provided method for gaining life.
 *
 * @class LifeMeter
 * @augments BaseCompositeComp
 * @param {Object} obj  An object with 'total','changeOrder' and 'iconClasses' properties.
 * @example
 *
 * var objConfig = {
 * total : 3 ,		// There should be 3 lives in total.
 * changeOrder : "CHANGE_ORDER_ASCENDING",	// In which order the lives gained or lose. There are two possible orders (CHANGE_ORDER_ASCENDING/CHANGE_ORDER_DESCENDING).
 * iconClasses :	["class1","class2","class3"] // The classes that will get applied on life divs respectively.
 * };
 *
 * //Note: By defualt class.active state is applied on life divs. So in css you have to define active states as well.
 * // Also if insufficient classes are provided then classes are applied in circular manner untill all life divs are covered.
 *
 * var lifemeterComp;
 * this.getComponent(this, "LifeMeter", "onComponentCreationComplete", objConfig );
 *
 * function onComponentCreationComplete(objComp){
 * lifemeterComp = objComp;
 * }
 */

function(Marionette, BaseCompositeComp, htmlLifeMeter, cssLifeMeter, LifeMeterModel, Life, LifeMeterConstants) {'use strict';
	var LifeMeter = BaseCompositeComp.extend({
		template : _.template(htmlLifeMeter),
		itemView : Life,
		tagName : 'div',
		className : 'lifeMeterLayout',
		/**
		 * Initialization begins here.
		 * @access private
		 * @memberof LifeMeter
		 */
		initialize : function(obj) {

			this.model = new LifeMeterModel();
			this.initializeModel(obj);

			var LifeViewModel, Coll, arrlifeViewModel, arrIconClasses, i, strClass, index, lifeViewModel;
			LifeViewModel = Backbone.Model.extend({
				defaults : {
					lifeclass : "",
					state : 1
				}
			});

			Coll = Backbone.Collection.extend({
				model : LifeViewModel
			});

			arrlifeViewModel = this.getFromModel("arrLifeModels");
			arrIconClasses = this.getFromModel("iconClasses");
			for ( i = 0; i < this.getFromModel("total"); i += 1) {
				strClass = "";
				if (i < arrIconClasses.length) {
					strClass = arrIconClasses[i];
				} else {
					index = i % arrIconClasses.length;
					strClass = arrIconClasses[index];
				}

				lifeViewModel = new LifeViewModel({
					lifeclass : strClass,
					state : 1
				});

				arrlifeViewModel.push(lifeViewModel);
			}

			this.collection = new Coll(arrlifeViewModel);
			arrlifeViewModel = null;
		},
		onRender : function() {
		},
		onShow : function() {
			var self = this;
			this.$el.on("click", $.proxy(self.compClick, self));
			this.$el.on("mouseover", $.proxy(self.compRollover, self));
			this.$el.on("mouseout", $.proxy(self.compRollout, self));
		},
		baseClass : BaseCompositeComp
	});

	LifeMeter.prototype.Super = BaseCompositeComp;
	/**
	 * Decrements Life .
	 * Removes the class.active state for the life div as per change order.
	 * @memberof LifeMeter
	 * @param none.
	 * @returns none.
	 * LIFE_ENDED Triggered when remaining life reaches to 0.
	 */
	LifeMeter.prototype.loseLife = function() {
		var arrlifeViewModel, index, lifeViewModel;

		if (this.getFromModel("remaining") <= 0) {
			console.error("No More Lives available");
			return;
		}
		this.setToModel("remaining", this.getFromModel("remaining") - 1);

		arrlifeViewModel = this.getFromModel("arrLifeModels");
		index = 0;

		if (this.getFromModel("changeOrder") === LifeMeterConstants.CONSTANTS.CHANGE_ORDER_DESCENDING) {
			index = this.getFromModel("remaining");
		} else {
			index = this.getFromModel("total") - (this.getFromModel("remaining") + 1);
		}

		lifeViewModel = arrlifeViewModel[index];
		lifeViewModel.set("state", 0);

		if (this.getFromModel("remaining") === 0) {
			this.trigger(LifeMeterConstants.EVENTS.LIFE_ENDED);
		}

	};

	/**
	 * Increments Life .
	 * Applies the class.active state for the life div as per change order.
	 * @memberof LifeMeter
	 * @param none.
	 * @returns none.
	 * LIFE_AT_MAX Triggered when remaining life reaches to MAX.
	 */
	LifeMeter.prototype.gainLife = function() {
		var arrlifeViewModel, index, lifeViewModel;
		if (this.getFromModel("remaining") < this.getFromModel("total")) {
			this.setToModel("remaining", this.getFromModel("remaining") + 1);
		} else {
			console.error("Lives cannot exceed beyond maximum.");
            throw new Error("Lives cannot exceed beyond maximum.");
		}

		arrlifeViewModel = this.getFromModel("arrLifeModels");
		index = 0;
		if (this.getFromModel("changeOrder") === LifeMeterConstants.CONSTANTS.CHANGE_ORDER_DESCENDING) {
			index = this.getFromModel("remaining") - 1;
		} else {
			index = this.getFromModel("total") - this.getFromModel("remaining");
		}

		lifeViewModel = arrlifeViewModel[index];
		lifeViewModel.set("state", 1);

		if (this.getFromModel("remaining") === this.getFromModel("total")) {
			this.trigger(LifeMeterConstants.EVENTS.LIFE_AT_MAX);
		}
	};
	/**
	 * Returns remaining lives .
	 * @memberof LifeMeter
	 * @param none.
	 * @returns {int} Remaining life.
	 *
	 */
	LifeMeter.prototype.getRemainingLife = function() {

		return this.getFromModel("remaining");
	};

	/**
	 * Resets lifemeter to as contructed .
	 * @memberof LifeMeter
	 * @param none.
	 * @returns none.
	 *
	 */
	LifeMeter.prototype.reset = function() {
		var arrlifeViewModel, i, objLifeViewModel;
		arrlifeViewModel = this.getFromModel("arrLifeModels");
		/*jslint plusplus: true*/
		for ( i = 0; i < arrlifeViewModel.length; i++) {
			objLifeViewModel = arrlifeViewModel[i];
			objLifeViewModel.set("state", 1);
		}
		this.setToModel("remaining", this.getFromModel("total"));
	};

	/**
	 * To Initialize lifemeter instance model.
	 * @memberof LifeMeter
	 * @param {Object} obj.
	 * @returns none.
	 * @access private
	 *
	 */
	LifeMeter.prototype.initializeModel = function(obj) {
		if (obj.total !== undefined) {
			this.model.set("total", obj.total);
			this.model.set("remaining", obj.total);
		}
		if (obj.changeOrder !== undefined) {
			this.model.set("changeOrder", obj.changeOrder);
		}
		if (obj.iconClasses !== undefined) {
			this.model.set("iconClasses", obj.iconClasses);
		}

	};

	/**
	 * To get value from lifemeter instance model.
	 * @memberof LifeMeter
	 * @param {String} strKey The key in model.
	 * @returns {Object} value Value could be any object.
	 * @access private
	 *
	 */
	LifeMeter.prototype.getFromModel = function(strKey) {
		var value = this.model.get(strKey);
		return value;
	};
	/**
	 * To get value from lifemeter instance model.
	 * @memberof LifeMeter
	 * @param {String} strKey The key in model.
	 * @param {Object} value The value/object to be stored in model for strKey.
	 * @returns none.
	 * @access private
	 *
	 */
	LifeMeter.prototype.setToModel = function(strKey, value) {
		this.model.set(strKey, value);
	};

	/**
	 * Destroys lifemeter instance.
	 * @memberof LifeMeter
	 * @param none.
	 * @returns none.
	 *
	 */
	LifeMeter.prototype.destroy = function() {
		var objThis, arrlifeViewModel, lifeViewModel;
		objThis = this;
		arrlifeViewModel = objThis.getFromModel("arrLifeModels");
		objThis.setToModel("total", 0);
		objThis.setToModel("arrlifeViewModel", []);
		objThis.setToModel("iconClasses", []);

		while (arrlifeViewModel.length) {
			lifeViewModel = arrlifeViewModel.pop();
			objThis.collection.remove(lifeViewModel);
			lifeViewModel.destroy();
			lifeViewModel = null;
		}

		arrlifeViewModel = null;
		objThis.model.destroy();
		objThis.model = null;
		objThis.colection = null;
		this.$el.off("click");
		this.$el.off("mouseover");
		this.$el.off("mouseout");

		return this.Super.prototype.destroy(true);
	};

	return LifeMeter;
});

