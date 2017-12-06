/*jslint nomen: true */
/*globals MCQCompHelper,_,$,console,Backbone*/

define(['marionette', 'player/base/base-item-comp', 'player/components/gallery/grid'],

/**
 * @class Gallery
 * @augments BaseItemComp
 * @param {Object} obj .
 */

function(Marionette, BaseItemComp, Grid) {'use strict';
	var Gallery = BaseItemComp.extend({
		template : _.template(''),
		members : {
			gridId : undefined,
			placeHolderId : undefined,
			thmbnailsId : undefined,
			controllsId : undefined,
			totalVisible : 0,
			totalSelected : 0,
			lastSelected : -1,
			defaultView : 0,
			bCirculate : true
		},
		objGrid : undefined,
		$thumbNails : undefined,
		$viewControlls : undefined,
		arrControlls : [],
		arrThumbs : [],
		arrSelected : [],
		/**
		 * Initialization begins here.
		 * @access private
		 * @memberof Gallery
		 */
		initialize : function(objConf) {
			if ($(String(objConf.gridId)).length > 0) {
				this.members.gridId = String(objConf.gridId);
			} else {
				throw new Error("Template undefined!!!");
			}

			if ($(String(objConf.placeHolderId)).length > 0) {
				this.members.placeHolderId = String(objConf.placeHolderId);
			}
			if ($(String(objConf.thmbnailsId)).length > 0) {
				this.members.thmbnailsId = String(objConf.thmbnailsId);
			}
			if ($(String(objConf.controllsId)).length > 0) {
				this.members.controllsId = String(objConf.controllsId);
			}

			if (String(objConf.circulate) === undefined || String(objConf.circulate) === "false") {
				this.members.bCirculate = false;
			}
			this.componentType = "gallery";

		},
		onRender : function() {
			this.objGrid = new Grid({
				"gridId" : this.members.gridId,
				"placeHolderId" : this.members.placeHolderId
			});
			this.objGrid.on("viewClicked", $.proxy(this.onGridViewClick, this));
			this.$thumbNails = $(this.members.thmbnailsId);
			this.$viewControlls = $(this.members.controllsId);
			this.attachControllEvents();
			this.attachThumnailsEvents();
			this.objGrid.render();
			this.arrControlls[this.members.defaultView].trigger("click");
		}
	});

	Gallery.prototype.Super = BaseItemComp;

	Gallery.prototype.onGridViewClick = function(e) {
		this.customEventDispatcher("gridViewClicked", this, {
			"view" : $(e.customData.currentTarget),
			"index" : $(e.customData.currentTarget).prop("index")
		});
	};

	Gallery.prototype.attachControllEvents = function() {
		var self = this;
		this.members.defaultView = parseInt(this.$viewControlls.attr("default"));
		if (isNaN(this.members.defaultView)) {
			this.members.defaultView = 0;
		}
		$.each(this.$viewControlls.children(), function(index, controlls) {
			$(controlls).off("click").on("click", $.proxy(self.handleControllClick, self));
			self.arrControlls.push($(controlls));
		});
	};

	Gallery.prototype.attachThumnailsEvents = function() {
		var self = this, $wrapper = $("<div></div>"), wid = 0;

		$.each(this.$thumbNails.children(), function(index, thumb) {
			$(thumb).prop("index", index);
			$(thumb).off("click").on("click", $.proxy(self.handleThumbClick, self));
			wid += $(thumb).outerWidth();
			self.arrThumbs.push($(thumb));
			$wrapper.append($(thumb));

		});
		$wrapper.css("width", wid + "px");
		$wrapper.css("height", "100%");
		this.$thumbNails.append($wrapper);
	};

	Gallery.prototype.handleControllClick = function(e) {
		var i, rows, cols, controll;

		for ( i = 0; i < this.arrControlls.length; i += 1) {
			controll = this.arrControlls[i];
			controll.removeClass('active');
		}
		controll = $(e.currentTarget);
		rows = parseInt(controll.attr('rows'));
		cols = parseInt(controll.attr('cols'));
		if (!isNaN(rows) && !isNaN(cols)) {
			this.objGrid.changeRowColumns({
				"rows" : rows,
				"columns" : cols
			});
			controll.addClass("active");
			this.members.totalVisible = rows * cols;
			this.changeThumbsState();
			this.customEventDispatcher("viewChanged", this, controll);
		}

	};

	Gallery.prototype.changeThumbsState = function() {
		var i, index, arrTmp;
		arrTmp = this.arrSelected.slice();
		for ( i = 0; i < arrTmp.length; i += 1) {
			index = arrTmp[i];
			if (this.objGrid.currentGridView.indexOf(index) === -1) {
				this.deselectThumb(index);
			}
		}

		this.members.totalSelected = this.arrSelected.length;
		this.members.lastSelected = this.arrSelected[this.arrSelected.length - 1];
	};

	Gallery.prototype.handleThumbClick = function(e) {
		var i, thumb;
		thumb = $(e.currentTarget);
		i = thumb.prop("index");
		if (thumb.hasClass("active")) {
			return;
		}

		if (this.members.totalSelected === this.members.totalVisible) {
			if (this.members.bCirculate) {
				this.deselectThumb(this.members.lastSelected);
			}
		}

		if (this.members.totalSelected < this.members.totalVisible) {
			this.members.totalSelected += 1;
			thumb.addClass("active");
			this.objGrid.showView(i);
			this.customEventDispatcher("thumbClicked", this, i);
			this.members.lastSelected = i;
			this.arrSelected.push(i);
		}

	};

	Gallery.prototype.deselectThumb = function(index) {
		var thumb;
		thumb = this.arrThumbs[index];
		if (thumb.hasClass("active")) {
			thumb.removeClass("active");
			this.objGrid.hideView(index);
			this.arrSelected.splice(this.arrSelected.indexOf(index), 1);
			this.members.totalSelected = this.arrSelected.length;
		}
	};

	Gallery.prototype.getSelected = function() {
		return this.arrSelected;
	};

	/**
	 * Destroys Gallery instance.
	 * @memberof Gallery
	 * @param none.
	 * @returns none.
	 *
	 */
	Gallery.prototype.destroy = function() {
		var objThis;
	};

	return Gallery;
});

