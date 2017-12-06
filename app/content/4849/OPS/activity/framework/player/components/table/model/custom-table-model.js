/*jslint nomen: true*/
/*global define,_*/
define(["backbone"], function (Backbone) {
    "use strict";
    var CustomTableModel = Backbone.Model.extend({
        defaults: {
            className: "tableComp",
            irClassName: "itemRenderer",
            selectedIndex: -1,
            selectedIndices: [],
            selectionMode: "single"
        },

        validate: function (attrs) {
            var invalid = false;
            if ((_.has(attrs, "selectionMode")) && (attrs.selectionMode === "")) {
                this.set('selectionMode', this.defaults.selectionMode);
                invalid = true;
            }
            //console.log('attrs : ', attrs.selectionMode);
            if ((_.has(attrs, "selectionMode")) && (attrs.selectionMode !== "single") && (attrs.selectionMode !== "multiple")) {
                this.set('selectionMode', this.defaults.selectionMode);
                invalid = true;
            }
            return invalid;
        },

        updateSelectedIndices: function (index) {
            this.get("selectedIndices").push(+index);
            this.get("selectedIndices").sort();
        },

        removeFromIndices: function (index) {
            var arrSel = this.get("selectedIndices");
            arrSel.splice(arrSel.indexOf(index), 1);
        },

        getSelectedIndices: function () {
            return this.get("selectedIndices");
        },

        resetSelectedIndices: function () {
            var arrSel = this.get("selectedIndices");
            arrSel.splice(0, arrSel.length);
        }
    });

    return CustomTableModel;
});