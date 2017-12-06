/* jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * text box
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['marionette', 'player/base/base-item-comp'], function(Marionette, BaseItemComp) {
	'use strict';
	var TextBox;

	TextBox = BaseItemComp.extend({
		objData : null,
		textBoxRef : null,
// template : _.template('<input type="text" id=""  />'),

		initialize : function(objData) {
			var objThis = this;
			this.objData = objData;//this property is being used in componentselector for editing.
			this.componentType = "inputtext";
			if(this.objData.multiline === "true" || this.objData.multiline === true){
				this.template = _.template('<textarea></textarea>');
			}else{
				this.template = _.template('<input type="text" id=""  />');
			}
			
		},

		onRender : function() {
			var objClassref = this;
			this.textBoxRef = $(this.$el.children()[0]);
			if (this.objData.styleClass !== undefined) {
				this.$el.addClass(this.objData.styleClass);
				$(this.textBoxRef).addClass(this.objData.styleClass);
				$(this.textBoxRef).css("poistion", "absolute");
				$(this.textBoxRef).css("left", "0px");
				$(this.textBoxRef).css("top", "0px");
				if(this.objData.placeholder){
					$(this.textBoxRef).attr('placeholder',this.objData.placeholder);
				}
				if(this.objData.dir){
					$(this.textBoxRef).attr('dir',this.objData.dir);
				}
				if(this.objData.type){
					$(this.textBoxRef).attr('type',this.objData.type);
				}
			}
			if(this.bEditor === false){
				this.textBoxRef.on("keyup input", objClassref, objClassref.handleInputTextEvents);
			}else{
				$(this.textBoxRef).css("pointer-events","none");
			}
		},

		handleInputTextEvents : function(objEvent) {
			var objClassref = objEvent.data;
			objClassref.customEventDispatcher(objEvent.type, objClassref, objEvent);
		},

		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		},

		setText : function(strText) {
			this.textBoxRef.val(strText);
		},

		getText : function() {
			return this.textBoxRef.val();
		}
	});
	
	TextBox.prototype.getValue = function() {
		return this.$el.find('input').val().trim();
		
	};
	TextBox.prototype.TextBoxSuper = BaseItemComp;

	TextBox.prototype.destroy = function() {
		this.textBoxRef.off("keyup input");
		this.textBoxRef = null;
		return this.TextBoxSuper.prototype.destroy.call(this, true);
	};
	return TextBox;
});
