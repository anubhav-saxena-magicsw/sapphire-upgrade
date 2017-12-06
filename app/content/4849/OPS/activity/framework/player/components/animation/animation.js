/*jslint nomen: true */
/*globals MCQCompHelper,_,$,console,Backbone*/

define(['marionette', 'components/case/case', 'components/animation/model'],

/**
 *A module representing a LifeMeter.
 *@class LifeMeter
 * @augments Container
 *@access private
 */

function(Marionette, Case, Model) {
	'use strict';
	var Animation = Case.extend({
		objData : null,
		template : _.template(''),
		refChild : null,
		speed : null,
		continuous : null,
		workingState: false,
		currentIndex : 0,
		objDraggable : undefined,
		objDestination : null,
		initialize : function(obj) {
			this.objData = obj;
			//this property is being used in componentselector for editing.
			this.model = new Model(obj);
			this.componentType = "animation";
			this.speed = obj.speed;
			this.continuous = (obj.continuous === "true") ? true : false;
			this.dindex = obj.dindex;
			this.objDestination = obj.animation;
			if (obj.speed === '') {
				this.speed = 1000;
			}
		},
		onRender : function() {
			this.$el.addClass(this.styleClass());
		},
		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		},
		stateDict : {}
	});

	Animation.prototype.AnimationSuper = Case;

	Animation.prototype.ANIMATION_START = 'onAnimationStart';

	Animation.prototype.ANIMATION_COMPLETE = 'onAnimationComplete';

	/**
	 * This method is responsible to add child of that given component type
	 * in a dictionary name storeChilds
	 * @param {Object} objChild
	 * @return
	 * @access private
	 * @memberof Animation#
	 */
	Animation.prototype.addChild = function(objChild) {
		var childComp = objChild.component;
		this.refChild = childComp;
		this.AnimationSuper.prototype.addChild.call(this, objChild);
	};

	/**
	 * This method is responsible to check that given component type
	 * can be added in its dom or not
	 * will return true if given component type (in parameter) can be added
	 * in its dom.
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof Animation#
	 */
	Animation.prototype.isValid = function(strCompType) {
		var validComponent = true;
		if (strCompType === "radio" || strCompType === "answer" || strCompType === "hint") {
			validComponent = false;
		}
		return validComponent;
	};
	/**
	 * This method is responsible to check that given component type
	 * can be added in its dom or not
	 * will return true if given component type (in parameter) can be added
	 * in its dom.
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof Animation#
	 */
	Animation.prototype.storeChilds = function(objComp, strKey) {
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
			//this.model.set("remaining", arr.length);

			this.stateDict[objComp.getID()] = 1;
			return true;
		}
		return false;
	};

	/**
	 * This method is responsible to start animation
	 * @param {Number} indexToExecute // Which index of the array to execute from to do the animation
	 * @return {NULL}
	 * @access public
	 * @memberof Animation#
	 */
	Animation.prototype.startAnimation = function(indexToExecute, insideflag) {
		if(!indexToExecute){
			indexToExecute = 0;
		}

		if ( typeof this.objDestination[indexToExecute] !== undefined && (this.workingState === false || insideflag === true)) {
			this.currentIndex = indexToExecute;
			this.workingState = true;
			this.customEventDispatcher(this.ANIMATION_START, this, this);

			var startX = this.objDestination[indexToExecute].startx, startY = this.objDestination[indexToExecute].starty, endX = this.objDestination[indexToExecute].left, endY = this.objDestination[indexToExecute].top, rotate = this.objDestination[indexToExecute].rotate;

			this.startPosition(startX, startY);

			if (rotate !== undefined) {
				this.animateRotate(rotate, endX, endY);
			} else {
				this.doAnimate(endX, endY);
			}

		}

	};

	/**
	 * This method is responsible to take the object to the StartX point and StartY point
	 * which is given in the value of the animation array index.
	 * @param {string} left
	 * @param {string} top
	 * @return {NULL}
	 * @access private
	 * @memberof Animation#
	 */
	Animation.prototype.startPosition = function(left, top) {
		this.$el.css({
			'position' : 'absolute',
			'top' : top,
			'left' : left
		});
	};

	/**
	 * This method is responsible to take rotate the object to a given degree.
	 * @param {string} angle
	 * @param {string} endX
	 * @param {string} endY
	 * @param {Boolean} flag
	 * @return {NULL}
	 * @access private
	 * @memberof Animation#
	 */
	Animation.prototype.animateRotate = function(angle, endX, endY) {
		var scope = this;
		// we use a pseudo object for the animation
		// (starts from `0` to `angle`), you can name it as you want

		this.$el.animate({
			deg : angle
		}, {
			duration : parseInt(scope.speed),
			step : function(now) {
				// in the step-call-back (that is fired each step of the animation),
				// you can use the `now` parameter which contains the current
				// animation-position (`0` up to `angle`)
				scope.$el.css({
					'transform' : 'rotate(' + now + 'deg)',
					'-moz-transform' : 'rotate(' + now + 'deg)',
					'-webkit-transform' : 'rotate(' + now + 'deg)',
					'-o-transform' : 'rotate(' + now + 'deg)',
					'-ms-transform' : 'rotate(' + now + 'deg)'

				});
			},
			complete : function() {
				scope.doAnimate(endX, endY);
			}
		});

	};
	/**
	 * This method is responsible to animate the object to the specified position.
	 * @param {string} left
	 * @param {string} top
	 * @return {NULL}
	 * @access private
	 * @memberof Animation#
	 */
	Animation.prototype.doAnimate = function(left, top) {
		
		var scope = this;
		scope.$el.animate({
			'position' : 'absolute',
			'top' : top,
			'left' : left
		}, parseInt(scope.speed), function() {
			if (scope.continuous) {
				scope.currentIndex++;
				if (scope.currentIndex < scope.objDestination.length) {
					scope.startAnimation(scope.currentIndex, true);
				} else {
					scope.customEventDispatcher(scope.ANIMATION_COMPLETE, scope, scope);
					scope.workingState = false;
					scope.$el.prop("deg", 0);
				}
			} else {
				scope.customEventDispatcher(scope.ANIMATION_COMPLETE, scope, scope);
				scope.workingState = false;
				scope.$el.prop("deg", 0);
			}
		});
	};

	/**
	 * This method is responsible to reset animation
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 * @memberof Animation#
	 */
	Animation.prototype.resetAnimation = function() {
		this.currentIndex = 0;
		this.stopAnimation();
		this.$el.attr('style', '');
		this.$el.prop("deg", 0);

	};

	/**
	 * This method is responsible to stop animation
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 * @memberof Animation#
	 */
	Animation.prototype.stopAnimation = function() {
		this.workingState = false;
		this.$el.stop(true, false);
	};

	/**
	 * This method is responsible to apply styleClass on given component type
	 * will return set/get on  given component type (in parameter)
	 * @param {Object} arg
	 * @return {set/get styleClas}
	 * @access private
	 */
	Animation.prototype.styleClass = function(arg) {
		if (arg) {
			this.model.set("styleClass", arg);
		} else {
			return this.model.get("styleClass");
		}
	};

	/**
	 * To Destroy Animation component.
	 * @memberof Animation
	 * @returns none.
	 */
	Animation.prototype.destroy = function() {
		return this.AnimationSuper.prototype.destroy.call(this, true);
	};

	return Animation;
});
