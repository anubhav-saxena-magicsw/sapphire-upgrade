/*jslint nomen: true */
/*globals MCQCompHelper,_,$, console,Backbone*/

define(['marionette', 'player/base/base-item-comp', 'player/components/list/model'],

/**
 * @class List
 * @augments BaseItemComp
 * @param {Object} obj .
 */

function(Marionette, BaseItemComp, Model) {
	'use strict';
	var Listcomp = BaseItemComp.extend({
		template : _.template(''),
		tagName : "select",
		isEnabled : true,
		/**
		 * Initialization begins here.
		 * @access private
		 * @memberof List
		 */
		initialize : function(obj) {
			this.model = new Model(obj);
			this.componentType = "list";
			this.objData = obj;//this property is being used in componentselector for editing.
		},

		onRender : function() {
			var i = 0, self = this, options = '', optionsList, selected;
			if (this.model.get('multiple') === "true" || this.model.get('multiple') === true) {
				this.$el.attr("multiple", "true");
			}
			optionsList = this.model.get('options');
			selected = this.model.get('selected');
			if (selected === undefined) {
				return;
			}
			if (!( selected instanceof Array)) {
				selected = [selected.trim()];
			}
			if (optionsList) {
				for ( i = 0; i < optionsList.length; i = i + 1) {
					if ((selected.indexOf(i.toString()) !== -1) || (selected.indexOf(optionsList[i].trim().toString()) !== -1)) {
						options += '<option selected="selected" value="' + optionsList[i] + '">' + optionsList[i] + '</option>';
					} else {
						options += '<option value="' + optionsList[i] + '">' + optionsList[i] + '</option>';
					}
				}
			}
			if (this.objData.styleClass !== undefined) {
				if(this.objData.dir){
					$(this.textBoxRef).attr('dir',this.objData.dir);
				}
			}
			this.$el.empty().append(options);
			this.$el.addClass(this.styleClass());
			if (this.bEditor === false) {
				this.$el.on("click", $.proxy(self.compClick, self));
				this.$el.on("mouseover", $.proxy(self.compRollover, self));
				this.$el.on("mouseout", $.proxy(self.compRollout, self));
				this.$el.on("change", $.proxy(self.compOnchange, self));
			}
		},

		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		}
	});

	Listcomp.prototype.ListcompSuper = BaseItemComp;

	/**
	 * This method is bind with the 'Click' Event of List
	 * Method is responsible to dispatch 'compClick' Event.
	 * @param {none}
	 * @return none
	 * @memberof List#
	 * @access private
	 */
	Listcomp.prototype.compClick = function(objEvent) {
		if (this.isEnabled === true) {
			this.customEventDispatcher("click", this, this.data());
		}
	};

	/**
	 * This method is bind with the 'change' Event
	 * Method is responsible to dispatch 'compOnchange' Event.
	 * @param {Boolean} bSelect The state of List.
	 * @return none
	 * @memberof List#
	 * @access private
	 */
	Listcomp.prototype.compOnchange = function(objEvent) {
		var selected = this.$el.val();

		if (this.isEnabled === true) {
			if (!( selected instanceof Array)) {
				selected = [selected];
			}
			this.model.set("selected", undefined);
			this.model.set("selected", selected);
			this.customEventDispatcher("change", this, objEvent);
		}
	};
	/**
	 * This method is bind with the 'rollover' Event
	 * Method is responsible to dispatch 'compRollover' Event.
	 * @param {Boolean} bSelect The state of List.
	 * @return none
	 * @memberof List#
	 * @access private
	 */
	Listcomp.prototype.compRollover = function(objEvent) {
		if (this.isEnabled === true) {
			this.customEventDispatcher("mouseover", this, objEvent);
		}
	};
	/**
	 * This method is bind with the 'rollout' Event of List
	 * Method is responsible to dispatch 'compRollout' Event.
	 * @param {none}
	 * @return none
	 * @memberof List#
	 * @access private
	 */
	Listcomp.prototype.compRollout = function(objEvent) {
		if (this.isEnabled === true) {
			this.customEventDispatcher("mouseout", this, objEvent);
		}
	};
	Listcomp.prototype.enable = function() {
		this.isEnabled = true;
		this.$el.removeClass('disabled');
	};

	Listcomp.prototype.disable = function() {
		this.isEnabled = false;
		this.$el.addClass('disabled');
	};

	/**
	 * Custom data can be associated or retrived with List by this method.
	 * @memberof List
	 * @param {Object} The data is to be associate with List. If nothing is passed then it would return the data assciated.
	 * @returns {Object} If argument is not provided.
	 *
	 */
	Listcomp.prototype.data = function(arg) {
		if (arg) {
			this.model.set("data", arg);
		} else {
			return this.model.get("data");
		}
	};
	Listcomp.prototype.setText = function(strText) {
		this.model.set('selected', strText);
		this.render();
	};
	Listcomp.prototype.styleClass = function(arg) {
		if (arg) {
			this.model.set("styleClass", arg);
		} else {
			return this.model.get("styleClass");
		}
	};
	/**
	 * Destroys List instance.
	 * @memberof List
	 * @param none.
	 * @returns none.
	 *
	 */
	Listcomp.prototype.destroy = function() {
		this.$el.off("click");
		this.$el.off("mouseover");
		this.$el.off("mouseout");
		return this.ListcompSuper.prototype.destroy.call(this, true);
	};

	return Listcomp;
});

