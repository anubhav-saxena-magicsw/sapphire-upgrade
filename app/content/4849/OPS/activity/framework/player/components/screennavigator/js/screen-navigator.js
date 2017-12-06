define(['player/base/base-composite-comp', 'components/screennavigator/js/screen-navigator-helper', 'text!components/screennavigator/templates/screen-navigator-tmpl.html'], function(BaseCompositeComp, SNHelper, screenNavTmpl) {

	var ScreenNavigator = BaseCompositeComp.extend({

		template : _.template(screenNavTmpl),
		className : "screenNavigatorStyle",
		isLastScreen : false,
		isFirstScreen : false,

		ui : {
			nextBtn : "#btnNext",
			backBtn : "#btnPrevious",
			indexBtns : "#screenNavContainer"
		},

		initialize : function(options) {
			SNHelper.init(this, options);
		},

		onRender : function() {
			SNHelper.updateLayout(this);
			SNHelper.showHideNextBackBtn(this);
			SNHelper.showHideIndexBtns(this);
		},

		onShow : function() {
			this.ui.nextBtn.off(this.EVT_CLICK).on(this.EVT_CLICK, $.proxy(this.gotoNextIndex, this));
			this.ui.backBtn.off(this.EVT_CLICK).on(this.EVT_CLICK, $.proxy(this.gotoPreviousIndex, this));
			// dispatch an event for ready...
			this.customEventDispatcher(this.EVT_RENDER_COMPLETE, this);
		}
	});

	ScreenNavigator.prototype.__super__ = BaseCompositeComp;

	ScreenNavigator.prototype.ON_SCREEN_CHANGE = "changeScreen";
	ScreenNavigator.prototype.ON_ACTIVITY_CHANGE = "changeActivity";
	ScreenNavigator.prototype.EVT_CLICK = "click";
	ScreenNavigator.prototype.EVT_RENDER_COMPLETE = "renderComplete";

	ScreenNavigator.prototype.gotoNextIndex = function(event) {
		SNHelper.moveScreenBy(this, 1);
	};

	ScreenNavigator.prototype.gotoPreviousIndex = function(event) {
		SNHelper.moveScreenBy(this, -1);
	};

	ScreenNavigator.prototype.setSelectedIndex = function(index, bUpdate) {
		if (SNHelper.validateIndex(index)) {
			SNHelper.setSelectedIndex(this, +index, bUpdate);
		} else {
			console.error("Provided index is not valid!");
		}
	};

	ScreenNavigator.prototype.getSelectedIndex = function() {
		return SNHelper.selectedIndex;
	};

	ScreenNavigator.prototype.enable = function(bEnable) {
		this.enableIndexButtons(bEnable);
		this.enableNextButton(bEnable);
		this.enableBackButton(bEnable);
	};

	ScreenNavigator.prototype.show = function(bShow) {
		this.showIndexButtons(bShow);
		this.showNextButton(bShow);
		this.showBackButton(bShow);
	};

	ScreenNavigator.prototype.showIndexButtons = function(bShow) {
		(bShow) ? this.ui.indexBtns.show() : this.ui.indexBtns.hide();
	};

	ScreenNavigator.prototype.showNextButton = function(bShow) {
		(bShow) ? this.ui.nextBtn.show() : this.ui.nextBtn.hide();
	};

	ScreenNavigator.prototype.showBackButton = function(bShow) {
		(bShow) ? this.ui.backBtn.show() : this.ui.backBtn.hide();
	};

	ScreenNavigator.prototype.enableIndexButtons = function(bEnable) {
		this.children.call('enable', bEnable);
	};

	ScreenNavigator.prototype.enableNextButton = function(bEnable) {
		if (bEnable) {
			this.ui.nextBtn.removeAttr('disabled');
		} else {
			this.ui.nextBtn.attr('disabled', 'disabled');
		}
	};

	ScreenNavigator.prototype.enableBackButton = function(bEnable) {
		if (bEnable) {
			this.ui.backBtn.removeAttr('disabled');
		} else {
			this.ui.backBtn.attr('disabled', 'disabled');
		}
	};

	ScreenNavigator.prototype.destroy = function(bDestroy) {
		this.children.call('destroy', bDestroy);
		var model;
		while ( model = this.collection.first()) {
			model.destroy();
		}
		
		this.undelegateEvents();
		
		this.ui.nextBtn.off(this.EVT_CLICK, this.gotoNextIndex);
		this.ui.backBtn.off(this.EVT_CLICK, this.gotoPreviousIndex);
		
		this.model.destroy();
		
		this.close();
		this.collection = null;
		this.model = null;
		return this.__super__.prototype.destroy(bDestroy);
	};

	return ScreenNavigator;

});
