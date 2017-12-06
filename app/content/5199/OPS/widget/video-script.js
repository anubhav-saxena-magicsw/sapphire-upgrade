$(document).ready( function() {
	//var currentID; 
	// console.log("hello",$(this));
	// console.log(document.getElementsByClassName("PageContainer"));
	// var id=document.getElementsByClassName("PageContainer");
	// var pageNo = $(id[0]).context.id;
	// pageNo = pageNo.split("PageContainer")
	// console.log(pageNo[1]);
	// $.ajax({
	// 	type : "GET",
	// 	url : "xml/videoTag.xml",
	// 	dataType : "xml",
	// 	success : function(xml) {
	// 		var getVideoTag = $(xml).find('videoTags');
	// 		console.log("sas",getVideoTag[0].children.length,getVideoTag[0].children[0].attributes[0].nodeValue);
	// 		for(i=0;i<getVideoTag[0].children.length;i++) {
	// 			if(getVideoTag[0].children[i].attributes[0].nodeValue == pageNo[1]) {
	// 				console.log("ii",getVideoTag[0].children[i].attributes[0].nodeValue)
	//                       currentID = getVideoTag[0].children[i].attributes[0].nodeValue;
	//                       currentNode =i;
	// 			}
	// 		}
	// 
	// 		getVideoTag = getVideoTag[0].children[currentNode].innerHTML;
	// 		console.log("sasssdsdsdsd",getVideoTag);
	// 		$('#videocontainer').append(getVideoTag);
			var video = document.getElementById('videoplayer');
			$('#playvideoLink').click( function() {
				console.log(video);
				$('#videocontainer').fadeIn(700);
				video.play();
			});
			$('#closeBtn').click( function() {
				$('#videocontainer').fadeOut(700);
				console.log(video);
				video.pause();
				video.currentTime = 0;
			});
			$("div.closebutton").click( function() {
				var parentid = $(this).parent().attr('id');
				//disablePopup(parentid);
			});
			//console.log(showHide,"*********");
			//if(showHide=="show")
			//{
			//$('#upperMargin, #bottomMargin,#btnPanel,#footerMargin').css("visibility","visible");
			//}
			//else if(showHide=="hide"){
			//$('#upperMargin, #bottomMargin,#btnPanel,#footerMargin').css("visibility","hidden");

			//}

		//},
		// error : function(xml) {
		// 	console.log("An error occurred while processing XML file.", xml);
		// }
	});

