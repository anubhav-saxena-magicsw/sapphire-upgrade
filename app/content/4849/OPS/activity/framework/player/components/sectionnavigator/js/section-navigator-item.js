/*jslint nomen: true*/
/*globals console,_*/
/*globals console,$*/
/**
 * SectionNavigatorItem
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */
define(['marionette', 'player/base/base-item-comp', 'text!components/sectionnavigator/template/section-navigator-item-template.html'],

/**
 *This class is used to display the items of carousel
 *@class SectionNavigatorItem
 *@access private
 *@augments BaseItemComp
 *@example
 *Class Initialize
 *require(['player/components/sectionNavigator/js/SectionNavigatorItem'], function(SectionNavigatorItem) {
 *    var SectionNavigatorItem = new SectionNavigatorItem();
 *});
 */
function(Marionette, BaseItemComp, SectionNavigatorItemTemp) {'use strict';

	var SectionNavigatorItem = /** @lends SectionNavigatorItem.prototype */
	BaseItemComp.extend({

		template : _.template(SectionNavigatorItemTemp),
		tagName : "div",
		className : "col-xs-4",
		parentContext : null,
		containerWidth : 0,
		sectionHotspot : null,
		activityNavigation : null,
		singleActivityWidth : 0,

		/**
		 * This function initializes the component
		 * @memberof SectionNavigatorItem
		 * @access private
		 * @param None
		 * @returns None
		 */
		initialize : function(data) {
			this.parentContext = data.context;
			this.containerWidth = data.itemWidth;
			this.parseItemData();
			this.model.on("change:selected", $.proxy(this.onHotSpotSelected, this));
			this.model.on("change:activities", $.proxy(this.onActivityVisited, this));

		},

		/**
		 * This function parse the data to configure the itemview
		 * @memberof SectionNavigatorItem
		 * @access private
		 * @param none
		 * @returns None
		 */
		parseItemData : function() {
			var i, arrActivity, iLen, obj;
			arrActivity = this.model.get("activities");
			iLen = arrActivity.length;
			/*jslint plusplus: true*/
			for ( i = 0; i < iLen; i++) {
				obj = arrActivity[i];
				obj.visited = false;
				arrActivity[i] = obj;
			}

			this.model.get("activities", arrActivity);
		},

		/**
		 * This function is called when rendering of component is completed
		 * @memberof SectionNavigatorItem
		 * @access private
		 * @param None
		 * @returns None
		 */
		onRender : function() {

			var objEventData = {}, arrActivities, objSelf = this;
			objEventData.sectionId = objSelf.model.get("sectionId");
			arrActivities = this.model.get("activities");

			objEventData.activityId = arrActivities[0].id;

			this.sectionHotspot = this.$(":first-Child");
			$(this.el).on("click", function() {

				if (!objSelf.model.get("selected")) {
					objSelf.model.set("selected", true);
					objSelf.parentContext.trigger(this.SECTION_HOTSPOT_CLICKED, objEventData);
				}

			});

			this.activityNavigation = this.$(":last-Child");

			$(this.el).css("width", this.containerWidth + "px");
			$(this.sectionHotspot).addClass(this.model.get("hotspotClass"));
			$(this.activityNavigation).addClass(this.model.get("trackerClass"));

			$(this.activityNavigation).css("width", "0px");

		},

		/**
		 * This function called when item is added in the DOM
		 * @memberof SectionNavigatorItem
		 * @access private
		 * @param none
		 * @returns None
		 */
		onShow : function() {
			var nHotspotWidth, nActivities;
			nHotspotWidth = $(this.sectionHotspot).width();
			nActivities = this.model.get("activities").length;
			//////console.log("width:" + nHotspotWidth);
			$(this.activityNavigation).css("left", (nHotspotWidth/2) + "px");
			this.singleActivityWidth = ((this.containerWidth - nHotspotWidth) / nActivities);
			this.updateHotpotState();
			this.updateActivityTrackerState();
		},

		/**
		 * This function when selected property of model is changed
		 * @memberof SectionNavigatorItem
		 * @access private
		 * @param none
		 * @returns None
		 */
		onHotSpotSelected : function() {

			this.updateHotpotState();

		},

		/**
		 * This function when activities property of model is changed
		 * @memberof SectionNavigatorItem
		 * @access private
		 * @param none
		 * @returns None
		 */
		onActivityVisited : function() {
			this.updateActivityTrackerState();

		},

		/**
		 * This function make the current activity as visited
		 * @memberof SectionNavigatorItem
		 * @access private
		 * @param {String} strId contains the activity id
		 * @returns None
		 */
		updateVisitedActivity : function(strId) {

			var i, arrActivity, iLen, obj;
			arrActivity = this.model.get("activities");
			iLen = arrActivity.length;
			/*jslint plusplus: true*/
			for ( i = 0; i < iLen; i++) {
				obj = arrActivity[i];

				if (obj.id === strId) {
					obj.visited = true;
					arrActivity[i] = obj;
				}
			}
			this.model.get("activities", arrActivity);

		},
		/**
		 * This function updates the hotspot state
		 * @memberof SectionNavigatorItem
		 * @access private
		 * @param None
		 * @returns None
		 */
		updateHotpotState : function() {
			if (this.model.get("selected")) {

				$(this.sectionHotspot).addClass("active");
				this.updateActivityTrackerState();
			} else {
				$(this.sectionHotspot).removeClass("active");
			}
		},

		/**
		 * This function updates the tracker state
		 * @memberof SectionNavigatorItem
		 * @access private
		 * @param None
		 * @returns None
		 */
		updateActivityTrackerState : function() {

			var i, arrActivity, iLen, iVisitedCount = 0, obj, currentWidth;
			arrActivity = this.model.get("activities");
			iLen = arrActivity.length;
			/*jslint plusplus: true*/
			for ( i = 0; i < iLen; i++) {
				obj = arrActivity[i];

				if (obj.visited) {
					/*jslint plusplus: true*/
					iVisitedCount++;
				}
			}
			if(iVisitedCount > 0)
			{
				currentWidth = iVisitedCount * this.singleActivityWidth;
			////console.log("updateActivityTrackerState"+iVisitedCount+" "+ " "+this.singleActivityWidth+" "+currentWidth);
			$(this.activityNavigation).css("width", (currentWidth + ($(this.sectionHotspot).width()/2)) + "px");
			}

		}
	});

	/**@constant
	 * @memberof SectionNavigatorItem
	 * @type {string}
	 * @default
	 */
	SectionNavigatorItem.prototype.SECTION_HOTSPOT_CLICKED = 'sectionHotSpotClicked';

	return SectionNavigatorItem;
});
