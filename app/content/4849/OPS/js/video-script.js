$(document).ready(function(){
/* var mainaudio = document.getElementById("audiocontainer");
$('#audio1').click(function(){
mainaudio.play();
}); */


var video = document.getElementById('videoplayer');
$('#playvideoLink').click(function(){
$('#videocontainer').fadeIn(700);
video.play();
});

$('#closeBtn').click(function(){
$('#videocontainer').fadeOut(700);
video.pause();
video.currentTime = 0;
});

$("div.closebutton").click(function() {
	var parentid = $(this).parent().attr('id');
		disablePopup(parentid);
});
});

$(document).ready(function(){
/* var mainaudio = document.getElementById("audiocontainer");
$('#audio1').click(function(){
mainaudio.play();
}); */


var video = document.getElementById('videoplayer');
$('#playvideoLink').click(function(){
$('#videocontainer1').fadeIn(700);
video.play();
});

$('#closeBtn').click(function(){
$('#videocontainer1').fadeOut(700);
video.pause();
video.currentTime = 0;
});

$("div.closebutton").click(function() {
	var parentid = $(this).parent().attr('id');
		disablePopup(parentid);
});
});

