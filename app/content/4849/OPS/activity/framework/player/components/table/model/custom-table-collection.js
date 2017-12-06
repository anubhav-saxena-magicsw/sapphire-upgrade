/*global define,$,console*/

define(["backbone", "components/table/model/custom-table-item-model"], function(Backbone, CustomTableItemModel) {"use strict";

	var CustomTableCollection = Backbone.Collection.extend({
		model : CustomTableItemModel,

		initialize : function() {

		},

		/**
		 * @access private
		 * @param {Object} model
		 */
		comparator : function(model) {
			return model.get('index');
		},

		/**
		 * @access private
		 * @param {Object} index
		 */
		getModelByIndex : function(index) {
			if (index < 0 || index >= this.length) {
				throw new Error('Index out of bound!');
			} else {
				return this.at(index);
			}
		},

		/**
		 * @access private
		 * @param {Object} index
		 */
		removeModelByIndex : function(index) {
			this.remove(this.getModelByIndex(index));
			this.updateModelsIndex(index, -1);
			console.log('now collection: ', this);
		},

		/**
		 * @access private
		 * @param {Object} model
		 * @param {Object} index
		 */
		addModelAt : function(model, index) {

			if (index < 0) {
				throw new Error("Data can not be inserted at index [" + index + "]");
			} else {
				//var currentItem = this.at(index);
				this.updateModelsIndex(index, 1);
				model.set({
					"index" : index
				});
				this.add(model, {
					at : index
				});

				this.sort();
			}

		},

		updateModelAt : function(model, index) {
			var objModel = this.at(index);
			$.each(model, function(key, value) {
				objModel.set(key, value);
			});
			return objModel;
		},

		updateModelsIndex : function(index, steps) {
			this.each(function(model, ind) {
				if (ind >= index) {
					model.updateIndex(steps);
				}
			});
		}
	});

	return CustomTableCollection;
});
