var audioi = document.createElement('audio');
var sourcei = document.createElement('source');
var objecti = document.createElement('object');
var embedi = document.createElement('embed');
var language = "e";
var grade = 'adv1';
var ie8sound;
var isiPad = navigator.userAgent.match(/iPad/i) != null;
var isiPod = navigator.userAgent.match(/iPod/i) != null;

function zeroFill( number, width )
{
    width -= number.toString().length;
    if ( width > 0 )
    {
        return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
    }
    return number;
}


$(function()
{
    $('#left-side-content').load('http://www.bigideasmath.com/protected/content/dc/start_menu.html');
});

function play_audio(id)
{
	var aTag = $("body").find('[href="javascript:play_audio(\'' + id+ '\');"]');
	
	aTag.find("*").addClass("aClicked");
	setTimeout(function() {
		aTag.find("*").removeClass("aClicked");
	}, 3000);
	
    var basepath = './audio';
    var locpath = './audio';


    var url = window.location;
    var pieces = id.split('_');
    var len = pieces.length;

    var chapter = pieces[len-3];
    var section = pieces[len-2];
    var audioName = pieces[len-1];
    var fileg = 'audio';

    var serverUrl = './data/assets/Audio/';

	window.whichBrowser = function () {

        var userAgent = window.navigator.userAgent;

        var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};

        for ( var key in browsers ) {

            if ( browsers [ key ].test ( userAgent ) ) {

                return key;

            }

        }

    }
	
	if ( whichBrowser() === 'firefox' ) {
		var audioFileName = audioName + '.ogg';
		
	} else {
		var audioFileName = audioName + '.mp3';
		
	}
    
    console.log ( serverUrl + audioFileName );

    //document.getElementById('audiotag_e_' + id).play();
    if(typeof audioi.canPlayType == 'function')
    {
        $(audioi).empty();
        $(audioi).src = "";
        $(audioi).remove();
        audioi = document.createElement('audio');
        if(audioi.canPlayType('audio/mpeg;'))
        {
            sourcei.type = "audio/mpeg";
            /*sourcei.src = basepath + "/" + language  + "/" + language + "_" + fileg + "_" + chapter + "_" + section +
                "_" + zeroFill(id,3) + ".mp3";*/
            sourcei.src = serverUrl + audioFileName;
        }
        else if(audioi.canPlayType('audio/ogg'))
        {

            /*sourcei.type = "audio/ogg";
             sourcei.codes = "vorbis";
             sourcei.src = basepath + "/e/e_" + fileg + "_" + chapter + "_" + section + "_" + zeroFill(id,3) + ".ogg";*/
            $('#flashsound').html('');
            $('#flashsound').show();
            $('#flashsound').html('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" allowScriptAccess="always" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" width="0" height="0" id="niftyPlayer1" align=""><param name=movie value="../../../niftyplayer/niftyplayer.swf"><param name=quality value=high><param name=bgcolor value=#FFFFFF><embed src="../../../niftyplayer/niftyplayer.swf" quality=high bgcolor=#FFFFFF width="0" height="0" name="niftyPlayer1" id="niftyPlayer1" align="" type="application/x-shockwave-flash" swLiveConnect="true" pluginspage="http://www.macromedia.com/go/getflashplayer"></embed></object>');
            setTimeout(function()
            {
                /*niftyplayer('niftyPlayer1').loadAndPlay(escape(locpath + "/" + language  + "/" + language + "_" + fileg + "_" + chapter + "_" + section + "_" + zeroFill(id,3) + ".mp3"));*/
                niftyplayer('niftyPlayer1').loadAndPlay(escape(serverUrl + audioFileName));
            }, 500)


        }


        $(audioi).append(sourcei);
        audioi.play();
		
    }
    else
    {
        //we don't have support for the audio object so what do we do now? I guess we fallback to embed and object...
        $('#ie8sound').attr('src',basepath + "/" + language  + "/" + language + "_" + fileg + "_" + chapter + "_" + section + "_" + zeroFill(id,3) + ".mp3");
        // this code uses Prototype.js

    }
}

function change_language(lid)
{
    $('.audio').removeClass("selected");
    $('.audio > img').attr('src',"images/audio_off.png");
    switch(lid)
    {
        case 1:
            language = "e";
            $('#english_selected_a').addClass("selected");
            $('#english_selected').attr('src','images/audio_on.png');
            break;
        case 2:
            language = "s";
            $('#spanish_selected_a').addClass("selected");
            $('#spanish_selected').attr('src','images/audio_on.png');
            break;
        default:
            language = "e";
    }
}

function scroll_page(dir)
{
    curPage = curPage + dir;
    if(curPage <= 0){curPage = 1;}
    if(curPage >= maxPages){curPage = maxPages;}
    document.location.hash = "#page" + curPage;
}

