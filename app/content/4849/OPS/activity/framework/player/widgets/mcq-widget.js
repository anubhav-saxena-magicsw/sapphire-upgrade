/*jslint nomen:true*/
/*global console,_,$, jQuery*/
/**
 * mcq
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
(function($){
    /**
     * @class Template.MCQ
     *
     * Widget 'MCQ' is introduced to empower to user to create MCQ activity with the minimum effort.
     *
     * By using this wiget  'MCQ' this feature can be created by providing data in JSON and HTML file.
     *
     * Events:
     * 	"ON_RESET", "ON_SHOW_RESULT", "ON_CORRECT_ANSWER", "ON_INCORRECT_ANSWER", "ON_INIT",ON_SHOW_FEEDBACK,ON_HIDE_FEEDBACK,ON_SHOW_ANSWER
     *
     * Public API:
     * "reset","showAnswer","result","showFeedback","hideFeedback"
     *
     /*
     {
         "id": "objWidget",
         "type": "widget",
         "parentId": ".questionHolder",
         "data": {
         "type": "mcqWidget",
             "templateId": "mcqtemplate1",
             "widgetName": "MCQ",
             "widgetData": {
         }
     },
         "events": [
         {
             "ON_RESET": [
                 {
                     "target": "helper",
                     "method": "onWidgetEvent"
                 }
             ]
         }    ,
         {    "ON_SHOW_RESULT": [
             {
                 "target": "helper",
                 "method": "onWidgetEvent"
             }
         ]
         }
     ]
      {
         "id":"reset",
         "type":"button",
         "parentId": "#button_holder",
         "state": "attached",
         "data": {
         "styleClass": "btn_style",
             "label": "Reset"
     },
         "events": [
         {
             "compClick": [
                 {
                     "target": "objWidget",
                     "method": "reset"
                 }
             ]
         }
     ]
     },
     {
         "id":"result",
         "type":"button",
         "parentId":"#button_holder",
         "state": "attached",
         "data": {
         "styleClass": "btn_style",
             "label": "result"
     },
         "events": [
         {
             "compClick": [
                 {
                     "target": "objWidget",
                     "method": "result"
                 }
             ]
         }
     ]
     }
     ,

     {
         "id":"show_answer",
         "type":"button",
         "parentId":"#button_holder",
         "state": "attached",
         "data": {
         "styleClass": "btn_style",
             "label": "Show Answer"
     },
         "events": [
         {
             "compClick": [
                 {
                     "target": "objWidget",
                     "method": "showAnswer"
                 }
             ]
         }
     ]
     },
     {
         "id":"hideFeedback",
         "type":"button",
         "parentId":"#button_holder",
         "state": "attached",
         "data": {
         "styleClass": "btn_style",
             "label": "Hide Feedback"
     },
         "events": [
         {
             "compClick": [
                 {
                     "target": "objWidget",
                     "method": "hideFeedback"
                 }
             ]
         }
     ]
     },
     {
         "id":"showfeedback",
         "type":"button",
         "parentId":"#button_holder",
         "state": "attached",
         "data": {
         "styleClass": "btn_style",
             "label": "Show Feedback"
     },
         "events": [
         {
             "compClick": [
                 {
                     "target": "objWidget",
                     "method": "showFeedback"
                 }
             ]
         }
     ]
     }
     }
     html structure
     <script type="text/template" id="mcqtemplate1">
     <div>
     Q1.The capital of india?
     <div ques="1"  type="mcq" ans="1">
     <div><input  data-type="option" type="radio"><label>Delhi</label></div>
     <div><input  data-type="option" type="radio"><label>Mumbai</label></div>
     <div><input  data-type="option" type="radio"><label>Kanpur</label></div>
     <div><input  data-type="option" type="radio"><label>Pune</label></div>
     <div><input  data-type="option" type="radio"><label>Chennai</label></div>
     </div>
     </script>
     */
    $.widget( "Template.MCQ",$.custom.BASEWIDGET, {
        // default options
        options: {
            answersArray:[],
            answersCheckedOrder:[],
            functionList : ["reset","showAnswer","result","showFeedback","hideFeedback","disable","enable"]

        },
        _create : function() {
        },
        _init: function() {
            this.dispatchEvent("ON_INIT");
            var questionIndex,tempArray,that = this,$elem = that.element;
            questionIndex = parseInt($elem.attr('ques'))-1;
            that.options.answersArray[questionIndex] = $elem.attr('ans').trim().split('|');
            $elem.removeAttr('ans');
            that.options.answersCheckedOrder[questionIndex] = new Array();
            tempArray = that.options.answersArray[questionIndex].slice(0);
            $.each($elem.find('[data-type="option"]'),function(index){
                var index = tempArray.indexOf((index+1).toString());
                if(index!==-1)
                    tempArray.splice(index,1);
            });
            if(tempArray.length!==0)
                throw "Question number "+(questionIndex+1)+" has wrong options";
            $elem.removeAttr('answers');
            $elem.find('[data-type="option"]').off('click').on('click',function(){
                var isChecked = $(this).hasClass('active');
                if(!isChecked)
                    $(this).addClass('active');
                else
                    $(this).removeClass('active');
                if(that._checkIfthisOptionsExist('ctype','clickWords'))
                {
                    $(this).addClass('active');
                    isChecked=false;
                }
                that._checkAnswer(questionIndex,$elem.find('[data-type="option"]').index($(this)),$elem,!isChecked);
            });
        },
        _checkIfthisOptionsExist:function(type,value){
            if(this.options.hasOwnProperty('widgetData')){
                if(this.options.widgetData[type]==value)
                    return true;
            }
            return false;
        }
        ,
        _arraysIdentical:function(arr1, arr2) {
            if(arr1.length !== arr2.length)
                return false;
            for(var i = arr1.length; i--;) {
                if(arr1[i] !== arr2[i])
                    return false;
            }
            return true;
        },
        /**
         * Responsible for to check current question if its incorrect ON_INCORRECT_ANSWER event dispatched if its correct ON_CORRECT_ANSWER event gets dispatched.
         * @param {none}
         * @return {none}
         * @access private
         * @memberof #MCQ
         */
        _checkAnswer:function(questionIndex,optionNumber,elem,isChecked){
            console.log(this.options)
            var tempArray = this.options.answersCheckedOrder[questionIndex].slice(0);
            var answersArray = this.options.answersArray[questionIndex];
            if(isChecked){
                if(this._checkIfthisOptionsExist('ctype','clickWords') || this._checkIfthisOptionsExist('autoUncheck',true) ){
                    if(tempArray.indexOf((optionNumber+1).toString())==-1)
                        tempArray.push((optionNumber+1).toString());
                }
                else
                    tempArray.push((optionNumber+1).toString());

            }else{
                var arrayIndex =  tempArray.indexOf((optionNumber+1).toString());
                tempArray.splice(arrayIndex,1);
            }
            this.options.answersCheckedOrder[questionIndex] = tempArray;
            if(!this._checkIfthisOptionsExist('autoUncheck',true)){
                if(tempArray.length > answersArray.length){
                    var selectedElement = elem.find('[data-type="option"]').eq(parseInt(tempArray.shift())-1);
                    selectedElement.removeClass('active');
                    if(selectedElement.get(0).tagName==='INPUT')
                        selectedElement.attr('checked',false);
                }
            }
            if(this._arraysIdentical(tempArray.slice(0).sort(),answersArray.slice(0).sort())){
                elem.find('.feedback').remove();
                this.dispatchEvent("ON_CORRECT_ANSWER",{},elem);
            }else{
                elem.find('.feedback').remove();
                this.dispatchEvent("ON_INCORRECT_ANSWER",{},elem);
            }
        },
        /**
         * Responsible to reset the mcq elements, and disptch 'ON_RESET' event
         * when reset complete.
         * @param {none}
         * @return {none}
         * @access public
         * @memberof #MCQ
         */
        reset:function(){
            this.element.find('[data-type="option"]').each(function(){ $(this).removeAttr('disabled');});
            this.element.find('[data-type="option"]').removeClass('active');
            if(this.element.find('[data-type="option"]').get(0).tagName==='INPUT')
                this.element.find('[data-type="option"]').attr('checked',false);
            for (var i in this.options.answersCheckedOrder)
                this.options.answersCheckedOrder[i] =new Array();
            $('.feedback').remove();
            this.dispatchEvent("ON_RESET");;
        },
        /**
         * Responsible to show all correct answers and dispatch 'ON_SHOW_ANSWER' event
         * @param {none}
         * @return {none}
         * @access public
         * @memberof #MCQ
         */
        showAnswer:function(){
            $('.feedback').remove();
            var that = this,currentIndex=parseInt(that.element.attr('ques'))-1;
            that.element.find('[data-type="option"]').removeClass('active');
            if(that.element.find('[data-type="option"]').get(0).tagName==='INPUT')
                that.element.find('[data-type="option"]').attr('checked',false);

            that.options.answersCheckedOrder[currentIndex] = that.options.answersArray[currentIndex];
            $.each(that.element.find('[data-type="option"]'),function(index){
                if(that.options.answersArray[currentIndex].indexOf((index+1).toString())!==-1){
                    if($(this).get(0).tagName==='INPUT')
                        this.checked = true;
                    $(this).addClass('active');
                }
            });
            this.dispatchEvent("ON_SHOW_ANSWER");
        },
        /**
         * Responsible for to return list of correct answers as an array and dispatch 'ON_SHOW_RESULT' event
         * @param {none}
         * @return {array}
         * @access public
         * @memberof #MCQ
         */
        result:function(){
            var results = [],currentIndex=parseInt(this.element.attr('ques'))-1;
            console.log(this.options.answersArray)
            for(var i = 0;i<this.options.answersArray.length;i++)
            {
                if(this._arraysIdentical(this.options.answersArray[i],this.options.answersCheckedOrder[i])){
                    results[i+1]=1
                }
                else{
                    results[i+1]=0;
                }
            }
            if(this.options.answersArray.length===currentIndex+1){
                this.dispatchEvent("ON_SHOW_RESULT",{},results);
            }
        },
        /**
         * Responsible for to show feedback and dispatch 'ON_SHOW_FEEDBACK' event
         * @param {none}
         * @return {none}
         * @access public
         * @memberof #MCQ
         */
        showFeedback:function(){
            var currentIndex = parseInt(this.element.attr('ques'))-1
            this.element.find('.feedback').remove();
            for(var i in this.options.answersCheckedOrder[currentIndex]){
                if(this.options.answersArray[currentIndex].indexOf(this.options.answersCheckedOrder[currentIndex][i])!==-1){
                    var  $correctFeedback = $('<div style="display: inline-block" class="feedback correct"></div>');
                    this.element.find('[data-type="option"]').eq(parseInt(this.options.answersCheckedOrder[currentIndex][i])-1).parent().append($correctFeedback);

                }else{
                    var  $incorrectFeedback = $('<div style="display: inline-block" class="feedback incorrect"></div>');
                    this.element.find('[data-type="option"]').eq(parseInt(this.options.answersCheckedOrder[currentIndex][i])-1).parent().append($incorrectFeedback);
                }
            }
            this.dispatchEvent("ON_SHOW_FEEDBACK");
        },
        /**
         * Responsible for to hide feedback and dispatch 'ON_HIDE_FEEDBACK' event
         * @param {none}
         * @return {none}
         * @access public
         * @memberof #MCQ
         */
        disable:function(){
            this.element.css('position','relative','z-index','0').prepend('<div class="widget_disabled" style="position: absolute;height: 100%;width: 100%" ></div>')
            this.element.find('[data-type="option"]').each(function(){ $(this).attr('disabled','disabled');});
            this.dispatchEvent("ON_DISABLE");
        },
        enable:function(){
            this.element.find('.widget_disabled').remove();
            this.element.find('[data-type="option"]').each(function(){ $(this).removeAttr('disabled');});
            this.dispatchEvent("ON_ENABLE");
        },
        hideFeedback:function(){
            $('.feedback').remove();
            this.dispatchEvent("ON_HIDE_FEEDBACK");
        },
        destroy: function() {
            this.options.answersCheckedOrder.length=0;
            this.options.answersArray.length=0;
            this.element.remove();
        }
    });
})(jQuery);