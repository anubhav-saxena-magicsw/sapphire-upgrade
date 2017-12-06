/*jslint nomen: true*/
/*globals _*/
/**
 * ToggleButtonGroup
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['marionette', 'player/base/base-collection-comp', 'components/togglebuttongroup/js/toggle-button-group-model', 'components/togglebuttongroup/js/toggle-button-group-collection', 'css!components/togglebuttongroup/css/toggle-button-group.css', 'components/togglebutton/toggle-button', 'components/togglebutton/model/toggle-button-model'],

/**
 *This module will be responsible for Toggle Button Group functionality
 *
 *@class ToggleButtonGroup
 *@augments BaseCollectionComp
 *@param {Object} obj An object with 'toggleBtnGroupContainerCSS', 'buttonsCount', 'gap', paddingLeft'. 'paddingTop', 'orientation', 'normalClass', 'buttonLabel', 'state' and 'shouldToggle' properties.
 *@example
 *
 *	var toggleButtonOptions = {
 *		toggleBtnGroupContainerCSS : 'toggleContainerClass',
 *		buttonsCount : 5,
 *		gap : 15,
 *		paddingLeft : 40,
 *		paddingTop : 20,
 *		orientation : 'horizontal',
 *		normalClass : 'btnNormal',
 *		buttonLabel : ['ADD', 'SUBTRACT', 'DIVIDE', 'MULTIPLY'],
 *		state : 1,
 *		shouldToggle : true
 *		};
 *	this.getComponent(this, "ToggleBtnGroup", "onToggleBtnGroupCreationComplete", toggleButtonOptions);

 * function onComponentCreated(objComp){
 *  toggleButtonComp = objComp;
 * }
 * <br>Configurable properties of component:<br>
 * <table border="1" style="white-space:pre-wrap; color:"#000000";"><tr><th>Property</th><th>Type</th><th>Default Value</th><th>Description</th></tr><tr><td>toggleBtnGroupContainerCSS</td><td>CSS Class</td><td>undefined</a></td><td>Contains the css class name defining style for group container.</td></tr><tr><td>buttonsCount</td><td>Integer</td><td>2</td><td>This property defines the count of buttons.</td></tr><tr><td>gap</td><td>number</td><td>5</td><td>This property defines the gap between the buttons.</td></tr><tr><td>paddingLeft</td><td>number</td><td>10</td><td>This property defines the left padding inside the container.</td></tr><tr><td>paddingTop</td><td>number</td><td>20</td><td>This property defines the top padding inside the container.</td></tr><tr><td>orientation</td><td>String</td><td>horizontal</td><td>This property defines the allignment of container.</td></tr><tr><td>normalClass</td><td>CSS Class</td><td>undefined</td><td>This property contains the name of css class which needs to be applied on buttons during off state.</td></tr><tr><td>buttonLabel</td><td>Array</td><td>["ToggleButton","ToggleButton"]</td><td>This property contains the label for each toggle buttons in an array.</td></tr><tr><td>state</td><td>Integer</td><td>0</td><td>This property contains the label for each toggle buttons in an array.</td></tr><tr><td>shouldToggle</td><td>Boolean</td><td>true</td><td>This property defines the toggle behaviour of buttons.</td></tr></table>
 */

