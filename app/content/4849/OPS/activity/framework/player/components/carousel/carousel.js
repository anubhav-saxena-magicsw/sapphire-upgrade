/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * Carousel
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette', 'jqueryUI', 'jqueryTouchPunch', 'player/base/base-composite-comp', 'text!components/carousel/template/carousel.html', 'components/carousel/model/carousel-model', 'components/carousel/js/carousel-constants', 'player/components/carousel/js/carousel-item', 'css!components/carousel/template/style/carousel.css'],

/**
 * A class representing a carousel.
 * A Carousel is the display of small thumbnail images with two buttons at either end to navigate between the images.
 * It can be configure to display images in vertical and horizontal position, also carousel navigation can be configured for linear and circular display.
 * It requires unique ids of player so that it can display appropriate selection of images as per the player.
 *
 *@class Carousel
 *@augments BaseCompositeComp
 *@param {Object} obj  An object with 'allignment','selectorIndex', 'wrap', 'imageCollection', 'playerIds' and 'carouselWrapperStyle' properties.
 *@example
 *
 * var  carouselComp, obj = {};
 * obj.allignment = CarouselConstants.CONSTANTS.VERTICAL;
 * obj.selectorIndex = 1;
 * obj.wrap = CarouselConstants.CONSTANTS.LINEAR;
 * obj.imageCollection = objData;
 * obj.playerIds = ["p1", "p2", "p3", "p4"];//array of unique player ids
 * obj.carouselWrapperStyle = 'CarouselWrapperStyle';//any style class defined in activity css
 *
 * this.getComponent(context, "Carousel", "onComponentCreated", objCompData);
 *
 * function onComponentCreated(objComp){
 * carouselComp = objComp;
 * }
 * <br>Configurable properties of component:<br>
 * <table border="1" style="white-space:pre-wrap; color:"#000000";"><tr><th>Property</th><th>Type</th><th>Default Value</th><th>Description</th></tr><tr><td>allignment</td><td>String</td><td>CarouselConstants.CONSTANTS.HORIZONTAL</td><td>This property is used to allign the component either horizontal or vertical. Other value which it can take is CarouselConstants.CONSTANTS.VERTICAL<br><br>If this property is not provided to the component then it will render horizontally.</td></tr><tr><td>selectorIndex</td><td>integer</td><td>0</td><td>This value could be any integer equals or greter than zero. This index defines as exactly which item's information will be returned while triggering getCurrentItem() function.</td></tr><tr><td>wrap</td><td>String</td><td>CarouselConstants.CONSTANTS.CIRCULAR</td><td>This property defines the navigation of carousel, other value which the component can take is CarouselConstants.CONSTANTS.CIRCULAR</td></tr><tr><td>imageCollection</td><td>json</td><td>json string of <a href="xml/imageCollection.xml" target="_blank">xml</a></td><td>This is the xml data containing image collection and styling, this data is required to be in a <a href="xml/imageCollection.xml" target="_blank">predifined</a> format.<br><br>This property is mandatory and should be provided during component creation.</td></tr><tr><td>playerIds</td><td>Array</td><td>[]</td><td>This property contains the unique id's(String) of players in an array.<br><br>This property is mandatory and should be provided during component creation.</td></tr><tr><td>carouselWrapperStyle</td><td>CSS class</td><td>CarouselWrapperStyle</td><td>Any style class defined in activity css, though this property is optional and if developer doesn't provide any new style class then calculator will render with its own pre-defined style.<br><br>Note: Developer should avoid definig a style class by the "CarouselWrapperStyle" name in activity css.</td></tr></table>
 */
