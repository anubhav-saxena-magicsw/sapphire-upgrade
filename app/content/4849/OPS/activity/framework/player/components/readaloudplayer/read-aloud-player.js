/*jslint nomen: true*/
/*globals Backbone,_,$,console,Data_Loader*/

define(['marionette', 'player/base/base-layout-comp', 'components/readaloudplayer/js/read-aloud-player-helper', 'text!components/readaloudplayer/template/read-aloud-player.html', 'css!components/readaloudplayer/template/css/read-aloud-player.css', 'components/readaloudplayer/model/read-aloud-player-model'],

/**
 * A class representing ReadAloudPlayer.
 * ReadAloudPlayer is a component which provides a mechanism for synching the text highlight with audio.
 * To achieve this one has to initialize this component with an xml containing the metadata for audio file, highlightClass and text.
 * Once intialized it creates the html elements as specified in the xml and initilize a audio player component internally,
 * which is monitored for current time and applies/removes highlightClass to the specific text portion with it. 
 * Also click events get associated with each word of the xml.
 * Methods are provided to start , stop and pause the synching.   
 *
 *@class ReadAloudPlayer
 *@augments BaseItemComp
 *@param {Object} obj AN object containing xmlPath and highlightClass properties.
 *@example
 *
 * var readAloudPlayerComp,objConfig;
 * objConfig = {
 * xmlPath : "activity/sampleReadAloudPlayer/data/xml/roads.xml",
 * highlightClass :	"greenHighlight" // The class name for highlighting.
 * };
 *	
 * this.getComponent(this, "ReadAloudPlayer", "onComponentCreationComplete", objConfig );
 * 
 * function onComponentCreationComplete(objComp){
 * readAloudPlayerComp = objComp;
 * }
 * <br>Configurable properties of component:<br>
 * <table border="1" style="white-space:pre-wrap; color:"#000000";"><tr><th>Property</th><th>Type</th><th>Default Value</th><th>Description</th></tr><tr><td>xmlPath</td><td>String</td><td>null</td><td>This property contains the url of the xml which contains the data for readaloud component.</td></tr><tr><td>highlightClass</td><td>CSS class</td><td>DefaultHotSpotHighlight</td><td>This property contains the name of the activity CSS's class name which will override for highlighting the element.</td></tr></table>
 */
function(Marionette, BaseLayoutComp, myHelper, playerHtm, playerCss, ReadAloudPlayerModel) {'use strict';
	
	var ReadAloudPlayer = /** @lends ToggleButton.prototype */
	BaseLayoutComp.extend({
		template : _.template(playerHtm),
		/**
		 * Defining regions where audio player and hot spots will be added into dom.
		 * @access private
		 */
		regions : {
			audioPlayerParent : '#audioPlayerParent',
			hotSpotsParent : '#hotSpotsParent'
		},
		
		/**
		 * This function initializes the component
		 * @access private
		 * @memberof ReadAloudPlayer
		 * @param {Object} objCompData Conatins the data to configure the component
		 * @returns None
		 */
		initialize : function(obj) {
			var objThis = this;
			if (this.model === undefined) {
				this.setModel(obj);
			}
			if (this.model instanceof ReadAloudPlayerModel) {
				this.model.on("change", function() {
					objThis.onMyModelChange();
				});
			}
			myHelper.initComponent(this);
		},
		
		/**
		 * This function is called when rendering of component is completed
		 * @access private
		 * @memberof ReadAloudPlayer
		 * @param None
		 * @returns None
		 */
		onRender : function() {

		},
		/**
		 * This function is called when component is shown in the DOM
		 * @access private
		 * @memberof ReadAloudPlayer
		 * @param None
		 * @returns None
		 */
		onShow : function() {
			this.audioPlayerParent.show(this.model.get('audioPlayerRef'));
			if (!this.members.areHotSpotsEventsApplied) {
				myHelper.applyEventOnHotSpots();
				this.members.areHotSpotsEventsApplied = true;
			}
		},
		/**
		 * Model change handler function.
		 * @access private
		 * @memberof ReadAloudPlayer
		 * @param None
		 * @returns None
		 */
		onMyModelChange : function() {
			this.render();
		},
		/**
		 * Keeping track of wheather events are applied on hot spots or not.
		 * @access private
		 * @memberof ReadAloudPlayer
		 * @param None
		 * @returns None
		 */
		members : {
			areHotSpotsEventsApplied : false
		}
	});

	/**
	 * Sets model for ReadAloudPlayer instance.
	 * @memberof ReadAloudPlayer#
	 * @param {Object} obj Object passed in constructor to override default values.
	 * @return none.
	 * @access private.
	 */
	ReadAloudPlayer.prototype.setModel = function(obj) {
		this.model = new ReadAloudPlayerModel();
		
		if (obj.xmlPath !== undefined) {
			this.model.set('xmlPath', obj.xmlPath);
		}

	};
	/**
	 * Start the audio player and highlighting.
	 * @memberof ReadAloudPlayer
	 * @access public
	 * @param None
	 * @return None
	 */
	ReadAloudPlayer.prototype.play = function() {
		myHelper.objAudioPlayer.play();
	};
	/**
	 * Pauses the audio player and highlighting.
	 * @access public
	 * @param None
	 * @return None
	 */
	ReadAloudPlayer.prototype.pause = function() {
		myHelper.objAudioPlayer.pause();
	};
	/**
	 * Stops the audio player and highlighting.
	 * @memberof ReadAloudPlayer
	 * @access public
	 * @param None
	 * @return None
	 */
	ReadAloudPlayer.prototype.stop = function() {
		myHelper.objAudioPlayer.stop();
	};

	/**
     * Set the super to BaseLayoutComp
     * @access private 
     * @memberof ReadAloudPlayer#
     */
	ReadAloudPlayer.prototype._super = BaseLayoutComp;
	
	/**
	 * This functions destroys the component
	 * @memberof ReadAloudPlayer#
	 * @access public
	 * @param None
	 * @returns {Boolean} True or false
	 */
	ReadAloudPlayer.prototype.destroy = function() {

		myHelper.destroy();
		this.model.off("change");
		this.model.set('audioPlayerRef', null);
		this.model.set('audioSource', []);
		this.model.set('xmlPath', "");
		this.model.set('strHotSpots', "");
		var arrMaps = this.model.get('map');
		while (arrMaps.length > 0) {
			arrMaps.pop();
		}
		this.model.set('map', []);
		this.hotSpotsParent.close();
		this.model.destroy();
		this.model = null;
		return this._super.prototype.destroy(true);
	};

	return ReadAloudPlayer;
});

