$(document).ready(function() {
	var prevWidth, prevHeight, prevTop, prevLeft, countClick, ratio, currentId;
	$('[zoomUp="true"]').on('click', zoomImage);
	function zoomImage(e) {
		$("#imgBIG").show();
		var containerHeight = $("#imgBIG").parent().css('height');
		console.log(containerHeight);
		var oImg = document.createElement("img");
		console.log($(this));
		var border_radius=$(this).css('borderRadius');
		
		console.log(border_radius);
		oImg.setAttribute('src', this.src);
		oImg.className = "imgPos_New";
		oImg.setAttribute('zoomUp', 'true');
		oImg.setAttribute('id', 'imgPos_New');
		$("#imgBIG").append(oImg);
		oImg.style.margin = "auto";
		oImg.style.display = "block";
		oImg.style.left = "0px";
		oImg.style.right = "0px";
		oImg.style.position = "absolute";
		oImg.style.borderRadius=border_radius;
		ratio = Number(oImg.width / oImg.height);
		if (ratio >= 1) {
			oImg.style.width = "85%";
			oImg.style.height = oImg.offsetWidth / ratio + "px";

		} else {
			oImg.style.height = "85%";
			oImg.style.width = oImg.offsetHeight * ratio + "px";
		}
		var new_top = (Number(+(containerHeight.split("px")[0]) - oImg.offsetHeight) / 2);
		oImg.style.top = new_top + "px";
	};

	$('#closeImg').off("click").on('click', function(e) {
		$("#imgPos_New").remove();
		$("#imgBIG").hide();
	});

});
