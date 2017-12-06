$(document).ready(setTimeout(function() {
	//alert("insideIframe");
	var deviceUsed;
	var previousPos = {};
	previousPos.x = 0;
	previousPos.y = 0;
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$(".image_zoom_btn").css("display", "none");
		deviceUsed = true;
	} else {
		$(".image_zoom_btn").fadeIn(1000);
		deviceUsed = false;
	}
	var origin = [];
	var moveEvent = false, mouseUpEvent = false;
	var bg_pos_x, bg_pos_y;
	var img_cont_width;
	var left;
	var img_cont_height;
	var top, lblId;
	var popupView = false;
	var title_height = (+$("#title_text").css("height").split("px")[0]);
	var container = {};
	var defaultView;
	var body = {};
	body.width = (+$("body").css("width").split("px")[0]);
	body.height = (+$("body").css("height").split("px")[0]);
	var extra_zoom_in = 0;
	container.width = (+$("#interActiveWidget").css("width").split("px")[0]) - 20;
	container.height = (+$("#interActiveWidget").css('height').split("px")[0]) - title_height;
	console.log(body.width, body.height, title_height);
	console.log(container.width, container.height);

	$("#interIm_cont").css({
		'width' : container.width
	});
	$("#interIm_cont").css('height', container.height - 30 + "px");
	//container.height = (+$("#interIm_cont").css('height').split("px")[0]);
	//console.log(container.width,container.height+"***********");
	var hotspots = [];
	$(".image_zoom_btn").off("click").on("click", enablePopupView);
	function enablePopupView(e) {
		e.stopPropagation();
		popupView = true;
		localStorage.setItem('interactiveImage_zoom', 'true');
		console.log(localStorage.getItem('interactiveImage_zoom'));
		zoomInViewAndScale();
	}

	function zoomInViewAndScale() {
		$(".image_zoom_out_btn").fadeIn(1000);
		$(".image_zoom_btn").hide();
		extra_zoom_in = 1;
		$("#interIm_cont").css("transform", "scale(1.5)");
		$("#title_text").css("text-align", "center");
	}


	$(".image_zoom_out_btn").off("click").on("click", enableInPageView);
	function enableInPageView() {
		popupView = false;
		localStorage.setItem('interactiveImage_zoom', 'false');
		console.log(localStorage.getItem('interactiveImage_zoom'));
		zoomOutViewAndScale();
	}

	function zoomOutViewAndScale() {
		extra_zoom_in = 0;
		$(".image_zoom_out_btn").hide();
		if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
			$(".image_zoom_btn").fadeIn(1000);
		}
		$("#interIm_cont").css("transform", "scale(1)");
		$("#title_text").css("text-align", "left");
	}

	var source = "../../" + $("#img_cont").attr("src");
	getImageDimension(source);
	var ratio = {};
	function getImageDimension(src) {
		var image = new Image();
		var width, height;
		image.onload = function() {
			width = this.width;
			height = this.height;
			ratio.x = width;
			ratio.y = height;
			defaultView = (container.width / 1.5) / width;
			$("#img_cont").css("width", width + "px");
			//$("#img_cont").css("height",width/container.height*100+"%");
			$("#img_cont").css("transform", "scale(" + defaultView + ")");
			img_cont_width = (+$("#img_cont").css("width").split("px")[0]);

			$("#img_cont").css("left", ((container.width - ratio.x) / 2) + "px");
			$("#img_cont").css("top", ((container.height - ratio.y) / 2) + "px");
			left = (+$("#img_cont").css("left").split("px")[0]);
			$("#img_cont").css("height", img_cont_width * height / width + "px");
			img_cont_height = (+$("#img_cont").css("height").split("px")[0]);

			top = (+$("#img_cont").css("top").split("px")[0]);
			console.log(left, top, img_cont_width, img_cont_height, ratio.x, height / body.height);
			$("svg").css({
				width : img_cont_width,
				height : img_cont_height
			});
		};
		image.src = src;
	};
	$(".label").each(function(i) {
		var hotspot = {};
		hotspot.x = (+$(this).attr("x"));
		hotspot.y = (+$(this).attr("y"));
		hotspot.cx = (+$(this).attr("cx"));
		hotspot.cy = (+$(this).attr("cy"));
		hotspot.scl = (+$(this).attr("scl"));
		$(this).css({
			'left' : hotspot.x,
			'top' : hotspot.y
		});
		hotspots.push(hotspot);
	});
	$("#img_cont").css("background-image", "url(" + source + ")");
	createLabels(hotspots);
	function createLabels(hotspots) {
		$(".label").css("transform", "scale(3)");
		for (var i = 0; i < hotspots.length; i++) {
			var v1 = {
				x : hotspots[i].cx,
				y : hotspots[i].cy
			}
			var v2 = {
				x : hotspots[i].x + 100,
				y : hotspots[i].y + 17
			}
			$(".label").addClass("ani");
			var v = getPointOnLineAtDistance(v1, v2, 15);
			var d = 'M' + (hotspots[i].x + 100) + ' ' + (hotspots[i].y + 17) + ' L' + v.x + ' ' + v.y + '';
			console.log(d);
			var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			newLine.setAttribute('id', 'path' + i);
			newLine.setAttribute('d', d);
			newLine.setAttribute("filter", "url(#i1)");
			newLine.style.stroke = "rgb(249, 249, 249)";
			newLine.style.fill = "none";
			newLine.style.strokeWidth = "10px";
			$("svg").append(newLine);
			var newCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			newCircle.setAttribute('id', 'circle' + i);
			newCircle.setAttribute('cx', hotspots[i].cx);
			newCircle.setAttribute('cy', hotspots[i].cy);
			newCircle.setAttribute('r', 15);
			newCircle.setAttribute("filter", "url(#i2)");
			newCircle.style.stroke = "rgb(249, 249, 249)";
			newCircle.style.strokeWidth = "10px";
			newCircle.style.fill = "none";
			$("svg").append(newCircle);
		};
		$(".label").off("click").on("click", function(e) {
			console.log(1);
			e.stopPropagation();
			lblId = (+this.id.split("_")[1]);
			if ($(this).hasClass("label_view")) {
				$(".label").removeClass("label_view");
				zoom_out_section(lblId);
				return;
			}
			$(".label").removeClass("label_view");
			$(this).toggleClass("label_view");
			zoom_in_section(lblId);
		});

		//$("#image_container,svg").off("click");

		$("#interIm_cont").off("click").on("click", function() {
			console.log(mouseUpEvent);
			console.log(2);
			if (!mouseUpEvent || deviceUsed) {
				if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
					if (!($(".label").hasClass("label_view")) && !extra_zoom_in) {
						localStorage.setItem('interactiveImage_zoom', 'true');
						setTimeout(function() {
							zoomInViewAndScale();
						}, 100);
						return;
					}
				}
				$(".label").removeClass("label_view");
				zoom_out_section(lblId);
			} else {
				mouseUpEvent = false;
			}
		});

	}

	function distanceBetweenPoints(p1, p2) {
		var d = Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
		return d;
	}

	function getPointOnLineAtDistance(v1, v2, d) {
		var m = d / distanceBetweenPoints(v1, v2);
		var n = 1 - m;
		var points = {};
		points.x = (m * v2.x + n * v1.x) / (m + n);
		points.y = (m * v2.y + n * v1.y) / (m + n);
		//console.log(points.x,points.y);
		return points;
	}

	function zoom_in_section(index) {
		$("#img_cont").off("mousedown touchstart").on("mousedown touchstart", mouseDownEvent);
		var section = hotspots[index];
		var scl = section.scl;
		var x = (section.cx + section.x) / 2;
		var y = (section.cy + section.y) / 2;
		$("#img_cont").addClass("ani");
		//left = (+$("#img_cont").css("left").split("px")[0]);
		//top = (+$("#img_cont").css("top").split("px")[0]);
		var ch_left = img_cont_width / 2 - x;
		var ch_top = img_cont_height / 2 - y;
		$("#img_cont").css("top", (top + ch_top) + "px");
		$("#img_cont").css("left", (left + ch_left) + "px");
		$("#img_cont").css("transform", "scale(" + scl + ")");
		$(".label").css("transform", "scale(1)");
	}

	function zoom_out_section(index) {
		$("#img_cont").off("mousedown touchstart");
		$(".label").css("transform", "scale(3)");
		var section = hotspots[index - 1];
		var scl = defaultView;
		$("#img_cont").addClass("ani");
		$("#img_cont").css("left", ((container.width - ratio.x) / 2) + "px");
		$("#img_cont").css("top", ((container.height - ratio.x) / 2) + "px");
		$("#img_cont").css("transform", "scale(" + scl + ")");
	}

	function mouseDownEvent(e) {
		e.preventDefault();
		console.log("down");
		$("#img_cont").removeClass("ani");
		origin = get_mouse_coords(e);
		bg_pos_x = (+$("#img_cont").css("left").split("px")[0]);
		bg_pos_y = (+$("#img_cont").css("top").split("px")[0]);
		previousPos.x = bg_pos_x;
		previousPos.y = bg_pos_x;
		this.style.cursor = "grab";
		$("#img_cont").off("mousemove touchmove").on("mousemove touchmove", moveImage);
		//$(document).off("mouseup touchend").on("mouseup touchend", moveup);
		$("#img_cont").off("mouseup touchend").on("mouseup touchend", moveup);
	}

	function moveImage(e) {
		console.log("move");
		moveEvent = true;
		e.preventDefault();
		var currentPos = get_mouse_coords(e);
		bg_pos_x = (bg_pos_x + (currentPos[0] - origin[0]));
		bg_pos_y = (bg_pos_y + (currentPos[1] - origin[1]));
		image_move_update();
		origin = get_mouse_coords(e);
	}

	function moveup(e) {
		if (moveEvent && (bg_pos_x != previousPos.x && bg_pos_y != previousPos.y)) {
			mouseUpEvent = true;
			moveEvent = false;
		} else {
			console.log(3);
			if(deviceUsed)
			$("#interIm_cont").trigger("click");
		}

		console.log("up");
		//this.style.cursor = "default";
		$("#img_cont").off("mousemove touchmove");
		$("#img_cont").off("mouseup touchend");
	}

	function image_move_update() {
		$("#img_cont").css({
			"left" : bg_pos_x + "px",
			"top" : bg_pos_y + "px"
		});
	}

	function get_mouse_coords(e) {
		var coords = [];
		if (e.originalEvent.touches && e.originalEvent.touches.length) {
			coords[0] = e.originalEvent.touches[0].pageX;
			coords[1] = e.originalEvent.touches[0].pageY;
		} else {
			coords[0] = e.pageX;
			coords[1] = e.pageY;
		}
		return coords;
	}

}), 100);
