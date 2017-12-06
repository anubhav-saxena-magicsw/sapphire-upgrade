define(['player/base/base-item-comp', 'text!components/screennavigator/templates/screen-navigator-item.html'], function(BaseItemComp, screenNavItemTmpl) {

	var screenNavItem = BaseItemComp.extend({

		template : _.template(screenNavItemTmpl),
		className : "screenNavItemStyle",
		isEnabled : true,

		initialize : function(options) {
			if (options.hasOwnProperty('parent')) {
				this.parent = options.parent;
			}
			// do basic div setup
			this.$el.data('cid', this.model.cid);
			var strId = "snItem_" + this.model.get('screenId');
			this.$el.attr('data-cid', this.cid);
			this.$el.attr('id', strId);
			this.$el.attr('title', this.model.get('screenName'));
			var strClass = this.model.get('className');
			if (strClass !== undefined) {
				this.$el.removeClass(this.className);
				this.$el.addClass(strClass);
			}
		},
		
		onRender : function(){
			this.$el.off('click').on('click', $.proxy(this.handleItemClickEvent, this));
		}
	});

	screenNavItem.prototype.__super__ = BaseItemComp;

	screenNavItem.prototype.updateActiveIndex = function(nIndex) {
		// TODO: Following code may need to be improved and updated
		if (nIndex === this.model.get('screenIndex')) {
			this.$el.addClass('active');
			this.model.set('selected', true);
			this.model.set('visited', true);
		} else if (this.model.get('selected')) {
			this.$el.removeClass('active');
			this.model.set('selected', false);
			this.model.set('visited', false);
		}
	};

	screenNavItem.prototype.handleItemClickEvent = function(event) {
		if (this.isEnabled) {
			var nIndex = this.model.get('screenIndex');
			this.parent.setSelectedIndex(nIndex, true);
			this.changeActiveIndex(nIndex);
		}
	};

	screenNavItem.prototype.changeActiveIndex = function(nIndex) {
		if (nIndex === this.model.get('screenIndex')) {
			var data = Object.create({"index" : nIndex});
			data.screenIndex = nIndex;
			data.isFirstScreen = this.parent.isFirstScreen;
			data.isLastScreen = this.parent.isLastScreen;
			data.type = this.model.get('type');
			this.parent.customEventDispatcher(this.parent.ON_SCREEN_CHANGE, this.parent, data);
		}
	};

	screenNavItem.prototype.enable = function(bEnable) {
		this.isEnabled = bEnable;
		if (bEnable) {
			this.$el.removeAttr('disabled');
		} else {
			this.$el.attr('disabled', 'disabled');
		}
	};

	screenNavItem.prototype.destroy = function(bDestroy) {
		this.$el.off("click", this.handleItemClickEvent);
		// destroy its model
		this.model.destroy();
		this.undelegateEvents();
		this.close();
		return this.__super__.prototype.destroy(bDestroy);
	};

	return screenNavItem;

});
