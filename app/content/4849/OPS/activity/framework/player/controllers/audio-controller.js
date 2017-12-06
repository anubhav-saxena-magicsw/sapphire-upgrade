/*jslint nomen: true*/
/*globals _,console*/
/**
 * AudioController
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

define([], function() {
	"use strict";

	/**
	 * Class handles loading of audio and provides APIs to control the audio.
	 *@class AudioController
	 *@access private
	 *@example
	 *Load module
	 *require(['player/controllers/AudioController'], function(AudioController) {
	 *    var audioController = new AudioController();
	 *});
	 */
	var AudioController, arrAudioObject, objInstance, uid, arrBg, defaultVolume, isWebApiEnable = true, AudioContext, context;
	objInstance = null;
	defaultVolume = 1;
	AudioContext = window.AudioContext || window.webkitAudioContext;
	AudioController = function() {
		var i;
		arrAudioObject = {};
		arrBg = [];
		if (AudioContext) {
			this.bufferList = {};
			this.loadCount = 0;
			this.gainNode = null;
			this.context = new AudioContext();
			this.audioSourcesObj = {};
			this.helperContext = null;

		}
		setInterval(function() {
			for ( i = 0; i < arrBg.length; i += 1) {
				var objPlayer = arrBg[i];
				if (objPlayer !== undefined) {
					if (isNaN(objPlayer.data.duration) === false) {
						if (objPlayer.data.isPaused === true) {
							return;
						}
						objPlayer.missed = undefined;
						if (objPlayer.data.cTime === undefined) {
							objPlayer.data.cTime = objPlayer.currentTime;
						} else {
							if (objPlayer.data.cTime === objPlayer.currentTime) {
								objPlayer.volume = defaultVolume;
								objPlayer.play();
							}
						}
						objPlayer.data.cTime = objPlayer.currentTime;
					} else {
						objPlayer.missed = (objPlayer.missed === undefined) ? 0 : objPlayer.missed + 1;
						if (objPlayer.missed % 2 === 0) {
							objPlayer.load();
						}
					}
				}
			}
		}, 1000);
		uid = 0;
	};

	/**
	 * Plays audio
	 * @access public
	 * @memberof AudioController#
	 * @param {Object} objData contains data for the audio file to be played
	 * This object contains follwing properties:
	 * {Stirng} strPath audio path
	 * {int} bLoop set true if sound need to be play loop.
	 * {Stirng} strTrack a unique identifier of sound file, by the track id activity is allow stop/play selected track.
	 * {Boolean} bReload if set true then files will be reloaded.
	 * {Function} sCallBack when track start associated callback method will be invoked.
	 * {Function} fCallBack when track finish associated callback method will be invoked.
	 * @returns None
	 */
	AudioController.prototype.playAudio = function(objData) {
		var strAudio, objRef = objData, Progress, objProgress, i;

		Progress = function() {
			var self = this;
			this.loadStart = function() {
				this.addEventListener('loadedmetadata', self.metaLoaded);
				this.addEventListener('canplay', self.canPlay);
			};

			this.metaLoaded = function() {
				this.removeEventListener('loadedmetadata', self.metaLoaded);
				this.data.duration = this.duration;

			};

			this.canPlay = function() {
				this.removeEventListener('canplay', self.canPlay);
				this.volume = defaultVolume;
				this.play();
				if ((this.data.bLoop === true) && (arrBg.indexOf(this) === -1)) {
					arrBg.push(this);
				}
				if (this.data.onStart !== undefined) {
					this.data.onStart();
				}
			};

			this.audioEnded = function() {
				var callToOnFinish;
				this.pause();
				this.currentTime = 0;
				if (this.data.bLoop) {
					this.volume = defaultVolume;
					this.play();
					return;
				}
				if (this.data.onFinish !== undefined) {
					callToOnFinish = this.data.onFinish;
					this.data.onFinish = undefined;
					callToOnFinish();
				}
			};
		};

		if (arrAudioObject[objData.strTrack] === undefined) {
			strAudio = document.createElement("audio");
			strAudio.uid = uid += 1;

			objProgress = new Progress();

			strAudio.data = objData;
			this.setSource(strAudio, objData.strPath);

			//strAudio.setAttribute("src", objData.strPath);
			console.log(strAudio.getAttribute("src"));
			strAudio.addEventListener("loadstart", objProgress.loadStart);
			strAudio.addEventListener("ended", objProgress.audioEnded);

			strAudio.load();
			arrAudioObject[objData.strTrack] = strAudio;

		} else if (objData.reload) {
			arrAudioObject[objData.strTrack].data = objData;
			arrAudioObject[objData.strTrack].pause();
			arrAudioObject[objData.strTrack].data.isPaused = undefined;
			if (arrAudioObject[objData.strTrack].src.indexOf(objData.strPath) === -1) {
				arrAudioObject[objData.strTrack].src = "";
				this.setSource(arrAudioObject[objData.strTrack], objData.strPath);
				//arrAudioObject[objData.strTrack].setAttribute("src", objData.strPath);
				arrAudioObject[objData.strTrack].load();
			} else {
				arrAudioObject[objData.strTrack].volume = defaultVolume;
				arrAudioObject[objData.strTrack].play();
				if (objData.onStart !== undefined) {
					objData.onStart();
				}

			}

		} else {
			this.restartAudio(objData.strTrack);
		}
	};

	/**
	 *setSource
	 *@access public
	 *@memberof AudioController#
	 *@param {Object} objAudio Audio element.
	 *@param {Object} objSrc Object with source info.
	 *@returns None
	 * @private
	 */
	AudioController.prototype.setSource = function(objAudio, objSrc) {
		var i, type;

		if ( objSrc instanceof Array) {
			for ( i = 0; i < objSrc.length; i += 1) {

				if (objSrc[i].type === 'mp3') {
					if (objAudio.canPlayType('audio/mpeg;')) {
						objAudio.setAttribute("src", objSrc[i].path);
						break;
					}
				} else if (objSrc[i].type === 'ogg') {
					if (objAudio.canPlayType('audio/ogg;')) {
						objAudio.setAttribute("src", objSrc[i].path);
						break;
					}
				}
			}
		} else {
			objAudio.setAttribute("src", objSrc);
		}
	};

	/**
	 *Restart audio
	 *@access public
	 *@memberof AudioController#
	 *@param {String} strTrackId id of audio track which needs to be restart
	 *@returns None
	 */
	AudioController.prototype.restartAudio = function(strTrackId) {
		try {
			arrAudioObject[strTrackId].currentTime = 0;
			arrAudioObject[strTrackId].pause();
			arrAudioObject[strTrackId].volume = defaultVolume;
			arrAudioObject[strTrackId].play();
		} catch(e) {
			console.error("//" + strTrackId + "// track not found.");
		}
	};

	/**
	 *Stops audio
	 *@access public
	 *@memberof AudioController#
	 *@param {String} strTrackId id of audio track which needs to be restart
	 *@param {Boolean} bDestroy defines if referenc eof audio is also need to be deleted
	 *@returns None
	 */
	AudioController.prototype.stopAudio = function(strTrackId, bDestroy) {
		try {
			arrAudioObject[strTrackId].currentTime = 0;
			arrAudioObject[strTrackId].pause();
			arrAudioObject[strTrackId].data.isPaused = true;
			if (bDestroy) {
				delete arrAudioObject[strTrackId];
			}
		} catch(e) {
			console.error("//" + strTrackId + "// track not found.");
		}
		this.stop(strTrackId.id);
	};
	/**
	 *Stops all audio files which are played by the AudioController
	 *@access public
	 *@memberof AudioController#
	 *@param {Object} objEvent contains the reference of event
	 *@returns None
	 */
	AudioController.prototype.stopAllAudio = function(objEvent) {

		var prop, bDestroy;
		bDestroy = objEvent.bDestroy;

		for (prop in arrAudioObject) {
			if (arrAudioObject.hasOwnProperty(prop)) {
				this.stopAudio(prop, bDestroy);
			}
		}
	};

	/**
	 *Pauses audio
	 *@access public
	 *@memberof AudioController#
	 *@param {String} strTrackId id of audio track which needs to be restart
	 *@returns None
	 */
	AudioController.prototype.pauseAudio = function(strTrackId) {
		try {
			arrAudioObject[strTrackId].data.isPaused = true;
			arrAudioObject[strTrackId].pause();
		} catch(e) {
			console.error("//" + strTrackId + "// track not found.");
		}
		if ( typeof strTrackId === 'object')
			this.pause(strTrackId.id);

	};

	/**
	 *Resumes audio
	 *@access public
	 *@memberof AudioController#
	 *@param {String} strTrackId id of audio track which needs to be restart
	 *@returns None
	 */
	AudioController.prototype.resumeAudio = function(strTrackId) {
		try {
			arrAudioObject[strTrackId].data.isPaused = false;
			arrAudioObject[strTrackId].volume = defaultVolume;
			arrAudioObject[strTrackId].play();
		} catch(e) {
			console.error("//" + strTrackId + "// track not found.");
		}
		if ( typeof strTrackId === 'object') {
			strTrackId.type = 'resume';
			this.playWebAudio(strTrackId);
		}

	};

	//Methods added-----------------------------------------------------------
	/**
	 *Controls volume
	 *@access public
	 *@memberof AudioController#
	 *@param {Object} objData contains "strTrackId" and "volume" properties
	 *@returns None
	 */
	AudioController.prototype.setVolume = function(objData) {
		var fraction;
		try {
			arrAudioObject[objData.strTrackID].volume = objData.volume;
		} catch(e) {
			/* console.error("//" + objData + "// track not found.");*/
		}
		if (objData.type === 'audioApi') {
			fraction = parseInt(objData.volume) / 100;
			this.gainNode.gain.value = fraction * fraction;
		}
	};

	/**
	 *Controls volume
	 *@access public
	 *@memberof AudioController#
	 *@param {Number} vol The volume to be set to all audios
	 *@returns None
	 */
	AudioController.prototype.setDefaultVolume = function(objData) {
		var objKey, objPlayer;
		defaultVolume = objData.volume;
		for (objKey in arrAudioObject) {
			if (arrAudioObject.hasOwnProperty(objKey)) {
				objPlayer = arrAudioObject[objKey];
				if (objPlayer !== undefined) {
					objPlayer.volume = defaultVolume;
				}
			}
		}
	};

	AudioController.prototype.unloadWebApiBufferAudio = function(obj) {
		var id, helperContext = this.helperContext;
		if (obj.context) {
			helperContext = this.helperContext;
		}

		if (obj.hasOwnProperty('id')) {
			id = obj.id;
			delete this.bufferList[id];
			delete this.audioSourcesObj[id];
			if (helperContext && obj.unLoad && typeof helperContext[obj.unLoad] === 'function') {
				helperContext[obj.unLoad].call(helperContext, id);
			}
		} else {
			this.bufferList = {};
			this.audioSourcesObj = {};
			if (helperContext && obj.unLoad && typeof helperContext[obj.unLoad] === 'function') {
				helperContext[obj.unLoad].call(helperContext, null);
			}
		}
	};

	AudioController.prototype.loadBuffer = function(url, index) {
		var request, loader;
		// Load buffer asynchronously
		request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.responseType = "arraybuffer";
		loader = this;

		request.onload = function() {
			// Asynchronously decode the audio file data in request.response
			loader.context.decodeAudioData(request.response, function(buffer) {
				if (!buffer) {
					console.log('error decoding file data: ' + url);
					return;
				}
				loader.bufferList[index] = buffer;
				loader.audioSourcesObj[index] = {};
				if (++loader.loadCount === (Object.keys(loader.urlList).length - 2)) { {
						if (loader.helperContext && loader.urlList.onLoad && typeof loader.helperContext[loader.urlList.onLoad] === 'function') {
							loader.helperContext[loader.urlList.onLoad].call(loader.helperContext, loader.bufferList);
						}
					};
				};
			}, function(error) {
				console.error('decodeAudioData error', error);
			});
		};

		request.onerror = function() {
			console.log('BufferLoader: XHR error');
		};

		request.send();
	};

	AudioController.prototype.initWebAudio = function(urlsObj) {
		var i;
		this.urlList = urlsObj;
		this.helperContext = urlsObj.context;
		for (i in this.urlList) {
			if (i != 'context' && i != 'onLoad') {
				this.loadBuffer(this.urlList[i], i);
			};
		};
	};

	AudioController.prototype.stop = function(key) {
		if (this.audioSourcesObj[key].source === undefined) {
			return;
		}
		
		if (!this.audioSourcesObj[key].source.stop) {
			//TO:DO: Need to check (soruce.noteOFF)
			this.audioSourcesObj[key].source.stop = source.noteOff;

		}
		this.audioSourcesObj[key].source.stop(0);
		this.audioSourcesObj[key].paused = false;
		this.audioSourcesObj[key].started = false;
	};
	AudioController.prototype.playWebAudio = function(urlObj) {
		var bLoop = false, start, end, key = urlObj.id, len, startTime, endTime, helperContext = this.helperConext;
		if (urlObj) {
			if (!this.bufferList.hasOwnProperty(key)) {
				console.log('This audio not loaded yet');
				return;
			}
		}
		if (urlObj.hasOwnProperty('type')) {
			if (this.audioSourcesObj[key].source === undefined) {
				return;
			}
		} else {
			this.audioSourcesObj[key].paused = false;
		}
		if (urlObj.loop) {
			bLoop = true;
		}

		if (this.audioSourcesObj[key].started) {
			this.stop(key);
		}
		if (!this.context.createGain) {
			this.context.createGain = this.context.createGainNode;
		}
		this.gainNode = this.context.createGain();
		this.audioSourcesObj[key].source = this.context.createBufferSource();
		this.audioSourcesObj[key].source.buffer = this.bufferList[key];
		// Connect source to a gain node
		this.audioSourcesObj[key].source.connect(this.gainNode);
		// Connect gain node to destination
		this.gainNode.connect(this.context.destination);
		// Start playback in a loop
		this.audioSourcesObj[key].source.loop = bLoop;
		if (this.audioSourcesObj[key].paused) {
			this.audioSourcesObj[key].startedAt = Date.now() - this.audioSourcesObj[key].pausedAt;
			this.audioSourcesObj[key].source.start(0, this.audioSourcesObj[key].pausedAt / 1000);
		} else {
			endTime = len = this.audioSourcesObj[key].source.buffer.duration;
			startTime = 0;
			if (urlObj.startTime) {
				startTime = parseFloat(urlObj.startTime / 1000);
			}
			if (urlObj.endTime) {
				endTime = parseFloat(urlObj.endTime / 1000);
			}
			if (startTime > endTime || endTime > len || startTime < 0) {
				console.log('Please enter correct start and end time');
				return;
			}
			if (!this.audioSourcesObj[key].source.start) {
				this.audioSourcesObj[key].source.start = this.audioSourcesObj[key].source.noteOn;
			}

			this.audioSourcesObj[key].source.start(0, startTime, endTime - startTime);
			this.audioSourcesObj[key].startedAt = Date.now();
		}
		this.audioSourcesObj[key].started = true;
		if (urlObj.context) {
			helperContext = urlObj.context;
		}

		if (helperContext && urlObj.onStart && typeof helperContext[urlObj.onStart] === 'function') {
			helperContext[urlObj.onStart].call(helperContext, key);
		}

		this.audioSourcesObj[key].source.onended = function() {
			if (helperContext && urlObj.onFinish && typeof helperContext[urlObj.onFinish] === 'function') {
				helperContext[urlObj.onFinish].call(helperContext, key);
			}
		};
	};
	AudioController.prototype.pause = function(key) {
		if (this.audioSourcesObj[key].source === undefined) {
			return;
		}
		if (!this.audioSourcesObj[key].source.stop) {

			//TODO:NEED to check sournce.noteOff
			this.audioSourcesObj[key].source.stop = source.noteOff;
		}
		this.audioSourcesObj[key].source.stop(0);
		this.audioSourcesObj[key].pausedAt = Date.now() - this.audioSourcesObj[key].startedAt;
		this.audioSourcesObj[key].paused = true;
		this.audioSourcesObj[key].started = false;
	};

	//Methods added-----------------------------------------------------------

	return {
		getInstance : function() {
			if (objInstance === null) {
				objInstance = new AudioController();
			}
			return objInstance;
		}
	};
});
