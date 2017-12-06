/*jslint nomen: true*/

/*globals FIBCompHelper,_,$,console,Backbone*/

define(['marionette', 'components/container', 'components/fibcomp/model', 'components/inputtext/inputtext', 'components/case/case'],

/**
 *A module representing a FibComp.
 *@class FibComp
 * @augments Container
 *@access private
 */

function(Marionette, Container, Model, Inputtext, Case) {
	'use strict';
	var objClassRef,
	    FibComp = Container.extend({

		template : _.template(''),
		totalCorrect : null,
		totalIncorrect : null,
		totalAttempt : null,
		optionIndex : 0,
		count : 0,
		initialize : function(obj) {
			this.model = new Model(obj);
			objClassRef = this;
			this.objData = obj;
			//this property is being used in componentselector for editing.
		},
		onRender : function() {
			this.$el.addClass(this.styleClass());
		},
		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		}
	});
	/**
	 * To Add all childs in fib component.
	 * @memberof FibComp
	 * @param obj  Instance of Container.
	 * @returns none.
	 */
	FibComp.prototype.addChild = function(objChild) {

		var childComp = objChild.component,
		    type;
		if ( childComp instanceof Inputtext) {
			this.storeOptonsChilds(childComp);
		} else if ( childComp instanceof Case) {
			this.storeFeedbackChilds(childComp);
			this.optionIndex++;
		} else {
			// console.warn("FibComp needs Inputtext objects!!");

		}
		this.Super.prototype.addChild.call(this, objChild);
	};
	/**
	 * To Stroe Inputexts.
	 * @memberof FibComp
	 * @param obj and string  Instance of Container.
	 * @returns none.
	 */
	FibComp.prototype.storeOptonsChilds = function(objComp) {
		var arr;
		arr = this.model.get('lists');
		if (objComp.getID()) {
			arr.push(objComp.getID());
		}

	};
	/**
	 * To Stroe feedback Case.
	 * @memberof FibComp
	 * @param obj
	 * @returns none.
	 */
	FibComp.prototype.storeFeedbackChilds = function(objComp) {
		var arr = this.model.get('lists');
		if (objComp.getID()) {
			arr[this.optionIndex] = {
				feedback : objComp.getID(),
				optionId : arr[this.optionIndex]
			};
		}
	};
	/**
	 * To check the attempts made by user on fib.
	 * @memberof FibComp
	 * @param none.
	 * @returns none.
	 */
	FibComp.prototype.attempt = function() {
		var isCorrect = false;
		if (this.count === -1 && this.count === undefined) {
		} else {++this.count;
			if (this.count === parseInt(this.model.get("attempts"), 10)) {
				isCorrect = true;
				this.customEventDispatcher(this.ATTEMPT_OVER_EVENT, this, this);
			}
		}

	};

	/**
	 * To reset fib compontent.
	 * @memberof FibComp
	 * @param none.
	 * @returns none.
	 */
	FibComp.prototype.reset = function() {
		var TextFields,
		    i,
		    feedbackCorrect,
		    feedbackIncorrect;
		feedbackCorrect = this.model.get('styleCorrect');
		feedbackIncorrect = this.model.get('styleIncorrect');
		TextFields = this.model.get('lists');
		for (i in TextFields) {
			$('#' + TextFields[i].optionId).val("");
			$('#' + TextFields[i].feedback).removeClass(feedbackCorrect + ' ' + feedbackIncorrect);
			$('#' + TextFields[i].optionId).removeAttr('disabled');
		}
	};
	/**
	 * To check answers in  fib component.
	 * @memberof FibComp
	 * @param none.
	 * @returns none.
	 */
	FibComp.prototype.checkAnswer = function() {
		var i,
		    totalCorrect = [],
		    totalIncorrect = [],
		    totalAttempt = 0,
		    TextFields,
		    answers,
		    caseSensetive,
		    val,
		    feedbackCorrect,
		    feedbackIncorrect;
		TextFields = this.model.get('lists');
		answers = this.model.get('answer');
		caseSensetive = this.model.get('caseSensetive');
		feedbackCorrect = this.model.get('styleCorrect');
		feedbackIncorrect = this.model.get('styleIncorrect');
		if (!caseSensetive) {
			for (i in TextFields) {
				totalAttempt++;
				val = $('#' + TextFields[i].optionId).val();
				if (answers[i].toString().toLowerCase() === val.toString().toLowerCase()) {
					totalCorrect.push(1 + parseInt(i));
					$('#' + TextFields[i].feedback).removeClass(feedbackCorrect + ' ' + feedbackIncorrect).addClass(feedbackCorrect);
				} else {
					totalIncorrect.push(1 + parseInt(i));
					$('#' + TextFields[i].feedback).removeClass(feedbackCorrect + ' ' + feedbackIncorrect).addClass(feedbackIncorrect);

				}
			}
		} else {
			for (i in TextFields) {
				totalAttempt++;
				val = $('#' + TextFields[i].optionId).val();
				if (answers[i].toString() === val.toString()) {
					totalCorrect.push(1 + parseInt(i));
					$('#' + TextFields[i].feedback).removeClass(feedbackCorrect + ' ' + feedbackIncorrect).addClass(feedbackCorrect);
				} else {
					totalIncorrect.push(1 + parseInt(i));
					$('#' + TextFields[i].feedback).removeClass(feedbackCorrect + ' ' + feedbackIncorrect).addClass(feedbackIncorrect);
				}
			}
		}
		this.totalCorrect = totalAttempt;
		this.totalIncorrect = totalIncorrect;
		this.totalAttempt = totalAttempt;
	};
	/**
	 * To Enable FibComp component.
	 * @memberof FibComp
	 * @param none .
	 * @returns none.
	 */
	FibComp.prototype.enable = function() {
		var TextFields,
		    i;
		TextFields = this.model.get('lists');
		for (i in TextFields) {
			$('#' + TextFields[i].optionId).removeAttr('disabled');
		}
	};

	/**
	 * To Disable FibComp component.
	 * @memberof FibComp
	 * @param none.
	 * @returns none.
	 */
	FibComp.prototype.disable = function() {
		var TextFields,
		    i;
		TextFields = this.model.get('lists');
		for (i in TextFields) {
			$('#' + TextFields[i].optionId).attr('disabled', true);
		}
	};

	FibComp.prototype.data = function(arg) {
		if (arg) {
			this.model.set("data", arg);
		} else {
			return this.model.get("data");
		}
	};

	FibComp.prototype.styleClass = function(arg) {
		if (arg) {
			this.model.set("styleClass", arg);
		} else {
			return this.model.get("styleClass");
		}
	};

	FibComp.prototype.Super = Container;

	/**
	 * To Destroy FibComp component.
	 * @memberof FibComp
	 * @param none objThis Intance of FibComp.
	 * @returns none.
	 */
	FibComp.prototype.destroy = function() {
		delete this.model;
		delete this.totalCorrect;
		delete this.totalIncorrect;
		delete this.totalAttempt;
		delete this.optionIndex;
		return this.Super.prototype.destroy(true);
	};

	return FibComp;
});
