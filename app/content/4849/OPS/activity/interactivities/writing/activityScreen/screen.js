/*jslint nomen: true*/
/*globals Backbone,_,console,$, class */
/*
define(['player/screen/screen-helper','shell/js/jquery.PrintArea.js'
        ], function(ScreenHelper) {*/
define(['player/screen/screen-helper', 'player/utils/data-loader','shell/js/jquery.PrintArea.js'
        ], function(ScreenHelper,DataLoader) {
    var Helper, mySelf,bFirstDrag = false,bSecondDrag = false,strFristDragItemId ="",nCount = 0;
    var userChoiceArr = ["",""];
     Helper = ScreenHelper.extend({
    });
    
    Helper.prototype.members = {
        currentAudio : undefined
    };
     Helper.prototype.init = function() {
      
         Data_Loader = new DataLoader();
         mySelf = this;
         $(".unSelectDraggable").on('dragstart', function (e) {e.preventDefault();});
      
       
        $("#directions").on('click',function(evt){
           mySelf.playThisAudio('directions');
           
        });
        
         $("#rightDiv").on('click',function(evt){
           mySelf.playThisAudio('prompt');
           
        });
        
         $("#box_1").on('click',function(evt){
           mySelf.playThisAudio('1');
           
        });
        
          $("#box_2").on('click',function(evt){
           mySelf.playThisAudio('2');
           
        });
          
          $("#box_3").on('click',function(evt){
           mySelf.playThisAudio('3');
           
        });
        
          $("#box_4").on('click',function(evt){
           mySelf.playThisAudio('4');
           
        });
        
          $("#box_5").on('click',function(evt){
           mySelf.playThisAudio('5');
           
        });
        
          $("#box_6").on('click',function(evt){
           mySelf.playThisAudio('6');
           
        });
        
          $("#box_7").on('click',function(evt){
           mySelf.playThisAudio('7');
           
        });
        
    //     $(".sumbitBtn").mouseover(function(evt){	
    //     	 mySelf.playThisAudio('print');
    //    });
        
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
            url: "interactivities/writing/activityScreen/assets/xml/dndAdvance.xml",
            dataType: "xml",
            contentType: "application/xml",
            returnType: "json"
        });
      
        
      $(".sumbitBtn").addClass('disableBtn'); 
    
       
       $("#btnClose").click(function(){
            $(this).parent().hide();
            $('.blocker').hide();
          $('#screenHolder').css('pointer-events','none');
                         
        }); 
        
        $(".sumbitBtn").on('click', function(){
        	 mySelf.evaluate();
        });
          
            $("#textArea").keyup(function(e){
            mySelf.checkBlockValues();
        });
          
            $("#textArea").keydown(function(e){
            mySelf.checkBlockValues();
        });
        
          $("#textArea").keypress(function(e){
            mySelf.checkBlockValues();
        });
        
       
       /*
        var el = document.getElementById("textArea");
              var range = document.createRange();
              var sel = window.getSelection();
              range.setStart(el.childNodes[2], 5);
              range.collapse(true);
              sel.removeAllRanges();
              sel.addRange(range);*/
       
       
          
     };
     
       Helper.prototype.checkBlockValues = function() {
       
        var txt = $("#textArea").val();  
        txt = txt.trim();   
        console.log(txt);
        if(txt != "")
        	{
        		$(".sumbitBtn").removeClass('disableBtn');  
        		$('.sumbitBtn').css('color','white');
        		
        	}
        	
        	else {
        		$(".sumbitBtn").addClass('disableBtn');  
        		$('.sumbitBtn').css('color','#5C6A73');
        	}
        };
     
  Helper.prototype.evaluate = function() {   
    
        //$("#sumbitBtn").addClass('disableBtn');  
        //$(".sumbitBtnBtn").css({"color":"#5C6A73"});
          
      console.log(111111);
      PrintElem();
        /*
            var imgSrc1 = "interactivities/writing/activityScreen/assets/images/"+userChoiceArr[0]+".png";
                    var imgSrc2 = "interactivities/writing/activityScreen/assets/images/"+userChoiceArr[1]+".png";
                    /*var imgSrc3 = "interactivities/writing/activityScreen/assets/images/"+userChoiceArr[2]+".png";
                    mySelf.playThisAudio('greatjob');
                  
                   $("#popupfeedback,.blocker").show(); 
                   mySelf.correctFeedbackAnim1.play(false);
                   $("#activityArea").addClass('disableBtn'); 
                  
                    $("#imgDrag1").attr('src',imgSrc1);
                    $("#imgDrag2").attr('src',imgSrc2);*/
        
           // $("#imgDrag3").attr('src',imgSrc3);
          // $("#"+userChoiceArr[2]).css("visibility","hidden");
        /*
           $("#"+userChoiceArr[0]).css("visibility","hidden");
                   $("#"+userChoiceArr[1]).css("visibility","hidden");
                   $(".droppableItem").css("visibility","hidden");
                   $(".dropPrintableImages").css("visibility","visible");*/
        
           /* $(".textArea").html($(".hiddenText").html());*/
           
          // $("#printablearea").printArea(); 
          
          
          
            function PrintElem()
    {   
    	   // console.log()
    	    //$('#render').html($('#textArea').val());
        Popup($('#textArea').val());
    }

    function Popup(data) 
    {
    	data= data.replace(/\r?\n/g, '<br />');
    	console.log("entryyyyyy");
    	console.log(data);
        var mywindow = window.open('', 'my div', 'height=400,width=600');
        mywindow.document.write('<html><head><title></title>');
        /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
        mywindow.document.write('</head><body >');
        mywindow.document.write("<img src='interactivities/writing/activityScreen/assets/images/card.png'></img>"+"<br/>"+data);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10

        mywindow.print();
        mywindow.close();

        return true;
    }
    
    
    
        
      /*
        else
              {
                 
                  mySelf.showIncorrectPopup();
              }*/
      

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
        //mySelf.playThisAudio('1sec');
        /*
        if(nCount>=1)
                {
                   $("#activityArea").removeClass('disableBtn');
                }
                if(nCount ==2)
                {  
                    $(".draggableItem").addClass('disableBtn');
                    $(".sumbitBtnBtn").css({"color":"#fff"});
                    $("#sumbitBtn").removeClass('disableBtn'); 
                     
                 }*/
        
       
    };
    
    Helper.prototype.playThisAudio = function(audio) {
     
        mySelf.audioController.stop();
        var audioType = 'mp3';
        var audioSource = {
            source : [{
                path : 'interactivities/writing/activityScreen/assets/audios/'+ audio + "." + audioType,
                type : audioType
            }],
            loop : false
        };
        mySelf.audioController.changeAudio(audioSource);
        mySelf.members.currentAudio = audio;
        mySelf.audioController.play();
    };
    
   
  /*
    Helper.prototype.handleDndEvent = function(e) {
           var dropId,index;
           var dragID = e.customData.dragItem.id;
           var bBackDrag = false;
         
           if(e.customData.dropItem)
           {
                dropId = e.customData.dropItem.id;
                index = dropId.substr(4,dropId.length);
                $("#activityArea").addClass('disableBtn');
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
                         if(nCount<2 && !bBackDrag)
           {
                mySelf.playThisAudio('praise1');
           }
           else if(nCount ==2)
           {
                mySelf.playThisAudio('praise2');
           }
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
           console.log(nCount,"ncount");
         
           
           console.log(userChoiceArr,"arrrr");
   
        };
        
         Helper.prototype.handleDragStart = function(e) {
            
             mySelf.audioController.stop();
   
        };*/
  
        
    
   Helper.prototype.showIncorrectPopup = function(){
         mySelf.playThisAudio('tryagain');
      		$('#tryagain').show();
              
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
