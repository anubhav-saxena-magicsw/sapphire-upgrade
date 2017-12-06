define(["player/screen/screen-helper"], function(e) {
    var mySelf= this;
	var t, counter=0;
	var id=0, currentDraggable = null;
	return t = e.extend({}), t.prototype.init = function() {
	this.disableBtn();
		
	},
	t.prototype.resetDnd = function() {
	counter = 0;
			$('.wrong').remove();
			$('.right').remove();
			$('.answer').remove();
            $('.draggableItem ').removeClass('abc');
			$('.draggableItem').draggable("enable");
            $('.draggableItem').show();
			$('#btnCheckAnswer').removeClass('disabledBtn').attr('disabled','');
			$('#show_answer,#btnResetDnd').addClass('disabledBtn').attr('disabled','disabled');
			$('#btnCheckAnswer').addClass('disabledBtn').attr('disabled','disabled');
	
	},
	t.prototype.onClickShowAns = function() {
	var temp = ['a piece of', 'a pair of', 'a packet of', 'a slice of'];
	 $('.wrong').remove();
             $('.right').remove();
             $('.answer').remove();
             $('.draggableItem ').removeClass('abc');
             $('.draggableItem').draggable("enable");
			 $('#show_answer').addClass('disabledBtn').attr('disabled','disabled');
             $('.draggableItem').show();
		 $.each($('.droppableItem'), function(index) {
             if(!$(this).find('.answer').length){
  		        $(this).append('<div class="answer">' + temp[index] + '</div>');
				
             }
		 });
         $('.draggableItem ').hide()
         $.each($('.draggableItem '),function(){
          if(temp.indexOf($(this).text().trim())!==-1){
              $(this).hide();
             }
         });

	},
	t.prototype.checkAnswer = function(e) {
	$('.draggableItem').draggable("disable");
     	var rightArr = ['a piece of', 'a pair of', 'a packet of', 'a slice of'];
		var ansArr = [];
		
		for(var i=0; i< $('.droppableItem').length; i++){
			ansArr.push($($('.droppableItem')[i]).attr('ans').trim());
		}
		console.log(ansArr);
		for(var i=0; i< rightArr.length; i++){
			
				if(rightArr[i] == ansArr[i]){
					$('#drop'+(i+1)).append('<div class="right"></div>');
					 $('#btnCheckAnswer').addClass('disabledBtn').attr('disabled','disabled');
				}else{
					$('#drop'+(i+1)).append('<div class="wrong"></div>');
					$('#show_answer,#btnResetDnd').removeClass('disabledBtn').attr('disabled','');
					$('#btnCheckAnswer').addClass('disabledBtn').attr('disabled','disabled');
				}
			
		}
		//$("#btnCheckAnswer").css({"opacity":"0.5","pointer-events":"none","cursor":"default"});
		
	
	},



	t.prototype.destroy = function() {
	}, t.prototype.onTreeUpdateEvent = function(e) {
		console.log("onTreeUpdateEvent!!!!!!!!!!!!!!", e.type, " ::data: ", e.customData)
	}, t.prototype.handlePoupuEvent = function(e) {
		console.log("handlePoupuEvent!!!!!!!!!!!!!!", e.type, " ::data: ", e.customData)
	}, t.prototype.handleWidgetEvent = function(e) {

		if (e.type == 'onDragStart') {
		    currentDraggable = e.customData.ui.target.id;
			var l = currentDraggable.length;
			
		} else if (e.type == 'onDrop') {
		counter++;
		var dropId = e.customData.ui.target.id;
		var dragElemLength = $('.draggableItem').length-1;
		if(counter == dragElemLength){
			$('#btnCheckAnswer').removeClass('disabledBtn').attr('disabled','');
			
			
		}
		    
			$(currentDraggable).addClass('abc');
			var ans = $("#" + currentDraggable).text().trim();
			$('#'+dropId).attr('ans',ans);
		
		   
		} else if (e.type == 'onAnswerChecked') {
		
			/*$('.draggableItem').draggable("disable");
			var correctList = e.customData.correctList;
			var incorrectList = e.customData.incorrectList;
            $.each($('.draggableItem '),function(){
                if($(this).hasClass('abc') && (correctList.indexOf($(this).attr('id'))!==-1)){
				 $('#btnCheckAnswer').addClass('disabledBtn').attr('disabled','disabled');
                    $(this).append('<div class="right"></div>');
                }
            });
            $.each($('.draggableItem '),function(){
                if($(this).hasClass('abc') && (incorrectList.indexOf($(this).attr('id'))!==-1)){
                    $(this).append('<div class="wrong"></div>');
					$('#show_answer,#btnResetDnd').removeClass('disabledBtn').attr('disabled','');
					$('#btnCheckAnswer').addClass('disabledBtn').attr('disabled','disabled');
                }
            });
			console.log("handleWidgetEvent!!!!!INHElper.....", e)*/
		}
	}, t.prototype.disableBtn = function() {
		$('.buttonStyle').children().addClass('disabledBtn').attr('disabled','disabled');
	},t.prototype.destroy = function() {
	}, t
});
