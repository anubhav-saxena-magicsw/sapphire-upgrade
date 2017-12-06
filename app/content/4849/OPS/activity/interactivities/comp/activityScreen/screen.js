/*jslint nomen: true*/
/*globals Backbone,_,console,$, class */
//define(['player/screen/screen-helper', 'shell/js/jquery.PrintArea.js'], function(ScreenHelper) {
	define(['player/screen/screen-helper', 'player/utils/data-loader','shell/js/jquery.PrintArea.js'
        ], function(ScreenHelper,DataLoader) {
    var Helper, mySelf,bFirstDrag = false,bSecondDrag = false,strFristDragItemId ="",nCount = 0;
    var userChoiceArr = ["","",""];
     Helper = ScreenHelper.extend({
    });
    
    Helper.prototype.members = {
        currentAudio : undefined
    };
     Helper.prototype.init = function() {
      
         Data_Loader = new DataLoader();
         mySelf = this;
         	var img = document.createElement('img');
		img.src="interactivities/comp/activityScreen/assets/images/Result.png";
         $(".unSelectDraggable").on('dragstart', function (e) {e.preventDefault();});
      
       
        $("#directions").on('click',function(evt){
			  mySelf.playThisAudio('directions');
           
        });
        
         $("#btnReset").on('click',function(evt){
				mySelf.objActivity.jumpToActivityByID(1);	 
        });
        
        $("#btnReveal").on('click',function(evt){
			$('.dropImages').show();
			//$('.drop_img').css("top","230px");
			$('.dnd1 .draggableItem').hide();
			$(this).parent().hide();
			$("#btnsubmit").hide();
			$("#activityArea").addClass('disableBtn'); 
			$("#directions").addClass('disableBtn'); 
        });
        
        $("#btnReset").mouseover(function(evt){	
         	 mySelf.playThisAudio('reset');
        });
		
		$("#btnsubmit").mouseover(function(evt){	
         	 mySelf.playThisAudio('submit');
        });
		
	    $("#btnReveal").mouseover(function(evt){	
         	 mySelf.playThisAudio('reveal');
        });
        
        $(".Sen").on('click',function(evt){
            var strAudioName = $(this).attr('audioName');
           mySelf.playThisAudio(strAudioName);
             
        });
       
        $(".overClass").on('click',function(evt){
               var strAudioName = $(this).attr('audioName');
               mySelf.playThisAudio(strAudioName);
        });
       
        Data_Loader.off(Data_Loader.DATA_LOAD_SUCCESS);
        Data_Loader.off(Data_Loader.DATA_LOAD_FAILED);
        Data_Loader.on(Data_Loader.DATA_LOAD_SUCCESS, function(objData) {
            dndData = objData;
            Data_Loader.off(Data_Loader.DATA_LOAD_SUCCESS);
            Data_Loader.off(Data_Loader.DATA_LOAD_FAILED);
            mySelf.dndComp.setQuestionData(objData.dnd);
            mySelf.playDraggableItemSound();
        });
        
        Data_Loader.on(Data_Loader.DATA_LOAD_FAILED, function(error) {
            Data_Loader.off(Data_Loader.DATA_LOAD_SUCCESS);
            Data_Loader.off(Data_Loader.DATA_LOAD_FAILED);

        });
        
        Data_Loader.load({                                                      // load draggable and droppable from xml
            url: "interactivities/comp/activityScreen/assets/xml/dndAdvance.xml",
            dataType: "xml",
            contentType: "application/xml",
            returnType: "json"
        });
       
     $("#btnsubmit").click(function(){
               mySelf.evaluate();          
     }); 
       
       $("#btnClose").click(function(){
            $(this).parent().hide();
            $('.blocker,#btnsubmit').hide();
          $('#screenHolder').css('pointer-events','none');
                         
        }); 
          
     };
  Helper.prototype.evaluate = function() {   
        
        $('#btnsubmit').hide();
        $("#sumbit").addClass('disableBtn');  
        $(".sumbitBtn").css({"color":"#5C6A73","background":"-webkit-linear-gradient(#51A0FC , #79AEFE)","background":"-o-linear-gradient(#51A0FC , #79AEFE)","background":"-moz-linear-gradient(#51A0FC , #79AEFE)","background":"linear-gradient(#51A0FC , #79AEFE)"});
        if (userChoiceArr[0] == "opt4" && userChoiceArr[1] == "opt1" && userChoiceArr[2] == "opt2" && userChoiceArr[3] == "opt3")       
        {
        	
            /*var imgSrc3 = "interactivities/writing/activityScreen/assets/images/"+userChoiceArr[2]+".png";*/
          mySelf.playThisAudio('greatjob');
          $('#lastSprite').addClass('lastSprite');
           $(".blocker").show(); 
           $("#wrongMark").show(); 
           $('.dnd1 .draggableItem ').addClass('disableBtn');
		   $("#wrongMark").on('click',function() {
				$('#lastSprite').css('display','none');
				$('.blocker').css('display','none');
				$("#btnsubmit").css("pointer-events","none");		
				$("#directions").css("pointer-events","none");		
		   });
		   mySelf.correctFeedbackAnim1.play(false);
           
          
            $("#imgDrag1").attr('src',imgSrc1);
            $("#imgDrag2").attr('src',imgSrc2);
           // $("#imgDrag3").attr('src',imgSrc3);
          // $("#"+userChoiceArr[2]).css("visibility","hidden");
       /*
           $("#"+userChoiceArr[0]).css("visibility","hidden");
                  $("#"+userChoiceArr[1]).css("visibility","hidden");
                  $(".droppableItem").css("visibility","hidden");
                  $(".dropPrintableImages").css("visibility","visible");*/
       
         
         //  $("#printablearea").printArea(); 
        }
        else
        {
           
            mySelf.showIncorrectPopup();
        }

   };
     
   Helper.prototype.playDraggableItemSound = function() {    
         $(".draggableItem").on('click',function(){ 
           var optionAudioURL = $(this).attr('id');
           mySelf.playThisAudio(optionAudioURL);
         
          });
        
       };
     
    Helper.prototype.hidePreloader = function() {   
            $("#preloader").hide();
        };
    
    Helper.prototype.onAudioFinish = function(evt) {
        mySelf.audioController.stop();
        mySelf.audioController.pause();
        if(nCount>=1)
        {
           $("#activityArea").removeClass('disableBtn');
        }
       /*
        if(nCount == 3)
               {  
                   $(".draggableItem").addClass('disableBtn');
                   $(".sumbitBtn").css({"color":"#000000","background":"-webkit-linear-gradient(#51A0FC , #79AEFE)","background":"-o-linear-gradient(#51A0FC , #79AEFE)","background":"-moz-linear-gradient(#51A0FC , #79AEFE)","background":"linear-gradient(#51A0FC , #79AEFE)"});	
                   $("#btnsubmit").css('pointer-events','auto').css('cursor','pointer').css('background-image',"url('interactivities/comp/activityScreen/assets/images/submit_en.png')"); 
                   
                 }*/
       
       
    };
    
    Helper.prototype.playThisAudio = function(audio) {
        mySelf.audioController.stop();
        var audioType = 'mp3';
        var audioSource = {
            source : [{
                path : 'interactivities/comp/activityScreen/assets/audios/'+ audio + "." + audioType,
                type : audioType
            }],
            loop : false
        };
        mySelf.audioController.changeAudio(audioSource);
        mySelf.members.currentAudio = audio;
        mySelf.audioController.play();
    };
		
   
    Helper.prototype.handleDndEvent = function(e) {
         var dropId,index;
         var dragID = e.customData.dragItem.id;
          mySelf.playThisAudio(dragID);
	
         var bBackDrag = false;
       
         if(e.customData.dropItem)
         {
              dropId = e.customData.dropItem.id;
              index = dropId.substr(4,dropId.length);
              //$("#activityArea").addClass('disableBtn');
               for(var i=0; i< userChoiceArr.length;i++)
                {
                    if(userChoiceArr[i] == dragID)
                    {
                        userChoiceArr[i] = "";
                        nCount--;
                    }
                    
                }
                 nCount++;
               userChoiceArr[index-1] = dragID;
         }
         else{
            for(var i=0; i< userChoiceArr.length;i++)
            {
                if(userChoiceArr[i] == dragID)
                {
                    userChoiceArr[i] = "";
                     nCount--;
                     bBackDrag = true;
                }
            }
         }
         
           console.log('last'+nCount);
         if(nCount < 4) {
         	console.log("workin");
         	 
      
         	 $("#btnsubmit").css('pointer-events','none').css('cursor','pointer').css('opacity','0.4'); 
         }
         else if(nCount == 4) {
         	console.log("workinAlso");
         	
              $("#btnsubmit").css('pointer-events','auto').css('cursor','pointer').css('opacity','1'); 
         }
      };
      
       Helper.prototype.handleDragStart = function(e) {
         
           mySelf.audioController.stop();
 
      };
        
    
   Helper.prototype.showIncorrectPopup = function(){
		    mySelf.playThisAudio('tryagain');
      		$('#tryagain').show();
      		$('#btnsubmit').hide();
				
      };
    
     Helper.prototype.tryAaginFunction = function(){
         nCount =0;
          $(".draggableItem").removeClass('disableBtn');
          $(".sumbitBtn").css({"color":"#5C6A73","background":"-webkit-linear-gradient(#51A0FC , #79AEFE)","background":"-o-linear-gradient(#51A0FC , #79AEFE)","background":"-moz-linear-gradient(#51A0FC , #79AEFE)","background":"linear-gradient(#51A0FC , #79AEFE)"});
         mySelf.dndComp.resetAll();
         userChoiceArr =  ["",""];
        $("#myModal_incorrect").modal('hide'); 
       
      };
      
       
    Helper.prototype.exitActivity = function(){
        userChoiceArr =  ["","",""];
        nCount =0;
        this.jumpToActivityByID(1);
          
      };
   
     Helper.prototype.destroy = function() {
      userChoiceArr = ["","",""];
      nCount = 0;
       
     };


    return Helper;
});
