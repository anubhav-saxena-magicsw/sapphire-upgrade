/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * ColorAccessibilityBox
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['marionette', 'components/case/case', 'css!components/coloraccessibility/css/coloraccessibility'], function(Marionette, Case) {
	'use strict';
	var ColorAccessibilityBox;

	ColorAccessibilityBox = Case.extend({
		objData : null,
		comp_dict : [],
		button_ids : [],
		body : undefined,
        strHorizontal : undefined,
		strVertical : undefined,
		template : _.template(''),
		val : undefined,

		initialize : function(objData) {
			this.comp_dict = [], this.objData =
			objData;
			//this property is being used in componentselector for editing.
			this.body = $('body');
			this.strHorizontal = 'horizontal';
			this.strVertical = 'vertical';
			this.componentType = "coloraccessibility";
		},
		onRender : function() {
			if (this.objData.styleClass !== undefined) {
				//console.log(this.$el.addClass(this.objData.styleClass));
				this.$el.addClass(this.objData.styleClass);
				$(this.el).attr('id', this.strCompId);
				if (this.objData.view === this.VERTICAL_VIEW || (this.objData.view == this.DROPDOWN_VIEW && this.bEditor === true) ){
					this.$el.addClass(this.strVertical).removeClass(this.strHorizontal);
				} else if (this.objData.view == this.HORIZONTAL_VIEW) {
					this.$el.addClass(this.strHorizontal).removeClass(this.strVertical);
				} else if (this.objData.view == this.DROPDOWN_VIEW && this.bEditor === false) {
					this.$el.append('<select></select>');
				}
			}
		},
		onShow : function() {
			var self = this;
		}
	});

	ColorAccessibilityBox.prototype.VERTICAL_VIEW = "vertical";

	ColorAccessibilityBox.prototype.DROPDOWN_VIEW = "dropdown";

	ColorAccessibilityBox.prototype.HORIZONTAL_VIEW = "horizontal";

	ColorAccessibilityBox.prototype.isValid = function(strCompType) {
		var bValid = false;
		return bValid;
	};
	
    /**
     * This method add the child component in its parent
     * component add render according to its view 
     * @memberof ColorAccessibility
     * @param objChild recieves the child component
     * @returns none.     
     */
	ColorAccessibilityBox.prototype.addChild = function(objChild) {
		var childComp = objChild.component;
		if (this.objData.view !== this.DROPDOWN_VIEW || (this.objData.view === this.DROPDOWN_VIEW && this.bEditor === true)) {
			this.button_ids.push(objChild.component.strCompId);
			this.comp_dict.push(childComp);
			this.ColorAccessibilitySuper.prototype.addChild.call(this, objChild);
		}
		if (this.objData.view == this.DROPDOWN_VIEW && this.bEditor === false) {
			var self = this,val;
			this.$el.find('select').append('<option value=' + objChild.component.options.label + '>' + objChild.component.options.label + '</option>');
			this.$el.find('select').on("change", function() {
				val = self.$el.find('select').find("option:selected").prop("value");
				if (val == 'Gray') {
					self.body.removeClass('grayscaleInvertFilter').removeClass('grayscaleFilter').addClass('grayscaleFilter');
				} else if (val == 'Invert') {
					self.body.removeClass('grayscaleFilter').removeClass('grayscaleInvertFilter').addClass('grayscaleInvertFilter');
				} else {
					self.body.removeClass('grayscaleFilter grayscaleInvertFilter');
				}
			});
		}
		if (this.comp_dict.length == 3) {
			this.invertColors();
		}
	};
	
    /** 
     * This method is used to bind the buttons
     * with their respective css classes 
     * @memberof ColorAccessibility
     * @param none
     * @returns none.     
     */
	ColorAccessibilityBox.prototype.invertColors = function() {
		var self = this;
		$('#' + this.button_ids[0]).on("click", function() {
			self.body.removeClass('grayscaleInvertFilter').removeClass('grayscaleFilter').addClass('grayscaleFilter');
		});

		$('#' + this.button_ids[1]).on("click", function() {
			self.body.removeClass('grayscaleFilter').removeClass('grayscaleInvertFilter').addClass('grayscaleInvertFilter');
		});
		setTimeout(function() {
			$('#' + self.button_ids[2]).on("click", function() {
				self.body.removeClass('grayscaleFilter grayscaleInvertFilter');
			});
		}, 300);
	};
    
    /**
     * This method is used to change the view of component 
     * @memberof ColorAccessibility
     * @param strPropertyName recieves the name of property to be changed and 
     * strPropertyValue recieves the value of changed property.
     * @returns none.
     */
    ColorAccessibilityBox.prototype.changeView = function(strPropertyName, strPropertyValue) {
		if (strPropertyName === 'view') {
			if (strPropertyValue === this.HORIZONTAL_VIEW) {
				this.$el.addClass(this.strHorizontal).removeClass(this.strVertical);
			} else if (strPropertyValue === this.VERTICAL_VIEW || strPropertyValue === this.DROPDOWN_VIEW) {
				this.$el.addClass(this.strVertical).removeClass(this.strHorizontal);
			}
		}
	};
	ColorAccessibilityBox.prototype.ColorAccessibilitySuper = Case;
    
    /**
     * This component is used to destroy the variables, arrays 
     * and unbind the events
     * @memberof ColorAccessibility
     * @param none
     * @returns none.     
     */
	ColorAccessibilityBox.prototype.destroy = function() {
		var i;
		delete this.objData;
		this.$el.find('select').off("change");
		$('#' + this.button_ids[0]).off("click");
		$('#' + this.button_ids[1]).off("click");
		$('#' + this.button_ids[2]).off("click");
		this.comp_dict = null;
		this.objChild = null;
		this.button_ids = null;
		return this.ColorAccessibilitySuper.prototype.destroy.call(this, true);
	};

	return ColorAccessibilityBox;
});
