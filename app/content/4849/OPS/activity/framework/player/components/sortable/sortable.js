/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/

define(['marionette', 'components/container', 'components/sortable/model'],

/**
 *A module representing a Sortable.
 *@class Sortable
 * @augments Container
 *@access private
 */

function(Marionette, Container, Model) {
	'use strict';
	var Sortable = Container.extend({
		objData : null,
		template : _.template(''),
		initialize : function(obj) {
			this.objData = obj;//this property is being used in componentselector for editing.
			this.model = new Model(obj);
			this.componentType = "sortable";
		},
		onRender : function() {
			this.$el.attr("class",this.styleClass());
		},
		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		}
	});

	Sortable.prototype.enable = function() {
		this.$Sortable.Sortable("enable");
	};

	/**
	 * To Disable Sortable component.
	 * @memberof Sortable
	 * @param none objThis Intance of Sortable.
	 * @returns none.
	 */
	Sortable.prototype.disable = function() {
		this.$Sortable.Sortable("disable");
	};
	
	Sortable.prototype.value = function(value) {
		if(value){
			this.model.set("value",value);
		}else{
			return this.model.get("value");
		}
	};
	
	Sortable.prototype.data = function(arg) {
		if (arg) {
			this.model.set("data", arg);
		} else {
			return this.model.get("data");
		}
	};

	Sortable.prototype.styleClass = function(arg) {
		if (arg) {
			this.model.set("styleClass", arg);
		} else {
			return this.model.get("styleClass");
		}
	};

	Sortable.prototype.Super = Container;

	/**
	 * To Destroy Sortable component.
	 * @memberof Sortable
	 * @param none objThis Intance of Sortable.
	 * @returns none.
	 */
	Sortable.prototype.destroy = function() {
		//TODO
		return this.Super.prototype.destroy(true);
	};

	return Sortable;
});
