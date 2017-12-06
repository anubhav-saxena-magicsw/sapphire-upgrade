define(['marionette', 
        'jqueryUI', 'jqueryTouchPunch',
        'player/base/base-item-comp', 
        'components/advancedvideoplayer/model/advanced-videoplayer-model',
        'text!components/advancedvideoplayer/template/advanced-videoplayer.html',
        'css!components/advancedvideoplayer/css/videoplayer.css'],

        function(Marionette, jqueryUI, jqueryTouchPunch, BaseItemComp, VideoPlayerModel, VideoCompTemplate) {
		'use strict';
		
		var objCompRef = null, isDragging =  false;
		var _timer, thumbSpeed = 500;
		var AdvancedVideoPlayer = BaseItemComp.extend({
			
			template : _.template(VideoCompTemplate),
			
			/**Members**/
			compData : null,
			objThumb : null,
			click : {},
			orgPos : {},
			totalTime : 0,
			video: null,
			/**
			 * This function initializes the component
			 * @access private
			 * @memberof AdvancedVideoPlayer
			 * @param {Object} objCompData conatins the data to configure the component
			 * @returns None
			**/
			initialize : function(objCompData) {
				
				objCompRef = this;				
				this.objData = objData;//this property is being used in componentselector for editing. 
				this.compData = objCompData;	
				this.model = new VideoPlayerModel();
			},
			
			
			/**
			 * This function is called when the component is added to Stage
			 * @access private
			 * @memberof AdvancedVideoPlayer
			 * @param 
			 * @returns None
			**/
			onShow : function() {
				
				var videoElement = this.$('video');
				var btnPlayPause = this.$('#btnPlayPause');
				
				var obj = {
					video : videoElement,
					compData: this.compData
				};
				
				this.configVideoPlayer(obj);
				this.configVideoController(obj);
			},
			
			
			/**
			 * This function configures the videoComponent 
			 * @access private
			 * @memberof AdvancedVideoPlayer
			 * @param  {Object} objData conatins the data to configure the component
			 * @returns None
			**/
			configVideoPlayer : function(objData){
						
				objData.video.css({
					'width' :  objData.compData.width,
					'height':  objData.compData.height
				});		
				
				var source = document.createElement('source');
				if(objData.video[0].canPlayType("video/mp4") === 'maybe'){
					objData.compData.srcType = 'video/mp4';	
					source.src = objData.compData.source + '.mp4';
				} else if(objData.video[0].canPlayType("video/ogg")  === 'maybe'){
					objData.compData.srcType = 'video/ogg';	
					source.src = objData.compData.source + '.ogg';
				}
			   // source.src = objData.compData.source;
			    source.type = objData.compData.srcType;				    
			   
			    objData.video.append(source);
			    thumbSpeed =  this.model.get("thumbSpeed");
			    
			    var loaderLeft = (objData.compData.width.split('px')[0] - this.$('#videoLoader').width())/2;
			    var loaderTop = (objData.compData.height.split('px')[0] - this.$('#videoLoader').height())/2;
			    this.$('#poster').css({'width':objData.compData.width+'px', 'height':objData.compData.height+'px'});
			    
			    this.$('#videoLoader').css({'left':loaderLeft+'px', 'top':loaderTop+'px'});

			    this.model.set("video",  objData.video);
			    this.model.set("isPlaying",  false);
			    
			    
			    this.addListeners();
			},
			
			/**
			 * This function configures the videoComponent 
			 * @access private
			 * @memberof AdvancedVideoPlayer
			 * @param  {Object} objData conatins the data to configure the component
			 * @returns None
			**/
			configVideoController : function(objData){
				
				this.objBackground = this.$('#sliderWrapper');
				this.objBoundingBox = this.$('#boundingBox');
				this.objSlidingBar = this.$('#slidingBar');
				this.objThumb = this.$('#thumb');
				this.objCompBlocker = this.$('#thumbBlocker');
				
				var padding, sliderLen,	boundingArea;
				
				
				if(objData.compData.sAlign === 'horizontal'){
					padding = $(this.objThumb).width();				
					sliderLen =  $(this.objSlidingBar).width();				
					boundingArea = sliderLen + padding;
					
					var sliderLeft = $(this.objSlidingBar).css('left').split('px')[0];
					this.objBoundingBox.css({'width': boundingArea + 'px', 'height': '10px', 'left' : (sliderLeft - (padding / 2)) +'px'});
				}
				else{
					padding = $(this.objThumb).height();				
					sliderLen =  $(this.objSlidingBar).height();				
					boundingArea = sliderLen + padding;
					
					var sliderTop = $(this.objSlidingBar).css('top').split('px')[0];
					this.objThumb.css('top', (boundingArea - padding) +'px');
					this.objCompBlocker.css('top', (boundingArea - padding) +'px');
					this.objBoundingBox.css({'height': boundingArea + 'px', 'width': '10px', 'top' : (sliderTop - (padding / 2)) +'px'});
				}
								
				$(this.objThumb).draggable({
					axis : ( objData.compData.sAlign === 'horizontal') ? "x" : "y",
					containment : this.objBoundingBox,
					scroll : false,
					start : $.proxy(this.onDraggingStart, this),
					drag : $.proxy(this.onDragging, this),
					stop : $.proxy(this.onDraggingStop, this)
				});
				
				
				this.model.set("sLength",  sliderLen);
			    this.model.set("sAlingment",  objData.compData.sAlign);	
			},
			
			
			/**
			 * This function add listeners to videoElements
			 * @access private
			 * @memberof AdvancedVideoPlayer
			 * @param 
			 * @returns None
			**/
			addListeners : function(){
				this.$('#btnPlayPause').on("mousedown", this, this.playPause);
				this.$('video').on("timeupdate", this, this.updateDuration).off("timeupdate");
				this.$('video').on("ended", this, this.videoEnded);
				this.$('#thumb').on("mousedown", this, this.mouseDownThumb);
				this.$('#thumb').on("mouseup", this, this.mouseUpThumb);
				
			},			
			
			/**
			 * This function controls play/pause
			 * @access private
			 * @memberof AdvancedVideoPlayer
			 * @param event
			 * @returns None
			**/
			playPause : function(evt){
				var comp;
				
				if(evt.type == undefined)
					comp = evt;
				else
					comp = evt.data;
				
				var vdComp = comp.model.get('video')[0]; 
				var playStatus = comp.model.get('isPlaying');
				
				if(playStatus == true){
					clearInterval(_timer);
					comp.$('#btnPlayPause').css("background-position", "0px 0px");
 					comp.model.set('isPlaying' , false);
					vdComp.pause();					
		    	}
		    	else{
		    				    	
		    		if(comp.$('#poster').css('display') == 'block'){
						comp.$('#videoLoader').css('visibility','visible');	
		    		}
		    		
		    		clearInterval(_timer);
		    		_timer = setInterval(function(){
		    			objCompRef.updateDuration(evt);
		    		}, thumbSpeed);
		    		
		    		comp.$('#btnPlayPause').css("background-position", "-40px 0px");
		    		comp.model.set('isPlaying' , true);
		    		vdComp.play();	
		    	}				
				
				comp.curTime = vdComp.currentTime;	
			},
			
			/**
			 * This function is called when video is ended
			 * @access private
			 * @memberof AdvancedVideoPlayer
			 * @param {Event)
			 * @returns None
			 */
			videoEnded : function(evt) {
				
				clearInterval(_timer);
				
				var comp = evt.data;
				var vdComp = comp.model.get('video')[0];
				
				if(vdComp.currentTime > vdComp.duration){
					vdComp.currentTime = vdComp.duration;
					objCompRef.updateDuration(evt);
				}
				
				comp.model.set('isPlaying' , false);	
				comp.$('#btnPlayPause').css("background-position", "0px 0px");
				vdComp.pause();	
			},
			
			/**
			 * This function update video Duration
			 * @access private
			 * @memberof AdvancedVideoPlayer
			 * @param event
			 * @returns None
			**/
			updateDuration : function(evt){

				if(isDragging)
					return;
				
				var comp;

				if(evt.data == undefined)
					comp = evt;								
				else
					comp = evt.data;
				
				var vdComp = comp.model.get('video')[0]; 
				var sliderLen = comp.model.get('sLength');
				var curTime = 0, totalTime = vdComp.duration;
				
				if (vdComp.duration > 0.1) {	
									
					curTime = vdComp.currentTime;
					totalTime = vdComp.duration;
					
					if (vdComp.currentTime > 0.1){
						comp.$('#videoLoader').css('visibility','hidden');		
						comp.$('#thumbBlocker').hide();		
						comp.$('#poster').css("display", "none");
					}
					
					if(vdComp.paused && !isDragging && (curTime != totalTime))
					{
						comp.model.set('isPlaying' , false);
						comp.$('#btnPlayPause').css("background-position", "0px 0px");
						curTime = comp.model.get('vCurTime');
						vdComp.currentTime = curTime;
					}
					
					if(curTime + 0.1 > totalTime && curTime - 0.1 < totalTime ){
						curTime = totalTime;
					}
										
					
					comp.model.set('vCurTime', curTime);
					comp.model.set('vTotalTime', totalTime);
					
					var thumbPos = Math.round(sliderLen * (curTime / totalTime));
					if (isNaN(thumbPos)) 
						thumbPos = 0;
					
				    var percentage = (thumbPos / sliderLen) * 100;
				    comp.updateThumbPos(percentage);	
				    
				   // console.log('Update', curTime, totalTime, percentage)
				}
					
			},
			
			/**
			 * This function changes slider thumb pos
			 * @access private
			 * @memberof AdvancedVideoPlayer
			 * @param (nValue) Percentage
			 * @returns None
			**/
			updateThumbPos : function(nValue){
				
				var objCurrentPos = {}, objCurrentPercent = {}, topPosition;
				
				objCurrentPos = this.model.get("sCurrentPosition");
				objCurrentPercent = this.model.get("sCurrentPercentage");
				
				objCurrentPos = ((nValue * (this.model.get("sLength"))) / 100);
				objCurrentPercent = nValue;
				
				this.model.set("sCurrentPosition", objCurrentPos);
				this.model.set("sCurrentPercentage", objCurrentPercent);
				
				this.setThumbPosition(this.objThumb, objCurrentPos);	
			},
			
			/**
			 * This function positions the required thumb on the slider
			 * @access private
			 * @memberof AdvancedVideoPlayer
			 * @param {Number} nValue Conatains the position of thumb
			 * @returns None
			 */
			setThumbPosition : function(thumb, value) {
				
				var topPosition;
				$(thumb).css('height', $(thumb).height() + 'px');
				$(thumb).css('width', $(thumb).width() + 'px');
				$(thumb).css('position', 'absolute');
				
				if (this.model.get("sAlingment") === 'horizontal') {
					$(thumb).css('left', value + 'px');
					
					if (this.orgPos) {
						this.orgPos.left = value;
					}
					else{
						this.orgPos = {
							left : value,
							top : $("#thumb").css("top")
						};
					}
				}
				else{
					
					topPosition = (this.model.get("sLength") - value);
					$(thumb).css('top', +topPosition + 'px');
				
					if (this.orgPos) {
						this.orgPos.top = topPosition;
					} 
					else {
						this.orgPos = {
							left : $("#thumb").css("left"),
							top : topPosition
						};
					}
				}			
			},
			
			/**
			 * This function is called when dragging of slider thumb starts
			 * @access private
			 * @memberof AdvancedVideoPlayer
			 * @param {Object} event Conatins the reference of event object
			 * @returns None
			 */
			mouseDownThumb : function(objEvent) {
				
				var comp = objEvent.data;
				var vdComp = comp.model.get('video')[0];
				var playStatus = comp.model.get('isPlaying');
				
				if(playStatus){
					isDragging = true;
					
					clearInterval(_timer);
					vdComp.play();
					vdComp.pause();
					console.log("HHHHH")
				}

				
			},
			
			/**
			 * This function is called when dragging of slider thumb starts
			 * @access private
			 * @memberof AdvancedVideoPlayer
			 * @param {Object} event Conatins the reference of event object
			 * @returns None
			 */
			mouseUpThumb : function(objEvent) {
			
				var comp = objEvent.data;
				var vdComp = comp.model.get('video')[0]; 
				var playStatus = comp.model.get('isPlaying');
				isDragging = false;
				
				if (playStatus){
					
					clearInterval(_timer);
					_timer = setInterval(function(){
		    			objCompRef.updateDuration(objEvent);
		    		}, thumbSpeed);
					vdComp.play();
					console.log("MouseUpThumb")			
				} 
				
			},
			
			/**
			 * This function is called when dragging of slider thumb starts
			 * @access private
			 * @memberof AdvancedVideoPlayer
			 * @param {Object} event Conatins the reference of event object
			 * @returns None
			 */
			onDraggingStart : function(objEvent, ui) {

				var thumbId, objCurrentPercentage, zIndexValue;
				
				isDragging = true;
				thumbId = objEvent.target.id;
				
				this.click.x = objEvent.clientX;
				this.click.y = objEvent.clientY;
				
				this.totalTime = this.model.get('vTotalTime');				
				this.video = this.model.get('video')[0];
				/*this.video.play();
				this.video.pause();*/
			},
			
			/**
			 * This function is called when the slider thumb is being dragged
			 * @access private
			 * @memberof AdvancedVideoPlayer
			 * @param {Object} event Conatins the reference of event object
			 * @returns None
			 */
			onDragging : function(objEvent, ui) {
				var objData, nUpdatedX, nUpdatedY, original, target, targetId;
				target = objEvent.target;
				targetId = objEvent.target.id;
				original = ui.originalPosition;
				
				if (this.orgPos !== null) {
					nUpdatedX = (objEvent.clientX - this.click.x + (this.orgPos.left * this.getStageScaleValue())) / this.getStageScaleValue();
					nUpdatedY = (objEvent.clientY - this.click.y + (this.orgPos.top * this.getStageScaleValue())) / this.getStageScaleValue();
				}
				else
				{
					nUpdatedX = (objEvent.clientX - this.click.x + original.left) / this.getStageScaleValue();
					nUpdatedY = (objEvent.clientY - this.click.y + original.top ) / this.getStageScaleValue();
				}
								
				if (this.isThumbWithinboundary(target, ui, nUpdatedX, nUpdatedY)) 
				{
					
					if (this.model.get("sAlingment") === 'horizontal') {
						objData = this.getPercentage(nUpdatedX, this.model.get("sLength"));
					} else {
						objData = this.getPercentage((this.model.get("sLength") - nUpdatedY), this.model.get("sLength"));
					}				
					var curVideoTime = (objData / 100) * this.totalTime;
					
					var _totalTime;
					var ua = window.navigator.userAgent;
		            var msie = ua.indexOf("MSIE");

		            if (msie > 0)   
						_totalTime = this.totalTime - 0.25;
					else
						_totalTime = this.totalTime;
					
					if(curVideoTime <= _totalTime && curVideoTime > 0)
					{
						this.video.currentTime = curVideoTime;
						this.model.set('vCurTime', curVideoTime);
					}					
				}

			},
			
			/**
			 * This function is called when slider thumb is stopped
			 * @access private
			 * @memberof AdvancedVideoPlayer
			 * @param {Object} event Conatins the reference of event object
			 * @returns None
			 */
			onDraggingStop : function(event, ui) {

				var thumbId, targetThumb, objCurrentPos = {}, objCurrentPercent = {}, percentage;
				var dragObj;
				
				isDragging = false;
				thumbId = event.target.id;
				targetThumb = event.target;

				
				if (this.model.get("sAlingment") === 'horizontal') {
					
					this.orgPos = ui.position;
					
					var thumbX = this.orgPos.left;
					var sliderLen = this.model.get("sLength");
					
				    var percentage = (thumbX / sliderLen) * 100;

					//update position
					//objCurrentPos = this.model.get("sCurrentPosition");
					this.model.set("sCurrentPosition", thumbX);

					//update percentage
					//objCurrentPercent = this.model.get("sCurrentPercentage");
					this.model.set("sCurrentPercentage", percentage);
					
					/*if(percentage == 100){
						
						//clearInterval(_timer);						
						var Totaltime = this.model.get("vTotalTime");
						this.model.set("vCurTime", Totaltime);
					//	this.model.set('isPlaying', false);
					//	$('#btnPlayPause').css("background-position", "0px 0px");

					}*/
				} 
				else {

					this.orgPos = ui.position;
					
					//update position
					objCurrentPos = this.model.get("sCurrentPosition");
					this.model.set("sCurrentPosition", objCurrentPos);

					//update percentage
					objCurrentPercent = this.model.get("sCurrentPercentage");
					this.model.set("sCurrentPercentage", objCurrentPercent);
				}
				
				var vdComp = this.model.get('video')[0]; 
				var playStatus = this.model.get('isPlaying');
				
				dragObj = this;
				if (playStatus){
					clearInterval(_timer);
					_timer = setInterval(function(){
						objCompRef.updateDuration(dragObj);
		    		}, thumbSpeed);
					vdComp.play();	
					console.log("DraggingStop")				
				} 

				
			},
			
			/**
			 * This function checks if the thumb is with in boundary box
			 * @access private
			 * @memberof AdvancedVideoPlayer
			 * @param {Object} target Conatins the reference of current thumb
			 * @param {Object} ui Conatins the reference of ui object
			 * @param {Number} nUpdatedX Conatins the updated left position
			 * @param {Number} nUpdatedY Conatins the updated top position
			 * @returns None
			 */
			isThumbWithinboundary : function(target, ui, nUpdatedX, nUpdatedY) {

				var minValue, maxValue, bVal = false, calculatedPos, objBoundaryValues = {};

				objBoundaryValues = this.getBoundaryValues(target, ui, nUpdatedX, nUpdatedY);
				minValue = objBoundaryValues.minValue;
				maxValue = objBoundaryValues.maxValue;
				calculatedPos = objBoundaryValues.calculatedPos;

				if (this.model.get("sAlingment") === 'horizontal') {

					if ((nUpdatedX > minValue) && (nUpdatedX <= maxValue)) {
						ui.position.left = nUpdatedX;
						ui.position.top = nUpdatedY;
						bVal = true;
					} else if (nUpdatedX <= minValue) {
						ui.position.left = minValue;
						ui.position.top = nUpdatedY;
					} else if (nUpdatedX > maxValue) {
						ui.position.left = maxValue;
						ui.position.top = nUpdatedY;
					}
				} else {

					if ((calculatedPos > minValue) && (calculatedPos <= maxValue)) {
						ui.position.top = nUpdatedY;
						ui.position.left = nUpdatedX;
						bVal = true;
					} else if (calculatedPos <= minValue) {
						ui.position.top = this.model.get("sLength") - minValue;
						ui.position.left = nUpdatedX;
					} else if (calculatedPos > maxValue) {
						ui.position.top = this.model.get("sLength") - maxValue;
						ui.position.left = nUpdatedX;
					}
				}

				return bVal;
			},
			
			/**
			 * This function returns the boundary values
			 * @access private
			 * @memberof AdvancedVideoPlayer
			 * @param {Object} target Conatins the reference of current thumb
			 * @param {Object} ui Conatins the reference of ui object
			 * @param {Number} nUpdatedX Conatins the updated left position
			 * @param {Number} nUpdatedY Conatins the updated top position
			 * @returns None
			 */
			getBoundaryValues : function(target, ui, nUpdatedX, nUpdatedY) {
				var minValue, maxValue, otherVideoSliderPos, objCurrentPos, calculatedPos, actualTopPos, objBoundaryValues = {}, objVerticalBoundaryValues = {};
				var thumbMin = 
				
				minValue = ((this.model.get("sMinSlidingPosition") * this.model.get("sLength")) / 100 );
				maxValue = ((this.model.get("sMaxSlidingPosition") * this.model.get("sLength")) / 100 );
				objCurrentPos = this.model.get("sCurrentPosition");
				
				if (this.model.get("sAlingment") === 'vertical') {
					objVerticalBoundaryValues = this.getVerticalBoundaryValues(target, ui, nUpdatedX, nUpdatedY, minValue, maxValue);
					minValue = objVerticalBoundaryValues.minValue;
					maxValue = objVerticalBoundaryValues.maxValue;
					calculatedPos = objVerticalBoundaryValues.calculatedPos;
				}
				
				objBoundaryValues.minValue = minValue;
				objBoundaryValues.maxValue = maxValue;
				objBoundaryValues.calculatedPos = calculatedPos;

				return objBoundaryValues;
			},
			
			/**
			 * This function returns the boundary values
			 * @access private
			 * @memberof AdvancedVideoPlayer
			 * @param {Object} target Conatins the reference of current thumb
			 * @param {Object} ui Conatins the reference of ui object
			 * @param {Number} nUpdatedX Conatins the updated left position
			 * @param {Number} nUpdatedY Conatins the updated top position
			 * @param {Number} minValue Conatins minimum value for boundary
			 * @param {Number} maxValue Conatins the maximum value for boundary
			 * @returns None
			 */
			getVerticalBoundaryValues : function(target, ui, nUpdatedX, nUpdatedY, minValue, maxValue) {
				var otherVideoSliderPos, objCurrentPos, calculatedPos, actualTopPos, objBoundaryValues = {};

				objCurrentPos = this.model.get("sCurrentPosition");

				if (target.id === "thumb") {
					otherVideoSliderPos = objCurrentPos.thumbMax;
					calculatedPos = this.model.get("sLength") - nUpdatedY;
					maxValue = (maxValue > otherVideoSliderPos) ? otherVideoSliderPos : maxValue;
				} else {
					otherVideoSliderPos = objCurrentPos.thumb;
					calculatedPos = this.model.get("sLength") - nUpdatedY;
					minValue = (minValue > otherVideoSliderPos) ? minValue : otherVideoSliderPos;
				}

				objBoundaryValues.calculatedPos = calculatedPos;
				objBoundaryValues.minValue = minValue;
				objBoundaryValues.maxValue = maxValue;

				return objBoundaryValues;
			},
			
			/**
			 * This function returns the percentage of provided values
			 * @access private
			 * @memberof AdvancedVideoPlayer
			 * @param {Number} numerator Conatins the numerator value
			 * @param {Number} model Contains the denominator value
			 * @returns None
			 */
			getPercentage : function(numerator, denominator) {
				var percentage = ((numerator / denominator) * 100);
				return percentage;
			}

		});
		
		
		/**
		 * Set the super to BaseItemComp
		 * @access private
		 * @memberof BaseItemComp#
		 */
		AdvancedVideoPlayer.prototype.Super = BaseItemComp;
		
		
		/*
		 * Handles Play Pause btn Manually
		 * 
		 */
		AdvancedVideoPlayer.prototype.manualPlayPause = function (){
			
			if(this.compData.isPlaying == false){
				$('#btnPlayPause').css("background-position", "0px 0px");
				this.model.attributes.video[0].pause();
				this.model.set('isPlaying' , false);
	    	}
	    	else{
	    		$('#btnPlayPause').css("background-position", "-40px 0px");
	    		this.model.attributes.video[0].play();
	    		this.model.set('isPlaying' , true);		    		
	    	}	
		};
		
		/*
		 * update the currenttime and moves slider to a new position
		 * 
		 */
		AdvancedVideoPlayer.prototype.updateCurTime = function (newTime){
			if(this.model.get('vCurTime') != 0)
			{
				this.model.set('vCurTime', newTime);
				this.model.attributes.video[0].currentTime = newTime;
			}
			
			objCompRef.updateDuration(this);
			$('#videoLoader').css('visibility','hidden');	
		};
		/**
		 * Destroys video player instance.
		 * @memberof AdvancedVideoPlayer
		 * @param none.
		 * @returns none.
		 *
		 */
		AdvancedVideoPlayer.prototype.destroy = function() {
			
			clearInterval(_timer);
			
			objCompRef = null;
			isDragging =  false;
			_timer, thumbSpeed = 500;
			
			this.compData = null;
			this.objThumb = null;
			this.click = {};
			this.orgPos = {};
			this.totalTime = 0;
			this.video = null;
				
			this.$('#btnPlayPause').off("mousedown", this, this.playPause);
			//this.$('video').off("timeupdate", this, this.updateDuration);
			this.$('video').off("ended", this, this.videoEnded);
			this.$('#thumb').off("mousedown", this, this.mouseDownThumb);
			this.$('#thumb').off("mouseup", this, this.mouseUpThumb);
			
			return this.Super.prototype.destroy(true);
		};
	return AdvancedVideoPlayer;
});