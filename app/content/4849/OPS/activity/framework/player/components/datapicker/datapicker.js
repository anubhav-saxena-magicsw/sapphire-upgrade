/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * Image
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['marionette', 'player/base/base-item-comp', 'player/components/datapicker/model'], function(Marionette, BaseItemComp, Model) {
	'use strict';
	var DataPicker;

	DataPicker = BaseItemComp.extend({
		objData : null,
		template : _.template(''),

		initialize : function(objData) {
			var objThis = this;
			this.objData = objData;//this property is being used in componentselector for editing.
			this.model = new Model(objData);
			this.arrItems = [];
			this.componentType = "datapicker";
		},

		onRender : function() {
			this.$el.attr("class", this.model.get("styleClass"));
			this.empty();
			this.setBlankView();
			this.createItems();

		},
		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		},
		$closebtn : undefined,
		$okbtn : undefined,
		$previewSection : undefined,
		$listSection : undefined,
		currentItem : undefined
	});

	DataPicker.prototype.setBlankView = function() {
		var objThis = this;
		this.$previewSection = $("<div class='" + this.model.get("stylepreviewsection") + "'/>");
		this.$listSection = $("<div class='" + this.model.get("stylelistsection") + "'/>");
		this.$okbtn = $("<div class='" + this.model.get("styleokbutton") + "'/>");
		this.$closebtn = $("<div class='" + this.model.get("styleclosebutton") + "'/>");
		this.$el.append(this.$previewSection);
		this.$el.append(this.$listSection);
		this.$el.append(this.$okbtn);
		this.$el.append(this.$closebtn);
		this.$closebtn.off("click").on("click", function() {
			objThis.close();
		});
		this.$okbtn.off("click").on("click", function() {
			objThis.close();
			objThis.customEventDispatcher("change", objThis, objThis.getCurrentItem());
		});
		this.currentItem = undefined;
	};

	DataPicker.prototype.getCurrentItem = function() {
		return this.currentItem;
	};

	DataPicker.prototype.setCurrentItem = function(obj) {
		this.currentItem = obj;
	};

	DataPicker.prototype.open = function() {
		this.$el.show();
		this.$el.animate({
			left : "-=300",
		}, 1000, function() {
			// Animation complete.
		});
	};

	DataPicker.prototype.close = function() {
		this.$el.hide();
	};

	DataPicker.prototype.setData = function(newData) {
		if (newData.filter !== undefined) {
			this.model.set("filter", newData.filter);
		}
		if (newData.itemclass !== undefined) {
			this.model.set("itemclass", newData.datasource);
		}
		if (newData.datasource !== undefined) {
			this.model.set("datasource", null);
			this.model.set("datasource", newData.datasource);
		}
		this.render();
	};

	DataPicker.prototype.empty = function() {
		for (var i = 0; i < this.arrItems.length; i += 1) {
			this.dettatchEvents(this.arrItems[i]);
			this.arrItems[i] = null;
		}
		this.$el.empty();
		this.arrItems = null;
	};

	DataPicker.prototype.createItems = function() {
		var i, objSource, arrSource, objItem;
		arrSource = this.model.get("datasource");
		this.arrItems = [];
		for ( i = 0; i < arrSource.length; i += 1) {
			objSource = arrSource[i];
			objItem = this.createNewItem(objSource);
			if (objItem) {
				this.attatchEvents(objItem);
				this.$listSection.append(objItem);
				this.arrItems.push(objItem);
			}
		}
	};

	DataPicker.prototype.attatchEvents = function(objItem) {
		var objThis = this, data;
		objItem.off("click").on("click", function(e) {
			objThis.setCurrentItem($(this).prop("data"));
			objThis.$previewSection.html("");
			objThis.$previewSection.append($(this).prop("item").clone().show());
		});
	};
	DataPicker.prototype.dettatchEvents = function(objItem) {
		objItem.off("click");
	};

	DataPicker.prototype.createNewItem = function(objData) {
		var type, path, wrapper, item;
		wrapper = $("<div/>");
		wrapper.addClass(this.model.get("itemclass"));
		path = objData.path;
		type = objData.type;
		if (this.model.get("filter").indexOf(type) === -1) {
			return undefined;
		}
		switch(type) {
		case "image":
			item = $("<img/>");
			item.attr("src", path);
			break;
		case "video":
			var sourceMp4, sourceOgg;
			item = $("<video controls></video>");
			sourceMp4 = $("<source></source>");
			sourceMp4.attr("src", path.split(".")[0] + ".mp4");
			sourceOgg = $("<source></source>");
			sourceOgg.attr("src", path.split(".")[0] + ".ogg");
			item.append(sourceMp4);
			item.append(sourceOgg);
			break;
		case "audio":
			item = $("<audio controls/>");
			item.attr("src", path);
			break;
		default:
			item = undefined;
			break;
		}

		if (item) {
			wrapper.text(objData.name);
			wrapper.prop("item", item);
			wrapper.prop("data", objData);
			item.css({
				"position" : "relative",
				"margin" : "auto",
				"display" : "none"
			});
		}
		return wrapper;
	};

	DataPicker.prototype.__super__ = BaseItemComp;

	DataPicker.prototype.destroy = function() {
		return this.__super__.prototype.destroy(true);
	};

	return DataPicker;
});
