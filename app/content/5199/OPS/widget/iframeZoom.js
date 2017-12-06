$(document).ready(function() {
	$("#frame").on("load", function() {
	
	
		var count = 1;
		var prevWidth, prevHeight, prevTop, prevLeft, prevZ;
		//window.addEventListener("message", receiveMessage, false);

		$(window).bind('storage', function (e) {
	          	console.log("a");
				console.log(e.originalEvent.key, e.originalEvent.newValue);
				receiveMessage() 
				});
		//$('iframe').contents().bind('click', receiveMessage)
		function receiveMessage() {
			console.log(">>>>>>>>>>>>>>>>",localStorage.getItem('zoom'))
			if (localStorage.getItem('zoom') == "true") {
				console.log("1332445567676");
				prevWidth = $("#iframeContanier").css("width");
				prevHeight = $("#iframeContanier").css("height");
				prevTop = $("#iframeContanier").css("top");
				prevLeft = $("#iframeContanier").css("left");
				
				$("#iframeContanier").css("zIndex", "2");
				$("#iframeContanier").css("width","99%");
				$("#iframeContanier").css("height","99%");
				$("#iframeContanier").css("top","0px");
				$("#iframeContanier").css("left","0px");
				/*
				$("#frame").animate({
					"width" : "99%",
					"height" : "99%",
					"left" : "0px",
					"top" : "0px"
				}, 1000);
				*/
			} else {
				console.log("1332445567676**********************");
				$("#iframeContanier").css("zIndex", "1");
				$("#iframeContanier").css("width",prevWidth);
				$("#iframeContanier").css("height",prevHeight);
				$("#iframeContanier").css("top",prevTop);
				$("#iframeContanier").css("left",prevLeft);
				$('iframe').contents().find("#outerSliderContainer").css("width",prevWidth);
				$('iframe').contents().find("#outerSliderContainer").css("height",prevHeight);
				/*
				$("#frame").animate({
					"width" : prevWidth,
					"height" : prevHeight,
					"left" : prevLeft,
					"top" : prevTop
				}, 1000, function() {
					$("#frame").css("position", 'relative');
					$("#frame").css('position', 'absolute');
					$('iframe').contents().find("#outerSliderContainer").css("width",prevWidth);
					$('iframe').contents().find("#outerSliderContainer").css("height",prevHeight);
				});
				*/
			}
		};

	});
});

/*
	function onPageLoadComplete() {
		window.addEventListener("message", receiveMessage, false);
		var item = document.getElementById("PageContainer3");
		item.addEventListener("click", check);
		function check(e){
			console.log("dddd---->>", item,window.location.href);
			window.dispatchEvent(message);
		}
		function receiveMessage() {
			console.log("GOL N GOL");
			alert("ram ram");
		}

	}
*/