function(Marionette, BaseCollectionComp, ToggleBtnGroupModel, ToggleBtnGroupCollection, GroupCSS, ToggleButton, ToggleButtonModel) {'use strict';

	var ToggleButtonGroup = /** @lends ToggleButtonGroup.prototype */
	BaseCollectionComp.extend({

		itemView : ToggleButton,

		className : function() {
			var strClassName = 'toggleButtonContainer';
			if (this.options.toggleBtnGroupContainerCSS !== undefined) {
				strClassName = this.options.toggleBtnGroupContainerCSS;
			}

			return strClassName;
		},

		arrViewsToToggle : [],
		lastToggledView : undefined,
		
		/**
		 * Intializes ToggleButtonGroup
		 * @memberof ToggleButtonGroup
		 * @access private
		 * @param {Object} obj options the data to configure the component
		 * returns None
		 */
		initialize : function(options) {
			//class variables
			var self = this;
			this.currentBtnSelectedIndex = 0;
			this.childViews = [];
			this.userDefinedOrientation = options.orientation;

			//Toggle Button Group Model
			this.model = new ToggleBtnGroupModel();
			if (options.buttonsCount !== undefined) {
				this.model.set('buttonsCount', options.buttonsCount);
			}
			if (options.gap !== undefined) {
				this.model.set('gap', options.gap);
			}
			if (options.paddingLeft !== undefined) {
				this.model.set('paddingLeft', options.paddingLeft);
			}
			if (options.paddingTop !== undefined) {
				this.model.set('paddingTop', options.paddingTop);
			}

			//Initialize Toggle Button Models for the Toggle Button Group Collection
			this.initializeCollection(options);

			if (options.viewsToToggle instanceof Array) {
				if (options.viewsToToggle.length != this.model.get('buttonsCount')) {
					throw new Error("ToggleButtonGroup : Views count should be equal to the count of buttons");
				}
				_.each(options.viewsToToggle, function(strObj, index) {
					self.arrViewsToToggle.push($(strObj));
					$(strObj).hide();
				});
				
				if(parseInt(options.defaultSelectedIndex) >= 0 && parseInt(options.defaultSelectedIndex) < this.model.get('buttonsCount')){
					this.currentBtnSelectedIndex = parseInt(options.defaultSelectedIndex);
				}
			}

		},

		/**
		 * This function is called when component is shown in the DOM
		 * @access private
		 * @memberof ToggleButtonGroup
		 * @param None
		 * @returns None
		 */
		onShow : function() {
			this.updateChildViewArray();
			this.addListenerToChildViews();

			//Bind Orientation Change event
			this.listenTo(this.model, 'change:orientation', this.setChildViewsAlignment);
			this.model.set('orientation', this.userDefinedOrientation, {
				validate : true
			});
			
			this.childViews[this.currentBtnSelectedIndex].$el.trigger("click");
		},

		/**
		 * This function is adds listener to views
		 * @access private
		 * @memberof ToggleButtonGroup
		 * @param None
		 * @returns None
		 */
		addListenerToChildViews : function() {
			var self = this;
			_.each(self.childViews, function(objChildView, index) {
				objChildView.on(objChildView.EVENTS.ON_CHANGE, function() {
					self.clearAll();
					this.model.set('state', 1);
					self.currentBtnSelectedIndex = index + 1;
					self.toggleView(index);
					self.customEventDispatcher("itemClickEvent", self, {
						btnIndex : self.currentBtnSelectedIndex
					});
				});
			});
		},

		toggleView : function(index) {
			var self = this;
			if (self.arrViewsToToggle.length > 0) {
				if(self.lastToggledView !== undefined){
					self.arrViewsToToggle[self.lastToggledView].hide();	
				}
				if (index >= 0 && index < self.arrViewsToToggle.length) {
					self.lastToggledView = index;
				} else if (index >= self.arrViewsToToggle.length) {
					self.lastToggledView = self.arrViewsToToggle.length - 1;
				} else {
					self.lastToggledView = 0;
				}
				self.arrViewsToToggle[self.lastToggledView].show();
			}

		},

		/**
		 * This function is alligns the child view
		 * @access private
		 * @memberof ToggleButtonGroup
		 * @param None
		 * @returns None
		 */
		setChildViewsAlignment : function() {
			var objChildView, strOrientation, gap, nPaddingLeft, nPaddingTop, nPos, nViewDimension, nContainerWidth, nContainerHeight, nLastChildTop, nLastChildLeft;

			strOrientation = this.model.get('orientation');
			gap = this.model.get('gap');

			nPaddingLeft = this.model.get('paddingLeft');
			nPaddingTop = this.model.get('paddingTop');
			nPos = nViewDimension = nContainerWidth = nContainerHeight = 0;

			if (this.childViews !== undefined) {
				_.each(this.childViews, function(item, index) {
					objChildView = item;
					if (strOrientation === 'vertical') {
						nViewDimension = objChildView.$el.height();
						nPos = nPaddingTop + (nViewDimension * index) + (gap * index);
						objChildView.$el.css({
							"position" : "absolute",
							"top" : nPos + "px",
							"left" : nPaddingLeft + "px"
						});
					} else {
						nViewDimension = objChildView.$el.width();
						nPos = nPaddingLeft + (index * nViewDimension) + (gap * index);
						objChildView.$el.css({
							"position" : "absolute",
							"left" : nPos + "px",
							"top" : nPaddingTop + "px"
						});
					}
				}, this);

				//Set Containers width and height
				nLastChildTop = parseInt(objChildView.$el.css("top").split("p")[0], 10);
				if (nLastChildTop > nPaddingTop) {
					nContainerHeight = nPaddingTop + nLastChildTop + objChildView.$el.height();
				} else {
					nContainerHeight = (nPaddingTop * 2) + objChildView.$el.height();
				}

				nLastChildLeft = parseInt(objChildView.$el.css("left").split("p")[0], 10);
				if (nLastChildLeft > nPaddingLeft) {
					nContainerWidth = nPaddingLeft + nLastChildLeft + objChildView.$el.width();
				} else {
					nContainerWidth = (nPaddingLeft * 2) + objChildView.$el.width();
				}
			}
			this.$el.css({
				"height" : nContainerHeight + "px",
				"width" : nContainerWidth + "px"
			});
			//this.trigger(ToggleButtonGroup.TOGGLE_BUTTON_GROUP_ORIENTATION_CHANGE);
			this.customEventDispatcher("orientationChange", this);
		},

		/**
		 * This function is updates the child view array
		 * @access private
		 * @memberof ToggleButtonGroup
		 * @param None
		 * @returns None
		 */
		updateChildViewArray : function() {
			this.childViews = [];
			_.each(this.collection.models, function(objModel) {
				var objChildView = this.children.findByModel(objModel);
				this.childViews.push(objChildView);
			}, this);
		},

		/**
		 * This function initializes the collection
		 * @access private
		 * @memberof ToggleButtonGroup
		 * @param {Object} options contains the data to initialize the collection
		 * @returns None
		 */
		initializeCollection : function(options) {
			var objModel, i, arrToggleButtonModels = [];
			for ( i = 0; i < this.model.get("buttonsCount"); i += 1) {
				objModel = new ToggleButtonModel();
				//_.extend(objModel.defaults, {options});

				//Validate Toggle Button attributes
				if (options.normalClass !== undefined) {
					objModel.set('normalClass', options.normalClass);
				}
				if (options.buttonLabel[i] !== undefined) {
					objModel.set('label', options.buttonLabel[i]);
				}
				if (options.state !== undefined) {
					objModel.set('state', options.state);
				}
				if (options.shouldToggle !== undefined) {
					objModel.set('shouldToggle', options.shouldToggle);
				}
				arrToggleButtonModels.push(objModel);
			}
			this.collection = new ToggleBtnGroupCollection(arrToggleButtonModels);
		}
	});

	/**
	 * Set the super to BaseCollectionComp
	 * @access private
	 * @memberof ToggleButtonGroup#
	 */
	ToggleButtonGroup.prototype.__super__ = BaseCollectionComp;

	_.extend(ToggleButtonGroup.prototype, /** @lends ToggleButtonGroup.prototype */
	{

		/**
		 * ToggleButtonGroup Item click event constant.
		 * @const
		 * @access public
		 * @memberof ToggleButtonGroup#
		 * @type {string}
		 */
		TOGGLE_BUTTON_GROUP_ITEM_CLICK : "itemClickEvent",

		/**
		 * ToggleButtonGroup Item orientation change event constant.
		 * @const
		 * @access public
		 * @memberof ToggleButtonGroup#
		 * @type {string}
		 */
		TOGGLE_BUTTON_GROUP_ORIENTATION_CHANGE : "orientationChange",

		/*ToggleButtonGroup.prototype.TOGGLE_BUTTON_GROUP_BUTTON_ADDED = "buttonAddedEvent";
		ToggleButtonGroup.prototype.TOGGLE_BUTTON_GROUP_BUTTON_REMOVED = "buttonRemovedEvent";*/

		/**
		 * Sets the button at given index selected.
		 * @access public
		 * @memberof ToggleButtonGroup#
		 * @param {Integer}index Sets the button at index selected.
		 * @returns None
		 */
		setSelected : function(index) {
			this.clearAll();
			var objModel = this.collection.models[index - 1];
			if (objModel !== undefined) {
				objModel.set('state', 1);
			}
			this.currentBtnSelectedIndex = index;
		},

		/**
		 * Gets the selected button index.
		 * @access public
		 * @memberof ToggleButtonGroup#
		 * @param None
		 * @returns {Integer} Value representing index of button in the group.
		 */
		getSelected : function() {
			return this.currentBtnSelectedIndex;
		},

		/**
		 * Clears the selection on the group if multiple button are selected.
		 * @access public
		 * @memberof ToggleButtonGroup#
		 * @param None
		 * @returns None
		 */
		clearAll : function() {
			_.each(this.collection.models, function(objModel, index) {
				objModel.set('state', 0);
			});
		},

		/**
		 * Sets the button at given index in normal state.
		 * @param {Integer}index The index of the button which needs to be deselectd.
		 * @access public
		 * @memberof ToggleButtonGroup#
		 * @returns None
		 */
		clearSelection : function(index) {
			var objModel = this.collection.models[index - 1];
			if (objModel !== undefined) {
				objModel.set('state', 0);
			}
		},

		/**
		 * Sets the orientation of the component.
		 * @param {String}strOrientation Horizontal or Vertical
		 * @access public
		 * @memberof ToggleButtonGroup#
		 * @returns None
		 */
		setOrientation : function(strOrientation) {
			this.model.set('orientation', strOrientation);
		},

		/**
		 * Gets the array of all child views.
		 * @access public
		 * @memberof ToggleButtonGroup#
		 * @param None
		 * @returns {Array} Array of all child views.
		 */
		getToggles : function() {
			return this.childViews;
		},

		/**
		 * Destroys the Component from memory.
		 * @access public
		 * @memberof ToggleButtonGroup#
		 * @param None
		 * @returns {Boolean} True or false
		 */
		destroy : function() {
			var model, objChildView;

			while (this.collection.first()) {
				model = this.collection.first();
				objChildView = this.children.findByModel(model);
				objChildView.destroy();
				model.destroy();
				model = null;
			}
			this.collection = null;

			this.model.destroy();
			this.model = null;

			this.undelegateEvents();
			this.unbind();
			this.remove();
			return this.__super__.prototype.destroy(true);
		}
		/*setEnabled: function(bEnable) {
		 },

		 getSelectedBtnToggleButtonGroup: function() {
		 },

		 changeGap: function (gap)
		 {
		 this.model.set('gap', gap);
		 };

		 addToggleButtonToGroup: function (options)
		 {
		 var objModel = new ToggleButtonModel(options);
		 this.collection.add(objModel);
		 this.updateChildViewArray();
		 this.setChildViewsAlignment();

		 //add change event to newly added button
		 var objChildView = this.children.findByModel(objModel);

		 //dispatch button added event
		 };

		 removeToggleButtonFromGroup: function (index)
		 {
		 var objModel = this.collection.models[index - 1];
		 this.collection.remove(objModel);
		 this.updateChildViewArray();
		 this.setChildViewsAlignment();

		 //dispatch button removed event
		 }; */

	});

	return ToggleButtonGroup;
});
