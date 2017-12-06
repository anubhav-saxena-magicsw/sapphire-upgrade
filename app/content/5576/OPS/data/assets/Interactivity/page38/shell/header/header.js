/*jslint nomen: true*/
/*globals Backbone,$, console*/
define(["marionette", "player/base/base-activity", "css!shell/header/header.css", basePath + "js/utils/bootstrap.min.js", "shell/zoom-widget.js"], function(Marionette, BaseActivity, headerCSS, bootstrap) {'use strict';

    var objHeaderRef, Header = BaseActivity.extend({
        btnHome : undefined,
        changeExt:false,
        that : this,
        helpText : "",
        mAct_index : 0,
        mAct_length : 0,
        instructionText : "",
        headerBtnObj : {},
        bShowInstructionButton : false,
        objBackgroundAudio : null,
        objZoomWgt : undefined,
        events : {
            "click #btnColor" : "handleColorMode",
            "click #btnGrayscale" : "handleGrayscaleMode",
            "click #btnInvert" : "handleInvertMode",
            "click #btnMagnify" : "handleMagnification"
        },

        onShow : function() {
            objHeaderRef = this;
            // ADD SLIDEDOWN ANIMATION TO DROPDOWN //
            $('.dropdown').on('show.bs.dropdown', function(e) {
                $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
            });

            // ADD SLIDEUP ANIMATION TO DROPDOWN //
            $('.dropdown').on('hide.bs.dropdown', function(e) {
                $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
            });
            var that = this;
            // set default seleced to color button
            $('.dropdown .dropdown-menu li div.spnColor').addClass('active');
            

            this.addEvents();
        },

        reset: function(){
            this.closeHeaderPopupWindow();
            this.closeMenu();
            this.closeAccDropDown();
        },

        onAudioCompCreated : function(ObjComp) {
            this.objBackgroundAudio = ObjComp;
        },

        changeBGVolume : function(evt) {
            var currentPosition, duration, result;
            currentPosition = Number(evt);
            result = Math.ceil(currentPosition) / 100;
            this.objBackgroundAudio.setVolume(result);
        },

        playBackgroundAudio : function(audioObj) {
            this.objBackgroundAudio.changeAudio(audioObj);
            this.objBackgroundAudio.play();
        },
        stopBackgroundAudio : function() {

            this.objBackgroundAudio.stop();
        },
        playBackgroundAudioAgain : function(audioObj) {
            console.log("hello",audioObj);
            this.objBackgroundAudio.changeAudio(audioObj.data);
            this.objBackgroundAudio.play();
        },

        setBackgroundAudioForDevice : function(audioObj) {
            this.objBackgroundAudio.changeAudio(audioObj);
            this.objBackgroundAudio.play();
            this.objBackgroundAudio.stop();
        },

        addEvents : function() {
            this.btnHome = $("#btnHome", this.$el);
            this.btnMenu = $("#btnMenu", this.$el);
            this.btnHelp = $("#btnHelp", this.$el);
            this.btnNext = $("#btnNext", this.$el);
            this.btnReplay = $("#btnReplay", this.$el);
            this.btnPrevious = $("#btnPrevious", this.$el);
            this.btnInstruction = $("#btnInstruction", this.$el);
            this.attachListener(this, this.btnHome, "click", "handleButtonClick");
            this.attachListener(this, this.btnMenu, "click", "handleButtonClick");
            this.attachListener(this, this.btnHelp, "click", "handleButtonClick");
            this.attachListener(this, this.btnInstruction, "click", "handleButtonClick");
            this.attachListener(this, this.btnNext, "click", "handleButtonClick1");
            this.attachListener(this, this.btnPrevious, "click", "handleButtonClick1");
            this.attachListener(this, this.btnReplay, "click", "handleButtonClick1");

            $('#mActivity').on('click', '#btnZoomIn, #btnZoomOut', this.handleTextZoom);

            this.getComponent(this, "audioPlayer", "onAudioCompCreated", {});
            this.broadcastEventReceiver("shellAudioStop", this, "stopBackgroundAudio");
            this.broadcastEventReceiver("shellAudioPlay", this, "playBackgroundAudioAgain");
            this.broadcastEventReceiver("resetHeader", this, "reset");

            //$('#mActivity').off('click').on('click', '.menuPopupNavBtn, .menuPopupCreditsBtn', $.proxy(this.handleMenuPopupBtnClick, this));

        },

        handleColorMode : function() {
            $("#btnInvert", this.$el).removeClass('active');
            $("#btnGrayscale", this.$el).removeClass('active');
            if ($("#mActivity").hasClass('grayscaleFilter')) {
                $("#mActivity").removeClass('grayscaleFilter');
            }

            if ($("#mActivity").hasClass('grayscaleInvertFilter')) {
                $("#mActivity").removeClass('grayscaleInvertFilter');
            }
            $("#btnColor", this.$el).addClass('active');
        },
        handleGrayscaleMode : function(e) {
            var $this = $(e.currentTarget);
            $("#btnInvert", this.$el).removeClass('active');
            $("#btnColor", this.$el).removeClass('active');
            if ($this.hasClass('active')) {
                $this.removeClass('active');
                this.handleColorMode();
            } else {
                $this.addClass('active');
                $("#mActivity").removeClass('grayscaleInvertFilter').removeClass('grayscaleFilter').addClass('grayscaleFilter');
            }
        },
        handleInvertMode : function(e) {
            var $this = $(e.currentTarget);
            $("#btnGrayscale", this.$el).removeClass('active');
            $("#btnColor", this.$el).removeClass('active');
            if ($this.hasClass('active')) {
                $this.removeClass('active');
                this.handleColorMode();
            } else {
                $this.addClass('active');
                $("#mActivity").removeClass('grayscaleFilter').removeClass('grayscaleInvertFilter').addClass('grayscaleInvertFilter');
            }

        },
        handleMagnification : function(e) {
            var $this = $(e.currentTarget);
            if ($this.hasClass('active')) {
                $this.removeClass('active');
                this.removePopupWindow("zoomPopup");
            } else {

                $this.addClass('active');
                this.launchAsPopup("zoomPopup", 'mActivity', true, "zoomPopupClose");
            }
        },

        handleTextZoom : function(popupData) {
            var self = this;
            if (this.objTxtZoomWgt === undefined) {
                this.objTxtZoomWgt = $(popupData.popupRef).find('#zoomable').ZoomWidget({
                    zoomType : "text",
                    minZoom : 20,
                    maxZoom : 60,
                    zoomStep : 5,
                    lastZoom : 20
                }).ZoomWidget("initialize");
            }

            $(popupData.popupRef).find('#zoomPopupPlus').off('click').on('click', function() {
                self.zoomIn();
            });
            $(popupData.popupRef).find('#zoomPopupMinus').off('click').on('click', function() {
                self.zoomOut();
            });

        },

        zoomIn : function(e) {
            this.objTxtZoomWgt.ZoomWidget("zoomIn");
        },
        zoomOut : function(e) {
            this.objTxtZoomWgt.ZoomWidget("zoomOut");
        },

        showHelpContent : function(event) {
            this.launchAsPopup("menuPopup", 'mActivity', true);
            this.launchAsPopup("helpPopup", 'mActivity', true);
        },

        handleMenuPopupBtnClick : function(event) {
            console.log('menu popup btn click');
            var btnCls = $(event.target).attr("class");
            switch(btnCls) {
                case "menuPopupNavBtn":
                    this.launchAsPopup("navigationPopup", "mActivity", true, 'btnClose');
                    break;
                case "menuPopupCreditsBtn":
                    this.launchAsPopup("creditPopup", "mActivity", true, 'btnClose');
                    break;
            }
        },

        onPopupAddedInDom : function(popupData) {
            //console.log("onPopupAddedInDom!!!!!, Header.js!!!!!", popupData);
            $('#mActivity').off('click').on('click', '.menuPopupNavBtn, .menuPopupCreditsBtn', $.proxy(this.handleMenuPopupBtnClick, this));
            if (popupData.templateId === "zoomPopup") {
                this.zoomPopupAdded(popupData);
            }
        },

        onPopupClose : function(strPopupId) {
            console.log("onPopupClose!!!!!!!!!", strPopupId);
            if (strPopupId === "zoomPopup") {
                this.zoomPopupRemoved();
            }
        },

        zoomPopupAdded : function(popupData) {
            this.handleTextZoom(popupData);
        },
        zoomPopupRemoved : function() {
            this.objTxtZoomWgt = undefined;
            $("#btnMagnify").removeClass('active');
        },

        changeTitleText : function(strText) {
            $("#loTitle", this.$el).html(strText);
        },
        changeHelpText : function(strText) {
            this.helpText = strText;
        },
        changeInstructionText : function(strText) {
            this.instructionText = strText;
        },
        handleButtonClick : function(objEvent) {
            var objData, btnAccEl, arrList, strEventName = objEvent.target.id, objTarget = $(objEvent.target);
            //this.removeAllPopupWindow();

            switch(strEventName) {
                case "btnHome":

                    arrList = ["btnHome", "btnMenu", "btnHelp", "btnInstruction", "zoomInBtn", "zoomOutBtn"];
                    if (this.bShowInstructionButton) {
                        arrList.push("btnInstruction");
                    }
                    this.showHideControls(arrList, "display", "none");
                    btnAccEl = $("[data-toggle='dropdown']", this.$el);
                    btnAccEl.removeAttr('style');
                    btnAccEl.addClass('navDropDownTitle').removeClass('navDropDownTitleShort');
                    $("#btnMenu").removeClass("liBtnMenu_selected").addClass("liBtnMenu");
                    $("#btnMenu").attr("isSelected", "false");
                    this.removePopupWindow("menuPopup");
                    // remove all other popups if opened
                    this.removePopupWindow('creditPopup');
                    this.removePopupWindow('navigationPopup');
                    //	$('#mActivity').off('click').on('click', '.menuPopupNavBtn, .menuPopupCreditsBtn', $.proxy(this.handleMenuPopupBtnClick, this));
                    $("#btnHelp").removeClass("liBtnHelp_selected").addClass("liBtnHelp");
                    $("#btnHelp").attr("isSelected", "false");
                    $("#btnInstruction").removeClass("liBtnInstruction_selected").addClass("liBtnInstruction");
                    $("#btnInstruction").attr("isSelected", "false");

                    if ($("#btnMagnify").hasClass('active')) {
                        $("#btnMagnify").trigger("click");
                    }
                    this.launchActivityInRegion("mActivity", "2");

                    break;
                case "btnMenu":
                    //this.btnHelp.attr("isSelected", "false");
                    //this.btnHelp.removeClass("liBtnHelp_selected").addClass("liBtnHelp");
                    //this.btnInstruction.attr("isSelected", "false");
                    //this.btnInstruction.removeClass("liBtnInstruction_selected").addClass("liBtnInstruction");

                    var isSelected = objTarget.attr("isSelected");
                    if (isSelected == "true") {
                        objTarget.attr("isSelected", "false");
                        objTarget.removeClass("liBtnMenu_selected").addClass("liBtnMenu");
                        this.removePopupWindow("menuPopup");
                        // remove all other popups if opened
                        this.removePopupWindow('creditPopup');
                        this.removePopupWindow('navigationPopup');
                        //$('#mActivity').off('click').on('click', '.menuPopupNavBtn, .menuPopupCreditsBtn', $.proxy(this.handleMenuPopupBtnClick, this));
                        objData = {};
                        objData.taskName = "onCreditPopupClose";

                    } else {
                        objTarget.removeClass("liBtnMenu").addClass("liBtnMenu_selected");
                        objTarget.attr("isSelected", "true");
                        this.launchAsPopup("menuPopup", 'mActivity', false);
                        objData = {};
                        objData.taskName = "onCreditPopupOpen";
                    }
                    this.broadcastEvent("shellCommonEvent", objData);
                    break;
                case "btnHelp":
                    //this.btnMenu.attr("isSelected", "false");
                    //this.btnMenu.removeClass("liBtnMenu_selected").addClass("liBtnMenu");
                    //this.btnInstruction.attr("isSelected", "false");
                    //this.btnInstruction.removeClass("liBtnInstruction_selected").addClass("liBtnInstruction");

                    var isSelected = objTarget.attr("isSelected");
                    if (isSelected == "true") {
                        objTarget.attr("isSelected", "false");
                        objTarget.removeClass("liBtnHelp_selected").addClass("liBtnHelp");
                        this.removePopupWindow("helpPopup");
                        break;
                    } else {
                        objTarget.removeClass("liBtnHelp").addClass("liBtnHelp_selected");
                        objTarget.attr("isSelected", "true");
                        this.launchAsPopup("helpPopup", 'mActivity', false);
                        $("#helpTextContainer").html(this.helpText);

                        var objInstruction = $("#btnInstruction");

                        if (objInstruction.attr("isSelected") == "true") {
                            objInstruction.click();
                        }
                        break;
                    }

                case "btnInstruction":
                    //this.btnMenu.attr("isSelected", "false");
                    //this.btnMenu.removeClass("liBtnMenu_selected").addClass("liBtnMenu");
                    //this.btnHelp.attr("isSelected", "false");
                    //this.btnHelp.removeClass("liBtnHelp_selected").addClass("liBtnHelp");

                    var isSelected = objTarget.attr("isSelected");
                    if (isSelected == "true") {
                        objTarget.attr("isSelected", "false");
                        objTarget.removeClass("liBtnInstruction_selected").addClass("liBtnInstruction");
                        this.removePopupWindow("instructionPopup");
                        break;
                    } else {
                        objTarget.removeClass("liBtnInstruction").addClass("liBtnInstruction_selected");
                        objTarget.attr("isSelected", "true");
                        this.launchAsPopup("instructionPopup", 'mActivity', false);
                        $("#instructionTextContainer").html(this.instructionText);

                        var objHelp = $("#btnHelp");

                        if (objHelp.attr("isSelected") == "true") {
                            objHelp.click();
                        }

                        break;
                    }
            }
        },
        onActivityCreationComplete : function() {
            this.initBaseActivity();
            //activity initlized....
        },
        showHideControls : function(arrControlList, prop, value) {
            var i;
            for ( i = 0; i < arrControlList.length; i++) {
                $("#" + arrControlList[i], this.$el).css(prop, value);
            }
        },
        handleStartBtnClick : function(arrControlList, prop, value) {

            objHeaderRef.headerBtnObj = {};
            objHeaderRef.headerBtnObj.btnList = arrControlList;
            objHeaderRef.headerBtnObj.prop = prop;
            objHeaderRef.headerBtnObj.val = value;

            var btnAccEl = $("[data-toggle='dropdown']", this.$el);
            btnAccEl.animate({
                width : '45px',
                opacity : 0.2
            }, 1000, $.proxy(this.handleAnimComplete, this));

            $(".introContentBox").css("visibility", "visible").css("opacity", ".7").animate({
                opacity : 0,
                left : "-300px"
            }, 400);

            $("#startBtnDiv").css("visibility", "visible").css("opacity", "1").animate({
                opacity : 0,
                left : "-300px"
            }, 700);

            $("#navBtnDiv").css("visibility", "visible").css("opacity", "1").animate({
                opacity : 0,
                left : "-300px"
            }, 1000);

            $("#creditsBtnDiv").css("visibility", "visible").css("opacity", "1").animate({
                opacity : 0
            }, 500);


            $("#hyperText").css("visibility", "visible").css("opacity", "1").animate({
                opacity : 0,
                left : "-300px"
            }, 700);

        },
        handleAnimComplete : function() {
            var arrList = objHeaderRef.headerBtnObj.btnList;
            //["btnHome", "btnMenu"];
            if (this.bShowInstructionButton) {
                arrList.push("btnInstruction");
            }
            var btnAccEl = $("[data-toggle='dropdown']", this.$el);
            btnAccEl.css('opacity', 1);
            btnAccEl.addClass('navDropDownTitleShort').removeClass('navDropDownTitle');
            this.showHideControls(arrList, objHeaderRef.headerBtnObj.prop, objHeaderRef.headerBtnObj.val);
            this.launchActivityInRegion("mActivity", "3");
        },
        showAndAnimateHeader : function() {
            $("#mHeader").css("visibility", "visible");//.css("opacity", "0").animate({
                //opacity : 1
            //}, 1000);
        },
        closeHelpPopup : function() {
            var isSelected = this.btnHelp.attr("isSelected");
            if (isSelected === "true") {
                this.btnHelp.trigger("click");
            }
        },
        closeInstructionPopup : function() {
            var isSelected = this.btnInstruction.attr("isSelected");
            if (isSelected === "true") {
                this.btnInstruction.trigger("click");
            }
        },
        showInstructionButton : function(bVal) {
            this.bShowInstructionButton = bVal;
        },

        changeHelpButtonState : function() {
            this.btnHelp.attr("isSelected", "false");
            this.btnHelp.removeClass("liBtnHelp_selected").addClass("liBtnHelp");
        },

        closeHeaderPopupWindow : function() {
            this.btnHelp.attr("isSelected", "false");
            this.btnHelp.removeClass("liBtnHelp_selected").addClass("liBtnHelp");
            this.btnInstruction.attr("isSelected", "false");
            this.btnInstruction.removeClass("liBtnInstruction_selected").addClass("liBtnInstruction");
            this.removeAllPopupWindow();
        },

        closeMenu: function(){
            var isSelected = this.btnMenu.attr("isSelected");
            if (isSelected === "true") {
                this.btnMenu.trigger("click");
            }
        },

        closeAccDropDown: function(){
            var btnAccEl = $(".dropdown");
            if(btnAccEl.hasClass("open")){
                //btnAccEl.find("a").get(0).removeClass();
                //$('.dropdown-menu').css({display:"none"});
                btnAccEl.find("a").trigger("click");
            }
        }
    });
    Header.prototype.handleButtonClick1 = function(objEvent) {
        var strTargetId = objEvent.target.id, index = 0;

        var bCustomNav = (objHeaderRef.model) ? objHeaderRef.model.get("customNav") : false;

        switch(strTargetId) {
            case "btnPrevious":
                if(bCustomNav){
                    objHeaderRef.broadcastEvent("headerGlobalEvent", {taskName : "back"});
                }
                else{

                    if (this.mAct_index > 2) {

                        index = this.mAct_index - 1;
                        this.launchActivityInRegion("mActivity", index, {}, true);
                    }

                }
                break;

            case "btnNext":
                if(bCustomNav){
                    objHeaderRef.broadcastEvent("headerGlobalEvent", {taskName : "next"});
                }
                else{
                    if (this.mAct_index < this.mAct_length - 1) {
                        index = this.mAct_index + 1;
                        this.launchActivityInRegion("mActivity", index, {}, true);
                    }
                }
                break;

            case "btnReplay":
                var activityIdForReplay = objHeaderRef.model.get("jumpToActivityFromReplay");
                this.launchActivityInRegion("mActivity", activityIdForReplay, null, false);
                //	console.dir(this);
                break;
        }
    };

    Header.prototype.updateNextBackButtons = function(value){

        //************* enable/disable back button ****************
        if (this.mAct_index <= 2) {

            //disable back button
            this.btnPrevious.attr('disabled', 'disabled');
        }
        else{
            //enable back button
            this.btnPrevious.removeAttr('disabled');
        }

        //*********** enable/disable next button ******************************
        if (this.mAct_index >= (this.mAct_length - 1)) {
            //disable next button
            this.btnNext.attr('disabled', 'disabled');
        }
        else{
            //enable next button
            this.btnNext.removeAttr('disabled');
        }
    };


    Header.prototype.getRegionChangeNotification = function(objData) {
        this.btnHelp.attr("isSelected", "false");
        this.btnHelp.removeClass("liBtnHelp_selected").addClass("liBtnHelp");
        if (objData.mActivity !== undefined) {
            

            this.mAct_length = objData.mActivity.activityLength;
            this.mAct_index = objData.mActivity.currentActivityIndex;
            var bCustomNav = (objHeaderRef.model) ? objHeaderRef.model.get("customNav") : false;
            if(!bCustomNav){
                this.updateNextBackButtons();
            }
            this.changeExt=false;
        }
    };

    return Header;
});
