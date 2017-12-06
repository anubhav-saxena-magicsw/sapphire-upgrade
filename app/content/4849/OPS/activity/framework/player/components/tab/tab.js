/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * TabComp
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['components/case/case', 'css!components/tab/css/tab.css'], function(Case) {
	'use strict';
	var TabComp;
	var scope;
	/**
	 * @class TabComp
	 *
	 *
	 */

	TabComp = Case.extend({
		objData : null,
		template : _.template(''),
		objChild : [],

		initialize : function(objData) {
			scope = this;
			this.objData = objData;//this property is being used in componentselector for editing.
			this.componentType = "tab";
		},

		onRender : function() {
			if (this.objData.styleClass !== undefined) {

				$(this.$el).addClass(this.objData.styleClass);
				$(this.$el).attr('id', this.strCompId);

				if (this.objData.view === this.TAB_VIEW_HORIZONTAL) {
					this.$el.addClass(this.TAB_VIEW_HORIZONTAL).removeClass(this.TAB_VIEW_VERTICAL);

				} else if (this.objData.view == this.TAB_VIEW_VERTICAL) {

					this.$el.addClass(this.TAB_VIEW_VERTICAL).removeClass(this.TAB_VIEW_HORIZONTAL);
				} else if (this.objData.view == this.TAB_VIEW_DROPDOWN && this.bEditor === false) {

					this.$el.append('<select ><option value="0"></option></select>');

					this.$el.find('select').on('change', function() {
						//scope.customEventDispatcher(scope.TAB_CHILD_CLICK, scope, $(this).val());
						scope.changeIndex(($(this).val()));
					});

				} else if (this.objData.view == this.TAB_VIEW_DROPDOWN && this.bEditor === true) {
					this.$el.addClass(this.TAB_VIEW_VERTICAL).removeClass(this.TAB_VIEW_HORIZONTAL);
				}

			}

		},

		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		}
	});

	/** TabChangeEvent **/
	TabComp.prototype.TAB_CHILD_CLICK = "tabChange";

	/** TabEnableEvent **/
	TabComp.prototype.TAB_ENABLED = "tabEnable";

	/** TabDisableEvent **/
	TabComp.prototype.TAB_DISABLED = "tabDisable";

	TabComp.prototype.TAB_ACTIVE_CLASS = "btnActive";

	TabComp.prototype.TAB_DISABLED_CLASS = "disableTab";

	TabComp.prototype.TAB_VIEW_HORIZONTAL = "horizontal";

	TabComp.prototype.TAB_VIEW_VERTICAL = "vertical";

	TabComp.prototype.TAB_VIEW_DROPDOWN = "dropdown";

	/**
	 * This method is responsible to check that given component type
	 * can be added in its dom or not
	 * will return true if given component type (in parameter) can be added
	 * in its dom.
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof TabComp#
	 */
	TabComp.prototype.isValid = function(strCompType) {
		var bValid;
		bValid = (strCompType === "button") ? true : false;
		return bValid;
	};

	/**
	 * Store child reference and pass child to its super class
	 *
	 * @access private
	 * @memberof TabComp#
	 */
	TabComp.prototype.addChild = function(objChild) {

		var length = this.objChild.length;
		objChild.component.index = parseInt(length + 1);
		objChild.component.$el.attr('index', parseInt(length + 1));
		this.objChild[length] = objChild.component;

		if (this.objData.view !== this.TAB_VIEW_DROPDOWN || this.bEditor === true) {

			this.TabCompSuper.prototype.addChild.call(this, objChild);

			//if (parseInt(this.objData.index) === parseInt(length + 1) && this.bEditor === false) {
			//	$(objChild.component.$el).addClass(this.TAB_ACTIVE_CLASS);
			//}

		}

		if (this.objData.view == this.TAB_VIEW_DROPDOWN && this.bEditor === false) {
			//if (parseInt(this.objData.index) === parseInt(length + 1)) {
			//	$(this.$el).find('select').append('<option value="' + parseInt(length + 1) + '" selected>' + objChild.component.options.label + '</option>');

			//} else {
			$(this.$el).find('select').append('<option value="' + parseInt(length + 1) + '">' + objChild.component.options.label + '</option>');
			//}
		}

		objChild.component.$el.on('click', function() {
			scope.changeIndex(($(this).attr('index')));

			//scope.customEventDispatcher(scope.TAB_CHILD_CLICK, scope, objChild.component.index);
		});

		if (this.bEditor === false) {
			this.defaultIndex(this.objData.index);
		}

		if (this.objData.view === this.TAB_VIEW_VERTICAL) {
			objChild.component.$el.addClass('verticalBtn').removeClass('horizontalBtn');
			//objChild.component.$el.css({
			//	'display' : 'block'
			//});

		}
	};

	/**
	 * Give child reference while removing Child
	 *
	 * @access private
	 * @memberof TabComp#
	 */
	TabComp.prototype.removeChild = function(objChild) {

		var removeIndex = parseInt($('.' + objChild).attr('index') - 1);
		scope.objChild.splice(removeIndex, 1);
		for (var i = 0; i < scope.objChild.length; i++) {
			scope.objChild[i].$el.attr('index', parseInt(i + 1));
		}

	};

	/**
	 * This function is use to change the View of the Tab.
	 * Three Views are present currently: Horizontal, Vertical and Dropdown.
	 *
	 * @param {string} strPropertyName - will have 'view' in it
	 * @param {string} strPropertyValue - horizontal/vertical/dropdown
	 *
	 * @access public
	 * @memberof TabComp#
	 */
	TabComp.prototype.attrChange = function(strPropertyName, strPropertyValue) {

		if (strPropertyName === 'view') {
			if (strPropertyValue === this.TAB_VIEW_HORIZONTAL) {
				this.$el.addClass(this.TAB_VIEW_HORIZONTAL).removeClass(this.TAB_VIEW_VERTICAL);
				this.$el.find('div').addClass('horizontalBtn').removeClass('verticalBtn');
				//this.$el.find('div').css({
				//	'display' : 'inline-block'
				//});

			} else if (strPropertyValue === this.TAB_VIEW_VERTICAL || strPropertyValue === this.TAB_VIEW_DROPDOWN) {

				this.$el.addClass(this.TAB_VIEW_VERTICAL).removeClass(this.TAB_VIEW_HORIZONTAL);
				this.$el.find('div').addClass('verticalBtn').removeClass('horizontalBtn');
				//this.$el.find('div').css({
				//	'display' : 'block'
				//});
			}

		}

	};

	/**
	 * This function is use to change the State of the Button.
	 *
	 * @param {number} indexNum - will have index of the Tab.
	 *
	 * @access public
	 * @memberof TabComp#
	 */
	TabComp.prototype.buttonToggle = function(indexNum) {
		$('.' + this.TAB_ACTIVE_CLASS).removeClass(this.TAB_ACTIVE_CLASS);
		$('div[index=' + indexNum + ']').addClass(this.TAB_ACTIVE_CLASS);
	};

	/**
	 * This function is use to change the Index of the Tab.
	 *
	 * @param {number} indexNum - will have index of the Tab.
	 *
	 * @access public
	 * @memberof TabComp#
	 */
	TabComp.prototype.changeIndex = function(indexNum) {
		if (this.objData.view === this.TAB_VIEW_DROPDOWN) {
		} else {
			if (this.bEditor === false) {
				this.buttonToggle(indexNum);
			}
		}
		scope.customEventDispatcher(scope.TAB_CHILD_CLICK, scope, indexNum);
	};

	/**
	 * This function is use to select the Default Tab.
	 *
	 * @param {number} indexNum - will have index of the Tab.
	 *
	 * @access public
	 * @memberof TabComp#
	 */
	TabComp.prototype.defaultIndex = function(indexNum) {

		if (this.objData.view === this.TAB_VIEW_DROPDOWN) {
			this.$el.find('select').val(indexNum);
		} else {
			this.buttonToggle(indexNum);
		}

	};

	/**
	 * This function is use to select the Enable the Tab.
	 *
	 * @param {null}
	 *
	 * @access public
	 * @memberof TabComp#
	 */
	TabComp.prototype.enable = function() {
		if (this.objData.view === this.TAB_VIEW_DROPDOWN) {
			this.$el.find('select').attr('disabled', false);
		} else {
			this.$el.removeClass(this.TAB_DISABLED_CLASS);
		}
		scope.customEventDispatcher(scope.TAB_ENABLED, scope, scope);
	};

	/**
	 * This function is use to select the Disable the Tab.
	 *
	 * @param {null}
	 *
	 * @access public
	 * @memberof TabComp#
	 */
	TabComp.prototype.disable = function() {
		if (this.objData.view === this.TAB_VIEW_DROPDOWN) {
			this.$el.find('select').attr('disabled', true);
		} else {
			this.$el.addClass(this.TAB_DISABLED_CLASS);
		}
		scope.customEventDispatcher(scope.TAB_DISABLED, scope, scope);
	};

	TabComp.prototype.buttonWidth = function(btnWidth) {

	};

	TabComp.prototype.TabCompSuper = Case;

	TabComp.prototype.destroy = function() {
		delete this.objData;
		this.objChild = null;
		scope = null;
		return this.TabCompSuper.prototype.destroy.call(this, true);
	};

	return TabComp;
});