function scroll_to_page(pn)
{
    document.location.hash = "#page" + pn;
}
function play_glossary_audio_english(id, grade)
{
    var basepath = '../audio';
    var locpath = '../audio';


    var url = window.location;
    var pieces = url.pathname.split("/");
    var len = pieces.length;

    if (grade === undefined)
    {
        var grade = pieces[len-2];
        grade = grade.replace("es_grade_","");
        grade = grade.replace("se_grade_","");
    }



    //document.getElementById('audiotag_e_' + id).play();
    if(typeof audioi.canPlayType == 'function')
    {
        $(audioi).empty();
        $(audioi).src = "";
        $(audioi).remove();
        audioi = document.createElement('audio');
        if(audioi.canPlayType('audio/mpeg;'))
        {
            sourcei.type = "audio/mpeg";
            sourcei.src = basepath + "/english/" + grade + "/e_gloss_" + grade + "_" + zeroFill(id,3) + ".mp3";
        }
        else if(audioi.canPlayType('audio/ogg'))
        {

            /*sourcei.type = "audio/ogg";
             sourcei.codes = "vorbis";
             sourcei.src = basepath + "/e/e_" + fileg + "_" + chapter + "_" + section + "_" + zeroFill(id,3) + ".ogg";*/
            $('#flashsound').html('');
            $('#flashsound').show();
            $('#flashsound').html('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" allowScriptAccess="always" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" width="0" height="0" id="niftyPlayer1" align=""><param name=movie value="../../niftyplayer/niftyplayer.swf"><param name=quality value=high><param name=bgcolor value=#FFFFFF><embed src="../../niftyplayer/niftyplayer.swf" quality=high bgcolor=#FFFFFF width="0" height="0" name="niftyPlayer1" id="niftyPlayer1" align="" type="application/x-shockwave-flash" swLiveConnect="true" pluginspage="http://www.macromedia.com/go/getflashplayer"></embed></object>');
            setTimeout(function()
            {
                niftyplayer('niftyPlayer1').loadAndPlay(escape(basepath + "/english/" + grade + "/e_gloss_" + grade + "_" + zeroFill(id,3) + ".mp3"));
            }, 500)


        }


        $(audioi).append(sourcei);
        audioi.play();
    }
    else
    {
        //we don't have support for the audio object so what do we do now? I guess we fallback to embed and object...
        $('#ie8sound').attr('src',basepath + "/english/" + grade + "/e_gloss_" + grade + "_" + zeroFill(id,3) + ".mp3");
        // this code uses Prototype.js

    }
}

function play_glossary_audio_spanish(id, grade)
{
    var basepath = '../audio';
    var locpath = '../audio';


    var url = window.location;
    var pieces = url.pathname.split("/");
    var len = pieces.length;

    if (grade === undefined)
    {
        var grade = pieces[len-2];
        grade = grade.replace("es_grade_","");
        grade = grade.replace("se_grade_","");
    }


    //document.getElementById('audiotag_e_' + id).play();
    if(typeof audioi.canPlayType == 'function')
    {
        $(audioi).empty();
        $(audioi).src = "";
        $(audioi).remove();
        audioi = document.createElement('audio');
        if(audioi.canPlayType('audio/mpeg;'))
        {
            sourcei.type = "audio/mpeg";
            sourcei.src = basepath + "/spanish/" + grade + "/s_gloss_" + grade + "_" + zeroFill(id,3) + ".mp3";
        }
        else if(audioi.canPlayType('audio/ogg'))
        {

            /*sourcei.type = "audio/ogg";
             sourcei.codes = "vorbis";
             sourcei.src = basepath + "/e/e_" + fileg + "_" + chapter + "_" + section + "_" + zeroFill(id,3) + ".ogg";*/
            $('#flashsound').html('');
            $('#flashsound').show();
            $('#flashsound').html('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" allowScriptAccess="always" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" width="0" height="0" id="niftyPlayer1" align=""><param name=movie value="../../niftyplayer/niftyplayer.swf"><param name=quality value=high><param name=bgcolor value=#FFFFFF><embed src="../../niftyplayer/niftyplayer.swf" quality=high bgcolor=#FFFFFF width="0" height="0" name="niftyPlayer1" id="niftyPlayer1" align="" type="application/x-shockwave-flash" swLiveConnect="true" pluginspage="http://www.macromedia.com/go/getflashplayer"></embed></object>');
            setTimeout(function()
            {
                niftyplayer('niftyPlayer1').loadAndPlay(escape(basepath + "/spanish/" + grade + "/s_gloss_" + grade + "_" + zeroFill(id,3) + ".mp3"));
            }, 500)


        }


        $(audioi).append(sourcei);
        audioi.play();
    }
    else
    {
        //we don't have support for the audio object so what do we do now? I guess we fallback to embed and object...
        $('#ie8sound').attr('src',basepath + "/spanish/" + grade + "/s_gloss_" + grade + "_" + zeroFill(id,3) + ".mp3");
        // this code uses Prototype.js

    }
}
function stop_audio() {
 sound.pause();
 sound.currentTime = 0; 
 }