/*jslint nomen: true */
/*globals MCQCompHelper,_,$,console,Backbone*/

define(['marionette', 'components/case/case', 'components/lives/model', 'components/life/life'],

/**
 *A module representing a LifeMeter.
 *@class LifeMeter
 * @augments Container
 *@access private
 */

function(Marionette, Case, Model, Life) {
	'use strict';
	var LifeMeter = Case.extend({
		objData : null,
		template : _.template(''),
		objDraggable : undefined,
		initialize : function(obj) {
			this.objData = obj;//this property is being used in componentselector for editing.
			this.model = new Model(obj);
			this.componentType = "lives";
		},
		onRender : function() {
			this.$el.addClass(this.styleClass());
		},
		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		},
		stateDict : {}
	});
	
	LifeMeter.prototype.LifeMeterSuper = Case;
	
	/**
	 * This method is responsible to add child of that given component type
	 * in a dictionary name storeChilds
	 * @param {Object} objChild
	 * @return
	 * @access private
	 * @memberof MultipleChoice#
	 */
	LifeMeter.prototype.addChild = function(objChild) {
		var childComp = objChild.component;
		if ( childComp instanceof Life) {
			this.storeChilds(childComp, "lives");
		} else if (this.bEditor) {
			// Do Nothing
		} else {
			console.warn("Lifemeter can only have Life kind of objects!!");
			return;
		}
		this.LifeMeterSuper.prototype.addChild.call(this, objChild);
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
	LifeMeter.prototype.isValid = function(strCompType) {
		var isvalid = false;
		isvalid = (strCompType === "life") ? true : false;
		return isvalid;
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
	LifeMeter.prototype.storeChilds = function(objComp, strKey) {
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
			this.model.set("remaining", arr.length);

			this.stateDict[objComp.getID()] = 1;
			return true;
		}
		return false;
	};

	

	LifeMeter.prototype.reset = function() {

	};
	/**
	 * This method is responsible to add life
	 * @param {Object} none
	 * @return {Boolean}
	 * @access private
	 * @memberof MultipleChoice#
	 */
	LifeMeter.prototype.gainlife = function() {
		var strLives, arrLives, nremaining, self = this, bDone = false;
		strLives = this.model.get("lives");
		if (strLives.length) {
			arrLives = strLives.split("|");
		}

		if (this.model.get("losingdirection") === "left_to_right") {
			arrLives.reverse();
		}

		$.each(arrLives, function(index, value) {
			if (self.stateDict[value] === 0 && !bDone) {
				self.stateDict[value] = 1;
				nremaining = self.model.get("remaining");
				nremaining += 1;
				self.model.set("remaining", nremaining);
				self[value].enable();
				bDone = true;
			}
		});
		
		if(bDone){
			this.customEventDispatcher("ongainlife", this, this.prepareEventData());
		}
	};
	
	
	
	/**
	 * This method is responsible to remove life
	 * will return
	 * in its dom.
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof MultipleChoice#
	 */
	LifeMeter.prototype.loselife = function() {
		var strLives, arrLives, nremaining, self = this, bDone = false;
		strLives = this.model.get("lives");
		if (strLives.length) {
			arrLives = strLives.split("|");
		}

		if (this.model.get("losingdirection") === "left_to_right") {
			// do nothing
		} else {
			arrLives.reverse();
		}

		$.each(arrLives, function(index, value) {
			if (self.stateDict[value] === 1 && !bDone) {
				self.stateDict[value] = 0;
				nremaining = self.model.get("remaining");
				nremaining -= 1;
				self.model.set("remaining", nremaining);
				self[value].disable();
				bDone = true;
			}
		});
		
		if(bDone){
			this.customEventDispatcher("onloselife", this, this.prepareEventData());
		}
	};
	
	LifeMeter.prototype.prepareEventData = function() {
		var obj = {},self = this;
		obj.remaining = self.model.get("remaining");
		return obj; 
	};
	
	/**
	 * This method is responsible to apply styleClass on given component type
	 * will return set/get on  given component type (in parameter)
	 * @param {Object} arg
	 * @return {set/get styleClas}
	 * @access private
	 */
	LifeMeter.prototype.styleClass = function(arg) {
		if (arg) {
			this.model.set("styleClass", arg);
		} else {
			return this.model.get("styleClass");
		}
	};

	/**
	 * To Destroy LifeMeter component.
	 * @memberof LifeMeter
	 * @param none objThis Intance of LifeMeter.
	 * @returns none.
	 */
	LifeMeter.prototype.destroy = function() {
		console.log("LifeMeter.prototype.LifeMeterSuper = Container;!!!!!!!!!!!!!!");
		return this.LifeMeterSuper.prototype.destroy.call(this, true);
	};

	return LifeMeter;
});
