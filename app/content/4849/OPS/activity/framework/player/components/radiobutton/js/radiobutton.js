/*jslint nomen: true*/
/*globals console,_,$*/

/**RadioButton
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */
define(['marionette', 'player/base/base-item-comp', 'text!components/radiobutton/radiobutton.html'],
/**
 * This class represents a radio button component which can be used to create group of radio buttons to be used as objective selection for end user.
 *
 *@class RadioButton
 *@augments BaseItemComp
 *@param {Object} CompModel  An object of backbone model with 'id','groupName', 'label', 'img' and 'optionTheme' properties.
 *@example
 *
 * var  radioButtonComp, RadioButtonModel,CompModel;
 *
 * RadioButtonModel = Backbone.Model.extend({
 *	defaults:
 *		{
 *			id : undefined,
 *			groupName: undefined,
 *			label: undefined,
 *			img: undefined,
 *			optionTheme: undefined
 *		}
 *	});
 *
 * CompModel = new RadioButtonModel();
 * CompModel.set('id', "cb1");
 * CompModel.set('groupName', "cbGrp1");
 * CompModel.set('label', "Add details:");
 * CompModel.set('img', "../cb1.png");
 * CompModel.set('optionTheme', ../cb1Theme.png);
 *
 * this.getComponent(context, "RadioButton", "onComponentCreated", CompModel);
 *
 * function onComponentCreated(objComp){
 * radioButtonComp = objComp;
 * }
 * <br>Configurable properties of component:<br>
 * <table border="1" style="white-space:pre-wrap; color:"#000000";"><tr><th>Property</th><th>Type</th><th>Default Value</th><th>Description</th></tr><tr><td>id</td><td>String</td><td>null</td><td>This property contains the unique identifier for the component.<br><br>This property is mandatory and should be provided during component creation.</td></tr><tr><td>groupName</td><td>String</td><td>null</td><td>This property contains the unique identifier for the group to which this component belongs.<br><br>This property is mandatory and should be provided during component creation.</td></tr><tr><td>label</td><td>String</td><td>null</td><td>This property contains the text which needs to be shown with the radio button.<br><br>This is an optional property, if developer doesn't provide this property then component will assume that there is no text which needs to be displayed with the radio button.</td></tr><tr><td>img</td><td>String</td><td>null</td><td>This property contains the path of the image which needs to be shown with the radio button.<br><br>This is an optional property, if developer doesn't provide this property then component will assume that there is no image which needs to be displayed with the radio button.</td></tr><tr><td>optionTheme</td><td>String</td><td>null</td><td>This property contains the unique id for theme.<br><br>This is an optional property, if developer doesn't provide this property then component will automatically provide an id.</td></tr></table>
 */
function(Marionette, BaseItemComp, radiobuttonTmpl) {"use strict";
	var RadioButton = BaseItemComp.extend({
		SELECTED_CLASS_POSTFIX : "_selected",
		strInputCls : "radioButtonInput",
		strInputContentCls : "radioButtonContent",
		strLblCls : "radioButtonLabel",
		strImgDivCls : "radioButtonImgDiv",
		strImgCls : "radioButtonImg",
		template : _.template(radiobuttonTmpl),
		ui:{
			radioBtn : "input[type='radio']"
		},
		initialize  : function(options){
			if(options && options.hasOwnProperty('parent')){
				this.parent = options.parent;
			}
		},
		/**
		 * onRender function
		 * @access private
		 * @memberof RadioButton
		 * @param None
		 * @returns None
		 */
		onRender : function() {
			this.$el.addClass(this.model.get('optionTheme'));
			// set model cid
			this.$el.attr('data-cid', this.model.cid);
			this.$el.prop('optionTheme', this.model.get('optionTheme'));
			if (this.model) {
                this.strId = 'radio_' + this.model.get('groupName') + '_' + this.model.get('id');
                
                this.$("#" + this.strId).on('change', $.proxy(this.handleOptionChange, this));
            }
		},
		
		handleOptionChange : function(){
			var that = this, allRadioBtn, isChecked, dataCid, itemView;
			allRadioBtn = $("input[type='radio']", this.parent.$el);
			_.each(allRadioBtn, function(itemRadio){
				isChecked = $(itemRadio).is(":checked"); 
				dataCid = $(itemRadio).parent().data('cid');
				//console.log("****>>>>", dataCid);
				itemView = that.parent.children.findByModelCid(dataCid);
				//itemView.model.set('checked', isChecked); 
				itemView.updateOptionStatus();
			});
			dataCid = this.$el.data('cid');
			itemView = that.parent.children.findByModelCid(dataCid);
			that.parent.validateAnOption(that.parent, this.$el, itemView);
		},

		/**
		 * @description This function updates the model of the radio button to update and store its selection status
		 * @access private
		 * @memberof RadioButton
		 * @param None
		 * @returns None
		 */
		updateOptionStatus : function() {
			var groupName, strId, correctFB, incorrectFB;
			// get the radio input and set the checked status into model
			this.model.set('checked', this.ui.radioBtn[0].checked);
			//console.log('option status', this.model.get('checked'));
			// hide feedback if not checked
			if (this.model.get('checked') === false) {
				groupName = this.model.get('groupName');
				strId = this.model.get('id');
				correctFB = this.$el.find("#correctFB_" + groupName + "_" + strId);
				incorrectFB = this.$el.find("#incorrectFB_" + groupName + "_" + strId);
				correctFB.hide();
				incorrectFB.hide();
			}
			this.applySelectedClass();
		},

		/**
		 * This function can be used to select a radio button
		 * @access private
		 * @memberof RadioButton
		 * @param {Boolean} bSelect true or false
		 * @returns None
		 */
		select : function(bSelect) {
			this.model.set('checked', bSelect);
			this.$("input[type='radio']").attr('checked', bSelect);
			this.applySelectedClass();
		},

		/**
		 * This function can be used to apply selected style class
		 * @access private
		 * @memberof RadioButton
		 * @param None
		 * @returns None
		 */
		applySelectedClass : function() {
			var objEl, objInput, objInputContent, objLabel, objImgDiv, objImg;
			// reset selection first
			/*objEl = $("[class$='"+this.SELECTED_CLASS_POSTFIX+"']", this.$el.parent());
			objEl.removeClass(this.strInputCls + this.SELECTED_CLASS_POSTFIX);
			objEl.removeClass(this.strInputContentCls + this.SELECTED_CLASS_POSTFIX);
			objEl.removeClass(this.strLblCls + this.SELECTED_CLASS_POSTFIX);
			objEl.removeClass(this.strImgDivCls + this.SELECTED_CLASS_POSTFIX);
			objEl.removeClass(this.strImgCls + this.SELECTED_CLASS_POSTFIX);
			objEl.removeClass(objEl.prop('optionTheme')+this.SELECTED_CLASS_POSTFIX);			
			*/
			objInput = this.$("input[type='radio']");
			objInputContent = this.$("label");
			objLabel = this.$("label span");
			objImgDiv = this.$("label>div");
			objImg = this.$("label div:first-child");
			//console.log('is checked : ', this.model.get('checked'));
			if (this.model.get('checked') === true) {
				objInput.addClass(this.strInputCls + this.SELECTED_CLASS_POSTFIX);
				objInputContent.addClass(this.strInputContentCls + this.SELECTED_CLASS_POSTFIX);
				objLabel.addClass(this.strLblCls + this.SELECTED_CLASS_POSTFIX);
				objImgDiv.addClass(this.strImgDivCls + this.SELECTED_CLASS_POSTFIX);
				objImg.addClass(this.strImgCls + this.SELECTED_CLASS_POSTFIX);
				this.$el.addClass(this.model.get('optionTheme') + this.SELECTED_CLASS_POSTFIX);
			}else{
				objInput.removeClass(this.strInputCls + this.SELECTED_CLASS_POSTFIX);
				objInputContent.removeClass(this.strInputContentCls + this.SELECTED_CLASS_POSTFIX);
				objLabel.removeClass(this.strLblCls + this.SELECTED_CLASS_POSTFIX);
				objImgDiv.removeClass(this.strImgDivCls + this.SELECTED_CLASS_POSTFIX);
				objImg.removeClass(this.strImgCls + this.SELECTED_CLASS_POSTFIX);
				this.$el.removeClass(this.model.get('optionTheme') + this.SELECTED_CLASS_POSTFIX);
			}
		}
	});

	/**
	 * Set the super to BaseItemComp
	 * @access private
	 * @memberof RadioButton#
	 */
	RadioButton.prototype._super = BaseItemComp;

	/**
	 * This function destroys the component
	 * @memberof RadioButton#
	 * @param None
	 * @returns {Boolean} True or false
	 */
	RadioButton.prototype.destroy = function() {
		this.unbind();
		this.undelegateEvents();
		return this._super.prototype.destroy(true);
	};

	return RadioButton;
});
