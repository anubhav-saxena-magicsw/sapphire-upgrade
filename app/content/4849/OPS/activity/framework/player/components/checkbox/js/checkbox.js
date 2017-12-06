/*jslint nomen: true*/
/*globals console,_,$*/
/**
 * CheckBox
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */
define([
    'marionette',
    'player/base/base-item-comp',
    'text!components/checkbox/checkbox.html'
], 
/**
 * This class represents a checkbox component which can be used to create group of checkboxes to be used as objective selection for end user.
 *
 *@class CheckBox
 *@augments BaseItemComp
 *@param {Object} CompModel  An object of backbone model with 'id','groupName', 'label', 'img' and 'optionTheme' properties.
 *@example
 *
 * var  checkBoxComp, CheckBoxModel,CompModel;
 * 
 * CheckBoxModel = Backbone.Model.extend({
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
 * CompModel = new CheckBoxModel();
 * CompModel.set('id', "cb1");
 * CompModel.set('groupName', "cbGrp1");
 * CompModel.set('label', "Add details:");
 * CompModel.set('img', "../cb1.png");
 * CompModel.set('optionTheme', ../cb1Theme.png);
 *
 * this.getComponent(context, "CheckBox", "onComponentCreated", CompModel);
 *
 * function onComponentCreated(objComp){
 * checkBoxComp = objComp;
 * }
 * <br>Configurable properties of component:<br>
 * <table border="1" style="white-space:pre-wrap; color:"#000000";"><tr><th>Property</th><th>Type</th><th>Default Value</th><th>Description</th></tr><tr><td>id</td><td>String</td><td>null</td><td>This property contains the unique identifier for the component.<br><br>This property is mandatory and should be provided during component creation.</td></tr><tr><td>groupName</td><td>String</td><td>null</td><td>This property contains the unique identifier for the group to which this component belongs.<br><br>This property is mandatory and should be provided during component creation.</td></tr><tr><td>label</td><td>String</td><td>null</td><td>This property contains the text which needs to be shown with the checkbox.<br><br>This is an optional property, if developer doesn't provide this property then component will assume that there is no text which needs to be displayed with the checkbox.</td></tr><tr><td>img</td><td>String</td><td>null</td><td>This property contains the path of the image which needs to be shown with the checkbox.<br><br>This is an optional property, if developer doesn't provide this property then component will assume that there is no image which needs to be displayed with the checkbox.</td></tr><tr><td>optionTheme</td><td>String</td><td>null</td><td>This property contains the unique id for theme.<br><br>This is an optional property, if developer doesn't provide this property then component will automatically provide an id.</td></tr></table>
 */
function(Marionette, BaseItemComp, checkboxTmpl) {
    "use strict";
    var CheckBox = BaseItemComp.extend({
        strId : "",
        SELECTED_CLASS_POSTFIX : "_selected",
        strInputCls : "checkboxInput",
        strInputContentCls : "checkboxContent",
        strLblCls : "checkboxLabel",
        strImgDivCls : "checkboxImgDiv",
        strImgCls : "checkboxImg",
        template: _.template(checkboxTmpl),
        /**
         * Initialize function
         * @memberof CheckBox
         * @access private 
         */
        initialize: function(options) {
			this.objData = options;//this property is being used in componentselector for editing.
			if(options && options.hasOwnProperty('parent')){
				this.parent = options.parent;
			}
        },
        
        /**
         * onRender function
         * @memberof CheckBox
         * @access private 
         */
        onRender: function() {
            this.$el.addClass(this.model.get('optionTheme'));
            // set model cid
            this.$el.attr('data-cid', this.model.cid);
            this.$el.prop('optionTheme', this.model.get('optionTheme'));
            if (this.model) {
                this.strId = 'checkbox_' + this.model.get('groupName') + '_' + this.model.get('id');
                
                this.$("#" + this.strId).on('change', $.proxy(this.handleOnChange, this));
            }
        },
        
        /**
         * This is handler function of change event gets fired by the component.
         * It updates the model and also hides the feedback div
         * @memberof CheckBox
         * @access private
         * @param {type} event
         */
        handleOnChange: function(event) {
            var dataCid, itemView, groupName, strId, correctFB, incorrectFB;
            this.model.set('checked', event.currentTarget.checked);
            groupName = this.model.get('groupName');
            strId = this.model.get('id');
            correctFB = this.$el.find("#correctFB_" + groupName + "_" + strId);
            incorrectFB = this.$el.find("#incorrectFB_" + groupName + "_" + strId);
            correctFB.hide();
            incorrectFB.hide();
            this.applySelectedClass();
            dataCid = this.$el.data('cid');
			itemView = this.parent.children.findByModelCid(dataCid);
			this.parent.validateAnOption(this.parent, this.$el, itemView);
        },
        
        /**
         * This function can be used to select a checkbox
         * @access private
         * @memberof CheckBox
         * @param {Boolean} bSelect true or false
         * @returns None
         */
        select : function(bSelect){
            this.model.set('checked', bSelect);
            this.$("input[type='checkbox']").attr('checked', bSelect);
            this.applySelectedClass();
        },
        
        /**
         * This function is used to apply selected class on the component
         * @access private
         * @memberof CheckBox
         * @param None
         * @returns None
         */
        applySelectedClass : function(){
            var objInput, objLabel, objImg, objInputContent, objImgDiv;
            objInput = this.$("input[type='checkbox']");
            objInputContent = this.$("label");
            objLabel = this.$("label span");
            objImgDiv = this.$("label>div");
            objImg = this.$("label div:first-child");
            if(this.model.get('checked') === true){
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
     * @memberof CheckBox#
     */
    CheckBox.prototype._super = BaseItemComp;
    
    /**
     * This function destroys the component
     * @memberof CheckBox#
     * @access public
     * @returns {Boolean} True or false
     */
    CheckBox.prototype.destroy = function(){
        this.$("#" + this.strId).off('change', $.proxy(this.handleOnChange, this));
        this.unbind();
        this.undelegateEvents();
        return this._super.prototype.destroy(true);
    };

    return CheckBox;
});
