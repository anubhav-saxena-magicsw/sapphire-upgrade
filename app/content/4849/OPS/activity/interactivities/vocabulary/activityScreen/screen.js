/*jslint nomen: true*/
/*globals Backbone,_,console,$, class */
define(['player/screen/screen-helper', 'player/utils/data-loader', 'shell/js/jquery.PrintArea.js'], function(ScreenHelper, DataLoader) {
	var Helper, mySelf, bFirstDrag = false, bSecondDrag = false, strFristDragItemId = "", nCount = 0;
	var userChoiceArr = ["","","","",""];
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
		$(".unSelectDraggable").on('dragstart', function(e) {
			e.preventDefault();
		});

		$("#directions").on('click', function(evt) {
			mySelf.playThisAudio('directions');

		});

		$(".btnReset").on('click', function(evt) {
			mySelf.objActivity.jumpToActivityByID(1);
		});

		$(".btnReveal").on('click', function(evt) {
			$('.drop_img').show();
			$('.dnd1 .draggableItem').hide();
			$(this).parent().hide();
			$("#btnsubmit").hide();
			$("#directions").css("pointer-events","none");
		});

		$("#btnsubmit").mouseover(function(evt) {
			mySelf.playThisAudio('submit');
		});
		
		$(".click_here").mouseover(function(evt) {
		    var id = this.id;
			mySelf.playThisAudio(id);
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

		Data_Loader.load({// load draggable and droppable from xml
			url : "interactivities/vocabulary/activityScreen/assets/xml/dndAdvance.xml",
			dataType : "xml",
			contentType : "application/xml",
			returnType : "json"
		});

		$("#btnsubmit").click(function() {
			mySelf.evaluate();
		});

	};
	Helper.prototype.evaluate = function() {

		$("#btnsubmit").addClass('disableBtn');
		if (userChoiceArr[0] == "opt3" && userChoiceArr[1] == "opt4" && userChoiceArr[2] == "opt1" &&  userChoiceArr[3] == "opt5" &&  userChoiceArr[4] == "opt2") {
			$("#activityArea").addClass('disableBtn');
			mySelf.playThisAudio('star');
			$(".popupfeedback,.blocker").show();
			mySelf.anim1.play(false);
			
		} else {
			mySelf.showIncorrectPopup();
		}
	};

	Helper.prototype.playDraggableItemSound = function() {
		$(".draggableItem").on('click', function() {
			var optionAudioURL = $(this).attr('id');
			mySelf.playThisAudio(optionAudioURL);
		});
	};

	Helper.prototype.close_all = function() {
		$('.blocker,#btnsubmit,.popupfeedback').hide();
		$('#screenHolder').css('pointer-events', 'none');
	};

	Helper.prototype.hidePreloader = function() {
		$("#preloader").hide();
	};

	Helper.prototype.onAudioFinish = function(evt) {
		mySelf.audioController.stop();
		mySelf.audioController.pause();
		if (nCount >= 1) {
			$("#activityArea").removeClass('disableBtn');
		}
	};

	Helper.prototype.playThisAudio = function(audio) {
		mySelf.audioController.stop();
		var audioType = 'mp3';
		var audioSource = {
			source : [{
				path : 'interactivities/vocabulary/activityScreen/assets/audios/' + audio + "." + audioType,
				type : audioType
			}],
			loop : false
		};
		mySelf.audioController.changeAudio(audioSource);
		mySelf.members.currentAudio = audio;
		mySelf.audioController.play();
	};

	Helper.prototype.handleDndEvent = function(e) {
		var dropId, index;
		var dragID = e.customData.dragItem.id;
		mySelf.playThisAudio(dragID);
		var bBackDrag = false;

		if (e.customData.dropItem) {
			dropId = e.customData.dropItem.id;
			index = dropId.substr(4, dropId.length);
			for (var i = 0; i < userChoiceArr.length; i++) {
				if (userChoiceArr[i] == dragID) {
					userChoiceArr[i] = "";
					nCount--;
				}
			}
			nCount++;
			userChoiceArr[index - 1] = dragID;
		} else {
			for (var i = 0; i < userChoiceArr.length; i++) {
				if (userChoiceArr[i] == dragID) {
					userChoiceArr[i] = "";
					nCount--;
					bBackDrag = true;
				}
			}
		}
		   console.log('last'+nCount);
         if(nCount == 0 || nCount == 1 || nCount == 2 || nCount == 3 || nCount == 4) {
          	 $("#btnsubmit").css('pointer-events','none').css('cursor','pointer').css('opacity','0.5'); 
         }
         else if(nCount == 5) {
                $("#btnsubmit").css('pointer-events','auto').css('cursor','pointer').css('opacity','1'); 
         }
	};

	Helper.prototype.handleDragStart = function(e) {
		mySelf.audioController.stop();
	};

	Helper.prototype.showIncorrectPopup = function() {
		mySelf.playThisAudio('tryagain');
		$('#tryagain').show();
	};

	Helper.prototype.tryAaginFunction = function() {
		nCount = 0;
		$(".draggableItem").removeClass('disableBtn');
		mySelf.dndComp.resetAll();
		userChoiceArr = ["", "", ""];
		$("#myModal_incorrect").modal('hide');
	};

	Helper.prototype.exitActivity = function() {
		userChoiceArr = ["", "", ""];
		nCount = 0;
		this.jumpToActivityByID(1);
	};

	Helper.prototype.destroy = function() {
		userChoiceArr = ["","","","",""];
		nCount = 0;
	};

	return Helper;
});
