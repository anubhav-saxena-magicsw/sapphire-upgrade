/*jslint nomen: true */
/*globals MCQCompHelper,_,$,console,Backbone*/

define(['marionette', 'player/base/base-item-comp'],

/**
 * @class Grid
 * @augments BaseItemComp
 * @param {Object} obj .
 */

function(Marionette, BaseItemComp) {'use strict';
	var Grid = BaseItemComp.extend({
		template : _.template(''),
		members : {
			rows : 1,
			cloumns : 1,
			startIndex : 0,
			gridId : undefined,
			placeHolderId : undefined
		},
		$template : undefined,
		$placeHolder : undefined,
		arrViews : [],
		arrPlaceHolders : [],
		currentGridView : [-1],
		/**
		 * Initialization begins here.
		 * @access private
		 * @memberof Grid
		 */
		initialize : function(objConf) {
			if (!isNaN(parseInt(objConf.rows))) {
				this.members.rows = parseInt(objConf.rows);
			}
			if (!isNaN(parseInt(objConf.columns))) {
				this.members.columns = parseInt(objConf.columns);
			}
			if (!isNaN(parseInt(objConf.startIndex))) {
				this.members.startIndex = parseInt(objConf.startIndex);
			}
			if ($(String(objConf.placeHolderId)).length > 0) {
				this.members.placeHolderId = String(objConf.placeHolderId);
			}
			if ($(String(objConf.gridId)).length > 0) {
				this.members.gridId = String(objConf.gridId);
			} else {
				throw new Error("Template undefined!!!");
			}

		},
		onRender : function() {
			this.$template = $(this.members.gridId).hide();
			this.$placeHolder = $(this.members.placeHolderId).clone().css({
				"position" : "absolute",
				"width" : "100%",
				"height" : "100%"
			});
			this.collectViews();
			this.arrangeGridViews();
			this.$template = $(this.members.gridId).show();
		}
	});

	Grid.prototype.Super = BaseItemComp;

	Grid.prototype.collectViews = function() {
		var $thumb, self = this;
		_.each(this.$template.children(), function(el, index) {
			if (el.tagName == 'DIV') {
				$(el).prop('iclass', $(el).attr('class'));
				$(el).prop('index', index);
				self.arrViews.push($(el).hide());
				$(el).off("click").on("click",$.proxy(self.handleViewClick,self));
			}
		});

	};

	Grid.prototype.handleViewClick = function(e) {
		this.customEventDispatcher("viewClicked",this,e);
	};

	Grid.prototype.changeRowColumns = function(obj) {
		if (!isNaN(parseInt(obj.rows))) {
			this.members.rows = parseInt(obj.rows);
		}
		if (!isNaN(parseInt(obj.columns))) {
			this.members.columns = parseInt(obj.columns);
		}
		this.arrangeGridViews();
	};

	Grid.prototype.arrangeGridViews = function() {
		var i, c, r, total, row, col, view, wid, hit, objCss, ph, self = this;
		row = this.members.rows;
		col = this.members.columns;
		total = row * col;
		wid = 100 / col;
		hit = 100 / row;
		i = this.members.startIndex;
		$.each(this.arrViews, function(index, view) {
			view.hide();
		});
		$.each(this.arrPlaceHolders, function(index, placeHolder) {
			placeHolder.remove();
		});
		this.arrPlaceHolders = [];
		objCss = {
			"width" : wid + "%",
			"height" : hit + "%",
			"position" : "relative",
			"float" : "left",
			"margin" : "auto",
			"border" : "none"
		};

		for ( r = 0; r < row; r += 1) {
			for ( c = 0; c < col; c += 1) {
				if (i < this.arrViews.length) {
					view = this.arrViews[i];
					if (view.prop('iclass') !== undefined) {
						view.attr('class', view.prop('iclass'));
					}
					view.addClass(" grid_row" + r + "_col" + c);
					view.css(objCss);
				}
				ph = this.$placeHolder.clone();
				ph.css(objCss).show();
				this.$template.append(ph);
				this.arrPlaceHolders.push(ph);
				i += 1;
				if (this.currentGridView.length === i) {
					this.currentGridView.push(-1);
				}
			}
		}

		while (this.currentGridView.length > total) {
			this.currentGridView.pop();
		}

		$.each(this.currentGridView, function(index, val) {
			if (val !== -1) {
				self.currentGridView[index] = -1;
				self.showView(val);
			}
		});

	};

	Grid.prototype.showView = function(index) {
		var view, pview, ph, i;
		for ( i = 0; i < this.currentGridView.length; i += 1) {
			if (this.currentGridView[i] === index) {
				return;
			}
		}

		for ( i = 0; i < this.currentGridView.length; i += 1) {
			if (this.currentGridView[i] === -1) {
				ph = this.arrPlaceHolders[i];
				view = this.arrViews[index];
				view.insertAfter(ph);
				ph.hide();
				view.attr("style", ph.attr("style"));
				view.show();
				this.currentGridView[i] = parseInt(view.prop("index"));
				return;
			}
		}

		pview = this.arrViews[this.currentGridView[this.currentGridView.length - 1]];
		view = this.arrViews[index];
		view.insertAfter(pview);
		pview.hide();
		view.attr("style", pview.attr("style"));
		view.show();
		this.currentGridView.pop();
		this.currentGridView.push(parseInt(view.prop("index")));
	};
	

	
	Grid.prototype.hideView = function(index) {
		var view, pview, ph, i;

		for ( i = 0; i < this.currentGridView.length; i += 1) {
			if (this.currentGridView[i] === index) {
				ph = this.arrPlaceHolders[i];
				view = this.arrViews[index];
				ph.insertAfter(view);
				view.hide();
				ph.attr("style", view.attr("style"));
				ph.show();
				this.currentGridView[i] = -1;
				return;
			}
		}
	};
	/**
	 * Destroys Grid instance.
	 * @memberof Grid
	 * @param none.
	 * @returns none.
	 *
	 */
	Grid.prototype.destroy = function() {
		var objThis;
	};

	return Grid;
});