function(Marionette, jqueryUI, jqueryTouchPunch, BaseCompositeComp, CarouselTemp, CarouselModel, CarouselConstants, CarouselItem, CarouselCSS) {'use strict';

	var Carousel = /** @lends Carousel.prototype */
	BaseCompositeComp.extend({

		objNextButton : null,

		currentPlayer : "p1",

		nextButtonCounter : 0,

		isNextDisabled : false,

		objPreviousButton : null,

		previousButtonCounter : 0,

		isPreviousDisabled : false,

		objImageContainer : null,

		template : _.template(CarouselTemp),

		itemView : CarouselItem,

		itemViewContainer : "#imageContainer",

		/**
		 * This function initializes the component
		 * @access private
		 * @memberof Carousel
		 * @param {Object} objCompData Conatins the data to configure the component
		 * @returns None
		 */
		initialize : function(objCompData) {

			var cItemModel, i, iLen, imageCount, arrItemModel = [], objImageCollection = {}, MyCollection, CarouselItemModel;

			this.model = new CarouselModel();
			this.parseCompData(objCompData, this.model);

			objImageCollection = this.model.get("imageCollection");

			CarouselItemModel = Backbone.Model.extend({

				defaults : {

					imgSource : "",
					styleName : "",
					playerId : "",
					itemId : "",
					selected : false,
					allignment : CarouselConstants.CONSTANTS.HORIZONTAL
				}
			});

			MyCollection = Backbone.Collection.extend({

				model : CarouselItemModel

			});

			if (this.model.get("wrap") === CarouselConstants.CONSTANTS.LINEAR) {
				iLen = this.model.get("selectorIndex");
				for ( i = 0; i < iLen; i += 1) {
					cItemModel = new CarouselItemModel();
					cItemModel.set('imgSource', objImageCollection.images[0].src);
					cItemModel.set('styleName', "InvisibleItem");
					cItemModel.set('itemId', "-1");
					cItemModel.set('allignment', this.model.get("allignment"));
					arrItemModel.push(cItemModel);
				}
			}

			iLen = objImageCollection.images.length;
			this.previousButtonCounter = iLen - 1;

			// console.log("this.nextButtonCounter:"+this.nextButtonCounter);
			for ( i = 0; i < iLen; i += 1) {
				cItemModel = new CarouselItemModel();
				cItemModel.set('imgSource', objImageCollection.images[i].src);
				cItemModel.set('styleName', objImageCollection.images[i].styleName);
				cItemModel.set('itemId', objImageCollection.images[i].id);
				cItemModel.set('allignment', this.model.get("allignment"));
				arrItemModel.push(cItemModel);
			}

			this.collection = new MyCollection(arrItemModel);

		},

		/**
		 * This function sets the current player Id
		 * @access private
		 * @memberof Carousel
		 * @param {String} strId contains the player id
		 * @returns None
		 */
		setCurrentPlayer : function(strId) {
			this.currentPlayer = strId;
		},

		/**
		 * This function updates the model for current slection of carousel
		 * @access private
		 * @memberof Carousel
		 * @param {String} currentSelectionId contains the current section id
		 * @returns None
		 */
		onCarouselItemSelected : function(currentSelectionId) {

			//Deselect previous selection of current user and update the new selection

			var previousModel, newModel;
			previousModel = this.collection.findWhere({
				playerId : this.currentPlayer
			});

			if (previousModel) {
				previousModel.set("playerId", "");
				previousModel.set("selected", false);
			}

			newModel = this.collection.get(currentSelectionId);
			newModel.set("playerId", this.currentPlayer);
			newModel.set("selected", true);

		},

		/**
		 * This function enable/disable next or previous button
		 * @access private
		 * @memberof Carousel
		 * @param {Object} context contains the context from which it is called
		 * @param {int} previousCounter contains the previous counter
		 * @param {int} nextCounter contains the next counter
		 * @returns None
		 */
		updateNextPreviousButtonAvailability : function(context, previousCounter, nextCounter) {

			if (this.model.get("wrap") === CarouselConstants.CONSTANTS.LINEAR) {
				var iLen = (this.model.get("imageCollection")).images.length;

				if (previousCounter === (iLen - 1)) {

					$(context.objPreviousButton).removeClass('active');
					// console.log("Previous button Disabled");
					context.isPreviousDisabled = true;
				} else {
					$(context.objPreviousButton).addClass('active');
					context.isPreviousDisabled = false;
					// console.log("Previous button enabled");
				}

				// iLen = (iLen - (this.model.get("selectorIndex")+1));
				console.log("iLen:" + iLen + " nextCounter:" + nextCounter);
				if (nextCounter === (iLen - 1)) {
					$(context.objNextButton).removeClass('active');
					context.isNextDisabled = true;
					// console.log("Next button Disabled");
				} else {
					$(context.objNextButton).addClass('active');
					context.isNextDisabled = false;
					// console.log("Next button enabled");
				}
			} else {
				this.isNextDisabled = false;
				$(context.objNextButton).addClass('active');
				this.isPreviousDisabled = false;
				$(context.objPreviousButton).addClass('active');
			}

		},

		/**
		 * This function is called when rendering of component is completed
		 * @access private
		 * @memberof Carousel
		 * @param None
		 * @returns None
		 */
		onRender : function() {

			this.$('#carouselWrapper').addClass(this.model.get("carouselWrapperStyle"));
		},

		/**
		 * This function is called when component is shown in the DOM
		 * @access private
		 * @memberof Carousel
		 * @param None
		 * @returns None
		 */
		onShow : function() {
			var allignment, parent, child, objReference;
			this.objNextButton = this.$('#btnNext');
			this.objPreviousButton = this.$('#btnPrevious');
			this.objImageContainer = this.$('#imageContainer');
			objReference = this;

			objReference.updateNextPreviousButtonAvailability(this, this.previousButtonCounter, this.nextButtonCounter);

			this.objNextButton.on("click", function() {
				objReference.onNextButtonClicked(objReference);
			});
			this.objPreviousButton.on("click", function() {
				objReference.onPreviousButtonClicked(objReference);
			});

			allignment = this.model.get("allignment");
			parent = $(this.itemViewContainer).parent();
			child = $(this.itemViewContainer).find("img")[0];

			if (allignment === CarouselConstants.CONSTANTS.HORIZONTAL) {
				$(this.itemViewContainer).css("overflow-x", "hidden");
				$(this.itemViewContainer).css("overflow-y", "hidden");
				$(this.itemViewContainer).css("white-space", "nowrap");

			} else {
				$(this.itemViewContainer).css("overflow-y", "hidden");
				$(this.itemViewContainer).css("overflow-x", "hidden");
				$(this.itemViewContainer).css("white-space", "normal");
			}

			this.trigger(CarouselConstants.EVENTS.COMPONENT_INITIALIZED, this.getCurrentItem());
			this.$el.on("click", $.proxy(objReference.compClick, objReference));
			this.$el.on("mouseover", $.proxy(objReference.compRollover, objReference));
			this.$el.on("mouseout", $.proxy(objReference.compRollout, objReference));
		},

		/**
		 * This function is called when next button is clicked from carousel
		 * @access private
		 * @memberof Carousel
		 * @param {Object} objReference This contains the reference of Carousel
		 * @returns None
		 */
		onNextButtonClicked : function(objReference) {

			if (!objReference.isNextDisabled) {
				var divToMove = $("#imageContainer :first");
				// console.log("divToMove",divToMove);
				$(divToMove).remove();
				$("#imageContainer").append(divToMove);

				if (objReference.model.get("wrap") === CarouselConstants.CONSTANTS.LINEAR) {
					objReference.nextButtonCounter += 1;
					objReference.previousButtonCounter -= 1;
					objReference.updateNextPreviousButtonAvailability(objReference, objReference.previousButtonCounter, objReference.nextButtonCounter);
				}

				this.trigger(CarouselConstants.EVENTS.INDEX_CHANGED, this.getCurrentItem());
			}

		},

		/**
		 * This function is called when previous button is clicked from carousel
		 * @access private
		 * @memberof Carousel
		 * @param {Object} objReference This contains the reference of Carousel
		 * @returns None
		 */
		onPreviousButtonClicked : function(objReference) {

			if (!objReference.isPreviousDisabled) {

				var divToMove = $("#imageContainer :last");
				console.log("divToMove", divToMove);
				$(divToMove).remove();
				$("#imageContainer").prepend(divToMove);

				if (objReference.model.get("wrap") === CarouselConstants.CONSTANTS.LINEAR) {
					objReference.previousButtonCounter += 1;
					objReference.nextButtonCounter -= 1;
					objReference.updateNextPreviousButtonAvailability(objReference, objReference.previousButtonCounter, objReference.nextButtonCounter);
				}

				this.trigger(CarouselConstants.EVENTS.INDEX_CHANGED, this.getCurrentItem());
			}

		},

		/**
		 * This function returns the data-cid property of current item
		 * @access private
		 * @memberof Carousel
		 * @param None
		 * @returns None
		 */
		getCurrentDivId : function() {
			var selectedDiv, divToMove, cId;
			selectedDiv = "#imageContainer :nth-child(" + (this.model.get("selectorIndex") + 1) + ")";
			divToMove = $(selectedDiv);
			cId = $(divToMove).attr("data-cid");
			return cId;
		},

		/**
		 * This function parse the data and set it to the model of component
		 * @access private
		 * @memberof Carousel
		 * @param {Object} objCompData Conatins the data to configure the component
		 * @param {Object} model Conatins the reference of component's model
		 * @returns None
		 */
		parseCompData : function(objCompData, model) {

			if (objCompData) {
				if (objCompData.carouselWrapperStyle !== undefined) {
					model.set("carouselWrapperStyle", objCompData.carouselWrapperStyle);
				} else {
					model.set("carouselWrapperStyle", "CarouselHorizontalWrapperStyle");
				}

				if ((objCompData.allignment !== model.get("allignment")) && (objCompData.allignment !== undefined)) {
					model.set("allignment", objCompData.allignment);
				}

				if ((objCompData.scroll !== model.get("scroll")) && (objCompData.scroll !== undefined)) {
					model.set("scroll", objCompData.scroll);
				}

				if ((objCompData.wrap !== model.get("wrap")) && (objCompData.wrap !== undefined)) {
					model.set("wrap", objCompData.wrap);
				}

				if ((objCompData.imageCollection !== undefined)) {

					model.set("imageCollection", objCompData.imageCollection);
				}

				if ((objCompData.isSwapRequired !== model.get("isSwapRequired")) && (objCompData.isSwapRequired !== undefined)) {
					model.set("isSwapRequired", objCompData.isSwapRequired);
				}

				if ((objCompData.isSelectorRequired !== model.get("isSelectorRequired")) && (objCompData.isSelectorRequired !== undefined)) {
					model.set("isSelectorRequired", objCompData.isSelectorRequired);
				}

				if ((objCompData.selectorIndex !== model.get("selectorIndex")) && (objCompData.selectorIndex !== undefined)) {
					model.set("selectorIndex", objCompData.selectorIndex);
				}

				if ((objCompData.playerIds !== model.get("playerIds")) && (objCompData.playerIds !== undefined)) {
					model.set("playerIds", objCompData.playerIds);
				}
			}

		}
	});

	/**
     * Set the super to BaseCompositeComp
     * @access private 
     * @memberof Carousel#
     */
	Carousel.prototype.Super = BaseCompositeComp;

	/**
	 * This functions checks if current item is disabled for current user or not
	 * @access public
	 * @memberof Carousel#
	 * @param None
	 * @returns {Boolean}
	 */
	Carousel.prototype.isDisabledForCurrentUser = function() {
		var model;
		model = this.collection.at(this.model.get("selectorIndex"));
		return (this.currentPlayer === (this.model.get("playerId")) ? false : true);
	};

	/**
	 * This functions returns the current item of carousel which will be according to the selectorIndex
	 * @access public
	 * @memberof Carousel#
	 * @param None
	 * @returns {Object}
	 */
	Carousel.prototype.getCurrentItem = function() {

		var model, objCurrentItem = {}, cId;

		cId = this.getCurrentDivId();
		model = this.collection.get(cId);

		if (model) {
			objCurrentItem = {
				itemId : model.get("itemId"),
				selected : model.get("selected")
			};
		}

		return objCurrentItem;
	};

	/**
	 * This functions sets the current item of carousel which will be according to the selectorIndex
	 * @access public
	 * @memberof Carousel#
	 * @param None
	 * @returns None
	 */
	Carousel.prototype.setCurrentItem = function() {

		this.onCarouselItemSelected(this.getCurrentDivId());
	};

	/**
	 * This functions sets the id of current player
	 * @memberof Carousel#
	 * @access public
	 * @param {String} strId contains the id of current player
	 * @returns None
	 */
	Carousel.prototype.currentPlayer = function(strId) {

		this.setCurrentPlayer(strId);
	};

	/**
	 * This function flushes the data
	 * @memberof Carousel#
	 * @access private
	 * @param None
	 * @returns None
	 */
	Carousel.prototype.flush = function() {

		var model;
		if (this.collection) {
			while (this.collection.first()) {
				model = this.collection.first();
				model.id = null;
				model.destroy();
				model = null;
			}
		}

		// destroy mcq's model
		this.model.id = null;
		this.model.destroy();
		this.model = null;
		this.collection = null;

	};

	/**
	 * This functions destroys the component
	 * @memberof Carousel#
	 * @access public
	 * @param None
	 * @returns {Boolean} True or false
	 */
	Carousel.prototype.destroy = function() {
	
		this.$el.off("click");
		this.$el.off("mouseover");
		this.$el.off("mouseout");
		this.objNextButton.off("click", function() {
			this.onNextButtonClicked(this);
		});

		this.objPreviousButton.off("click", function() {
			this.onPreviousButtonClicked(this);
		});

		this.objNextButton = null;
		this.objPreviousButton = null;
		this.objImageContainer = null;

		this.flush();
		this.unbind();
		this.undelegateEvents();

		this.children.call('destroy');
		this.children.call('remove');

		this.close();

		return this.Super.prototype.destroy(true);
	};

	return Carousel;
});
