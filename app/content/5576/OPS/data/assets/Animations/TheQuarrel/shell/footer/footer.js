/*jslint nomen: true*/
/*globals Backbone,$, console*/
define(["marionette", "player/base/base-activity", "css!shell/footer/footer.css"], function(Marionette, BaseActivity, footerStyle) {'use strict';
	var Footer = BaseActivity.extend({
		mAct_index : 0,
		mAct_length : 0,
		onActivityCreationComplete : function() {
			//activity initlized....
			this.initBaseActivity();
			this.initScreenElements();
		}
	});

	Footer.prototype.initScreenElements = function() {
		this.attachListener(this, this.$el.find("#btnPrevious"), "click", "handleButtonClick");
		this.attachListener(this, this.$el.find("#btnNext"), "click", "handleButtonClick");
	};
	
	Footer.prototype.handleButtonClick = function(objEvent) {
		var strTargetId = objEvent.target.id, index = 0;
		switch(strTargetId) {
			case "btnPrevious":
				if (this.mAct_index >= 1) {
					index = this.mAct_index - 1;
					this.launchActivityInRegion("mActivity", index, {}, true);
				}
				break;

			case "btnNext":
				if (this.mAct_index < this.mAct_length - 1) {
					index = this.mAct_index + 1;
					this.launchActivityInRegion("mActivity", index, {}, true);
				}
				break;
		}
	};

	Footer.prototype.animateNext = function(bval) {
		console.log(Boolean(bval), " : ", bval);
		if (Boolean(bval)) {
			this.$el.find("#btnNext").addClass("btnAnim");
			
		} else {
			this.$el.find("#btnNext").removeClass("btnAnim");
		}
	};
	
	
	Footer.prototype.animatePrevious = function(bval) {
		console.log(Boolean(bval), " : ", bval);
		if (Boolean(bval)) {
			this.$el.find("#btnPrevious").addClass("btnAnim");
			
		} else {
			this.$el.find("#btnPrevious").removeClass("btnAnim");
		}
	};
	
	
	

	Footer.prototype.getRegionChangeNotification = function(objData) {
		if (objData.mActivity !== undefined) {
			this.mAct_length = objData.mActivity.activityLength;
			this.mAct_index = objData.mActivity.currentActivityIndex;
		}
	};

	Footer.prototype.__super__ = BaseActivity;

	Footer.prototype.showAndAnimateFooter = function() {
		$(this.$el).css("visibility", "visible").css("opacity", "1");
	};

	Footer.prototype.destroy = function() {
		return this.__super__.prototype.destroy(true);
	};

	return Footer;
});
