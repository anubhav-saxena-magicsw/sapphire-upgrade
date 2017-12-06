jQuery(document).ready(function ($) {
        	alertSize();
        	var scaleWidth = false ;
        	var galleryRatio =0.0;
        	var captionArray=[]
        	function alertSize() {
			  var myWidth = 0, myHeight = 0;
			  if( typeof( window.innerWidth ) == 'number' ) {
			    //Non-IE
			    myWidth = window.innerWidth;
			    myHeight = window.innerHeight;
			  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
			    //IE 6+ in 'standards compliant mode'
			    myWidth = document.documentElement.clientWidth;
			    myHeight = document.documentElement.clientHeight;
			  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
			    //IE 4 compatible
			    myWidth = document.body.clientWidth;
			    myHeight = document.body.clientHeight;
			    
			  }
			  console.log(myWidth,myHeight);
			  $("#outerSliderContainer,#slider1_container").css("width",myWidth);
			  $("#outerSliderContainer,#slider1_container").css("height",myHeight);
			  $(".imgHolder").css("width",myWidth-42);
			  $(".thumbnavigator").css("width",myWidth);
			  galleryRatio = myWidth/myHeight ;
			}
			
			function galleryEventAttacher(){
				var device = false;
				localStorage.setItem('zoom',"false");
				$("div[z='imgHolder']").css("border-radius","10px"); 
				if ((!navigator.userAgent.match(/iPad/i) && (!navigator.userAgent.match(/Android/i))))
				{
					$(".zoomBtnContainer").css("display","block");
					$(".zoomBtnContainer").unbind("click").bind('click', function() {
					if (localStorage.getItem('zoom')=="false") {
						$(".zoomBtnContainer").css("display","none");
						localStorage.setItem('zoom', "true");
						$("#closeBtn").css("display","block");
								} 
					});
				}
				else
				{
					$("div[z='imgHolder']").unbind("click").bind('click', function() {
					console.log("***********",localStorage.getItem('zoom'))
					var local = localStorage.getItem('zoom');
					if (localStorage.getItem('zoom')=="false") {
						$("#closeBtn").css("display","block");
						localStorage.setItem('zoom', "true");
								} 
					});
				}
				
				$("#closeBtn").unbind("click").bind('click', function() {
					localStorage.setItem('zoom', "false");
					$("#closeBtn").css("display","none");
					if ((!navigator.userAgent.match(/iPad/i) && (!navigator.userAgent.match(/Android/i))))
					{
						$(".zoomBtnContainer").css("display","block");
					}
					
				});
				
				$( "div[c='imgCaption']" ).each(function() {
					captionArray.push($(this).html())
				});	
				
				$( "div[t='thumbnail']" ).each(function() {
					// $(this).parent().css("overflow","visible");
					// $(this).parent().parent().css("overflow","visible");
				});	
           	 }
           	 
			var _CaptionTransitions = [];
            var _SlideshowTransitions = [
                ];
            var options = {
                $AutoPlay: false,                                    //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
                $AutoPlayInterval: 1500,                            //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000
                $PauseOnHover: 1,                                //[Optional] Whether to pause when mouse over if a slider is auto playing, 0 no pause, 1 pause for desktop, 2 pause for touch device, 3 pause for desktop and touch device, 4 freeze for desktop, 8 freeze for touch device, 12 freeze for desktop and touch device, default value is 1
                $DragOrientation: 1,                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)
                $ArrowKeyNavigation: false,   			            //[Optional] Allows keyboard (arrow key) navigation or not, default value is false
                $SlideDuration: 300,                                //Specifies default duration (swipe) for slide in milliseconds
                $ArrowNavigatorOptions: {                       //[Optional] Options to specify and enable arrow navigator or not
                    $Class: $JssorArrowNavigator$,              //[Requried] Class to create arrow navigator instance
                    $ChanceToShow: 1                               //[Required] 0 Never, 1 Mouse Over, 2 Always
                },
                $ThumbnailNavigatorOptions: {                       //[Optional] Options to specify and enable thumbnail navigator or not
                    $Class: $JssorThumbnailNavigator$,              //[Required] Class to create thumbnail navigator instance
                    $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
                    $ActionMode: 1,                                 //[Optional] 0 None, 1 act by click, 2 act by mouse hover, 3 both, default value is 1
                    $SpacingX: 13,                                   //[Optional] Horizontal space between each thumbnail in pixel, default value is 0
                    $DisplayPieces: 10,                             //[Optional] Number of pieces to display, default value is 1
                    $ParkingPosition: 360                          //[Optional] The offset position to park thumbnail
                }
            };

            var jssor_slider1 = new $JssorSlider$("slider1_container", options);
            var objItemDetail = {
            };
            galleryEventAttacher();
            
            //responsive code begin
            //you can remove responsive code if you don't want the slider scales while window resizes
            jssor_slider1.$On($JssorSlider$.$EVT_SWIPE_END, function(position, virtualPosition){
            	console.log("inside",position,virtualPosition);
            	$("div[l='captionContainer']").html(captionArray[position]);
            });
            function ScaleSlider() {
                var parentHeight = jssor_slider1.$Elmt.parentNode.parentNode.parentNode.clientHeight;
                var parentWidth = jssor_slider1.$Elmt.parentNode.parentNode.parentNode.clientWidth;
                if((parentWidth/parentHeight)>galleryRatio){
                	jssor_slider1.$ScaleHeight(Math.max(Math.max(parentHeight, 600), 300));
                }
                else{
                	jssor_slider1.$ScaleWidth(Math.max(Math.max(parentWidth, 600), 300));
                }
	            $("#outerSliderContainer").width(jssor_slider1.$Elmt.clientWidth);
	            $("#outerSliderContainer").height(jssor_slider1.$Elmt.clientHeight);
            }
            ScaleSlider();
            $(window).bind("load", ScaleSlider);
            $(window).bind("resize", ScaleSlider);
           // $(window).bind("orientationchange", ScaleSlider);
         //responsive code end
        });