/*jslint nomen: true*/
/*globals Backbone,_,$,console,Data_Loader*/

/**
 * ReadAloudHelper
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

define(['marionette', 'components/audioplayer/source/js/audio-player'], function(Marionette, AudioPlayer) {'use strict';
	/**
	 * An helper object which handles all operations for ReadAloudPlayer.
	 * @class ReadAloudHelper
	 * @access private
	 */
	var ReadAloudHelper = {
		/**
		 * Intializes the functionality related variables and objects.
		 * @param {ReadAloudPLayer} reference.
		 * @returns None
		 * @memberof ReadAloudHelper
		 * @access private
		 */
		initComponent : function(reference) {

			this.objAudioPlayer = null;
			this.isPaused = true;
			this.currentHotSpotTimeRange = undefined;
			this.currentHotSpot = undefined;
			this.currentIndex = 0;

			this.reference = reference;
			
			this.loadXML(this);
		},
		
		/**
		 * Loads the xml.
		 * @param None
		 * @returns None
		 * @memberof ReadAloudHelper
		 * @access private
		 */
		loadXML : function() {

			Data_Loader.on(Data_Loader.DATA_LOAD_SUCCESS, this.onXMLLoadSuccess, this);
			Data_Loader.on(Data_Loader.DATA_LOAD_FAILED, this.onXMLLoadFailure, this);
			Data_Loader.load({
				url : this.reference.model.get('xmlPath'),
				dataType : "xml",
				contentType : "application/xml",
				returnType : "json"
			});
		},
		/**
		 * Handler function of success of xml load.
		 * @param {XML} objData.
		 * @returns None
		 * @memberof ReadAloudHelper
		 * @access private
		 */
		onXMLLoadSuccess : function(objData) {
			var cmodel,arrAudioInfo,i,audioInfo;
			cmodel = this.reference.model;
			Data_Loader.off(Data_Loader.DATA_LOAD_SUCCESS);
			Data_Loader.off(Data_Loader.DATA_LOAD_FAILED);
			//Set highlightClass
			if(objData.highlightClass.name !== undefined){
				cmodel.set('highlightClass', objData.highlightClass.name);	
			}
			
			//Set AudioPlayer
			arrAudioInfo = [];
			if(objData.audio.source instanceof Array){
				for(i = 0 ; i < objData.audio.source.length ; i+=1){
					audioInfo = objData.audio.source[i];
					arrAudioInfo.push({
						path: audioInfo.src, 
						type: audioInfo.type		
					});
				}
			}else{
				audioInfo = objData.audio.source;
				arrAudioInfo.push({
					path: audioInfo.src, 
					type: audioInfo.type		
				});

			}
			cmodel.set('audioSource', arrAudioInfo);
			this.initAudioPlayer();
			
			//Set highlightText
			this.createHotSpots(objData);
		},
		/**
		 * Handler function of failure of xml load.
		 * @param None
		 * @returns None
		 * @memberof ReadAloudHelper
		 * @access private
		 */
		onXMLLoadFailure : function() {

			Data_Loader.off(Data_Loader.DATA_LOAD_SUCCESS);
			Data_Loader.off(Data_Loader.DATA_LOAD_FAILED);

			alert('xml failed to load.');
		},
		/**
		 * Intializes the audio player.
		 * @param None
		 * @returns None
		 * @memberof ReadAloudHelper
		 * @access private
		 */
		initAudioPlayer : function() {
			var audioSource, objAudioPlayer;
			audioSource = {};
			
			audioSource.source = this.reference.model.get('audioSource');
			audioSource.loop = false;

			objAudioPlayer = new AudioPlayer(audioSource);

			this.reference.model.set('audioPlayerRef', objAudioPlayer);
			objAudioPlayer.on(objAudioPlayer.AUDIO_START_EVENT, this.onAudioEvent, this);
			objAudioPlayer.on(objAudioPlayer.AUDIO_PAUSE_EVENT, this.onAudioEvent, this);
			objAudioPlayer.on(objAudioPlayer.AUDIO_STOP_EVENT, this.onAudioEvent, this);
			objAudioPlayer.on(objAudioPlayer.AUDIO_FINISH_EVENT, this.onAudioEvent, this);
			this.objAudioPlayer = objAudioPlayer;
		},
		/**
		 * This function reads the loaded xml and seperates the paragraph and words.
		 * Also this initializes the hotspots for the audio.
		 * @param {XML} objData.
		 * @returns None
		 * @memberof ReadAloudHelper
		 * @access private
		 */
		createHotSpots : function(objXml) {
			var arrMap, strPara, arrPara, i, j, objPara, arrWords, objWord;
			arrMap = this.reference.model.get('map');
			strPara = "";
			if (objXml.par instanceof Array) {
				arrPara = objXml.par;
				for ( i = 0; i < arrPara.length; i += 1) {
					strPara = strPara + '<p id="';
					objPara = arrPara[i];
					strPara = strPara + objPara.id + '" class="' + objPara.myClass + '">';
					if (objPara.word instanceof Array) {
						arrWords = objPara.word;
						for ( j = 0; j < arrWords.length; j += 1) {
							objWord = arrWords[j];
							strPara = strPara + '<span id="' + objWord.id + '" class="' + objWord.myClass + '" >' + objWord.text + '</span> ';
							arrMap.push({
								start : objWord.start,
								end : objWord.end,
								id : objWord.id
							});
						}
					} else {
						objWord = objPara.word;
						strPara = strPara + '<span id="' + objWord.id + '" class="' + objWord.myClass + '"  >' + objWord.text + '</span> ';
						arrMap.push({
							start : objWord.start,
							end : objWord.end,
							id : objWord.id
						});
					}

					strPara = strPara + '</p>';

				}

			} else {
				strPara = strPara + '<p id="';
				objPara = objXml.par;
				strPara = strPara + objPara.id + '" class="' + objPara.myClass + '">';
				if (objXml.par.word instanceof Array) {
					arrWords = objXml.par.word;
					for ( j = 0; j < arrWords.length; j += 1) {
						objWord = arrWords[j];
						strPara = strPara + '<span id="' + objWord.id + '" class="' + objWord.myClass + '" >' + objWord.text + '</span> ';
						arrMap.push({
							start : objWord.start,
							end : objWord.end,
							id : objWord.id
						});
					}
				} else {
					objWord = objXml.par.word;
					strPara = strPara + '<span id="' + objWord.id + '" class="' + objWord.myClass + '" ">' + objWord.text + '</span> ';
					arrMap.push({
						start : objWord.start,
						end : objWord.end,
						id : objWord.id
					});
				}
				strPara = strPara + '</p>';
			}

			this.reference.model.set('strHotSpots', strPara);

		},
		/**
		 *To apply the click event on hotspots.
		 * @param None
		 * @returns None
		 * @memberof ReadAloudHelper
		 * @access private
		 */
		applyEventOnHotSpots : function() {
			var objThis, arrMap;
			objThis = this;
			arrMap = this.reference.model.get('map');
			_.each(arrMap, function(objWord) {
				$('#' + objWord.id).on('click', function() {
					objThis.objAudioPlayer.pause();
					objThis.objAudioPlayer.setCurrentTime(objWord.start);
					objThis.objAudioPlayer.play();
				});
			});
		},
		/**
		 * Listener function for any kind of AudioPlayer events.
		 * @param {AudioPlayer.Events} e.
		 * @returns None
		 * @memberof ReadAloudHelper
		 * @access private
		 */
		onAudioEvent : function(e) {
			var highlightClass;
			switch(e.type) {
				case this.objAudioPlayer.AUDIO_START_EVENT:
					this.isPaused = false;
					this.objAudioPlayer.off(this.objAudioPlayer.AUDIO_PROGRESS_EVENT);
					this.objAudioPlayer.on(this.objAudioPlayer.AUDIO_PROGRESS_EVENT, this.onAudioEvent, this);
					break;
				case this.objAudioPlayer.AUDIO_PROGRESS_EVENT:
					this.objAudioPlayer.off(this.objAudioPlayer.AUDIO_PROGRESS_EVENT);
					this.setCurrentIndexAndTimeRangeForCurrentTime(e.customData);
					this.startHotSpotHighlight(this.currentIndex);
					break;
				case this.objAudioPlayer.AUDIO_PAUSE_EVENT:
					this.isPaused = true;
					this.interruptHotSpotHighlight();
					break;
				case this.objAudioPlayer.AUDIO_STOP_EVENT:
				case this.objAudioPlayer.AUDIO_FINISH_EVENT:
					this.isPaused = true;
					this.interruptHotSpotHighlight();
					if (this.currentHotSpot !== undefined) {
						highlightClass = this.reference.model.get('highlightClass');
						$(this.currentHotSpot).removeClass(highlightClass);
						this.currentHotSpot = undefined;
					}
					break;
			}
		},
		/**
		 * This function sets the currentIndex and currentHotSpotTimeRange respect to the currentTime of audio player.
		 * @param {Number} time.
		 * @returns None
		 * @memberof ReadAloudHelper
		 * @access private
		 */
		setCurrentIndexAndTimeRangeForCurrentTime : function(time) {
			var arrMap, objThis, i, bSet;
			arrMap = this.reference.model.get('map');
			objThis = this;
			i = 0;
			bSet = false;
			_.each(arrMap, function(objWord) {
				if ((objWord.end > time) && (objWord.start <= time)) {
					objThis.currentHotSpotTimeRange = (objWord.end - time) * 1000;
					objThis.currentIndex = i;
					bSet = true;
				}
				i += 1;
			});
			if (!bSet) {
				this.currentIndex = -1;
			}
		},
		/**
		 * This function selects the hotspot for supplied index and highlights it.
		 * @param {int} index.
		 * @returns None
		 * @memberof ReadAloudHelper
		 * @access private
		 */
		startHotSpotHighlight : function(index) {
			var arrMap, i, timeRange, objThis, highlightClass;
			arrMap = this.reference.model.get('map');
			highlightClass = this.reference.model.get('highlightClass');
			i = 0;
			objThis = this;
			_.each(arrMap, function(objWord) {
				if (i === index) {
					timeRange = (objWord.end - objWord.start) * 1000;
					$("#" + objWord.id).addClass(highlightClass);
					
					objThis.currentIndex = i;
					if (objThis.currentHotSpot) {
						$(objThis.currentHotSpot).removeClass(highlightClass);
					}
					objThis.currentHotSpot = $("#" + objWord.id);
					if (objThis.currentHotSpotTimeRange !== undefined) {
						timeRange = objThis.currentHotSpotTimeRange;
						objThis.currentHotSpotTimeRange = undefined;
					}
					objThis.startHotSpotHighlightTimer = setTimeout(function() {
						objThis.hotSpotHighlightHelper(index);
					}, timeRange);

				}
				i += 1;
			});
		},
		/**
		 * This function helps the startHotSpotHighlight function in de-highlighting the current highlighted hotspot and
		 * synchronize with the audio player to highlight next word.
		 * @param {int} time.
		 * @returns None
		 * @memberof ReadAloudHelper
		 * @access private
		 */
		hotSpotHighlightHelper : function(index) {
			var arrMap, i, end, time, objThis, highlightClass;
			objThis = this;
			arrMap = this.reference.model.get('map');
			highlightClass = this.reference.model.get('highlightClass');
			i = this.currentIndex;
			if (this.isPaused) {
				return;
			}

			if (this.currentHotSpot !== undefined) {
				$(this.currentHotSpot).removeClass(highlightClass);
				this.currentHotSpot = undefined;
			}

			if (i === arrMap.length - 1) {
				return;
			}
			time = this.objAudioPlayer.getCurrentTime();
			this.setCurrentIndexAndTimeRangeForCurrentTime(time);
			if (this.currentIndex === -1) {
				this.startHotSpotHighlightTimer = setTimeout(function() {
					objThis.hotSpotHighlightHelper(this.currentIndex);
				}, 1);
				return;
			}
			this.startHotSpotHighlight(this.currentIndex);

			//objThis = this;
			// _.each(arrMap, function(objWord) {
			// if(i === index){
			// end = objWord.end;
			// }
			// if(i === index+1){
			// time = (objWord.start - end)*1000 ;
			// setTimeout(function(){
			// objThis.startHotSpotHighlight(index+1);
			// },time);
			// }
			// i += 1;
			// });
		},
		/**
		 * This function interrupts the highlighting.
		 * @param None
		 * @returns None
		 * @memberof ReadAloudHelper
		 * @access private
		 */
		interruptHotSpotHighlight : function() {
			if (this.startHotSpotHighlightTimer) {
				clearTimeout(this.startHotSpotHighlightTimer);
			}

		},
		
		/**
		 * This function stops the audio and highlighting. Also nullifies audio player refernce and timer.
		 * @param None
		 * @returns None
		 * @memberof ReadAloudHelper
		 * @access private
		 */	
		destroy : function() {
			this.objAudioPlayer.stop();
			this.objAudioPlayer.off(this.objAudioPlayer.AUDIO_START_EVENT);
			this.objAudioPlayer.off(this.objAudioPlayer.AUDIO_PAUSE_EVENT);
			this.objAudioPlayer.off(this.objAudioPlayer.AUDIO_STOP_EVENT);
			this.objAudioPlayer.off(this.objAudioPlayer.AUDIO_FINISH_EVENT);
			this.objAudioPlayer.off(this.objAudioPlayer.AUDIO_PROGRESS_EVENT);
			this.objAudioPlayer.destroy();
			clearTimeout(this.startHotSpotHighlightTimer);
			Data_Loader.off(Data_Loader.DATA_LOAD_SUCCESS);
			Data_Loader.off(Data_Loader.DATA_LOAD_FAILED);
			this.startHotSpotHighlightTimer = null;
			this.reference = null;
			this.objAudioPlayer = null;
			this.isPaused = true;
			this.currentHotSpotTimeRange = undefined;
			this.currentHotSpot = undefined;
			this.currentIndex = 0;

		}
	};

	return ReadAloudHelper;
});
