/*jslint nomen: true*/
/*globals Backbone,$, console*/
define(["marionette", "player/base/base-activity", "css!shell/footer/footer.css"], function(Marionette, BaseActivity, footerStyle) {'use strict';
	var Footer = BaseActivity.extend({
		mAct_index : 0,
		mAct_length : 0,
		// onActivityCreationComplete : function() {
			// //activity initlized....
			// this.initBaseActivity();
			// this.initScreenElements();
		// },
	});
	
	Footer.prototype.exitActivity = function(){
    	 this.launchPreviousActivity();
    }
    Footer.prototype.destroy = function(){	 	
	 };

	// Footer.prototype.initScreenElements = function() {
		// this.attachListener(this, this.$el.find("#btnPrevious"), "click", "handleButtonClick");
		// this.attachListener(this, this.$el.find("#btnNext"), "click", "handleButtonClick");
		// this.attachListener(this, this.$el.find("#btnActivity"), "click", "handleButtonClick");
        // var that = this;
        // $(document).unbind("cuePointsFinish").bind("cuePointsFinish", function(e, data) {
            // that.animateNavBtns(e, data);
        // });
		// // this.broadcastEventReceiver("cuePointsFinish", this, "animateNavBtns");
	// };
// 
	// Footer.prototype.handleButtonClick = function(objEvent) {
// 
		// var strTargetId = objEvent.target.id, index = 0;
		// switch(strTargetId) {
			// case "btnPrevious":
				// //this.broadcastEvent("videoJumpEventBack");
				// if (this.mAct_index >= 1) {
					// index = this.mAct_index - 1;
					// this.launchActivityInRegion("mActivity", index, {}, true);
				// }
				// break;
// 
			// case "btnNext":
				// //this.broadcastEvent("videoJumpEvent");
				// if (this.mAct_index < this.mAct_length - 1) {
					// index = this.mAct_index + 1;
					// this.launchActivityInRegion("mActivity", index, {}, true);
				// }
				// break;
			// case "btnActivity":
				// if (this.mAct_index < this.mAct_length - 1) {
					// index = this.mAct_index + 1;
					// this.launchActivityInRegion("mActivity", index, {}, true);
				// }
				// break;
		// }
	// };
// 
	// Footer.prototype.animateNavBtns = function(e, data) {
		// var bval = data.val;
		// if (Boolean(bval)) {
			// this.$el.find("#btnNext").addClass("btnAnimMy");
			// this.$el.find("#btnPrevious").addClass("btnAnimMy");
		// } else {
			// this.$el.find("#btnNext").removeClass("btnAnimMy");
			// this.$el.find("#btnPrevious").removeClass("btnAnimMy");
		// }
	// };
// 
	// Footer.prototype.animateNext = function(bval) {
		// if (Boolean(bval)) {
			// this.$el.find("#btnNext").addClass("btnAnimMy");
		// } else {
			// this.$el.find("#btnNext").removeClass("btnAnimMy");
		// }
	// };
// 
	// Footer.prototype.animatePrevious = function(bval) {
		// console.log(Boolean(bval), " : ", bval);
		// if (Boolean(bval)) {
			// this.$el.find("#btnPrevious").addClass("btnAnimMy");
		// } else {
			// this.$el.find("#btnPrevious").removeClass("btnAnimMy");
		// }
	// };
// 
	// Footer.prototype.animateActivity = function(bval) {
// 
		// if (Boolean(bval)) {
			// this.$el.find("#btnActivity").addClass("btnAnimMy");
// 
		// } else {
			// this.$el.find("#btnActivity").removeClass("btnAnimMy");
		// }
// 
	// };
// 
	// Footer.prototype.getRegionChangeNotification = function(objData) {
		// if (objData.mActivity !== undefined) {
			// this.mAct_length = objData.mActivity.activityLength;
			// this.mAct_index = objData.mActivity.currentActivityIndex;
		// }
	// };
// 
	// Footer.prototype.__super__ = BaseActivity;
// 
	// Footer.prototype.showAndAnimateFooter = function() {
		// $(this.$el).css("visibility", "visible").css("opacity", "1");
	// };
// 
	// Footer.prototype.destroy = function() {
		// return this.__super__.prototype.destroy(true);
	// };

	return Footer;
});
