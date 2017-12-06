/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * SectionNavigator
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */
define(['marionette', 'jqueryUI', 'jqueryTouchPunch', 'player/base/base-composite-comp', 'text!components/sectionnavigator/template/section-navigator-template.html', 'components/sectionnavigator/model/section-navigator-model', 'player/components/section-navigator/js/section-navigator-item', 'css!components/sectionnavigator/template/style/section-navigator.css'],

/** 
 * This component is used to provide indication of current section and progress of activities visited with in each section.
 * Component triggers an event when any of the section item is clicked and sends the section id and id of first activity in the event object.
 * It provides public API "activityVisited" which can be used to update the compoent during runtime.
 *
 *@class SectionNavigator
 *@augments BaseCompositeComp
 *@param {Object} obj  An object with 'sectionData', 'compLength', 'defaultSelectedSection' and 'sectionNavigatorWrapperStyle' properties.
 *@example
 *
 * var  sectionNavigatorComp, obj = {};
 * obj.sectionData = objData;
 * obj.compLength = 400;
 * obj.defaultSelectedSection = 0;
 * obj.sectionNavigatorWrapperStyle = 'SectionNavigatorWrapperStyleActivity ';
 *
 * this.getComponent(context, "SectionNavigator", "onComponentCreated", obj);
 *
 * function onComponentCreated(objComp){
 *  sectionNavigatorComp = objComp;
 * }
 * <br>Configurable properties of component:<br>
 * <table border="1" style="white-space:pre-wrap; color:"#000000";"><tr><th>Property</th><th>Type</th><th>Default Value</th><th>Description</th></tr><tr><td>sectionData</td><td>json</td><td>undefined</a></td><td>is the xml data containing activities wrapped with in section, this data is required to be in a <a href="xml/sections.xml" target="_blank">predifined</a> format.).</td></tr><tr><td>compLength</td><td>integer</td><td>200</td><td>This property defines the length of component.</td></tr><tr><td>defaultSelectedSection</td><td>integer</td><td>0</td><td>This property defines the default selected section for the component.<br><br>If this property is not provided by the developer then by default first section would be dispalyed as selected.</td></tr><tr><td>sectionNavigatorWrapperStyle</td><td>CSS class</td><td>SectionNavigatorWrapperStyle</td><td>Any style class defined in activity css, though this property is optional and if developer doesn't provide any new style class then calculator will render with its own pre-defined style.<br><br>Note: Developer should avoid definig a style class by the "SectionNavigatorWrapperStyle" name in activity css.</td></tr></table>
 *
 *
 */
function(Marionette, jqueryUI, jqueryTouchPunch, BaseCompositeComp, SectionNavigatorTemp, SectionNavigatorModel, SectionNavigatorItem, SectionNavigatorCSS) {'use strict';

	var SectionNavigator = /** @lends SectionNavigator.prototype */
	BaseCompositeComp.extend({

		template : _.template(SectionNavigatorTemp),

		itemView : SectionNavigatorItem,

		itemViewContainer : "#sectionHotspotContainer",

		previousSelectedModel : null,

		/**
		 * This function initializes the component
		 * @access private
		 * @memberof SectionNavigator
		 * @param {Object} objCompData Conatins the data to configure the component
		 * @returns None
		 */
		initialize : function(objCompData) {

			var cItemModel, i, iLen, imageCount, arrItemModel = [], objSectionCollection = {}, MyCollection, SectionNavigatorlItemModel, itemWidth;

			this.model = new SectionNavigatorModel();
			this.parseCompData(objCompData, this.model);

			this.on(SectionNavigatorItem.SECTION_HOTSPOT_CLICKED, this.onSectionHotSpotClicked);

			objSectionCollection = this.model.get("sectionData");
			iLen = objSectionCollection.length;
			itemWidth = (this.model.get("compLength") / iLen);

			this.itemViewOptions = {
				context : this,
				itemWidth : itemWidth
			};

			SectionNavigatorlItemModel = Backbone.Model.extend({

				activities : [],
				defaults : {

					activities : [],
					sectionId : "",
					trackerClass : "",
					hotspotClass : "",
					selected : false,
					activityIds : ""
				},

				setActivity : function(strActivity) {
					var i, objThis = this, arr, arrActivity = [];
					this.set('activitiesIDs', strActivity);
					arr = strActivity.split("#");
					for ( i = 0; i < arr.length; i += 1) {
						arrActivity.push({
							id : arr[i],
							visited : false
						});
					}
					arr.length = 0;
					arr = null;
					this.set('activities', arrActivity);
				}
			});

			MyCollection = Backbone.Collection.extend({

				model : SectionNavigatorlItemModel

			});

			// console.log("this.nextButtonCounter:"+this.nextButtonCounter);
			for ( i = 0; i < iLen; i += 1) {
				cItemModel = new SectionNavigatorlItemModel();
				cItemModel.set('hotspotClass', objSectionCollection[i].hotspotClass);
				cItemModel.set('trackerClass', objSectionCollection[i].trackerClass);
				cItemModel.set('sectionId', objSectionCollection[i].id);
				cItemModel.setActivity(objSectionCollection[i].activity);

				if (this.model.get("defaultSelectedSection") === i) {
					cItemModel.set('selected', true);
					this.previousSelectedModel = cItemModel;
				}

				arrItemModel.push(cItemModel);
			}

			this.collection = new MyCollection(arrItemModel);
			this.model.on("change", $.proxy(this.onModelChange, this));

		},

		/**
		 * This function is called when rendering of component is completed
		 * @access private
		 * @memberof SectionNavigator
		 * @param None
		 * @returns None
		 */
		onRender : function() {

			this.$('#sectionNavigatorWrapper').addClass(this.model.get("sectionNavigatorWrapperStyle"));
			this.$('#sectionNavigatorWrapper').css("width", this.model.get("compLength") + "px");
		},

		/**
		 * This function is called when component is shown in the DOM
		 * @access private
		 * @memberof SectionNavigator
		 * @param None
		 * @returns None
		 */
		onShow : function() {

			this.SectionNavigatorWrapper = this.$('#SectionNavigatorWrapper');
		},

		/**
		 * This function updates the view of timer
		 * @access private
		 * @memberof SectionNavigator
		 * @param {Object} objThis contains the reference of component
		 * @returns None
		 */
		onModelChange : function() {
		},

		/**
		 * This function is called when any of the item of section navigator is clicked
		 * @access private
		 * @memberof SectionNavigator
		 * @param {Object} event contains the reference of the event
		 * @returns None
		 */
		onSectionHotSpotClicked : function(event) {
			//console.log("Button clicked", event);
			this.previousSelectedModel.set("selected", false);
			this.previousSelectedModel = this.collection.findWhere({
				sectionId : event.sectionId
			});
			this.trigger(this.SECTION_SELECTED, event);
		},

		/**
		 * This function parse the data and set it to the model of component
		 * @access private
		 * @memberof SectionNavigator
		 * @param {Object} objCompData Conatins the data to configure the component
		 * @param {Object} model Conatins the reference of component's model
		 * @returns None
		 */
		parseCompData : function(objCompData, model) {

			if (objCompData) {

				if ((objCompData.compLength !== undefined)) {

					model.set("compLength", objCompData.compLength);
				}

				if ((objCompData.defaultSelectedSection !== undefined)) {

					model.set("defaultSelectedSection", objCompData.defaultSelectedSection);
				}

				if ((objCompData.sectionData !== undefined)) {

					model.set("sectionData", objCompData.sectionData.section);
				}

				if ((objCompData.sectionNavigatorWrapperStyle !== undefined)) {

					this.model.set("sectionNavigatorWrapperStyle", objCompData.sectionNavigatorWrapperStyle);
				}

			}
		}
	});

	/**
	 * Set the super to BaseCompositeComp
	 * @access private
	 * @memberof SectionNavigator#
	 */
	SectionNavigator.prototype.Super = BaseCompositeComp;

	/**
	 * This function update the provided activity as visited
	 * @access public
	 * @memberof SectionNavigator#
	 * @param {String} strActivityId Contains the activity Id
	 * @returns None
	 */
	SectionNavigator.prototype.activityVisited = function(strActivityId) {

		var i, arrActivity, iLen, obj, newarr, sectionModel, previouModelCId;
		previouModelCId = this.previousSelectedModel.cid;

		sectionModel = this.collection.filter(function(item)
		{
		return item.get("activitiesIDs").search(strActivityId) === 0;
		})[0];

		if (sectionModel) {
			arrActivity = sectionModel.get("activities");
			iLen = arrActivity.length;
			/*jslint plusplus: true*/
			for ( i = 0; i < iLen; i++) {
				obj = arrActivity[i];

				if (obj.id === strActivityId) {
					obj.visited = true;
					arrActivity[i] = obj;
				}
			}
			newarr = [];
			while (arrActivity.length > 0) {
				newarr.push(arrActivity.pop());
			}
			sectionModel.set("activities", newarr);

			if (previouModelCId !== sectionModel.cid) {
				this.previousSelectedModel.set("selected", false);
				this.previousSelectedModel = sectionModel;
				sectionModel.set("selected", true);
			}
		} else {
			throw "Activity Id doesn't exist!";
		}

	};

	/**
	 * This function flushes the data
	 * @memberof SectionNavigator
	 * @access private
	 * @param None
	 * @returns None
	 */
	SectionNavigator.prototype.flush = function() {

		var model;
		if (this.collection) {
			while (this.collection.first()) {
				model = this.collection.first();
				model.id = null;
				model.destroy();
				model = null;
			}
		}

		// destroy SectionNavigator's model
		this.model.id = null;
		this.model.destroy();
		this.model = null;
		this.collection = null;

	};

	/**@constant
	 * @memberof SectionNavigator#
	 * @access public
	 * @type {string}
	 * @default
	 */
	SectionNavigator.prototype.SECTION_SELECTED = 'sectionSelected';

	/**
	 * This functions destroys the component
	 * @memberof SectionNavigator#
	 * @access public
	 * @param None
	 * @returns {Boolean} True or false
	 */
	SectionNavigator.prototype.destroy = function() {

		this.off(SectionNavigatorItem.SECTION_HOTSPOT_CLICKED, this.onSectionHotSpotClicked);

		this.flush();
		this.unbind();
		this.undelegateEvents();

		this.children.call('destroy');
		this.children.call('remove');

		this.close();

		return this.Super.prototype.destroy(true);
	};

	return SectionNavigator;
});
