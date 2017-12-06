var audiog = document.createElement('audio');
var sourceg = document.createElement('source');

function play_audio(id)
{
	var aTag = $("body").find('[href="javascript:play_audio(\'' + id+ '\');"]');
	
	aTag.find("*").addClass("aClicked");
	setTimeout(function() {
		aTag.find("*").removeClass("aClicked");
	}, 3000);	
   
    var url = window.location;    
    var audioName = id;
    var fileg = 'audio';   
	/* var localpath = '../OPS/content/audio/'; */	
	var localpath = 'http://amz.s-1.mdistribute.magicsw.com/webbooks_static/content/en/3525/OPS/';	
    var audioFileName = audioName + '.mp3';
   
     console.log ( localpath + audioFileName );
	
    if(typeof audiog.canPlayType == 'function')
    {
        $(audiog).empty();
        $(audiog).src = "";
        $(audiog).remove();
        audiog = document.createElement('audio');
        if(audiog.canPlayType('audio/mpeg;'))
        {
            sourceg.type = "audio/mpeg";
           
            sourceg.src = localpath + audioFileName;
             
        }
		
        $(audiog).append(sourceg);
        
    }
    }
	
	/* audio_popup g_glossary	 */
	
	jQuery(function($) {
	
	$("a.popup_word").click(function() {
			var curid = $( this ).attr('id');
			loadPopup(curid);
			
	return false;
	});

	$("div.gloss_prop").click(function() {
	var parentid = $(this).attr('id');
		disablePopup(parentid);
		
	});
	

	 /************** start: functions. **************/

	var popupStatus = 0;
	
	function loadPopup(curid) {
		if(popupStatus == 0) {
		$('#popup_container').find('#'+curid).fadeIn();
			popupStatus = 1;
			audiog.play();
		}
	}

	function disablePopup(parentid) {
		if(popupStatus == 1) {
			$('#popup_container').find('#'+parentid).fadeOut();
			popupStatus = 0;
			audiog.pause();
		audiog.currentTime = 0;
		}
	}
	/************** end: functions. **************/
});

